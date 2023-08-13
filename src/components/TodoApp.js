import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import './styles.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://172.104.207.188:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async () => {
    if (inputValue.trim() !== '') {
      try {
        const response = await axios.post('http://172.104.207.188:5000/api/todos', { task: inputValue });
        setTodos([...todos, response.data]);
        setInputValue('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };
  
  const handleEditTodo = async (index, newValue) => {
    const updatedTodos = [...todos];
    updatedTodos[index].task = newValue; // Update the task property
    setTodos(updatedTodos);
  
    try {
      await axios.put(`http://172.104.207.188:5000/api/todos/${todos[index]._id}`, { task: newValue });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };
  
  const handleRemoveTodo = async (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    try {
      await axios.delete(`http://localhost:5000/api/todos/${todos[index]._id}`);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="todo-container">
      <div className="add-todo-container">
        <TextField
          label="Add a new task"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddTodo}>
          Add
        </Button>
      </div>
      <List className="todo-list">
        {todos.map((todo, index) => (
          <ListItem key={index} className="list-item">
            <ListItemText primary={todo.task} />
            <ListItemSecondaryAction className="action-buttons">
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditTodo(index, prompt('Edit task:', todo.task))}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTodo(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TodoApp;
