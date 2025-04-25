'use client';
import { useEffect, useState } from 'react';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isClient]);

  const handleAddOrEdit = () => {
    if (!input.trim()) return;
    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex].text = input;
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, { text: input, completed: false }]);
    }
    setInput('');
  };

  const handleToggle = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    if (editingIndex === index) {
      setInput('');
      setEditingIndex(null);
    }
  };

  const handleEdit = (index) => {
    setInput(tasks[index].text);
    setEditingIndex(index);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📝 To-Do App</h1>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add or edit a task..."
          style={styles.input}
        />
        <button onClick={handleAddOrEdit} style={styles.button}>
          {editingIndex !== null ? 'Update' : 'Add'}
        </button>
      </div>
      <ul style={styles.taskList}>
        {tasks.map((task, index) => (
          <li key={index} style={styles.taskItem}>
            <span
              onClick={() => handleToggle(index)}
              style={{
                ...styles.taskText,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'gray' : 'black',
              }}
            >
              {task.text}
            </span>
            <div>
              <button onClick={() => handleEdit(index)} style={styles.editBtn}>✏️</button>
              <button onClick={() => handleDelete(index)} style={styles.deleteBtn}>❌</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: '50px auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  taskList: {
    listStyle: 'none',
    padding: 0,
  },
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
  },
  taskText: {
    cursor: 'pointer',
    flex: 1,
  },
  deleteBtn: {
    marginLeft: 10,
    backgroundColor: '#e63946',
    border: 'none',
    color: 'white',
    padding: '5px 10px',
    borderRadius: 4,
    cursor: 'pointer',
  },
  editBtn: {
    backgroundColor: '#f0ad4e',
    border: 'none',
    color: 'white',
    padding: '5px 10px',
    borderRadius: 4,
    marginRight: 5,
    cursor: 'pointer',
  },
};
