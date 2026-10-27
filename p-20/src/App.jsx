
import { useState, useEffect } from 'react';

function EmployeeForm({ addEmployee, editing, updateEmployee, cancelEdit }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');

  useEffect(() => {
    setName(editing ? editing.name : '');
    setRole(editing ? editing.role : '');
    setSalary(editing ? String(editing.salary) : '');
  }, [editing]);

  function handleSubmit(e) {
    e.preventDefault();

    const employee = {
      id: editing ? editing.id : Date.now(),
      name,
      role,
      salary: Number(salary)
    };

    if (editing) {
      updateEmployee(employee);
    } else {
      addEmployee(employee);
    }

    setName('');
    setRole('');
    setSalary('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editing ? 'Update Employee' : 'Add Employee'}</h2>

      <input
        placeholder="Employee Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <br /><br />

      <input
        placeholder="Employee Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />
      <br /><br />

      <input
        type="number"
        placeholder="Salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        min="0"
        required
      />
      <br /><br />

      <button type="submit">
        {editing ? 'Update' : 'Add Employee'}
      </button>

      {editing && (
        <button type="button" onClick={cancelEdit}>
          Cancel
        </button>
      )}
    </form>
  );
}

function EmployeeList({ employees, editEmployee, deleteEmployee }) {
  return (
    <div>
      <h2>Employee List</h2>

      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        employees.map((emp) => (
          <div key={emp.id}>
            <p>Name: {emp.name}</p>
            <p>Role: {emp.role}</p>
            <p>Salary: ₹{emp.salary}</p>

            <button onClick={() => editEmployee(emp)}>
              Edit
            </button>{' '}

            <button onClick={() => deleteEmployee(emp.id)}>
              Delete
            </button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  // Read employee data from a dummy API
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('API request failed');
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(
          data.slice(0, 3).map((emp) => ({
            id: emp.id,
            name: emp.name,
            role: emp.company.name,
            salary: 30000
          }))
        );
      })
      .catch(() => {
        setMessage('API unavailable. You can still add employees.');
      });
  }, []);

  function addEmployee(emp) {
    setEmployees((prev) => [...prev, emp]);
    setMessage('Employee added successfully!');
  }

  function updateEmployee(updated) {
    setEmployees((prev) =>
      prev.map((emp) => emp.id === updated.id ? updated : emp)
    );
    setEditing(null);
    setMessage('Employee updated successfully!');
  }

  function deleteEmployee(id) {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    if (editing && editing.id === id) {
      setEditing(null);
    }
    setMessage('Employee deleted successfully!');
  }

  return (
    <div>
      <h1>Employee Management System</h1>

      {message && <p>{message}</p>}

      <EmployeeForm
        addEmployee={addEmployee}
        editing={editing}
        updateEmployee={updateEmployee}
        cancelEdit={() => setEditing(null)}
      />

      <EmployeeList
        employees={employees}
        editEmployee={(emp) => {
          setEditing(emp);
          setMessage('');
        }}
        deleteEmployee={deleteEmployee}
      />
    </div>
  );
}

export default App;
