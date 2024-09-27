// routes/inventoryManagementRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Fifteen15", // Change pw
  database: "tycherosdb"
};

// Create a pool of connections to handle database requests
const pool = mysql.createPool(dbConfig);

// INVENTORY MANAGEMENT ROUTES :3

// GET INVENTORY DATA ENDPOINT
router.get('/getSubitem', async (req, res) => {
  const query = `
    SELECT 
      CASE WHEN ROW_NUMBER() OVER (PARTITION BY i.inventoryID ORDER BY po.expiryDate ASC) = 1 
          THEN i.inventoryID 
          ELSE NULL 
      END AS inventoryID,
      CASE WHEN ROW_NUMBER() OVER (PARTITION BY i.inventoryID ORDER BY po.expiryDate ASC) = 1 
          THEN i.inventoryName 
          ELSE NULL 
      END AS inventoryName,
      CASE WHEN ROW_NUMBER() OVER (PARTITION BY i.inventoryID ORDER BY po.expiryDate ASC) = 1 
          THEN i.reorderPoint 
          ELSE NULL 
      END AS reorderPoint,
      CASE WHEN ROW_NUMBER() OVER (PARTITION BY i.inventoryID ORDER BY po.expiryDate ASC) = 1 
          THEN i.unitOfMeasure 
          ELSE NULL 
      END AS unitOfMeasure,
      po.purchaseOrderID,
      sub.totalQuantity,
      si.quantityRemaining,
      po.pricePerUnit,
      DATE(po.stockInDate) AS stockInDate,
      DATE(po.expiryDate) AS expiryDate,
      s.supplierName,
      CONCAT(e.firstName, ' ', e.lastName) AS employeeName
    FROM 
        inventory i
    LEFT JOIN 
        subinventory si ON i.inventoryID = si.inventoryID AND si.quantityRemaining > 0 -- Filter out zero quantities here
    LEFT JOIN 
        purchaseorder po ON si.purchaseOrderID = po.purchaseOrderID
    LEFT JOIN 
        supplier s ON po.supplierID = s.supplierID
    LEFT JOIN 
        employees e ON po.employeeID = e.employeeID
    LEFT JOIN 
        (
            SELECT 
                inventoryID,
                SUM(quantityRemaining) AS totalQuantity
            FROM 
                subinventory
            WHERE quantityRemaining > 0 -- Ensure subinventory totals only positive quantities
            GROUP BY 
                inventoryID
        ) sub ON i.inventoryID = sub.inventoryID
    ORDER BY 
        i.inventoryName ASC,
        po.expiryDate ASC;
  `;

  try {
    const [result] = await pool.query(query);
    res.json(result);
  } catch (err) {
    console.error("Error fetching inventory data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ADD SUBITEM ENDPOINT
router.post('/postSubitem', async (req, res) => {
  const { inventoryName, unitOfMeasure, reorderPoint } = req.body;

  const newInventoryItem = {
    inventoryName,
    unitOfMeasure,
    reorderPoint,
  };

  try {
    const [result] = await pool.query("INSERT INTO inventory SET ?", newInventoryItem);
    res.json({ message: "Inventory item added successfully", inventoryID: result.insertId });
  } catch (err) {
    console.error("Error adding inventory item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE SUBITEM ENDPOINT
router.put('/putSubitem/:inventoryID', async (req, res) => {
  const inventoryID = req.params.inventoryID;
  const updatedData = req.body;

  const updateQuery = `
    UPDATE inventory
    SET inventoryName = COALESCE(?, inventoryName),
        unitOfMeasure = COALESCE(?, unitOfMeasure),
        reorderPoint = COALESCE(?, reorderPoint)
    WHERE inventoryID = ?
  `;

  const updateValues = [
    updatedData.inventoryName || null,
    updatedData.unitOfMeasure || null,
    updatedData.reorderPoint || null,
    inventoryID
  ];

  try {
    await pool.query(updateQuery, updateValues);
    res.json({ message: "Subitem updated successfully" });
  } catch (err) {
    console.error("Error updating inventory:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE SUBITEM ENDPOINT
router.delete('/deleteSubitem/:inventoryID', async (req, res) => {
  const inventoryID = req.params.inventoryID;

  const deleteQuery = `
    DELETE FROM inventory
    WHERE inventoryID = ?
  `;

  try {
    const [result] = await pool.query(deleteQuery, [inventoryID]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subitem not found" });
    }

    res.json({ message: "Subitem deleted successfully" });
  } catch (err) {
    console.error("Error deleting subitem:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// STOCK IN STOCK OUT STOCK IN STOCK OUT STOCK IN STOCK OUT STOCK IN STOCK OUT STOCK IN STOCK OUT STOCK IN STOCK OUT STOCK IN STOCK OUT 

// STOCK IN ENDPOINT
router.post('/stockInSubitem', async (req, res) => {
  const { inventoryID, supplierName, employeeID, quantityOrdered, actualQuantity, pricePerUnit, stockInDate, expiryDate } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Check if the supplier already exists
    const [existingSupplier] = await connection.query('SELECT supplierID FROM supplier WHERE supplierName = ?', [supplierName]);
    
    let supplierID;
    if (existingSupplier.length > 0) {
      // Supplier exists, use the existing supplierID
      supplierID = existingSupplier[0].supplierID;
    } else {
      // Supplier does not exist, insert a new one
      const [supplierResult] = await connection.query('INSERT INTO supplier (supplierName) VALUES (?)', [supplierName]);
      supplierID = supplierResult.insertId;
    }

    // 2. Insert into the purchaseorder table
    const [purchaseOrderResult] = await connection.query(`
      INSERT INTO purchaseorder 
      (supplierID, employeeID, quantityOrdered, actualQuantity, pricePerUnit, stockInDate, expiryDate) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`, 
      [supplierID, employeeID, quantityOrdered, actualQuantity, pricePerUnit, stockInDate, expiryDate]
    );
    const purchaseOrderID = purchaseOrderResult.insertId;

    // 3. Insert into the subinventory table and get the subinventoryID
    const [subinventoryResult] = await connection.query('INSERT INTO subinventory (inventoryID, purchaseOrderID, quantityRemaining) VALUES (?, ?, ?)', [inventoryID, purchaseOrderID, actualQuantity]);
    const subinventoryID = subinventoryResult.insertId;

    await connection.commit();
    res.status(201).send({
      message: 'Product stocked in successfully',
      supplierID,
      purchaseOrderID,
      subinventoryID
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error stocking in subitem:", err);
    res.status(500).send(err);
  } finally {
    connection.release();
  }
});


//STOCK OUT 
router.post('/stockOutSubitem', async (req, res) => {
  const { purchaseOrderID, quantity, reason } = req.body; // Assume purchaseOrderID is provided
  const date = new Date();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Find the subinventory entries with the given purchaseOrderID, ordered by the oldest expiry date
    const [subinventoryEntries] = await connection.query(`
      SELECT si.subinventoryID, si.quantityRemaining, po.expiryDate
      FROM subinventory si
      JOIN purchaseorder po ON si.purchaseOrderID = po.purchaseOrderID
      WHERE po.purchaseOrderID = ?
      ORDER BY po.expiryDate ASC
    `, [purchaseOrderID]);

    let remainingQuantity = quantity;
    
    for (const entry of subinventoryEntries) {
      if (remainingQuantity <= 0) break;

      const deductQuantity = Math.min(entry.quantityRemaining, remainingQuantity);

      // Update the quantityRemaining
      await connection.query(`
        UPDATE subinventory
        SET quantityRemaining = quantityRemaining - ?
        WHERE subinventoryID = ?
      `, [deductQuantity, entry.subinventoryID]);

      remainingQuantity -= deductQuantity;

      // Insert the stock-out record
      await connection.query(`
        INSERT INTO stockout (subinventoryID, quantity, reason, date)
        VALUES (?, ?, ?, ?)
      `, [entry.subinventoryID, deductQuantity, reason, date]);
    }

    if (remainingQuantity > 0) {
      throw new Error('Not enough stock available to complete the stock-out.');
    }

    await connection.commit();
    res.status(201).send('Stock-out recorded successfully');
  } catch (err) {
    await connection.rollback();
    console.error("Error processing stock-out:", err);
    res.status(500).send(`Error processing stock-out: ${err.message}`);
  } finally {
    connection.release();
  }
});




module.exports = router;
