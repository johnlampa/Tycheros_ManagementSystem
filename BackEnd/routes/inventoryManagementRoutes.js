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
      COALESCE(SUM(si.quantityRemaining), 0) AS totalQuantity,
      si.quantityRemaining,
      po.pricePerUnit,
      po.stockInDate,
      po.expiryDate,
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
    GROUP BY 
        i.inventoryID, 
        i.inventoryName, 
        i.reorderPoint, 
        i.unitOfMeasure, 
        si.subinventoryID, 
        si.quantityRemaining,
        po.pricePerUnit, 
        po.stockInDate, 
        po.expiryDate, 
        s.supplierName, 
        e.employeeID
    ORDER BY 
        i.inventoryName;
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

module.exports = router;
