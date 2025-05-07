import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CreateTaskForm = () => {
    const [loading,setLoading]= useState(false)
    const [success,setsuccess]=useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
  });
const token=useSelector(state=>state.user.user.user)
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.title) tempErrors.title = 'Title is required';
    if (!formData.dueDate) tempErrors.dueDate = 'Due Date is required';
    if (!formData.priority) tempErrors.priority = 'Priority is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        ...formData,
        status: 'To Do'  
      };
console.log(payload,token)
      const res = await axios.post('http://localhost:4000/api/auth/createtasks', payload, {
        headers: {
          Authorization:`${token}`
          
        }
      });
setsuccess(true)
      console.log('Task created:', res.data);
      
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: '',
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      alert('Failed to create task.');
    }finally{setLoading(false)}
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 text-white p-6 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600"
          />
          {errors.title && <p className="text-red-400">{errors.title}</p>}
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600"
          />
        </div>

        <div>
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600"
          />
          {errors.dueDate && <p className="text-red-400">{errors.dueDate}</p>}
        </div>

        <div>
          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600"
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors.priority && <p className="text-red-400">{errors.priority}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 p-2 rounded text-white transition"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            'Create Task'
          )}
        </button>
        {success&& <div className='text-xl '>Task Created successfully!</div>}
      </form>
    </div>
  );
};

export default CreateTaskForm;
