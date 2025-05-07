

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import FixedView from './Fixedviewchild';
import UpdateTask from './UpdateTask'
import { Loading } from '../page';
const TaskDashboard = ({onClick}) => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
 const[loading,setLoading]=useState("");
 const [modal,setmodal]=useState(false);
 const [currentTask, setCurrentTask] = useState(null);
const [page,setpage]=useState(false);
const [change,setchange]=useState(1)
const token=useSelector(state=>state.user.user.user);
const currentemail=useSelector(state=>state.user.user.email);


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/auth/tasks',{
            headers:{Authorization:`${token}`}
        });
        console.log(response)
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
  }, []);

  const noTasks =
    assignedTasks.length === 0 &&
    createdTasks.length === 0 &&
    overdueTasks.length === 0;

  const handleEdit = (taskId) => {
    console.log('Edit task:', taskId);
    const taskToEdit = [...assignedTasks, ...createdTasks, ...overdueTasks].find(t => t._id === taskId);
    setCurrentTask(taskToEdit);
setmodal(true)
    
  };

  const handleDelete = async (taskId) => {
    setLoading(taskId);
    
    try {
      await axios.delete(`http://localhost:4000/api/auth/tasks/${taskId}`,
        {headers:{Authorization:`${token}`}}
      );
      
      setchange(prev=>prev+1)
    } catch (error) {
      console.error('Failed to delete task:', error);
    }finally{setLoading(false)}
  };

  const renderTaskCard = (task, isOverdue = false) => (
    <div
      key={task._id}
      className={`p-4 border rounded-xl space-y-2 w-[300px] ${
        isOverdue ? 'border-red-500 bg-gradient-to-br from-gray-700 to-gray-600' : 'border-gray-300 bg-gradient-to-br from-gray-900 to-gray-700'
      } shadow-sm`}
    >
      <h3 className="text-lg font-semibold text-gray-300">{task.title}</h3>
      <p className="text-gray-400 break-words"><strong>Description:</strong> {task.description}</p>
      <p className="text-gray-400"><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
      <p className="text-gray-400"><strong>Priority:</strong> {task.priority}</p>
      <p className="text-gray-400"><strong>Status:</strong> {task.status}</p>
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
      </div>
    </div>
  );

  const renderTaskSection = (title, tasks, isOverdue = false) => (
    <section>
      <h2 className="text-2xl font-bold mb-4 text-gray-300">{title}</h2>
      <div className="flex flex-wrap gap-5">
        {tasks.map(task => renderTaskCard(task, isOverdue))}
        {tasks.length === 0 && <p className="text-gray-400">No tasks in this category.</p>}
      </div>
    </section>
  );
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
          {renderTaskSection(" Assigned Tasks", assignedTasks)}
          {renderTaskSection(" Created Tasks", createdTasks)}
          {renderTaskSection(" Overdue Tasks", overdueTasks, true)}
          {modal && currentTask && (
  <FixedView isOpen={modal} onClose={() => setmodal(false)}>
    <UpdateTask
      task={currentTask}
      onClose={() => setmodal(false)}
      onUpdate={() => window.location.reload()}
    />
  </FixedView>
)}

        </>
      )}
    </div>
  );
};
export default TaskDashboard;