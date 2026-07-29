import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

import "../styles/dashboard/dashboard.css";
import {
ResponsiveContainer,
BarChart,
Bar,
LineChart,
Line,
PieChart,
Pie,
Cell,
Tooltip,
Legend,
XAxis,
YAxis,
CartesianGrid
} from "recharts";



function Dashboard(){


const [usuarioEmail,setUsuarioEmail] = useState("");

const [ultimosMovimientos,setUltimosMovimientos] = useState([]);


const [saldo,setSaldo] = useState(0);

const [ingresos,setIngresos] = useState(0);

const [gastos,setGastos] = useState(0);



const [ingresosMes,setIngresosMes] = useState(0);

const [gastosMes,setGastosMes] = useState(0);


const [ahorroMes,setAhorroMes] = useState(0);

const [promedioGasto,setPromedioGasto] = useState(0);



const [movimientoMayor,setMovimientoMayor] = useState(null);


const [gastosCategoria,setGastosCategoria] = useState([]);


const [cuentaMayor,setCuentaMayor] = useState(null);

const [categoriaMayor,setCategoriaMayor] = useState(null);



const [graficoMovimientos,setGraficoMovimientos] = useState([]);

const [graficoSaldo,setGraficoSaldo] = useState([]);



const [ultimoIngreso,setUltimoIngreso] = useState(null);

const [ultimoGasto,setUltimoGasto] = useState(null);




useEffect(()=>{

cargarDatos();

},[]);







async function cargarDatos(){



const {data:{user}} = await supabase.auth.getUser();



if(!user) return;



setUsuarioEmail(user.email);







const {data:cuentas,error:errorCuentas}= await supabase
.from("cuentas")
.select("*")
.eq("usuario_id",user.id);




if(errorCuentas){

console.log(errorCuentas);

return;

}







const {data:movimientos,error:errorMov}= await supabase
.from("movimientos")
.select(`
id,
tipo,
monto,
descripcion,
fecha,
cuenta_id,
categorias(
nombre,
color
),
cuentas(
nombre
)
`)
.eq("usuario_id",user.id)
.order("fecha",{ascending:false});





if(errorMov){

console.log(errorMov);

return;

}








let saldoTotal=0;

let totalIngresos=0;

let totalGastos=0;



let ingresosActual=0;

let gastosActual=0;



let resumen={};


let evolucion=[];


let saldoAcumulado=0;


let mayorMovimiento=null;




const fechaActual=new Date();

const mesActual=fechaActual.getMonth();

const añoActual=fechaActual.getFullYear();









for(const cuenta of cuentas || []){


let saldoCuenta =
Number(cuenta.saldo_inicial || 0);





const movimientosCuenta =
movimientos.filter(
mov=>mov.cuenta_id===cuenta.id
);





movimientosCuenta.forEach((mov)=>{


if(
mov.descripcion?.toLowerCase()
.includes("transferencia")
){

return;

}




if(mov.tipo==="INGRESO"){

saldoCuenta += Number(mov.monto);

}




if(mov.tipo==="GASTO"){

saldoCuenta -= Number(mov.monto);

}



});




saldoTotal += saldoCuenta;



}









const ingresosLista =
movimientos.filter(
mov=>mov.tipo==="INGRESO"
);



const gastosLista =
movimientos.filter(
mov=>mov.tipo==="GASTO"
);





setUltimoIngreso(
ingresosLista[0] || null
);



setUltimoGasto(
gastosLista[0] || null
);









movimientos.forEach((mov)=>{



if(
mov.descripcion?.toLowerCase()
.includes("transferencia")
){

return;

}





const monto=Number(mov.monto);


const fecha=new Date(mov.fecha);








if(
!mayorMovimiento ||
monto >
Number(mayorMovimiento.monto)

){

mayorMovimiento=mov;

}








if(mov.tipo==="INGRESO"){


totalIngresos+=monto;



if(
fecha.getMonth()===mesActual &&
fecha.getFullYear()===añoActual
){

ingresosActual+=monto;

}



}








if(mov.tipo==="GASTO"){


totalGastos+=monto;




if(
fecha.getMonth()===mesActual &&
fecha.getFullYear()===añoActual
){

gastosActual+=monto;

}







const categoria =
mov.categorias?.nombre ||
"Sin categoría";




if(!resumen[categoria]){

resumen[categoria]=0;

}



resumen[categoria]+=monto;



}








saldoAcumulado +=
mov.tipo==="INGRESO"
?
monto
:
-monto;





evolucion.push({

fecha:
fecha.toLocaleDateString(),

saldo:
saldoAcumulado

});



});










const listaCategorias =
Object.entries(resumen)
.map(([nombre,total])=>({

nombre,

total

}))
.sort(
(a,b)=>b.total-a.total
);









setSaldo(saldoTotal);


setIngresos(totalIngresos);


setGastos(totalGastos);




setIngresosMes(ingresosActual);


setGastosMes(gastosActual);




setAhorroMes(
ingresosActual-gastosActual
);





setPromedioGasto(
totalGastos /
(
movimientos.length || 1
)
);






setMovimientoMayor(
mayorMovimiento
);




setGastosCategoria(
listaCategorias
);




setCategoriaMayor(
listaCategorias[0] || null
);





setUltimosMovimientos(
movimientos.slice(0,5)
);








setGraficoMovimientos([

{
nombre:"Ingresos",
total:totalIngresos
},

{
nombre:"Gastos",
total:totalGastos
}

]);







setGraficoSaldo(
evolucion.reverse()
);








if(cuentas?.length){



const mayorCuenta =
[...cuentas]
.sort(
(a,b)=>
Number(b.saldo_inicial || 0)
-
Number(a.saldo_inicial || 0)
)[0];



setCuentaMayor(
mayorCuenta
);



}





}







async function cerrarSesion(){


await supabase.auth.signOut();


window.location.href="/";


}








const coloresCategorias=[

"#ef4444",
"#3b82f6",
"#22c55e",
"#f59e0b",
"#a855f7",
"#06b6d4",
"#ec4899",
"#94a3b8"

];







const tarjeta = `

bg-black/40

backdrop-blur-xl

border

border-white/10

rounded-3xl

shadow-[0_20px_50px_rgba(0,0,0,0.45)]

`;
return (

<div

className="

relative

p-8

min-h-screen

text-white

"

>






<div className="

absolute

inset-0

bg-gradient-to-b

from-black/20

via-black/50

to-black/90

pointer-events-none

"

/>









<div className="relative z-10">







{/* HEADER */}


<div className="

flex

justify-between

items-center

mb-10

">


<div>


<h1 className="

text-5xl

font-black

tracking-[0.15em]

text-white

"

>

BLACK

<span className="text-red-600">

GHOST

</span>

</h1>



<p className="

text-gray-400

mt-3

"

>

Sistema financiero personal

</p>



<p className="

text-sm

text-gray-500

mt-1

"

>

{usuarioEmail}

</p>


</div>






<button

onClick={cerrarSesion}

className="

px-6

py-3

rounded-xl

bg-red-700/80

hover:bg-red-600

font-bold

transition

shadow-[0_0_30px_rgba(255,0,0,0.25)]

"

>

Cerrar sesión

</button>



</div>











{/* RESUMEN PRINCIPAL */}



<div className="

grid

grid-cols-4

gap-5

"

>




<div className={tarjeta+" p-6"}>

<p className="text-gray-400">

Patrimonio actual

</p>


<h2 className="

text-4xl

font-black

mt-4

"

>

S/ {saldo.toFixed(2)}

</h2>


</div>







<div className={tarjeta+" p-6"}>

<p className="text-gray-400">

Balance total

</p>


<h2 className="

text-4xl

font-black

mt-4

text-yellow-400

"

>

S/ {(ingresos-gastos).toFixed(2)}

</h2>


</div>







<div className={tarjeta+" p-6"}>

<p className="text-gray-400">

Ingresos acumulados

</p>


<h2 className="

text-4xl

font-black

mt-4

text-green-400

"

>

S/ {ingresos.toFixed(2)}

</h2>


</div>







<div className={tarjeta+" p-6"}>

<p className="text-gray-400">

Gastos acumulados

</p>


<h2 className="

text-4xl

font-black

mt-4

text-red-400

"

>

S/ {gastos.toFixed(2)}

</h2>


</div>







</div>













{/* INFORMACION RAPIDA */}



<div className="

grid

grid-cols-3

gap-5

mt-6

"

>




<div className={tarjeta+" p-6"}>


<p className="text-gray-400">

Último ingreso

</p>



<h3 className="

text-3xl

font-black

text-green-400

mt-3

"

>

S/ {

Number(
ultimoIngreso?.monto || 0
)
.toFixed(2)

}

</h3>



<p className="

text-gray-500

mt-2

"

>

{
ultimoIngreso?.descripcion ||
"Sin información"
}

</p>


</div>









<div className={tarjeta+" p-6"}>


<p className="text-gray-400">

Último gasto

</p>



<h3 className="

text-3xl

font-black

text-red-400

mt-3

"

>

S/ {

Number(
ultimoGasto?.monto || 0
)
.toFixed(2)

}

</h3>



<p className="

text-gray-500

mt-2

"

>

{
ultimoGasto?.descripcion ||
"Sin información"
}

</p>


</div>









<div className={tarjeta+" p-6"}>


<p className="text-gray-400">

Cuenta principal

</p>



<h3 className="

text-2xl

font-black

mt-3

"

>

{
cuentaMayor?.nombre ||
"Sin datos"
}

</h3>



<p className="

text-gray-400

mt-3

"

>

S/ {

Number(
cuentaMayor?.saldo_inicial || 0
)
.toFixed(2)

}

</p>


</div>








</div>












{/* INDICADORES MENSUALES */}



<div className="

grid

grid-cols-3

gap-5

mt-6

"

>



<div className={tarjeta+" p-5"}>


<p className="text-gray-400">

Ingresos del mes

</p>


<p className="

text-2xl

font-bold

text-green-400

mt-3

"

>

S/ {ingresosMes.toFixed(2)}

</p>


</div>






<div className={tarjeta+" p-5"}>


<p className="text-gray-400">

Gastos del mes

</p>


<p className="

text-2xl

font-bold

text-red-400

mt-3

"

>

S/ {gastosMes.toFixed(2)}

</p>


</div>







<div className={tarjeta+" p-5"}>


<p className="text-gray-400">

Ahorro mensual

</p>


<p className="

text-2xl

font-bold

text-purple-400

mt-3

"

>

S/ {ahorroMes.toFixed(2)}

</p>


</div>







</div>

{/* GRAFICOS PRINCIPALES */}


<div className="

grid

grid-cols-2

gap-6

mt-8

">






<div className={tarjeta+" p-6"}>


<h2 className="

text-xl

font-bold

mb-5

"

>

Ingresos vs Gastos

</h2>





<ResponsiveContainer

width="100%"

height={240}

>


<BarChart

data={graficoMovimientos}

>


<CartesianGrid

stroke="#222"

strokeDasharray="3 3"

/>



<XAxis

dataKey="nombre"

stroke="#888"

/>



<YAxis

stroke="#888"

/>




<Tooltip

contentStyle={{

background:"#090909",

border:"1px solid #333"

}}

/>





<Bar

dataKey="total"

fill="#64748b"

radius={[8,8,0,0]}

/>





</BarChart>


</ResponsiveContainer>



</div>









<div className={tarjeta+" p-6"}>



<h2 className="

text-xl

font-bold

mb-5

"

>

Distribución de gastos

</h2>







<ResponsiveContainer

width="100%"

height={240}

>


<PieChart>



<Pie

data={gastosCategoria}

dataKey="total"

nameKey="nombre"

outerRadius={85}

>




{

gastosCategoria.map((item,index)=>(


<Cell

key={index}

fill={
coloresCategorias[
index %
coloresCategorias.length
]
}

/>


))


}





</Pie>





<Tooltip

contentStyle={{

background:"#090909",

border:"1px solid #333"

}}

/>




<Legend/>




</PieChart>



</ResponsiveContainer>




</div>








</div>









{/* EVOLUCION FINANCIERA */}



<div className={tarjeta+" p-6 mt-6"}>


<h2 className="

text-xl

font-bold

mb-5

"

>

Evolución patrimonial

</h2>







<ResponsiveContainer

width="100%"

height={220}

>


<LineChart

data={graficoSaldo}

>




<CartesianGrid

stroke="#222"

strokeDasharray="3 3"

/>



<XAxis

dataKey="fecha"

stroke="#777"

/>



<YAxis

stroke="#777"

/>




<Tooltip

contentStyle={{

background:"#090909",

border:"1px solid #333"

}}

/>





<Line

type="monotone"

dataKey="saldo"

stroke="#38bdf8"

strokeWidth={2}

dot={false}

/>





</LineChart>



</ResponsiveContainer>




</div>












{/* ANALISIS */}



<div className="

grid

grid-cols-2

gap-6

mt-8

">






<div className={tarjeta+" p-6"}>


<h2 className="

text-xl

font-bold

"

>

Análisis financiero

</h2>







<div className="mt-6">


<p className="text-gray-500">

Mayor categoría de gasto

</p>


<h3 className="

text-3xl

font-black

text-orange-400

mt-2

"

>

{

categoriaMayor?.nombre ||

"Sin datos"

}

</h3>



<p className="mt-2">

S/

{

Number(
categoriaMayor?.total || 0
)

.toFixed(2)

}

</p>


</div>







<div className="mt-8">


<p className="text-gray-500">

Movimiento más grande

</p>


<h3 className="

text-3xl

font-black

mt-2

"

>

S/

{

Number(
movimientoMayor?.monto || 0
)

.toFixed(2)

}

</h3>




<p className="

text-gray-500

mt-2

"

>

{

movimientoMayor?.descripcion ||

"Sin información"

}

</p>



</div>





</div>









<div className={tarjeta+" p-6"}>


<h2 className="

text-xl

font-bold

mb-6

"

>

Resumen mensual

</h2>





<div className="space-y-5">





<div>


<p className="text-gray-500">

Ahorro generado

</p>


<p className="

text-2xl

font-bold

text-purple-400

"

>

S/

{

ahorroMes.toFixed(2)

}

</p>


</div>






<div>


<p className="text-gray-500">

Promedio por movimiento

</p>


<p className="

text-2xl

font-bold

"

>

S/

{

promedioGasto.toFixed(2)

}

</p>


</div>






</div>



</div>






</div>












{/* MOVIMIENTOS */}



<div className="mt-10">


<h2 className="

text-3xl

font-black

mb-6

text-red-500

"

>

Últimos movimientos

</h2>






<div className="space-y-4">



{

ultimosMovimientos.map((mov,index)=>(


<div

key={index}

className={

tarjeta+

" p-5 flex justify-between items-center"

}

>




<div>


<p className={

mov.tipo==="INGRESO"

?

"text-green-400 font-bold"

:

"text-red-400 font-bold"

}

>

{mov.tipo}

</p>





<h3 className="

text-lg

font-bold

mt-2

"

>

{

mov.descripcion ||

"Sin descripción"

}

</h3>






<p className="

text-gray-500

mt-1

"

>

{

mov.categorias?.nombre ||

"Sin categoría"

}

•

{

mov.cuentas?.nombre ||

"Sin cuenta"

}

</p>




</div>









<div className="text-right">



<p className="

text-xl

font-black

"

>

S/

{

Number(
mov.monto
)

.toFixed(2)

}

</p>





<p className="

text-gray-500

mt-2

"

>

{

new Date(
mov.fecha
)

.toLocaleDateString()

}

</p>






</div>





</div>



))


}




</div>



</div>












{/* RESUMEN CATEGORIAS */}



<div className="mt-10">


<h2 className="

text-3xl

font-black

mb-6

text-red-500

"

>

Resumen de gastos

</h2>







<div className="space-y-4">



{

gastosCategoria.map((item,index)=>(



<div

key={item.nombre}

className={

tarjeta+

" p-5"

}

>




<div className="

flex

justify-between

"

>


<p className="font-bold">

{item.nombre}

</p>



<p>

S/

{item.total.toFixed(2)}

</p>



</div>







<div className="

mt-4

h-2

bg-zinc-800

rounded-full

overflow-hidden

">


<div

className="

h-full

rounded-full

"

style={{

width:`${
Math.min(
(item.total/gastos)*100,
100
)
}%`,

backgroundColor:
coloresCategorias[
index %
coloresCategorias.length
]

}}


/>



</div>






</div>




))


}




</div>




</div>









</div>

</div>

)

}



export default Dashboard;