const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "AdDU2202201425196", // Change pw
  database: "tycherosdb"
});

router.get('/getOrders', (req, res) => {
  // Fetch the orders with their total amounts
  const ordersQuery = `
    SELECT
      o.orderID,
      o.paymentID,
      o.employeeID,
      o.date,
      o.status,
      SUM(pr.sellingPrice * oi.quantity) AS Total
    FROM
      \`order\` o
    JOIN orderitem oi ON o.orderID = oi.orderID
    JOIN price pr ON oi.productID = pr.productID
    WHERE
      pr.priceID = (
        SELECT MAX(pr2.priceID)
        FROM price pr2
        WHERE pr2.productID = oi.productID
      )
    GROUP BY o.orderID, o.paymentID, o.employeeID, o.date, o.status;
  `;

  db.query(ordersQuery, (err, ordersResult) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Initialize a map to collect orders
    const ordersMap = new Map();

    // Process the orders result set
    ordersResult.forEach(row => {
      ordersMap.set(row.orderID, {
        orderID: row.orderID,
        paymentID: row.paymentID,
        employeeID: row.employeeID,
        date: row.date,
        status: row.status,
        amount: row.Total,
        orderItems: []
      });
    });

    // Fetch order items with product names and prices
    const orderItemsQuery = `
      SELECT
        oi.orderID,
        oi.productID,
        p.productName,
        pr.sellingPrice,
        oi.quantity
      FROM
        orderitem oi
      JOIN product p ON oi.productID = p.productID
      JOIN price pr ON oi.productID = pr.productID
      WHERE
        pr.priceID = (
          SELECT MAX(pr2.priceID)
          FROM price pr2
          WHERE pr2.productID = oi.productID
        );
    `;

    db.query(orderItemsQuery, (err, orderItemsResult) => {
      if (err) {
        console.error("Error fetching order items:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Process the order items result set
      orderItemsResult.forEach(row => {
        if (ordersMap.has(row.orderID)) {
          const order = ordersMap.get(row.orderID);
          order.orderItems.push({
            productID: row.productID,
            productName: row.productName,
            sellingPrice: row.sellingPrice,
            quantity: row.quantity
          });
        }
      });

      // Convert map to array
      const ordersArray = Array.from(ordersMap.values());

      res.json(ordersArray);
    });
  });
});

// Endpoint to get menu data
router.get('/getMenuData', (req, res) => {
  const menuDataQuery = `
    SELECT
      p.productID,
      p.productName,
      pr.sellingPrice
    FROM
      product p
    JOIN price pr ON p.productID = pr.productID
    WHERE
      pr.priceID = (
        SELECT MAX(pr2.priceID)
        FROM price pr2
        WHERE pr2.productID = p.productID
      )
  `;

  db.query(menuDataQuery, (err, result) => {
    if (err) {
      console.error("Error fetching menu data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(result);
  });
});

// POST /processPayment endpoint
router.post('/processPayment', (req, res) => {
  const { orderID, amount, method, referenceNumber, discount, discountAmount } = req.body;

  // Start a transaction
  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: "Transaction error" });

    // Insert into Payment table
    const insertPaymentQuery = `
      INSERT INTO payment (amount, method, referenceNumber, discount, discountAmount)
      VALUES (?, ?, ?, ?, ?)`;
    db.query(insertPaymentQuery, [amount, method, referenceNumber, discount, discountAmount], (err, results) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ error: "Failed to insert payment" }));
      }

      const paymentID = results.insertId;
      console.log("discountAmount:", discountAmount);

      // Update the Order table with paymentID
      const updateOrderQuery = `
        UPDATE \`order\` 
        SET paymentID = ?, status = 'Pending'
        WHERE orderID = ?`;
      db.query(updateOrderQuery, [paymentID, orderID], (err) => {
        if (err) {
          return db.rollback(() => res.status(500).json({ error: "Failed to update order" }));
        }

        // Commit the transaction
        db.commit(err => {
          if (err) {
            return db.rollback(() => res.status(500).json({ error: "Failed to commit transaction" }));
          }
          res.status(200).json({ message: "Payment processed successfully" });
        });
      });
    });
  });
});

// PUT /updateOrderStatus endpoint
router.put('/updateOrderStatus', (req, res) => {
  const { orderID, newStatus } = req.body;

  if (!orderID || !newStatus) {
    return res.status(400).json({ error: 'OrderID and newStatus are required' });
  }

  const updateOrderQuery = `
    UPDATE \`order\`
    SET status = ?
    WHERE orderID = ?
  `;

  db.query(updateOrderQuery, [newStatus, orderID], (err, result) => {
    if (err) {
      console.error("Error updating order status:", err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully' });
  });
});

module.exports = router;
