import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loading from "./Loading";


function ProtectedRoute({children}){


const {usuario,cargando} = useContext(AuthContext);




if(cargando){

return <Loading/>;

}




if(!usuario){

return <Navigate to="/" replace />;

}




return children;


}


export default ProtectedRoute;