import { createSlice } from "@reduxjs/toolkit";
const initialState={
isAuthenticated:false,
user:null,

};
const userSlice=createSlice({
name:"user",
initialState,
reducers:{
setUser:(state,action)=>{

    state.isAuthenticated=true;
    state.user=action.payload;
    
    
},
logout:(state,action)=>{
    state.isAuthenticated = false;
    state.user ={user:null,email:null};
    
    
},

}

});
export const {setUser,logout}=userSlice.actions;
export default userSlice.reducer;