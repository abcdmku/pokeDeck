import { useState, useEffect } from "react";
import { supabase } from "./lib/api";
import { Routes, Route } from "react-router";
import Auth from "./components/Auth";
import Header from "./components/Header";
import Home from "./components/Home";
import Deck from "./components/Deck/Deck";
import TodoList from "./components/TodoList";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [user]);


  return (
    <div className="">
      {!user ? <Auth /> : 
      <div className={""}>
       <Header/>
      <Routes>
        <Route path="/" element={<Home user={user}/>}/>
        <Route path="/todo" element={<TodoList/>}/>
        <Route path="/deck" element={<Deck user={user}/>}/>
      </Routes>
      </div>
      }
    </div>
  );
}

export default App;
