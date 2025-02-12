export const dynamic = 'force-dynamic'

import PoolPG from "../../../lib/PoolPG";
import tryToQueryPostgres from "../../../lib/tryToQueryPostgres"
import responseFormat from "../../../lib/nextResponseFormat";

const poolPG = PoolPG()

export async function GET() {
    const query = `select 
lt."ID DEL CRQ" as crq,
at."ÁREA_TECNOLÓGICA" as areatecnologica,
en."EQUIPO_NOC" as noc,
lt."FECHA PROGRAMADA DE INICIO" as inicio,
lt."FECHA PROGRAMADA DE TÉRMINO" as fin,
lt."RED" as red,
lt."SEVERIDAD" as severidad,
lt."MOTIVO/RED" as motivo,
lt."SERVICIO" as servicio,
lt."ELEMENTO DE RED - CI" as elemento,
lt."RESUMEN DE LA TAREA" as resumen,
lt."ID DE LA TAREA" as tarea,
lt."DIRECCIÓN" as direccion,
lt."ÁREA DEL PLANIFICADOR" as areaplanificador,
lt."PLANIFICADOR" as planificador,
lt."ÁREA DEL EJECUTOR" as areaejecutor,
lt."EJECUTOR" as ejecutor,
lt."ÁREA DEL GESTOR" as areagestor,
lt."GESTOR" as gestor,
lt."FONDO_FECHA" as fondofecha,
lt."TEXTO_ROJO" as rojo,
lt."STATUS" as status
from "TrabajosProgramados_ListaTrabajos" lt
inner join "TrabajosProgramados_AreaTecnologica" at
on at."ÁREA_TECNOLÓGICA" = lt."ÁREA TECNOLÓGICA" 
inner join "TrabajosProgramados_EquipoNOC" en
on at."EQUIPO_NOC" = en."EQUIPO_NOC" 
order by crq desc
        `
    const response = await tryToQueryPostgres(query,poolPG)
    return response
    
}



// export async function POST (request) {

//     try {

//         const innerData = await request.json()
//         // const {state, title, starttime, endtime, alarms, message, ticket} = innerData
        
//         // if (!(state && title && starttime && endtime && alarms && message && ticket)) {
//         //     throw new Error("No se ingreso todos los parámetros")
//         // }
            
//         const query = {
//             text: `INSERT INTO "FaultTracking" (state,title,starttime,endtime,alarms,message,ticket,notes)
//             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
//             RETURNING *
//             ;
//             `,
//             values: [
//                 innerData.state||"",
//                 innerData.title||"",
//                 innerData.starttime||"",
//                 innerData.endtime||"",
//                 innerData.alarms||"",
//                 innerData.message||"",
//                 innerData.ticket||"",
//                 innerData.notes||""
//             ]
//         }
        
//         const response = await tryToQueryPostgres(query,poolPG)
//         return response
        
//     } catch (error) {
//         console.log("error:")
//         console.log(error)
//         const res = responseFormat(false,400,error.message)
//         return res
//     }
// }

// export async function PUT (request) {

//     try {
//         const innerData = await request.json()

//         if (!(innerData.id)) {
//             throw new Error("No se ingreso el 'ID'")
//         }
    
//         const query = {
//             text: `UPDATE "FaultTracking" SET 
//             state = $2,
//             title = $3,
//             starttime = $4,
//             endtime = $5,
//             alarms = $6,
//             message = $7,
//             ticket = $8,
//             notes = $9
//             WHERE ID = $1
//             RETURNING *
//             ;
//             `,
//             values: [
//                 innerData.id,
//                 innerData.state||"",
//                 innerData.title||"",
//                 innerData.starttime||"",
//                 innerData.endtime||"",
//                 innerData.alarms||"",
//                 innerData.message||"",
//                 innerData.ticket||"",
//                 innerData.notes||""
//             ]
//         }

//         const response = await tryToQueryPostgres(query,poolPG)
//         return response

//     } catch (error) {
//         console.log("error:")
//         console.log(error)
//         const res = responseFormat(false,400,error.message)
//         return res
//     }

// }