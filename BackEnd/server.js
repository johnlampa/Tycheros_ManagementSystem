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

//EMPLOYEE PAGE CRUD

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