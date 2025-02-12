export const dynamic = 'force-dynamic'

import PoolPG from "../../../../lib/PoolPG";
import tryToQueryPostgres from "../../../../lib/tryToQueryPostgres"
import responseFormat from "../../../../lib/nextResponseFormat";
import { NextResponse } from "next/server";

const poolPG = PoolPG()

export async function GET() {
    const query = `SELECT json_build_object(
        'grupos', (
            SELECT json_agg(
                json_build_object(
                    'noctitle', en."EQUIPO_NOC",
                    'arealist', (
                        SELECT json_agg(
                            json_build_object(
                                'areatecnologica', atec."ÁREA_TECNOLÓGICA"
                            )
                        )
                        FROM "TrabajosProgramados_AreaTecnologica" atec
                        WHERE atec."EQUIPO_NOC" = en."EQUIPO_NOC"
                    )
                )
            )
            FROM "TrabajosProgramados_EquipoNOC" en
        )
    ) AS equiposnoc;
    `
    const response = await tryToQueryPostgres(query,poolPG)
    return response
    
}

export async function PUT (request) {

    try {
        const innerData = await request.json()

        if (!(innerData.tarea)) {
            throw new Error("No se ingreso el 'ID'")
        }
    
        const query = {
            text: `UPDATE "TrabajosProgramados_ListaTrabajos" SET 
            "SEVERIDAD" = $2,
            "TEXTO_ROJO" = $3,
            "STATUS" = $4,
            "ÁREA TECNOLÓGICA" = $5
            WHERE "ID DE LA TAREA" = $1
            RETURNING *
            ;
            `,
            values: [
                innerData.tarea,
                innerData.severidad || "",
                innerData.rojo || "",
                innerData.status || "",
                innerData.areatecnologica || 'TECNOLOGÍA DE LA INFORMACIÓN'
            ]
        }

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