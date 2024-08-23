"use client";

import React, { useEffect, useState } from 'react';

// Define the Employee interface
interface Employee {
  employeeID: string;
  firstName: string;
  lastName: string;
  designation: string;
  status: string;
  contactInformation: string;
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    employeeID: '',
    firstName: '',
    lastName: '',
    designation: '',
    status: '',
    contactInformation: ''
  });
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [editEmployeeID, setEditEmployeeID] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:8081/employees');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Employee[] = await response.json();
        setEmployees(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    try {
      const response = await fetch('http://localhost:8081/addEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add employee');
      }
  
      // Close the overlay and reset the form
      setNewEmployee({
        employeeID: '',
        firstName: '',
        lastName: '',
        designation: '',
        status: '',
        contactInformation: ''
      });
  
      // Fetch updated employee list
      const updatedEmployees = await fetch('http://localhost:8081/employees').then(res => res.json());
      setEmployees(updatedEmployees);
  
      // Display success message
      alert('Employee added successfully');
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleEditEmployee = async (id: string) => {
    const trimmedId = id.trim();
    console.log("Trimmed Employee ID:", trimmedId);
    
    const employee = employees.find(emp => emp.employeeID.toString().trim() === trimmedId);
    console.log("Found employee:", employee);
    
    if (employee) {
      setEmployeeToEdit(employee);
      setShowEditOverlay(true);
    } else {
      alert('Employee not found');
    }
  };
  
  

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:8081/editEmployee/${employeeToEdit?.employeeID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeToEdit),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      // Fetch the updated list of employees
      const updatedEmployees = await response.json();
      setEmployees(updatedEmployees);

      // Close the overlay and refresh the page
      setShowEditOverlay(false);
      setShowConfirmOverlay(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1>Employees</h1>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowAddOverlay(true)}
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Add Employee
        </button>
        <button
          onClick={() => {
            const id = prompt('Enter Employee ID to Edit:');
            if (id) {
              handleEditEmployee(id); // Pass the ID directly
            }
          }}
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Edit Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <p>No employees found</p>
      ) : (
        <table style={{ width: '100%', color: 'black', border: '1px solid black', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '10px' }}>Employee ID</th>
              <th style={{ border: '1px solid black', padding: '10px' }}>First Name</th>
              <th style={{ border: '1px solid black', padding: '10px' }}>Last Name</th>
              <th style={{ border: '1px solid black', padding: '10px' }}>Designation</th>
              <th style={{ border: '1px solid black', padding: '10px' }}>Status</th>
              <th style={{ border: '1px solid black', padding: '10px' }}>Contact Information</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employeeID}>
                <td style={{ border: '1px solid black', padding: '10px' }}>{employee.employeeID}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{employee.firstName}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{employee.lastName}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{employee.designation}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{employee.status}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{employee.contactInformation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
            }}
          >
            <h2 style={{ color: 'black' }}>Add Employee</h2>
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={newEmployee.firstName}
                onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                style={{ marginBottom: '10px', padding: '8px', width: '100%', color: 'black' }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newEmployee.lastName}
                onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                style={{ marginBottom: '10px', padding: '8px', width: '100%', color: 'black' }}
              />
              <input
                type="text"
                placeholder="Designation"
                value={newEmployee.designation}
                onChange={(e) => setNewEmployee({ ...newEmployee, designation: e.target.value })}
                style={{ marginBottom: '10px', padding: '8px', width: '100%', color: 'black' }}
              />
              <input
                type="text"
                placeholder="Status"
                value={newEmployee.status}
                onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
                style={{ marginBottom: '10px', padding: '8px', width: '100%', color: 'black' }}
              />
              <input
                type="text"
                placeholder="Contact Information"
                value={newEmployee.contactInformation}
                onChange={(e) => setNewEmployee({ ...newEmployee, contactInformation: e.target.value })}
                style={{ marginBottom: '10px', padding: '8px', width: '100%', color: 'black' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                  onClick={() => {
                    handleAddEmployee(); 
                    setShowAddOverlay(false); 
                    window.location.reload();
                  }}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowAddOverlay(false)}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditOverlay && employeeToEdit && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
            }}
          >
            <h2 style={{ color: 'black' }}>Edit Employee</h2>
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={employeeToEdit.firstName}
                onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, firstName: e.target.value })}
                style={{ marginBottom: '10px', padding: '8px', width: '100%', color: 'black' }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={employeeToEdit.lastName}
                onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, lastName: e.target.value })}
                style={{ marginBottom: '10px', padding: '8px', width: '100%', color: 'black' }}
              />
              <input
                type="text"
                placeholder="Designation"
                value={employeeToEdit.designation}
                onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, designation: e.target.value })}
                style={{ marginBottom: '10px', padding: '8px', width: '100%', color: 'black' }}
              />
              <input
                type="text"
                placeholder="Status"
                value={employeeToEdit.status}
                onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, status: e.target.value })}
                style={{ marginBottom: '10px', padding: '8px', width: '100%', color: 'black' }}
              />
              <input
                type="text"
                placeholder="Contact Information"
                value={employeeToEdit.contactInformation}
                onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, contactInformation: e.target.value })}
                style={{ marginBottom: '10px', padding: '8px', width: '100%', color: 'black' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                  onClick={() => setShowConfirmOverlay(true)}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setShowEditOverlay(false)}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
            }}
          >
            <h2 style={{ color: 'black' }}>Confirm Changes</h2>
            <p style={{ color: 'black' }}>Are you sure you want to save these changes?</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
                onClick={handleSaveChanges}
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmOverlay(false)}
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
