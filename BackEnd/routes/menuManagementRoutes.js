// routes/menuManagementRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "AdDU2202201425196", // Change pw
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
        (SELECT productID, MAX(priceID) as maxPriceID 
         FROM price 
         GROUP BY productID) latestPrice 
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
  
      // Update the price table
      if (updatedData.sellingPrice) {
        const priceUpdateQuery = `
          UPDATE price
          SET sellingPrice = ?
          WHERE productID = ?
        `;
  
        db.query(priceUpdateQuery, [updatedData.sellingPrice, productID], (err, priceResult) => {
          if (err) {
            console.error("Error updating price:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
        });
      }
  
      // Check if the product exists
      const checkProductExistsQuery = `
        SELECT 1 FROM product WHERE productID = ?
      `;
  
      db.query(checkProductExistsQuery, [productID], (err, productExistsResult) => {
        if (err) {
          console.error("Error checking product existence:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
  
        if (productExistsResult.length === 0) {
          return res.status(404).json({ error: "Product not found" });
        }
  
        // Update or insert subitems if product exists
        if (updatedData.subitems && Array.isArray(updatedData.subitems)) {
          updatedData.subitems.forEach((subitem) => {
            // Check if the subitem already exists
            const checkSubitemExistsQuery = `
              SELECT subitemID FROM subitem
              WHERE productID = ? AND inventoryID = ?
            `;
  
            db.query(checkSubitemExistsQuery, [productID, subitem.inventoryID], (err, subitemExistsResult) => {
              if (err) {
                console.error("Error checking subitem existence:", err);
                return res.status(500).json({ error: "Internal Server Error" });
              }
  
              if (subitemExistsResult.length > 0) {
                // Update the existing subitem's quantityNeeded
                const subitemUpdateQuery = `
                  UPDATE subitem
                  SET quantityNeeded = COALESCE(?, quantityNeeded)
                  WHERE productID = ? AND inventoryID = ?
                `;
  
                const subitemValues = [
                  subitem.quantityNeeded || null,
                  productID,
                  subitem.inventoryID // Use the inventoryID to identify the subitem
                ];
  
                db.query(subitemUpdateQuery, subitemValues, (err, subitemUpdateResult) => {
                  if (err) {
                    console.error("Error updating subitem:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                  }
                });
              } else {
                // Insert a new subitem if it doesn't exist
                const subitemInsertQuery = `
                  INSERT INTO subitem (productID, inventoryID, quantityNeeded)
                  VALUES (?, ?, ?)
                `;
  
                const subitemInsertValues = [
                  productID,
                  subitem.inventoryID,
                  subitem.quantityNeeded || null,
                ];
  
                db.query(subitemInsertQuery, subitemInsertValues, (err, subitemInsertResult) => {
                  if (err) {
                    console.error("Error inserting new subitem:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                  }
                });
              }
            });
          });
        }
  
        return res.json({ message: "Product, subitems, and price updated successfully" });
      });
    });
  });

  //DELETE PRODUCT ENDPOINT
  router.delete('/deleteProduct/:productID', (req, res) => {
    const { productID } = req.params;
    
    const deleteQuery = `DELETE FROM product WHERE productID = ?`;
    
    db.query(deleteQuery, [productID], (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).json({ message: "Error deleting product" });
        }
        
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Product deleted successfully" });
        } else {
            return res.status(404).json({ message: "Product not found" });
        }
    });
  });
 
  module.exports = router;