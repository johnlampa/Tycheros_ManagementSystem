// routes/orderingRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "AdDU2202201425196", // Change pw
  database: "tycherosdb"
});

//ORDERING
//PAGE
//ENDPOINTS

// GET MENU DATA ENDPOINT
router.get('/getCustomerMenu', (req, res) => {
    const query = `
      SELECT p.productID, p.productName, p.imageUrl, c.categoryName as categoryName, pr.sellingPrice
      FROM product p
      JOIN category c ON p.categoryID = c.categoryID
      JOIN price pr ON p.productID = pr.productID
      WHERE pr.priceID = (
          SELECT MAX(pr2.priceID)
          FROM price pr2
          WHERE pr2.productID = p.productID
      )
    `;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching menu data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(result);
    });
  });
  
  module.exports = router;