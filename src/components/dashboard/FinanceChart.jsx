import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";




function FinanceChart({data=[]}){


return (

<ResponsiveContainer

width="100%"

height="100%"

>


<BarChart

data={data}

margin={{

top:10,

right:10,

left:-20,

bottom:5

}}

barSize={28}

>



<CartesianGrid

strokeDasharray="4 4"

stroke="rgba(255,255,255,0.08)"

vertical={false}

/>





<XAxis

dataKey="nombre"

stroke="#9ca3af"

tick={{

fontSize:12

}}

/>





<YAxis

stroke="#9ca3af"

tick={{

fontSize:11

}}

/>






<Tooltip


contentStyle={{


background:"#080808",


border:

"1px solid rgba(239,68,68,.25)",


borderRadius:"14px",


color:"#fff"


}}



formatter={(value)=>[

`S/ ${Number(value).toFixed(2)}`,

""

]}


/>








<Bar

dataKey="total"

radius={[8,8,0,0]}


fill="#ef4444"


/>





</BarChart>


</ResponsiveContainer>


)


}



export default FinanceChart;