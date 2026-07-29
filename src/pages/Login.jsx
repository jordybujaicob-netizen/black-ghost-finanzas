import { useState } from "react";
import { supabase } from "../services/supabase";

import logo from "../assets/logo-blackghost.png";



function Login(){


const [correo,setCorreo] = useState("");

const [password,setPassword] = useState("");

const [error,setError] = useState("");

const [cargando,setCargando] = useState(false);






async function iniciarSesion(e){


e.preventDefault();


setError("");





if(!correo || !password){


setError("Completa todos los campos");


return;


}






setCargando(true);







const {error}=await supabase.auth.signInWithPassword({


email:correo,


password:password


});







if(error){


setError("Correo o contraseña incorrectos");


setCargando(false);


return;


}





window.location.href="/dashboard";



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


onSubmit={iniciarSesion}


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

INICIAR SESIÓN

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


placeholder="Correo electrónico"


type="email"


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

"Iniciando..."

:

"INGRESAR"

}



</button>









<a


href="/recuperar"


className="

block

text-center

mt-6

text-gray-400

hover:text-red-500

transition

"


>

¿Olvidaste tu contraseña?

</a>









<a


href="/register"


className="

block

text-center

mt-3

text-gray-400

hover:text-red-500

transition

"


>

Crear cuenta

</a>








</form>







</div>







</div>


)


}



export default Login;