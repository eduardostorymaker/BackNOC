export const dynamic = 'force-dynamic'

import PoolPG from "../../../../lib/PoolPG";
import tryToQueryPostgres from "../../../../lib/tryToQueryPostgres"
import responseFormat from "../../../../lib/nextResponseFormat";
import { NextResponse } from "next/server";

const poolPG = PoolPG()

// export async function GET() {
//     const query = `SELECT json_build_object(
//     'severidad', (
//         SELECT json_agg(
//         json_build_object(
//             'data', t1."SEVERIDAD"
//         )
//         )
//         FROM "TrabajosProgramados_Severidad" t1
//     ),
//     'rojo', (
//         SELECT json_agg(
//         json_build_object(
//             'data', t2."TEXTO_ROJO"
//         )
//         )
//         FROM "TrabajosProgramados_TextoRojo" t2
//     )
//     ) AS severidadcolor;
//     `
//     const response = await tryToQueryPostgres(query,poolPG)
//     return response
    
// }

export async function PUT (request) {

    try {
        const innerData = await request.json()
        let list = ""

        console.log("innerData")
        console.log(innerData)

        if (!(innerData.length)) {
            throw new Error("No se selecciono elementos")
        } else {
            list = innerData.map( item => `'${item}'`)
            list = list.join(",")
        }
    
        const query = `UPDATE "TrabajosProgramados_ListaTrabajos" SET 
            "STATUS" = 'OK'
            WHERE "ID DE LA TAREA" IN (${list})
            RETURNING *
            ;
            `
        console.log("query")
        console.log(query)
        const response = await tryToQueryPostgres(query,poolPG)
        return response

    } catch (error) {
        console.log("error:")
        console.log(error)
        const res = responseFormat(false,400,error.message)
        return res
    }

}


export async function OPTIONS(request) {
    return NextResponse.json(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, UPDATE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
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