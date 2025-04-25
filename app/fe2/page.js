'use client';
import React, { useState, useEffect } from 'react';

export default function Page() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    roll: '',
    name: '',
    maths: '',
    science: '',
    social: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('students');
    if (stored) setStudents(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    if (!formData.roll || !formData.name) return alert('Roll number and Name are required!');
    const newStudent = { ...formData };
    setStudents(prev => [...prev, newStudent]);
    setFormData({ roll: '', name: '', maths: '', science: '', social: '' });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📘 Student Grades Manager</h1>

      <div style={styles.form}>
        <input style={styles.input} type="text" name="roll" placeholder="Roll Number" value={formData.roll} onChange={handleChange} />
        <input style={styles.input} type="text" name="name" placeholder="Student Name" value={formData.name} onChange={handleChange} />
        <input style={styles.input} type="number" name="maths" placeholder="Maths Marks" value={formData.maths} onChange={handleChange} />
        <input style={styles.input} type="number" name="science" placeholder="Science Marks" value={formData.science} onChange={handleChange} />
        <input style={styles.input} type="number" name="social" placeholder="Social Studies Marks" value={formData.social} onChange={handleChange} />
        <button style={styles.button} onClick={handleSubmit}>Add Student</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Roll No.</th>
            <th>Name</th>
            <th>Maths</th>
            <th>Science</th>
            <th>Social</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, idx) => (
            <tr key={idx}>
              <td>{s.roll}</td>
              <td>{s.name}</td>
              <td>{s.maths}</td>
              <td>{s.science}</td>
              <td>{s.social}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    background: '#f1f4ff',
    minHeight: '100vh'
  },
  title: {
    textAlign: 'center',
    color: '#2b2b2b'
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '30px'
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    width: '180px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px 20px',
    background: '#4285f4',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    background: 'white'
  },
  th: {
    border: '1px solid #ccc',
    padding: '10px'
  },
  td: {
    border: '1px solid #ccc',
    padding: '10px',
    textAlign: 'center'
  }
};
