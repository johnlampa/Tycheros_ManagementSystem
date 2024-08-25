// routes/inventoryManagementRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "AdDU2202201425196", // Change pw
  database: "tycherosdb"
});

// INVENTORY MANAGEMENT ROUTES

// GET INVENTORY DATA ENDPOINT
router.get('/getSubitem', (req, res) => {
  const query = `
    SELECT 
        i.inventoryID,
        i.inventoryName,
        i.reorderPoint,
        i.unitOfMeasure,
        sub.totalQuantity,  -- Total quantity of all subitems with the same inventoryID
        si.quantityRemaining,  -- Quantity remaining for the specific subinventory record
        po.pricePerUnit,
        DATE(po.stockInDate) AS stockInDate,  -- Extract DATE from DATETIME
        DATE(po.expiryDate) AS expiryDate,    -- Extract DATE from DATETIME
        s.supplierName,
        CONCAT(e.firstName, ' ', e.lastName) AS employeeName
    FROM 
        inventory i
    LEFT JOIN 
        subinventory si ON i.inventoryID = si.inventoryID
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
            GROUP BY 
                inventoryID
        ) sub ON i.inventoryID = sub.inventoryID
    ORDER BY 
        i.inventoryName ASC,  -- Order alphabetically by inventory name
        po.stockInDate ASC;   -- Order by oldest stock-in date
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching inventory data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

// ADD SUBITEM ENDPOINT
router.post('/postSubitem', (req, res) => {
  const { inventoryName, unitOfMeasure, reorderPoint } = req.body;

  const newInventoryItem = {
    inventoryName,
    unitOfMeasure,
    reorderPoint,
  };

  db.query("INSERT INTO inventory SET ?", newInventoryItem, (err, result) => {
    if (err) {
      console.error("Error adding inventory item:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ message: "Inventory item added successfully", inventoryID: result.insertId });
  });
});

// UPDATE SUBITEM ENDPOINT
router.put('/putSubitem/:inventoryID', (req, res) => {
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

  db.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      console.error("Error updating inventory:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json({ message: "Subitem updated successfully" });
  });
});

// DELETE SUBITEM ENDPOINT
router.delete('/deleteSubitem/:inventoryID', (req, res) => {
  const inventoryID = req.params.inventoryID;

  const deleteQuery = `
    DELETE FROM inventory
    WHERE inventoryID = ?
  `;

  db.query(deleteQuery, [inventoryID], (err, result) => {
    if (err) {
      console.error("Error deleting subitem:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subitem not found" });
    }

    return res.json({ message: "Subitem deleted successfully" });
  });
});


// STOCK IN STOCK OUT STOCK IN STOCK OUT STOCK IN STOCK OUT STOCK IN STOCK OUT STOCK IN STOCK OUT STOCK IN STOCK OUT STOCK IN STOCK OUT

// STOCK IN ENDPOINT
router.post('/stockInSubitem', (req, res) => {
  const { inventoryID, supplierName, employeeID, quantityOrdered, actualQuantity, pricePerUnit, stockInDate, expiryDate } = req.body;

  // Start a transaction to ensure data consistency
  db.beginTransaction((err) => {
      if (err) return res.status(500).send(err);

      // 1. Insert or retrieve the supplier ID
      const supplierQuery = 'INSERT INTO supplier (supplierName) VALUES (?) ON DUPLICATE KEY UPDATE supplierID=LAST_INSERT_ID(supplierID)';
      db.query(supplierQuery, [supplierName], (err, supplierResult) => {
          if (err) {
              return db.rollback(() => {
                  res.status(500).send(err);
              });
          }

          const supplierID = supplierResult.insertId;

          // 2. Insert into the purchaseorder table
          const purchaseOrderQuery = `
              INSERT INTO purchaseorder 
              (supplierID, employeeID, quantityOrdered, actualQuantity, pricePerUnit, stockInDate, expiryDate) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`;

          db.query(purchaseOrderQuery, [supplierID, employeeID, quantityOrdered, actualQuantity, pricePerUnit, stockInDate, expiryDate], (err, purchaseOrderResult) => {
              if (err) {
                  return db.rollback(() => {
                      res.status(500).send(err);
                  });
              }

              const purchaseOrderID = purchaseOrderResult.insertId;

              // 3. Insert into the subinventory table
              const subinventoryQuery = 'INSERT INTO subinventory (inventoryID, purchaseOrderID, quantityRemaining) VALUES (?, ?, ?)';

              db.query(subinventoryQuery, [inventoryID, purchaseOrderID, actualQuantity], (err, subinventoryResult) => {
                  if (err) {
                      return db.rollback(() => {
                          res.status(500).send(err);
                      });
                  }

                  const subinventoryID = subinventoryResult.insertId;

                  // Commit the transaction
                  db.commit((err) => {
                      if (err) {
                          return db.rollback(() => {
                              res.status(500).send(err);
                          });
                      }

                      // Send response
                      res.status(201).send({
                          message: 'Product stocked in successfully',
                          supplierID,
                          purchaseOrderID,
                          subinventoryID
                      });
                  });
              });
          });
      });
  });
});













module.exports = router;
