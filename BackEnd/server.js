const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Route imports
const employeeRoutes = require('./routes/employeeManagementRoutes');
const inventoryRoutes = require('./routes/inventoryManagementRoutes');
const menuRoutes = require('./routes/menuManagementRoutes');
const orderingRoutes = require('./routes/orderingRoutes');
const orderRoutes = require('./routes/orderManagementRoutes');

// Route usage
app.use('/employeeManagement', employeeRoutes);
app.use('/inventoryManagement', inventoryRoutes);
app.use('/menuManagement', menuRoutes);
app.use('/ordering', orderingRoutes);
app.use('/orderManagement', orderRoutes);

// LISTEN LISTEN LISTEN LISTEN LISTEN PAMINAW BA
app.listen(8081, () => {
    console.log("listening");
    });