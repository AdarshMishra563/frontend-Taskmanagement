import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EditTaskForm = ({ task, onClose, onUpdate }) => {
  const token = useSelector(state => state.user.user.user);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate.slice(0,10),
    priority: task.priority,
    status: task.status
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/auth/tasks/${task._id}`, formData, {
        headers: { Authorization: `${token}` }
      });
      onUpdate(); 
      onClose();  
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-200">Edit Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <div className="flex space-x-3">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskForm;
