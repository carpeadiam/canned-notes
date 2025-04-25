'use client';

import React, { useState, useEffect } from 'react';

export default function Page() {
  const [books, setBooks] = useState([]);
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('books');
    if (saved) {
      setBooks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (bookData.title && bookData.author && bookData.price && bookData.stock) {
      const newBook = {
        ...bookData,
        id: Date.now()
      };
      setBooks(prev => [...prev, newBook]);
      setBookData({ title: '', author: '', price: '', stock: '' });
    }
  };

  const handleDelete = (id) => {
    const filtered = books.filter(b => b.id !== id);
    setBooks(filtered);
  };

  return (
    <div className="container">
      <h1>📚 Bookstore Dashboard</h1>

      <div className="form">
        <input name="title" placeholder="Book Title" value={bookData.title} onChange={handleChange} />
        <input name="author" placeholder="Author" value={bookData.author} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={bookData.price} onChange={handleChange} />
        <input name="stock" type="number" placeholder="Stock" value={bookData.stock} onChange={handleChange} />
        <button onClick={handleAdd}>Add Book</button>
      </div>

      <div className="list">
        {books.length === 0 && <p>No books added.</p>}
        {books.map((book) => (
          <div key={book.id} className="book">
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Price:</strong> ₹{book.price}</p>
            <p><strong>Stock:</strong> {book.stock} copies</p>
            <button onClick={() => handleDelete(book.id)}>❌ Remove</button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          max-width: 700px;
          margin: 0 auto;
          padding: 2rem;
          font-family: Arial, sans-serif;
        }
        h1 {
          text-align: center;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .form input {
          padding: 8px;
          font-size: 1rem;
        }
        .form button {
          padding: 10px;
          background-color: #4CAF50;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 1rem;
        }
        .form button:hover {
          background-color: #45a049;
        }
        .list {
          margin-top: 20px;
        }
        .book {
          border: 1px solid #ddd;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 5px;
        }
        .book h3 {
          margin-top: 0;
        }
        .book button {
          margin-top: 10px;
          padding: 6px 12px;
          background-color: #f44336;
          color: white;
          border: none;
          cursor: pointer;
        }
        .book button:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </div>
  );
}
