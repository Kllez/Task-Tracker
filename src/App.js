import React, { useState, useEffect } from 'react';
import { FaTrash, FaCheck } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;

    const newTasks = [
      ...tasks,
      {
        id: Date.now(),
        name: newTask,
        dateAdded: new Date().toLocaleDateString(),
        dueDate: dueDate.toLocaleDateString(),
        completed: false,
      },
    ];
    localStorage.setItem('tasks', JSON.stringify(newTasks));

    setTasks(newTasks);
    setNewTask('');
    setDueDate(new Date());
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') {
      return task.completed;
    } else if (filter === 'incomplete') {
      return !task.completed;
    } else {
      return true;
    }
  });

  return (
    <div className="App">
      <div className="header">
        <h1>Task Tracker</h1>
      </div>
      <form>
        <div className="add-task">
          <div className="form-group">
            <label htmlFor="newTask">New Task Details</label>
            <input
              type="text"
              id="newTask"
              placeholder="Add new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <DatePicker id="dueDate" selected={dueDate} onChange={(date) => setDueDate(date)} minDate={new Date()} />
          </div>
          <div className="form-group">
            <label>&nbsp;</label>
            <button className="add-button" onClick={addTask}>
              Add Task
            </button>
          </div>
        </div>
      </form>

      <div className="filter-buttons">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
        <button className={filter === 'incomplete' ? 'active' : ''} onClick={() => setFilter('incomplete')}>Incomplete</button>
      </div>

      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <span className="task-name">{task.name}</span> 
            <span className="task-date">{`   Added: ${task.dateAdded}`}</span>
            <span className="task-date">{`   Due: ${task.dueDate}`}</span>
            <div>
              <button className="delete-button" onClick={() => deleteTask(task.id)}>
                <FaTrash />
              </button>
              <button className="complete-button" onClick={() => toggleComplete(task.id)}>
                <FaCheck />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
