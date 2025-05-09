'use client'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation'
import { FaBars, FaTimes,FaSearch } from 'react-icons/fa';
import { useStyleRegistry } from 'styled-jsx';
import { useDispatch, useSelector } from 'react-redux';
import NotificationBell from '../component/notification';
import CreateTaskForm from '../component/CreateTask';
import Modal from '../component/Fixedviewchild';
import AssignTask from '../component/AssignTask'
import getdaysleft from '../component/daysleft'
import TaskDashboard from '../component/TaskHome';
import TaskHomeTable from '../component/TaskHomeTable'
import { logout } from '../store/userSlice';
import { useSocket } from '../socketcontext/SocketContext';


export default function Dashboard() {
  const router=useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [table,setTable]=useState(false);
  const dropdownRef = useRef(null);
  const isAuthenticated=useSelector(state=>state.user.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      
    }
  }, [isAuthenticated,router])

  const token=useSelector(state=>state.user?.user?.user);
 
const {socket}=useSocket();
const { incomingCall, setIncomingCall,onlineUsers } = useSocket();
console.log(onlineUsers)
const handleAcceptCall = () => {
  
  router.push(`/video?toUserId=${incomingCall.from}`);
 
  setIncomingCall(null);
};

console.log(socket)

useEffect(() => {
  if (!socket) return;

  socket.on("incomingCall", ({ from, signal }) => {
    
   
  });

  return () => {
    socket.off("incomingCall");
  };
}, [socket]);







  const dispatch=useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search,setsearch]=useState("");
  const [debounce,setdebounce]=useState("");
  const [searchData,setSearchData]=useState([])
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
      setSearchData([])
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
const res=await axios.get(`https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks?${queryParams.toString()}`,
{
  headers:{Authorization:`${token}`}
}
);
setSearchData(res.data);
console.log(res)
  }catch(err){console.log(err)}
};



useEffect(()=>{
  if (search.trim().length === 0) {
    setSearchData([]) 
    return;
  }

  const queryParams = new URLSearchParams();


  if (filterData.status.length > 0) queryParams.append('status', JSON.stringify(filterData.status));
  if (filterData.priority.length > 0) queryParams.append('priority', JSON.stringify(filterData.priority));

  if (filterData.dueDate) queryParams.append('dueDate', filterData.dueDate);
  if (search) queryParams.append('search', search);

  

const filter=async ()=>{

  try{
const res=await axios.get(`https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks?${queryParams.toString()}`,
{
  headers:{Authorization:`${token}`}
}
);

setSearchData(res.data)
  }catch(err){console.log(err)}
};
filter();


  },[search,filterData.status,filterData.priority,token,filterData.dueDate])  ;
const [j,setj]=useState(0)
const callArray=()=>{

setj(prev=>prev+1);
setTimeout(()=>{ setShowCreateModal(false);setShowAssignModal(false)},600)


}


