import { createContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";


export const AuthContext = createContext();



export function AuthProvider({children}){


const [usuario,setUsuario] = useState(null);

const [cargando,setCargando] = useState(true);







useEffect(()=>{



async function obtenerSesion(){


const {data}= await supabase.auth.getSession();



setUsuario(
data.session?.user || null
);



setCargando(false);



}






obtenerSesion();







const {
data:listener
}= supabase.auth.onAuthStateChange(

(_event,session)=>{


setUsuario(
session?.user || null
);


setCargando(false);


}

);







return ()=>{


listener.subscription.unsubscribe();


};



},[]);









if(cargando){


return null;


}








return (

<AuthContext.Provider

value={{

usuario,

cargando

}}

>


{children}


</AuthContext.Provider>


);



}