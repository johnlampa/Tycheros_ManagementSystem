"use client";

import React, { useEffect, useState } from "react";
import { Employee } from "../../../lib/types/EmployeeDataTypes";

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [showEmployeeSelectOverlay, setShowEmployeeSelectOverlay] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    employeeID: undefined,
    firstName: "",
    lastName: "",
    designation: "",
    status: "",
    contactInformation: "",
    password: "",
  });
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [selectedEmployeeID, setSelectedEmployeeID] = useState<number | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/employeeManagement/getEmployee"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
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
    if (newEmployee.employeeID === undefined || isNaN(newEmployee.employeeID)) {
      alert("Please enter a valid Employee ID");
      return;
    }
  
    try {
      const response = await fetch(
        "http://localhost:8081/employeeManagement/postEmployee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEmployee),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to add employee");
      }
  
      setNewEmployee({
        employeeID: undefined, // Reset employeeID to undefined after successful submission
        firstName: "",
        lastName: "",
        designation: "",
        status: "",
        contactInformation: "",
        password: "",
      });
  
      const updatedEmployees = await fetch(
        "http://localhost:8081/employeeManagement/getEmployee"
      ).then((res) => res.json());
      setEmployees(updatedEmployees);
  
      alert("Employee added successfully");
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };
    // Input Validation shenanigans :3
    // Phone number validation
    const isValidPhoneNumber = (phoneNumber: string): boolean => {
      const phoneRegex = /^09\d{9}$/; // Regex for 11 digits starting with '09'
      return phoneRegex.test(phoneNumber);
    };

    // Add employee validation
const getEmptyAddEmployeeFields = (): string[] => {
  const emptyFields = [];
  if (newEmployee.firstName.trim() === "") emptyFields.push("First Name");
  if (newEmployee.lastName.trim() === "") emptyFields.push("Last Name");
  if (newEmployee.designation.trim() === "") emptyFields.push("Designation");
  if (newEmployee.status.trim() === "") emptyFields.push("Status");
  if (newEmployee.contactInformation.trim() === "") {
    emptyFields.push("Contact Information");
  } else if (!isValidPhoneNumber(newEmployee.contactInformation)) {
    emptyFields.push("Invalid Contact Information"); // Special message for invalid phone numbers
  }
  if (newEmployee.password.trim() === "") {
    emptyFields.push("Password"); // Validate if password is empty
  }

  return emptyFields;
};

