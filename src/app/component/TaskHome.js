

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import FixedView from './Fixedviewchild';
import UpdateTask from './UpdateTask'
import { Loading } from '../page';

import { useSocket } from '../socketcontext/SocketContext';
import { useRouter } from 'next/navigation';
const dueInfo = (dateString) => {
    const now = new Date();
    const dueDate = new Date(dateString);
    const diffMs = dueDate - now;
  
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
    if (diffMs < 0) return { text: "Overdue", days: -1 };
    if (days >= 1) return { text: `${days} day${days !== 1 ? 's' : ''} ${hours % 24}h left`, days };
    if (hours >= 1) return { text: `${hours}h ${minutes % 60}m left`, days };
    if (minutes >= 1) return { text: `${minutes}m left`, days };
    return { text: "Less than a minute left", days };
  };
  
  
const TaskDashboard = ({onClick,j}) => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
 const[loading,setLoading]=useState("");
 const [modal,setmodal]=useState(false);
 const [currentTask, setCurrentTask] = useState(null);
const [page,setpage]=useState(false);
const [change,setchange]=useState(0);
const token=useSelector(state=>state.user?.user?.user);
const currentemail=useSelector(state=>state.user?.user?.email);
const {onlineUsers}=useSocket();
const router=useRouter();
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks',{
            headers:{Authorization:`${token}`}
        });
        
        const tasks = response.data;
        const now = new Date();

        const assigned = [];
        const created = [];
        const overdue = [];

        tasks.forEach(task => {




         if(!task?.assignedTo){
            
            created.push(task);
            
           
            
            
          
         }else{
            if(task?.assignedTo.email==currentemail){
                assigned.push(task)
            }else{
                
                created.push(task)
            }


         };


         if(new Date(task.dueDate) < now){
overdue.push(task)


         }
        });
        

        setAssignedTasks(assigned);
        setCreatedTasks(created);
        setOverdueTasks(overdue);
        setpage(true)

      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [change,j,currentemail,token]);

  const noTasks =
    assignedTasks.length === 0 &&
    createdTasks.length === 0 &&
    overdueTasks.length === 0;

  const handleEdit = (taskId) => {
    
    const taskToEdit = [...assignedTasks, ...createdTasks, ...overdueTasks].find(t => t._id === taskId);
    setCurrentTask(taskToEdit);
setmodal(true)
    
  };

  const handleDelete = async (taskId) => {
    setLoading(taskId);
    
    try {
      await axios.delete(`https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks/${taskId}`,
        {headers:{Authorization:`${token}`}}
      );
      
      setchange(prev=>prev+1)
    } catch (error) {
      console.error('Failed to delete task:', error);
    }finally{setLoading(false)}
  };

  const callUser=(task)=>{
    if(task?.assignedTo?.email===currentemail){

        router.push(`/video?toUserId=${task?.createdBy?._id}&initiator=true`)
    }else{
        router.push(`/video?toUserId=${task?.assignedTo?._id}&initiator=true`)
    }


  }

  const renderTaskCard = (task, isOverdue = false) =>{
    const isUserOnline = task.assignedTo?.email === currentemail
  ? onlineUsers.includes(task.createdBy?._id)
  : onlineUsers.includes(task.assignedTo?._id);
    
    return (

    
    <div
      key={task._id}
      className={`p-4 border rounded-xl space-y-2 w-[300px] ${
        isOverdue ? 'border-red-500 bg-gradient-to-br from-black to-red-900' : 'border-gray-300 bg-gradient-to-br from-black to-gray-600'
      } shadow-sm`}
    >
      <h3 className="text-[140%] font-semibold text-gray-300">{task.title}</h3>
      <p className="text-gray-400 break-words"> {task.description}</p>
      <div className="flex items-center justify-between">
  <p className="text-gray-400">
    <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
  </p>
  <span className={`text-xs ${dueInfo(task.dueDate).days < 1 ? 'text-red-500' : 'text-gray-500'}`}>
    {dueInfo(task.dueDate).text}
  </span>
</div>
      <p className="text-gray-400"> <strong>{task.priority} </strong> Priority</p>
      <p className="text-gray-400">{task.status} </p>
      <p className="text-gray-400"><strong>Created By:</strong> {task.createdBy?.name || 'N/A'}</p>
      <p className="text-gray-400"><strong>Assigned To:</strong> {task.assignedTo?.name || 'Self'}</p>

      <div className="flex space-x-3 pt-2">
        <button
          onClick={() => handleEdit(task._id)}
          className="px-3 py-1 cursor-pointer rounded bg-gray-600 text-white hover:bg-gray-500 text-sm transition"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(task._id)}
          className="px-3 py-1 cursor-pointer rounded bg-red-800 text-white hover:bg-red-500 text-sm transition"
        >
            {loading===task._id ? (
            <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            'Delete'
          )}
        </button>
{task.assignedTo&&        <button onClick={()=>{callUser(task)}} disabled={!isUserOnline}
 style={{backgroundColor:task.assignedTo?.email === currentemail
  ? (onlineUsers.includes(task.createdBy?._id) ? "Green" : "Gray")
  : (onlineUsers.includes(task.assignedTo?._id) ? "Green" : "Gray")
}}   className="px-3 py-1 cursor-pointer rounded  text-white hover:bg-gray-600 text-sm transition">{task.assignedTo?.email === currentemail
  ? (onlineUsers.includes(task.createdBy?._id) ? "Connect" : "Offline")
  : (onlineUsers.includes(task.assignedTo?._id) ? "Connect" : "Offline")}</button>}
      </div>
    </div>
  );
  }
  const renderTaskSection = (title, tasks, isOverdue = false) => (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-gray-300">{title}</h2>
      <div className="flex flex-wrap gap-5">
        {tasks.map(task => renderTaskCard(task, isOverdue))}
        {tasks.length === 0 && <p className="text-gray-400">No tasks in this category.</p>}
      </div>
    </section>
  );
  const call=()=>{setchange(prev=>prev+1)}
  if(!page){
    return <Loading/>
      }
  return (
    <div className="p-6 space-y-8">
      {noTasks ? (
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <button onClick={onClick} className="w-16 h-16 rounded-full bg-green-500 text-white text-3xl flex items-center justify-center shadow-lg hover:bg-green-600 transition">
            +
          </button>
          <span className="mt-2 text-gray-500 font-medium">Create Your First Task</span>
        </div>
      ) : (
        <>
          {renderTaskSection(" Created Tasks", createdTasks)}
          {renderTaskSection(" Assigned Tasks", assignedTasks)}
          
          {renderTaskSection(" Overdue Tasks", overdueTasks, true)}
          {modal && currentTask && (
  <FixedView isOpen={modal} onClose={() => setmodal(false)}>
    <UpdateTask
    
      task={currentTask}
      onClose={() => setmodal(false)}
      onUpdate={call}
    />
  </FixedView>
)}

        </>
      )}
    </div>
  );
};
export default TaskDashboard;