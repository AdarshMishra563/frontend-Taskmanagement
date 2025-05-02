'use client'
import Router from "next/navigation"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../store/userSlice";

export default function Home() {
const dispatch=useDispatch();

const log=()=>{
  dispatch(logout);
  Router.push("./login")
}
const auth=useSelector(state=>state.user.isAuthenticated)
  useEffect(()=>{

    if(!auth){

      Router.push('/login')
    }
  },[auth,log]);

    return (
      <main>
        <h1>Hello from the App Router Homepage!</h1>
        <p onClick={log}>This is rjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjendered from /app/page.js</p>
      </main>
    )
  }
  