// routes/inventoryManagementRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "AdDU2202201425196", // Change pw
  database: "tycherosdb"
};

// Create a pool of connections to handle database requests
const pool = mysql.createPool(dbConfig);

// INVENTORY MANAGEMENT ROUTES :3

router.get('/getInventoryName', async (req, res) => {
  const query = `SELECT * FROM inventory`;
  try {
    const [data] = await pool.query(query);
    return res.json(data);
  } catch (err) {
    console.error('Error fetching inventory names:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET INVENTORY DATA ENDPOINT
router.get('/getSubitem', async (req, res) => {
  const query = `
    WITH InventoryData AS (
        SELECT 
            inv.inventoryID,
            inv.inventoryName,
            inv.inventoryCategory,
            inv.reorderPoint,
            inv.unitOfMeasure,
            si.quantityRemaining,  -- Show quantityRemaining per subinventory entry
            SUM(CASE WHEN si.quantityRemaining > 0 THEN si.quantityRemaining ELSE 0 END) 
                OVER (PARTITION BY inv.inventoryID) AS totalQuantity,  -- Total positive quantityRemaining for each inventoryID
            poi.quantityOrdered,
            poi.actualQuantity,
            poi.pricePerUnit,
            poi.expiryDate,
            po.stockInDate,
            s.supplierName,
            CONCAT(e.firstName, ' ', e.lastName) AS employeeName,  -- Full employee name as firstName + lastName
            ROW_NUMBER() OVER (PARTITION BY inv.inventoryID ORDER BY poi.expiryDate ASC) AS row_num  -- For ordering by expiryDate within each inventoryID
        FROM 
            inventory inv
        LEFT JOIN 
            subinventory si ON inv.inventoryID = si.inventoryID AND si.quantityRemaining > 0 -- Include only positive quantities
        LEFT JOIN 
            purchaseorderitem poi ON si.subinventoryID = poi.subinventoryID
        LEFT JOIN 
            purchaseorder po ON poi.purchaseOrderID = po.purchaseOrderID
        LEFT JOIN 
            supplier s ON po.supplierID = s.supplierID
        LEFT JOIN 
            employees e ON po.employeeID = e.employeeID
    )
    SELECT 
        inventoryID,  -- Always retain inventoryID for each row
        CASE WHEN row_num = 1 THEN inventoryName ELSE NULL END AS inventoryName,
        CASE WHEN row_num = 1 THEN inventoryCategory ELSE NULL END AS inventoryCategory,
        CASE WHEN row_num = 1 THEN reorderPoint ELSE NULL END AS reorderPoint,
        CASE WHEN row_num = 1 THEN unitOfMeasure ELSE NULL END AS unitOfMeasure,
        CASE WHEN row_num = 1 THEN totalQuantity ELSE NULL END AS totalQuantity,
        quantityRemaining,  -- Quantity remaining per subinventory entry
        quantityOrdered,
        actualQuantity,
        pricePerUnit,
        expiryDate,
        stockInDate,
        supplierName,
        employeeName
    FROM 
        InventoryData
    ORDER BY 
        COALESCE(inventoryName, (SELECT inventoryName FROM InventoryData WHERE inventoryID = InventoryData.inventoryID AND row_num = 1)) ASC,  -- Order by inventoryName alphabetically, group NULLs with their corresponding inventoryName
        inventoryID ASC,     -- Group all entries with the same inventoryID together
        row_num ASC;         -- Then order by row number (earliest expiryDate first)
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
  const { inventoryName, inventoryCategory, unitOfMeasure, reorderPoint } = req.body;

  const newInventoryItem = {
    inventoryName,
    inventoryCategory,
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
        inventoryCategory = COALESCE(?, inventoryCategory),
        unitOfMeasure = COALESCE(?, unitOfMeasure),
        reorderPoint = COALESCE(?, reorderPoint)
    WHERE inventoryID = ?
  `;

  const updateValues = [
    updatedData.inventoryName || null,
    updatedData.inventoryCategory || null,
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

// STOCK IN ENDPOINT (Modified to Handle Multiple Items)
router.post('/stockInInventoryItem', async (req, res) => {
  const {
    supplierName,
    employeeID,
    stockInDate,
    inventoryItems,
  } = req.body;
  const connection = await pool.getConnection();
  console.log("Request Body: ", req.body);

  try {
    await connection.beginTransaction();

    // 1. Check if the supplier already exists
    const [existingSupplier] = await connection.query(
      'SELECT supplierID FROM supplier WHERE supplierName = ?',
      [supplierName]
    );

    let supplierID;
    if (existingSupplier.length > 0) {
      // Supplier exists, use the existing supplierID
      supplierID = existingSupplier[0].supplierID;
    } else {
      // Supplier does not exist, insert a new one
      const [supplierResult] = await connection.query(
        'INSERT INTO supplier (supplierName) VALUES (?)',
        [supplierName]
      );
      supplierID = supplierResult.insertId;
    }

    // 2. Insert into the purchaseorder table
    const [purchaseOrderResult] = await connection.query(
      `INSERT INTO purchaseorder (supplierID, employeeID, stockInDate) VALUES (?, ?, ?)`,
      [supplierID, employeeID, stockInDate]
    );
    const purchaseOrderID = purchaseOrderResult.insertId;

    // 3. Loop through each inventory item and add it
    for (let item of inventoryItems) {
      const {
        inventoryID,
        quantityOrdered,
        actualQuantity,
        pricePerUnit,
        expiryDate,
      } = item;

      // Insert into the purchaseorderitem table
      const [purchaseOrderItemResult] = await connection.query(
        `INSERT INTO purchaseorderitem (quantityOrdered, actualQuantity, pricePerUnit, expiryDate, subinventoryID, purchaseOrderID) 
         VALUES (?, ?, ?, ?, NULL, ?)`,
        [quantityOrdered, actualQuantity, pricePerUnit, expiryDate, purchaseOrderID]
      );
      const purchaseOrderItemID = purchaseOrderItemResult.insertId;

      // Insert into the subinventory table and get the subinventoryID
      const [subinventoryResult] = await connection.query(
        'INSERT INTO subinventory (inventoryID, quantityRemaining) VALUES (?, ?)',
        [inventoryID, actualQuantity]
      );
      const subinventoryID = subinventoryResult.insertId;

      // Update the subinventoryID in purchaseorderitem
      await connection.query(
        'UPDATE purchaseorderitem SET subinventoryID = ? WHERE purchaseOrderItemID = ?',
        [subinventoryID, purchaseOrderItemID]
      );
    }

    await connection.commit();
    res.status(201).send({
      message: 'Products stocked in successfully',
      supplierID,
      purchaseOrderID,
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error stocking in subitems:', err);
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
