import { useState } from "react";
import { supabase } from "../services/supabase";

import logo from "../assets/logo-blackghost.png";



function Register(){


const [nombre,setNombre] = useState("");

const [correo,setCorreo] = useState("");

const [password,setPassword] = useState("");

const [mensaje,setMensaje] = useState("");

const [error,setError] = useState("");

const [cargando,setCargando] = useState(false);








async function registrarUsuario(e){


e.preventDefault();


setError("");

setMensaje("");






if(!nombre || !correo || !password){


setError("Completa todos los campos");


return;


}







if(password.length < 6){


setError(
"La contraseña debe tener mínimo 6 caracteres"
);


return;


}







setCargando(true);









const {data,error}=await supabase.auth.signUp({


email:correo,


password:password,


options:{


data:{


nombre:nombre


}


}


});









if(error){


setError(error.message);


setCargando(false);


return;


}









if(!data.user){


setError(
"Revisa tu correo para confirmar la cuenta"
);


setCargando(false);


return;


}









const {error:perfilError}=await supabase

.from("perfiles")

.insert({


id:data.user.id,


nombre:nombre,


moneda_principal:"PEN"


});









if(perfilError){


console.log(perfilError);


setError(
"Usuario creado pero error creando perfil"
);


setCargando(false);


return;


}









setMensaje(
"Cuenta creada correctamente"
);









setTimeout(()=>{


window.location.href="/";


},2000);





}












return (


<div

className="

min-h-screen

flex

items-center

justify-center

relative

overflow-hidden

text-white

"

>







{/* Fondo */}


<div

className="

absolute

inset-0

bg-cover

bg-center

"

style={{

backgroundImage:
"url('/background-blackghost.png')"

}}

/>









{/* Oscurecimiento */}


<div

className="

absolute

inset-0

bg-black/75

"

/>









<div

className="

relative

z-10

w-full

max-w-md

px-6

"

>









<form


onSubmit={registrarUsuario}


className="


bg-black/50


backdrop-blur-xl


border


border-red-900/40


shadow-[0_0_50px_rgba(255,0,0,0.15)]


rounded-3xl


p-8


"


>








<div

className="

flex

justify-center

mb-6

"

>


<img


src={logo}


alt="Black Ghost"


className="

w-64

object-contain

drop-shadow-[0_0_25px_rgba(255,0,0,0.35)]

"

/>



</div>









<p

className="

text-center

text-gray-500

text-xs

tracking-[0.5em]

mb-8

"

>

FINANCE SYSTEM

</p>









<h1

className="

text-center

text-2xl

font-black

mb-6

"

>

CREAR CUENTA

</h1>









<input


className="


w-full


mb-4


p-4


bg-black/60


border


border-white/10


focus:border-red-600


outline-none


text-white


rounded-xl


transition


"


placeholder="Nombre completo"


value={nombre}


onChange={(e)=>setNombre(e.target.value)}


/>









<input


type="email"


className="


w-full


mb-4


p-4


bg-black/60


border


border-white/10


focus:border-red-600


outline-none


text-white


rounded-xl


transition


"


placeholder="Correo electrónico"


value={correo}


onChange={(e)=>setCorreo(e.target.value)}


/>









<input


type="password"


className="


w-full


mb-5


p-4


bg-black/60


border


border-white/10


focus:border-red-600


outline-none


text-white


rounded-xl


transition


"


placeholder="Contraseña"


value={password}


onChange={(e)=>setPassword(e.target.value)}


/>









{

error &&

<p

className="

text-red-500

text-center

mb-4

"

>

{error}

</p>

}









{

mensaje &&

<p

className="

text-green-500

text-center

mb-4

"

>

{mensaje}

</p>

}









<button


disabled={cargando}


className="


w-full


py-4


rounded-xl


font-black


tracking-wider


bg-red-700


hover:bg-red-600


shadow-[0_0_25px_rgba(255,0,0,0.35)]


transition


disabled:opacity-50


"


>


{

cargando

?

"CREANDO..."

:

"CREAR CUENTA"

}



</button>









<a


href="/"


className="


block


text-center


mt-6


text-gray-400


hover:text-red-500


transition


"


>

Volver al login

</a>









</form>









</div>








</div>


)


}



export default Register;