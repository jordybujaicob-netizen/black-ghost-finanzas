import { useState } from "react";
import { supabase } from "../services/supabase";


function CuentaForm({actualizar}){


const [nombre,setNombre] = useState("");

const [tipo,setTipo] = useState("Billetera");

const [saldo,setSaldo] = useState("");

const [mensaje,setMensaje] = useState("");






async function crearCuenta(e){


e.preventDefault();





if(!nombre.trim()){


setMensaje("Ingresa un nombre para la cuenta");

return;


}





if(saldo===""){


setMensaje("Ingresa un saldo inicial");

return;


}






const {data:{user}} = await supabase.auth.getUser();





if(!user){

setMensaje("No hay sesión activa");

return;

}








const {error}= await supabase
.from("cuentas")
.insert({

usuario_id:user.id,

nombre:nombre,

tipo:tipo,

saldo_inicial:Number(saldo),

saldo_actual:Number(saldo),

color:"#00FF00"

});







if(error){


console.log(error);

setMensaje("Error al crear cuenta");

return;


}







setNombre("");

setSaldo("");

setTipo("Billetera");



setMensaje("Cuenta creada correctamente");





actualizar();






setTimeout(()=>{


setMensaje("");

},3000);





}
return (

<form

onSubmit={crearCuenta}

className="
border
border-red-900
bg-zinc-900
p-5
rounded-xl
mt-8
max-w-md
"

>



<h2 className="
text-2xl
text-red-600
font-bold
mb-4
">

Nueva cuenta

</h2>







<input

className="
w-full
mb-3
p-3
bg-black
border
border-red-900
text-white
rounded
"

placeholder="Nombre de cuenta"

value={nombre}

onChange={(e)=>setNombre(e.target.value)}

/>








<select

className="
w-full
mb-3
p-3
bg-black
border
border-red-900
text-white
rounded
"

value={tipo}

onChange={(e)=>setTipo(e.target.value)}

>



<option value="Billetera">

Billetera

</option>




<option value="Banco">

Banco

</option>





<option value="Efectivo">

Efectivo

</option>




</select>









<input

className="
w-full
mb-3
p-3
bg-black
border
border-red-900
text-white
rounded
"

placeholder="Saldo inicial"

type="number"

value={saldo}

onChange={(e)=>setSaldo(e.target.value)}

/>









<button

className="
w-full
bg-red-700
py-3
rounded
font-bold
text-white
"

>

Crear cuenta

</button>







{

mensaje && (

<p className="
mt-4
text-green-500
">

{mensaje}

</p>


)

}







</form>

)


}


export default CuentaForm;