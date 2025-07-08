import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useSocket } from '../socketcontext/SocketContext';

const EditTaskForm = ({ task, onClose, onUpdate }) => {
  const { socket, incomingCall, setIncomingCall, onlineUsers } = useSocket();
  const token = useSelector(state => state.user?.user?.user);
  const d=useSelector(state => state.user?.user?.email)
    const [messages, setMessages] = useState([]);
const [users,setallusers]=useState([])
  const [loading,setloading]=useState(false);
  const [name,setname]=useState("");
  const [editingBy, setEditingBy] = useState(null);
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
        setloading(true)
      await axios.put(`https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks/${task._id}`, formData, {
        headers: { Authorization: `${token}` }
      });
     
      onUpdate(); 
      onClose();  
    } catch (err) {
      console.error('Update failed:', err);
    }finally{setloading(false)}
  };
 useEffect(() => {
  const fetchUsers = async () => {
    const res = await axios.get(
      'https://backend-taskmanagement-k0md.onrender.com/api/auth/allusers',
      { headers: { Authorization: `${token}` } }
    );
    setallusers(res.data.users);
  };
  if (token) {
    fetchUsers();
  }
}, [token]);


useEffect(()=>{

  

  for(let i=0;i<users.length;i++){
 if(users[i]?.email==d){setname(users[i]?.name);
  

 }

  }
},[users]);
useEffect(() => {
    if (!users.length || !d || !task?._id) return;

    
    socket.emit("startEditingTask", { taskId: task._id, useremail: d });

    const handleTaskEditingStatus = ({ taskId: incomingTaskId, editingBy, conflict, attemptedBy }) => {
      if (incomingTaskId === task._id) {
        if (conflict) {
          const editor = users.find(u => u.email === editingBy);
          const message = `This task is already being edited by ${editor ? editor.name : editingBy}`;
          setEditingBy(editor ? editor.name : editingBy);
          setMessages(prev => [...prev, message]);
        } else {
          const editorName = editingBy === d ? "" : (users.find(u => u.email === editingBy)?.name || editingBy);
          setEditingBy(editorName);
        }
      }
    };

    const handleTaskEditingConflict = ({ taskId: incomingTaskId, attemptedBy }) => {
      if (incomingTaskId === task._id) {
        const attemptedUser = users.find(u => u.email === attemptedBy);
        const message = `${attemptedUser ? attemptedUser.name : attemptedBy} tried to edit this task while you’re editing it`;
        setMessages(prev => [...prev, message]);
      }
    };

    socket.on("taskEditingStatus", handleTaskEditingStatus);
    socket.on("taskEditingConflict", handleTaskEditingConflict);


    return () => {
      socket.emit("stopEditingTask", { taskId: task._id, useremail: d });
      socket.off("taskEditingStatus", handleTaskEditingStatus);
      socket.off("taskEditingConflict", handleTaskEditingConflict);
    };
  }, [users, task, d, socket]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-200">Edit Task</h2>
       {editingBy &&(<h3 className="p-2 rounded bg-yellow-500 text-black font-semibold">Editing by: {editingBy || "You"}</h3>)}

     
      {messages.length > 0 && (
        <div className='p-2 rounded bg-yellow-500 text-black font-semibold' style={{ marginTop: "1rem", padding: "0.5rem",  borderRadius: "8px" }}>
         
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
  {!editingBy&&   <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? (
            <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            'Update'
          )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>}
    </div>
  );
};

export default EditTaskForm;
