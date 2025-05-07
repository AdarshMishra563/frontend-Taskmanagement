'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';
import { Loading } from '../page';

Chart.register(ArcElement, Tooltip, Legend);

export default function ProfilePage() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
const token=useSelector(state=>state.user.user.user);

  useEffect(() => {
    fetchTasks();
    fetchUser();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get('https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks',
        {headers:{Authorization:`${token}`}}
    );
    setTasks(res.data);
    setLoading(false);
  };

  const fetchUser = async () => {
    const res = await axios.get('https://backend-taskmanagement-k0md.onrender.com/api/auth/getuser',

        
    {headers:{Authorization:`${token}`}}
    );
    setUser(res.data.user);
    console.log(res)
  };

  const getStatusCounts = () => {
    const counts = { 'To Do': 0, 'In Progress': 0, 'Done': 0 };
    tasks.forEach(task => counts[task.status]++);
    return counts;
  };

  const upcomingTasks = tasks
    .filter(task => new Date(task.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;

  const statusCounts = getStatusCounts();

  const data = {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [
      {
        data: [statusCounts['To Do'], statusCounts['In Progress'], statusCounts['Done']],
        backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <Loading/>;

  return (
    <div className="text-white p-6 bg-gradient-to-br from-gray-500 to-gray-600">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-300">Welcome, {user.name} ({user.email})</p>
        </div>
      </div>

      <div className="grid  grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-gray-800 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Total Tasks</h2>
          <p className="text-2xl">{totalTasks}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Completed Tasks</h2>
          <p className="text-2xl">{completedTasks}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded shadow flex flex-col justify-between">
  <h2 className="text-lg font-semibold mb-2">Status Distribution</h2>
  <div className="h-[250px]">
    <Pie data={data} options={{ maintainAspectRatio: false }} />
  </div>
</div>
      </div>

      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Next 3 Upcoming Tasks</h2>
        {upcomingTasks.map(task => (
          <div key={task._id} className="border-b border-gray-600 py-2">
            <h3 className="text-lg">{task.title}</h3>
            <p className="text-gray-400">{task.description}</p>
            <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
