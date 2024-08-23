const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "AdDU2202201425196", //change pw
  database: "tycherosdb"
});



//ORDERING
//PAGE
//ENDPOINTS

// GET MENU DATA ENDPOINT
app.get('/menu', (req, res) => {
  const query = `
    SELECT p.productID, p.productName, p.imageUrl, c.name as categoryName, pr.sellingPrice
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











// MENU
// MANAGEMENT
// ENDPOINTS

// GET MENU MANAGEMENT DATA ENDPOINT
app.get('/menuManagement', (req, res) => {
  const query = `
    SELECT p.productID, p.productName, c.name as categoryName, pr.sellingPrice
    FROM product p
    JOIN category c ON p.categoryID = c.categoryID
    JOIN price pr ON p.productID = pr.productID
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching menu data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});


//CREATE PRODUCT ENDPOINT //DONE
app.post('/addProduct', (req, res) => {
  const productData = req.body;

  // Insert the product into the product table
  const product = {
    productName: productData.productName, 
    imageUrl: productData.imageURL,
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


app.put('/editProduct/:productID', (req, res) => {
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


























//EMPLOYEE 
//MANAGEMENT
//ENDPOINTS

//READ ENDPOINT //DONE
app.get('/employees', (req, res) => {
  const query = "SELECT * FROM employees";

  db.query(query, (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    console.log(data);
    return res.json(data);
  });
});

//CREATE ENDPOINT //DONE
app.post('/addEmployee', (req, res) => {
  const employeeData = req.body;
  const employee = {
    firstName: employeeData.firstName, 
    lastName: employeeData.lastName,
    password: employeeData.password,
    designation: employeeData.designation,
    status: employeeData.status,
    contactInformation: employeeData.contactInformation,
  };

  db.query("INSERT INTO employees SET ?", employee, (err, employeeResult) => {
    if (err) {
      console.error("Error adding employee:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  })
});


// UPDATE ENDPOINT //DONE
app.put('/editEmployee/:employeeID', (req, res) => {
  const employeeID = req.params.employeeID;
  const employeeData = req.body;

  // Array to hold fields to update and their corresponding values
  let fields = [];
  let values = [];

  // Add fields to update if they exist in the request body
  if (employeeData.firstName) {
    fields.push("firstName = ?");
    values.push(employeeData.firstName);
  }
  if (employeeData.lastName) {
    fields.push("lastName = ?");
    values.push(employeeData.lastName);
  }
  if (employeeData.password) {
    fields.push("password = ?");
    values.push(employeeData.password);
  }
  if (employeeData.designation) {
    fields.push("designation = ?");
    values.push(employeeData.designation);
  }
  if (employeeData.status) {
    fields.push("status = ?");
    values.push(employeeData.status);
  }
  if (employeeData.contactInformation) {
    fields.push("contactInformation = ?");
    values.push(employeeData.contactInformation);
  }

  // Add the employeeID to the values array for the WHERE clause
  values.push(employeeID);

  // Construct the SQL query
  const query = `
    UPDATE employees 
    SET ${fields.join(", ")}
    WHERE employeeID = ?
  `;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating employee:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    return res.json({ message: "Employee updated successfully" });
  });
});

// DELETE ENDPOINT //DONE
app.delete('/deleteEmployee/:employeeID', (req, res) => {
  const employeeID = req.params.employeeID;

  const query = `
    DELETE FROM employees 
    WHERE employeeID = ?
  `;

  db.query(query, [employeeID], (err, result) => {
    if (err) {
      console.error("Error deleting employee:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    return res.json({ message: "Employee deleted successfully" });
  });
});

// LISTEN LISTEN LISTEN LISTEN LISTEN PAMINAW BA
app.listen(8081, () => {
    console.log("listening");
    });