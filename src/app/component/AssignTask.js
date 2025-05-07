import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CreateTaskForm = ({isOkay,client}) => {
const dropdownRef=useRef(null);
const [loading,setLoading]=useState(false)
    const [debounce,setdebounce]=useState("");
    const[assignedTo,setassignedTo]=useState("");
    const [popup,setpopup]=useState(false);
    const [existingusers,setexistingusers]=useState([]);
    const [assignedId,setAssignedId]=useState({});
    const [success,setsuccess]=useState(false)
useEffect(()=>{if(client){
  setAssignedId(client)
}},[client])


useEffect(()=>{

    if (assignedTo.trim().length === 0) {
        setexistingusers([]);  
        return;
      }
const users=async ()=>{  
try{
    const res=await axios.get(`http://localhost:4000/api/auth/getalluser?user=${assignedTo}`)
console.log(res.data);
if(res.data.users.length>0){
    setexistingusers(res.data.users)
}else{setexistingusers([{name:" No User with that email or name is registered"}])}


}catch(err){console.log(err);
    setexistingusers([])
}
};
users();

},[assignedTo])
useEffect(()=>{

  
const timeout=setTimeout(()=>{setassignedTo(debounce)},200)

return ()=>{clearTimeout(timeout)}
},[debounce])


useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setexistingusers([]); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setexistingusers]);
  


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    
  });

  const token = useSelector(state => state.user?.user?.user);

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
    e.preventDefault();
    if (!validate()) return;

    try { setLoading(true)
      const payload = {
        ...formData,
        status: 'To Do' ,
        assignedTo:assignedId._id
      };

      

      const res = await axios.post('http://localhost:4000/api/auth/createtasks', payload, {
        headers: {
          Authorization: `${token}`
        }
      });

      isOkay();
     setsuccess(true)

      
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: '',
        
      });
      setAssignedId({})
      setErrors({});
    } catch (error) {
      console.error(error);
      alert('Failed to create task.');
    }finally{setLoading(false)}
  };

  return (
    <div  className="max-w-md mx-auto bg-gray-800 text-white p-2 rounded shadow-lg">
      <div className="max-w-md w-full bg-gray-800 text-white p-6 rounded shadow-lg ">
        <h2 className="text-2xl font-bold mb-4">Create New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4 ">

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

          <div className='relative'>
            <label className="block mb-1" >Description</label>
            {existingusers.length > 0 && (
    <div ref={dropdownRef}  className="absolute bottom-[-140%] mb-1 left-0 w-80 max-h-100 overflow-y-auto border border-gray-400 bg-gray-800 text-white rounded shadow-lg z-50">
      {existingusers.map((data) => (
        <div key={data._id} onClick={()=>{setAssignedId(data);
            setexistingusers([])
        }} className="p-2 border-b border-gray-600 cursor-pointer">{data.name}<div>{data.email}</div></div>
      ))}
    </div>
  )}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 mt-1 rounded bg-gray-700 border  border-gray-600"
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

          <div>
            <label className=''>Assign To</label>
            
            <input
              type="text"
              name="assignedTo"
              disabled={client} 
              value={assignedId.name}
              onChange={(e)=>{setdebounce(e.target.value);setAssignedId({name:e.target.value})}}
              
              className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600"
            />
            {errors.tags && <p className="text-red-400">{errors.tags}</p>}
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
            'Assign Task'
          )}
          </button>
          {success && <div className='text-2xl'>Task assigned succefully!</div>}
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;
