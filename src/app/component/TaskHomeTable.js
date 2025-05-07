import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import FixedView from './Fixedviewchild';
import UpdateTask from './UpdateTask';
import { Loading } from '../page';
const TaskDashboard = ({onClick,j}) => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState("");
  const [modal, setmodal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [page,setpage]=useState(false);
const [change,setchange]=useState(0);
  const token = useSelector(state => state.user?.user?.user);
  const currentemail = useSelector(state => state.user?.user?.email);
 

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/auth/tasks', {
          headers: { Authorization: `${token}` }
        });
        const tasks = response.data;
        setpage(true)
        const now = new Date();

        const assigned = [];
        const created = [];
        const overdue = [];

        tasks.forEach(task => {
          if (!task?.assignedTo) {
            created.push(task);
          } else {
            if (task?.assignedTo.email === currentemail) {
              assigned.push(task);
            } else {
              created.push(task);
            }
          }
          if (new Date(task.dueDate) < now) {
            overdue.push(task);
          }
        });

        setAssignedTasks(assigned);
        setCreatedTasks(created);
        setOverdueTasks(overdue);

      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [change,j]);

  const noTasks =
    assignedTasks.length === 0 &&
    createdTasks.length === 0 &&
    overdueTasks.length === 0;

  const handleEdit = (taskId) => {
    const taskToEdit = [...assignedTasks, ...createdTasks, ...overdueTasks].find(t => t._id === taskId);
    setCurrentTask(taskToEdit);

    setmodal(true);
  };

  const handleDelete = async (taskId) => {
    setLoading(taskId);
    try {
      await axios.delete(`http://localhost:4000/api/auth/tasks/${taskId}`, {
        headers: { Authorization: `${token}` }
      });
      setchange(prev=>prev+1);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTaskSection = (title, tasks, isOverdue = false) => (
    <section className="space-y-4 mb-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-300">{title}</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-400">No tasks in this category.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className={`w-full text-left text-sm border ${isOverdue ? 'border-red-500' : 'border-gray-600'} rounded-xl`}>
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created By</th>
                <th className="p-3">Assigned To</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id} className="border-t border-gray-700 text-gray-300">
                  <td className="p-3">{task.title}</td>
                  <td className="p-3">{task.description}</td>
                  <td className="p-3">{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td className="p-3">{task.priority}</td>
                  <td className="p-3">{task.status}</td>
                  <td className="p-3">{task.createdBy?.name || 'N/A'}</td>
                  <td className="p-3">{task.assignedTo?.name || 'Self'}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(task._id)}
                      className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-500 text-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="px-3 py-1 rounded bg-red-800 text-white hover:bg-red-500 text-sm transition"
                    >
                      {loading === task._id ? (
                        <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
  const call=()=>{
    setchange(prev=>prev+1)
  }
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
          {renderTaskSection("Assigned Tasks", assignedTasks)}
          {renderTaskSection("Created Tasks", createdTasks)}
          {renderTaskSection("Overdue Tasks", overdueTasks, true)}
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
