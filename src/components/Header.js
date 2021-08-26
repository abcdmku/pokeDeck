import React from 'react';
import { supabase } from "../lib/api";

const handleLogout = async () => {supabase.auth.signOut().catch(console.error)};

function Header(props){
  return (
    <header className={"flex justify-between items-center px-4 h-16"} style={{background: '#2d68af'}}>
      <span className={"text-2xl sm:text-4xl text-white fw-bold pb-1 font-sans"}>
        Poké Game
      </span>
      <button onClick={handleLogout} className={"flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:border-yellow-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"}>
        Logout
      </button>
    </header>    
  )
}

export default Header;
