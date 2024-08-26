// routes/menuManagementRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Fifteen15", // Change pw
  database: "tycherosdb"
});

// MENU
// MANAGEMENT
// ENDPOINTS

// GET MENU MANAGEMENT DATA ENDPOINT
router.get('/getProduct', (req, res) => {
    const query = `
      SELECT 
          p.productID, 
          p.productName, 
          c.categoryName, 
          pr.sellingPrice
      FROM 
          product p
      JOIN 
          category c ON p.categoryID = c.categoryID
      JOIN 
          price pr ON p.productID = pr.productID
      JOIN 
          (SELECT productID, MAX(priceID) as maxPriceID FROM price GROUP BY productID) latestPrice 
          ON pr.productID = latestPrice.productID AND pr.priceID = latestPrice.maxPriceID;

    `;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching menu data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(result);
    });
  });

  router.get('/getAllSubitems', (req, res) => {
    const query = `
      SELECT * FROM inventory;
    `;

    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching subitem data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(result);
    })
  })


  
  //CREATE PRODUCT ENDPOINT //DONE
  router.post('/postProduct', (req, res) => {
    const productData = req.body;
  
    // Insert the product into the product table
    const product = {
      productName: productData.productName, 
      imageUrl: productData.imageUrl,
      categoryID: productData.categoryID,
    };
  
    db.query("INSERT INTO product SET ?", product, (err, productResult) => {
      if (err) {
        console.error("Error adding product:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      const productID = productResult.insertId;
  
      // Insert the price into the price table
      const price = {
        sellingPrice: productData.sellingPrice,
        productID: productID
      };
  
      db.query("INSERT INTO price SET ?", price, (err, priceResult) => {
        if (err) {
          console.error("Error adding price:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      });
  
      // Insert each subitem into the subitem table
      const subitems = productData.subitems;
      subitems.forEach((subitem) => {
        const subitemData = {
          productID: productID,
          inventoryID: subitem.inventoryID,
          quantityNeeded: subitem.quantityNeeded,
        };
  
        db.query("INSERT INTO subitem SET ?", subitemData, (err, subitemResult) => {
          if (err) {
            console.error("Error adding subitem:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
        });
      });
  
      return res.json({ message: "Product, subitems, and price added successfully" });
    });
  });
  

  router.get('/getSpecificSubitems/:productID', (req, res) => {
    const productID = req.params.productID;

    const query = `
        SELECT 
            si.subitemID, 
            si.inventoryID, 
            si.quantityNeeded,
            i.inventoryName,
            i.unitOfMeasure
        FROM 
            subitem si
        JOIN 
            inventory i ON si.inventoryID = i.inventoryID
        WHERE 
            si.productID = ?
    `;

    db.query(query, [productID], (err, result) => {
        if (err) {
            console.error("Error fetching subitems:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(result);
    });
});
  
  router.put('/putProduct/:productID', (req, res) => {
    const productID = req.params.productID;
    const updatedData = req.body;
  
    // Update the product table
    const productUpdateQuery = `
      UPDATE product
      SET productName = COALESCE(?, productName),
          imageUrl = COALESCE(?, imageUrl),
          categoryID = COALESCE(?, categoryID)
      WHERE productID = ?
    `;
  
    const productValues = [
      updatedData.productName || null,
      updatedData.imageUrl || null,
      updatedData.categoryID || null,
      productID,
    ];
  
    db.query(productUpdateQuery, productValues, (err, productResult) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      // Insert a new price entry into the price table
      if (updatedData.sellingPrice) {
        const newPriceEntry = {
          sellingPrice: updatedData.sellingPrice,
          productID: productID,
        };
  
        db.query("INSERT INTO price SET ?", newPriceEntry, (err, priceResult) => {
          if (err) {
            console.error("Error adding new price entry:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
        });
      }
  
      // Update the subitem table
      if (updatedData.subitems && Array.isArray(updatedData.subitems)) {
        updatedData.subitems.forEach((subitem) => {
          const subitemUpdateQuery = `
            UPDATE subitem
            SET quantityNeeded = COALESCE(?, quantityNeeded)
            WHERE productID = ? AND inventoryID = ?
          `;
  
          const subitemValues = [
            subitem.quantityNeeded || null,
            productID,
            subitem.inventoryID
          ];
  
          db.query(subitemUpdateQuery, subitemValues, (err, subitemResult) => {
            if (err) {
              console.error("Error updating subitem:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }
          });
        });
      }
  
      return res.json({ message: "Product updated, new price entry added, subitems updated successfully" });
    });
  });

  

  module.exports = router;