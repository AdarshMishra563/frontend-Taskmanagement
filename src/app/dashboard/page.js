'use client'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation'
import { FaBars, FaTimes,FaSearch } from 'react-icons/fa';
import { useStyleRegistry } from 'styled-jsx';
import { useSelector } from 'react-redux';
import NotificationBell from '../component/notification';
import CreateTaskForm from '../component/CreateTask';
import Modal from '../component/Fixedviewchild';
import AssignTask from '../component/AssignTask'
export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const dropdownRef = useRef(null);
  const token=useSelector(state=>state.user.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search,setsearch]=useState("");
  const [debounce,setdebounce]=useState("");
const sidebarRef=useRef(null);
const [filterData, setFilterData] = useState({
  status: [],
  priority: [],
  dueDate: ''
});

useEffect(()=>{
const timeout=setTimeout(()=>{setsearch(debounce) },500)

return ()=>{clearTimeout(timeout)}
},[debounce])


const handleCheckboxChange = (type, value) => {
  setFilterData(prev => {
    const updatedValues = prev[type].includes(value)
      ? prev[type].filter(item => item !== value)
      : [...prev[type], value];
    return { ...prev, [type]: updatedValues };
  });
};
const handleDateChange = (e) => {
  setFilterData(prev => ({ ...prev, dueDate: e.target.value }));
};
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


const applyFilter =async  () => {
  
  setShowDropdown(false);




  
  const queryParams = new URLSearchParams();


  if (filterData.status.length > 0) queryParams.append('status', JSON.stringify(filterData.status));
  if (filterData.priority.length > 0) queryParams.append('priority', JSON.stringify(filterData.priority));

  if (filterData.dueDate) queryParams.append('dueDate', filterData.dueDate);
  if (search) queryParams.append('search', search);

  



  try{
const res=await axios.get(`http://localhost:4000/api/auth/tasks?${queryParams.toString()}`,
{
  headers:{Authorization:`${token}`}
}
);
console.log(res)
  }catch(err){console.log(err)}
};



useEffect(()=>{
  

  const queryParams = new URLSearchParams();


  if (filterData.status.length > 0) queryParams.append('status', JSON.stringify(filterData.status));
  if (filterData.priority.length > 0) queryParams.append('priority', JSON.stringify(filterData.priority));

  if (filterData.dueDate) queryParams.append('dueDate', filterData.dueDate);
  if (search) queryParams.append('search', search);

  console.log(queryParams.toString());

const filter=async ()=>{

  try{
const res=await axios.get(`http://localhost:4000/api/auth/tasks?${queryParams.toString()}`,
{
  headers:{Authorization:`${token}`}
}
);
console.log(res,"ressssssssss")
  }catch(err){console.log(err)}
};
filter();


  },[search])  ;




useEffect(()=>{ 
  const clickedOutside=(event)=>{
    if(sidebarRef.current && !sidebarRef.current.contains(event.target)){
      setIsOpen(false)
    }
  };
  if(isOpen){
    document.addEventListener('mousedown',clickedOutside)
  }else{
    document.removeEventListener('mousedown',clickedOutside)
  };
  return ()=>{document.removeEventListener('mousedown',clickedOutside)}
},[isOpen])
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-700">
   <div ref={sidebarRef}
  className={`fixed top-0 left-0 h-full  w-64 bg-gray-900 text-white  z-40 sidebar transform transition-transform duration-300 ease-in-out shadow-2xl ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
>
<div className="text-white  text-2xl p-4 place-self-end cursor-pointer ">
  <FaTimes onClick={()=>{setIsOpen(false)}}  color='red' />
</div>
<div className='h-full'>
<div className='text-xl text-gray-300 border-b-2 border-red-300 w-54 p-2'>Profile</div>
<div className='text-xl text-gray-300 border-b-2 border-red-300 w-54 p-2'>Users</div>
<div className='text-xl text-gray-300 border-b-2 border-red-300 w-54 p-2'>Chat</div>
<div className='text-xl text-gray-300 border-b-2 border-red-300 w-54 p-2'>Log Out</div>

</div>
  
</div>
<div className='h-14 flex  bg-gradient-to-br from-black to-gray-800 ' >
  <div onClick={()=>{setIsOpen(true)}} className="text-white text-2xl p-1 pt-4 cursor-pointer ">
  <FaBars />
</div>

<div  className='h-12 p-2 mt-1 ml-[8%] flex items-center  mb-1 relative gap-2'>
      
      <button 
        className="text-white bg-green-700 px-3 py-1 rounded"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Filter
      </button>

      
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute left-0 mt-84 w-64 bg-gray-900 text-white rounded shadow-lg border border-gray-700 z-50 p-3"
        >
          
          <div className="font-semibold mb-1">Status</div>
          {['To Do', 'In Progress', 'Done'].map(status => (
            <label key={status} className="flex items-center gap-2 mb-1">
              <input 
                type="checkbox"
                checked={filterData.status.includes(status)}
                onChange={() => handleCheckboxChange('status', status)}
              />
              {status}
            </label>
          ))}

          
          <div className="font-semibold mt-3 mb-1">Priority</div>
          {['Low', 'Medium', 'High'].map(priority => (
            <label key={priority} className="flex items-center gap-2 mb-1">
              <input 
                type="checkbox"
                checked={filterData.priority.includes(priority)}
                onChange={() => handleCheckboxChange('priority', priority)}
              />
              {priority}
            </label>
          ))}

          
          <div className="font-semibold mt-3 mb-1">Due Date</div>
          <input 
            type="date"
            value={filterData.dueDate}
            onChange={handleDateChange}
            className="w-full p-1 rounded bg-gray-600 text-white border border-gray-600"
          />

        
          <button 
            onClick={applyFilter}
            className="w-full mt-4 bg-green-600 hover:bg-green-500 p-2 rounded text-white"
          >
            Apply Filter
          </button>
        </div>
      )}

      
      <div className="relative  ">
        <input 
        onChange={(e)=>{setdebounce(e.target.value)}}
          type='text'
          style={{width:"16vw"}} 
          placeholder='Search your tasks'
          className=' placeholder-gray-300 px-8 py-2 rounded  bg-gray-800 border border-gray-600 text-white focus:outline-none'
        />
        <FaSearch className='absolute left-2 top-3 text-gray-400' />
      </div>
    </div>
    <div className="text-red-300 w-full justify-end flex gap-6 items-center p-4">
        <div className="cursor-pointer">
          <NotificationBell count={4}/>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="w-28 bg-green-800 text-white py-2 rounded cursor-pointer hover:bg-green-700 transition"
        >
          Create Task
        </button>

        <button
          onClick={() => setShowAssignModal(true)}
          className="w-28 bg-gray-200 text-black py-2 rounded cursor-pointer hover:bg-gray-300 transition"
        >
          Assign Task
        </button>
      </div>

      
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <CreateTaskForm />
      </Modal>

      
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)}>
        
        <AssignTask/>
      </Modal>


 </div>
   
  </div>
  )
}
