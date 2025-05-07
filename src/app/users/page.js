"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Loading } from "../page";
import Modal from "../component/Fixedviewchild";
import AssignTask from '../component/AssignTask'
export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const[person,setperson]=useState({});
  const [searching, setSearching] = useState(false); 
const [showAssignModal,setShowAssignModal]=useState(false);
  const token = useSelector((state) => state.user.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated,router]);

  const fetchUsers = async (query = "") => {
    try {
      const res = await axios.get(`https://backend-taskmanagement-k0md.onrender.com/api/auth/allusers${query ? `?user=${query}` : ""}`, {
        headers: { Authorization: `${token}` },
      });
      setUsers(res.data.users);
      if (query) setSearching(false);
      else setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  });

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchText.trim() !== "") {
        setSearching(true);
        fetchUsers(searchText.trim());
      } else {
        fetchUsers();
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchText,fetchUsers]);

  const handleAssignTask = (userId) => {
    setShowAssignModal(true);
    console.log("Assign task to user:", userId);
    setperson(userId);

  };
  const call=()=>{

    console.log("assigned")
  }

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-800 to-gray-700 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>

      
      <div className="mb-6">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by email or name..."
          className="w-full md:w-96 p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none"
        />
      </div>

      {searching && <p className="text-gray-400 mb-4">Searching...</p>}

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="p-4 bg-gray-900 rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={() => handleAssignTask(user)}
                className="bg-green-600 hover:bg-green-500 transition text-white px-4 py-2 rounded"
              >
                Assign Task
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No users found.</p>
        )}
      </div>
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)}>
        
        <AssignTask isOkay={call} client={person} />
      </Modal>

    </div>
  );
}