// Edit employee validation
const getEmptyEditEmployeeFields = (): string[] => {
  const emptyFields = [];
  if (employeeToEdit?.firstName.trim() === "") emptyFields.push("First Name");
  if (employeeToEdit?.lastName.trim() === "") emptyFields.push("Last Name");
  if (employeeToEdit?.designation.trim() === "") emptyFields.push("Designation");
  if (employeeToEdit?.status.trim() === "") emptyFields.push("Status");
  if (employeeToEdit?.contactInformation.trim() === "") {
    emptyFields.push("Contact Information");
  } else if (!isValidPhoneNumber(employeeToEdit?.contactInformation || "")) {
    emptyFields.push("Invalid Contact Information"); // Special message for invalid phone numbers
  }
  if (employeeToEdit?.password.trim() === "") {
    emptyFields.push("Password"); // Validate if password is empty
  }

  return emptyFields;
};


  const handleEditEmployee = (selectedEmployeeID?: number) => {
    const employee = employees.find((emp) => emp.employeeID === selectedEmployeeID);
    if (employee) {
      setEmployeeToEdit(employee);
      setShowEditOverlay(true);
      setShowEmployeeSelectOverlay(false);
    } else {
      alert("Employee not found");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/employeeManagement/putEmployee/${employeeToEdit?.employeeID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeToEdit),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      const updatedEmployees = await fetch(
        "http://localhost:8081/employeeManagement/getEmployee"
      ).then((res) => res.json());
      setEmployees(updatedEmployees);

      setShowEditOverlay(false);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-sm mx-auto">
      <h1 className="text-black text-xl font-bold text-center mb-4">Employee Management</h1>
  
      {/* Buttons */}
      <div className="flex flex-col space-y-2 mb-4">
        <button
          onClick={() => setShowAddOverlay(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
        <button
          onClick={() => setShowEmployeeSelectOverlay(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Edit Employee
        </button>
      </div>
  
      {/* No Employees Case */}
      {employees.length === 0 ? (
        <p className="text-center text-black">No employees found</p>
      ) : (
        <div className="space-y-4">
          {/* Employee Cards */}
          {employees.map((employee) => (
            <div
              key={employee.employeeID}
              className="border border-black p-4 rounded-md bg-gray-100"
            >
              <div className="flex justify-between bg-gray-300 p-2 mb-2 rounded">
                <span className="font-semibold text-black">Employee ID: {employee.employeeID}</span>
                <span className="text-red-500 font-semibold">{employee.status}</span>
              </div>
  
              {/* Employee Details */}
              <div className="text-sm text-black">
                <p>
                  <strong>First Name:</strong> {employee.firstName}
                </p>
                <p>
                  <strong>Last Name:</strong> {employee.lastName}
                </p>
                <p>
                  <strong>Designation:</strong> {employee.designation}
                </p>
                <p>
                  <strong>Contact Number:</strong> {employee.contactInformation}
                </p>
                <p>
                  <strong>Password:</strong> {employee.password}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showAddOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-72">
            <h2 className="text-black">Add Employee</h2>
            <div>
              {/* Updated Employee ID input */}
              <input
                type="text"
                placeholder="Employee ID"
                value={newEmployee.employeeID !== undefined ? newEmployee.employeeID : ""} // Display empty string if undefined
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || !isNaN(Number(value))) { // Allow only numbers or empty input
                    setNewEmployee({ ...newEmployee, employeeID: value === "" ? undefined : Number(value) });
                  }
                }}
                className="mb-2.5 p-2 w-full text-black"
              />
              <input
                type="text"
                placeholder="First Name"
                value={newEmployee.firstName}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, firstName: e.target.value })
                }
                className="mb-2.5 p-2 w-full text-black"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newEmployee.lastName}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, lastName: e.target.value })
                }
                className="mb-2.5 p-2 w-full text-black"
              />
              <select
                value={newEmployee.designation}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, designation: e.target.value })
                }
                className="mb-2.5 p-2 w-full text-black"
              >
                <option value="" disabled>
                  Select Designation
                </option>
                <option value="Owner">Owner</option>
                <option value="Manager">Manager</option>
                <option value="Cashier">Cashier</option>
                <option value="Kitchen Staff">Kitchen Staff</option>
              </select>
              <select
                value={newEmployee.status}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, status: e.target.value })
                }
                className="mb-2.5 p-2 w-full text-black"
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input
                type="text"
                placeholder="Contact Information"
                value={newEmployee.contactInformation}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    contactInformation: e.target.value,
                  })
                }
                className="mb-2.5 p-2 w-full text-black"
              />
              <input
                type="password"
                placeholder="Password"
                value={newEmployee.password}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, password: e.target.value })
                }
                className="mb-2.5 p-2 w-full text-black"
              />

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    const emptyFields = getEmptyAddEmployeeFields();
                    if (emptyFields.length === 0) {
                      handleAddEmployee();
                      setShowAddOverlay(false);
                    } else {
                      alert(
                        `Please fill out the following fields: ${emptyFields.join(
                          ", "
                        )}`
                      );
                    }
                  }}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setNewEmployee({
                      employeeID: undefined,
                      firstName: "",
                      lastName: "",
                      designation: "",
                      status: "",
                      contactInformation: "",
                      password: "",
                    });
                    setShowAddOverlay(false);
                  }}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {showEmployeeSelectOverlay && (                                                          //Edit Employee Selector Modal with Radio Button :3                                                          
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"> 
            <div className="bg-white p-5 rounded-lg w-72">
              <h2 className="text-black">Select Employee to Edit</h2>
              <form>
                {employees.map((employee) => (
                  <div key={employee.employeeID} className="flex items-center mb-2.5">
                    <input
                      type="radio"
                      id={`employee-${employee.employeeID}`}
                      name="selectedEmployee"
                      value={employee.employeeID}
                      checked={selectedEmployeeID === employee.employeeID}
                      onChange={() => {
                        if (employee.employeeID !== undefined) {
                          setSelectedEmployeeID(employee.employeeID);
                        }
                      }}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`employee-${employee.employeeID}`}
                      className="text-black"
                    >
                      {employee.employeeID}: {employee.firstName} {employee.lastName}
                    </label>
                  </div>
                ))}
              </form>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    if (selectedEmployeeID) {
                      handleEditEmployee(selectedEmployeeID);
                      setShowEmployeeSelectOverlay(false);
                    } else {
                      alert("Please select an employee");
                    }
                  }}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setSelectedEmployeeID(null);
                    setShowEmployeeSelectOverlay(false);
                  }}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      {showEditOverlay && employeeToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-72">
            <h2 className="text-black">Edit Employee</h2>
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={employeeToEdit.firstName}
                onChange={(e) =>
                  setEmployeeToEdit({
                    ...employeeToEdit,
                    firstName: e.target.value,
                  })
                }
                className="mb-2.5 p-2 w-full text-black"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={employeeToEdit.lastName}
                onChange={(e) =>
                  setEmployeeToEdit({
                    ...employeeToEdit,
                    lastName: e.target.value,
                  })
                }
                className="mb-2.5 p-2 w-full text-black"
              />
              <select
                value={employeeToEdit.designation}
                onChange={(e) =>
                  setEmployeeToEdit({
                    ...employeeToEdit,
                    designation: e.target.value,
                  })
                }
                className="mb-2.5 p-2 w-full text-black"
              >
                <option value="" disabled>
                  Select Designation
                </option>
                <option value="Owner">Owner</option>
                <option value="Manager">Manager</option>
                <option value="Cashier">Cashier</option>
                <option value="Kitchen Staff">Kitchen Staff</option>
              </select>
              <select
                value={employeeToEdit.status}
                onChange={(e) =>
                  setEmployeeToEdit({
                    ...employeeToEdit,
                    status: e.target.value,
                  })
                }
                className="mb-2.5 p-2 w-full text-black"
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input
                type="text"
                placeholder="Contact Number"
                value={employeeToEdit.contactInformation}
                onChange={(e) =>
                  setEmployeeToEdit({
                    ...employeeToEdit,
                    contactInformation: e.target.value,
                  })
                }
                className="mb-2.5 p-2 w-full text-black"
              />
              <input
                type="password"
                placeholder="Password"
                value={employeeToEdit.password}
                onChange={(e) =>
                  setEmployeeToEdit({
                    ...employeeToEdit,
                    password: e.target.value,
                  })
                }
                className="mb-2.5 p-2 w-full text-black"
              />

              <div className="flex justify-between">
              <button
                    onClick={() => {
                      const emptyFields = getEmptyEditEmployeeFields(); //Specify what field is empty :3
                      if (emptyFields.length === 0) {
                        handleSaveChanges();
                        setShowEditOverlay(false);
                      } else {
                        alert(
                          `Please fill out the following fields: ${emptyFields.join(", ")}`
                        ); 
                      }
                    }}
                    className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                  >
                    Save
                  </button>
                <button
                  onClick={() => {
                    setEmployeeToEdit(null);
                    setShowEditOverlay(false)
                  }}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