useEffect(()=>{ 
  const clickedOutside=(event)=>{
    if(sidebarRef.current && !sidebarRef.current.contains(event.target)){
      setIsOpen(false);
      setSearchData([])
    }
  };
  if(isOpen){
    document.addEventListener('mousedown',clickedOutside)
  }else{
    document.removeEventListener('mousedown',clickedOutside)
  };
  return ()=>{document.removeEventListener('mousedown',clickedOutside)}
},[isOpen,searchData])
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-900">
         {incomingCall && (
        <div className="fixed bottom-5 right-5 p-4 bg-white rounded shadow">
          <p>Incoming call from {incomingCall.from}</p>
          <button
            onClick={handleAcceptCall}
            className="bg-green-500 text-white p-2 rounded m-2"
          >
            Accept
          </button>
          <button
            onClick={() => setIncomingCall(null)}
            className="bg-red-500 text-white p-2 rounded"
          >
            Decline
          </button>
        </div>
      )}
   <div ref={sidebarRef}
  className={`fixed top-0 left-0 h-full  w-64 bg-gray-900 text-white  z-40 sidebar transform transition-transform duration-300 ease-in-out shadow-2xl ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
>
<div className="text-white  text-2xl p-4 place-self-end cursor-pointer ">
  <FaTimes onClick={()=>{setIsOpen(false)}}  color='red' />
</div>
<div className='h-full'>
<div onClick={()=>{router.push("/profile")}} className='text-xl text-gray-300 border-b-2 border-red-300 w-54 p-2 cursor-pointer'>Profile</div>
<div onClick={()=>{router.push("/users")}} className='text-xl text-gray-300 border-b-2 border-red-300 w-54 p-2 cursor-pointer'>Users</div>

<div onClick={()=>{dispatch(logout());router.push("/login")}} className='text-xl text-gray-300 border-b-2 hover:text-gray-400 border-red-300 w-54 p-2 cursor-pointer'>Log Out</div>

</div>
  
</div>
<div className='h-14 flex justify-between items-center  bg-gradient-to-br from-black to-gray-800 ' >
  <div onClick={()=>{setIsOpen(true)}} className="text-white text-2xl p-1 pb-2 cursor-pointer ">
  <FaBars />
</div>

<div  className='h-12 p-2 mt-1 ml-[8%] flex items-center  mb-1 relative gap-2'>
      
      <button 
        className="text-white bg-green-700 px-3 py-1  rounded"
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
          style={{width:"30vw"}} 
          placeholder='Search your tasks'
          className=' placeholder-gray-300 px-8 py-2 rounded  bg-gray-800 border border-gray-600 text-white focus:outline-none'
        />
        <FaSearch className='absolute left-2 top-3 text-gray-400' />
        {searchData.length > 0 && (
    <div  ref={dropdownRef} className="absolute top-full left-0 mt-1 w-full bg-gray-900 border border-gray-700 rounded shadow-lg z-50 max-h-90 overflow-y-auto">
      {searchData.map(task => (
        <div 
          key={task._id}
          className="p-2 b-1  border-b border-gray-500 hover:bg-gray-800 cursor-pointer flex justify-between items-center"
          
        >
          <div className='flex flex-col w-0 flex-1'>
          <span className='text-gray-200 pl-1 pt-1 text-xl'>{task.title}</span>
<span className='text-gray-400 pl-1 break-words whitespace-normal '>{task.description}</span></div>
          <div className='flex flex-col'><span className="text-xs text-gray-400 place-self-end">{task.status}</span>
          <span className='flex text-gray-500 justify-end '>{task.priority} Priority </span>
          <span className='text-gray-400 w-[100%] flex justify-between' ><div style={{backgroundColor:getdaysleft(task.dueDate).days>1?"green":"red"}} className='w-2 h-2 rounded-full mr-1 mt-2'> </div>{getdaysleft(task.dueDate).days<1?"":getdaysleft(task.dueDate).days}{getdaysleft(task.dueDate).days<1?"":" Days"} {getdaysleft(task.dueDate).hours===0?"overdue":<span className='justify-end place-items-end'>{getdaysleft(task.dueDate).hours} hours left</span>}</span></div>
        </div>
      ))}
    </div>
  )}
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
        <CreateTaskForm onOkay={callArray} />
      </Modal>

      
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)}>
        
        <AssignTask  isOkay={callArray}/>
      </Modal>


 </div>
 
 <div className="p-2 space-y-8">
      
      <div className="flex items-center space-x-4 p-2 mb-4">
        <span className="text-gray-300 font-medium">Card View</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={table}
            onChange={() => setTable(!table)}
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </label>
        <span className="text-gray-300 font-medium">Table View</span>
      </div>

      
      <div>{table ? <TaskHomeTable j={j} onClick={() => setShowCreateModal(true)} /> : <TaskDashboard j={j} onClick={() => setShowCreateModal(true)}/>}</div>
    </div>
   
  </div>
  )
}
