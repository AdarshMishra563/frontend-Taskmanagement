'use client'

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../store/userSlice";
import axios from 'axios'
import { Loading } from "../page";
export default function Home() {

  const [initial,setinitial]=useState(true)
const dispatch=useDispatch();
const token=useSelector(state=>state.user.user);
console.log(token)
const log=async ()=>{
 const data= await axios.get("http://localhost:4000/api/auth/getuser",{
  headers: {
    'Authorization': `Bearer ${token}`
  }
 }) ;
 console.log(data);
 setTimeout(()=>{setinitial(false);},800)

  
}
useEffect(()=>{
  log()
})
const auth=useSelector(state=>state.user.isAuthenticated)

if(initial){
  return <Loading/>
}
    return (
      <main>
        <h1 onClick={log}>Hello from the App Router Homepage!</h1>
        <p onClick={log}>This is rjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjendered from /app/page.js</p>
      </main>
    )
  }
  