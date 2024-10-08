"use client";

import React, { useEffect, useState } from "react";
import { Employee } from "../../../lib/types/EmployeeDataTypes"; // Assuming the Employee type is defined here

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
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
        employeeID: undefined,
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

  const handleEditEmployee = (id: number) => {
    const employee = employees.find((emp) => emp.employeeID === id);
    if (employee) {
      setEmployeeToEdit(employee);
      setShowEditOverlay(true);
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
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h1 className="text-black">Employees</h1>
      <div className="mb-5">
        <button
          onClick={() => setShowAddOverlay(true)}
          className="bg-black text-white px-5 py-2.5 rounded border-none cursor-pointer mr-2.5"
        >
          Add Employee
        </button>
        <button
          onClick={() => {
            const id = prompt("Enter Employee ID to Edit:");
            if (id) {
              handleEditEmployee(parseInt(id));
            }
          }}
          className="bg-black text-white px-5 py-2.5 rounded border-none cursor-pointer"
        >
          Edit Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <p>No employees found</p>
      ) : (
        <table className="w-full text-black border border-black border-collapse">
          <thead>
            <tr>
              <th className="border border-black p-2.5">Employee ID</th>
              <th className="border border-black p-2.5">First Name</th>
              <th className="border border-black p-2.5">Last Name</th>
              <th className="border border-black p-2.5">Designation</th>
              <th className="border border-black p-2.5">Status</th>
              <th className="border border-black p-2.5">Contact Information</th>
              <th className="border border-black p-2.5">Password</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employeeID}>
                <td className="border border-black p-2.5">{employee.employeeID}</td>
                <td className="border border-black p-2.5">{employee.firstName}</td>
                <td className="border border-black p-2.5">{employee.lastName}</td>
                <td className="border border-black p-2.5">{employee.designation}</td>
                <td className="border border-black p-2.5">{employee.status}</td>
                <td className="border border-black p-2.5">{employee.contactInformation}</td>
                <td className="border border-black p-2.5">{employee.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-72">
            <h2 className="text-black">Add Employee</h2>
            <div>
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
                    handleAddEmployee();
                    setShowAddOverlay(false);
                  }}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowAddOverlay(false)}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
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
                placeholder="Contact Information"
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
                    handleSaveChanges();
                    setShowEditOverlay(false);
                  }}
                  className="bg-black text-white py-2 px-4 rounded cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowEditOverlay(false)}
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
