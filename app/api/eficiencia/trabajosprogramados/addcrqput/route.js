export const dynamic = 'force-dynamic'

import PoolPG from "../../../../lib/PoolPG";
import tryToQueryPostgres from "../../../../lib/tryToQueryPostgres"
import responseFormat from "../../../../lib/nextResponseFormat";
import { NextResponse } from "next/server";
import { initialize,executeQuery,close } from "../../../../lib/oradb";

const poolPG = PoolPG()

// export async function GET(request) {

//     try {
//         const { searchParams } = new URL(request.url);
//         if (!(searchParams)) {
//             throw new Error("No se ingreso el 'ID'")
//         }
//         const crqnumber = searchParams.get('crq');
        
//         const query = `
//         select distinct
//         to_char(to_date('1969-12-31 19:00:00','YYYY-MM-DD HH24:MI:SS') + numtodsinterval(ts.SCHEDULED_START_DATE,'SECOND'),'DD/MM/YYYY HH24:MI:SS') inicio,
//         to_char(to_date('1969-12-31 19:00:00','YYYY-MM-DD HH24:MI:SS') + numtodsinterval(ts.SCHEDULED_END_DATE,'SECOND'),'DD/MM/YYYY HH24:MI:SS') fin,
//         COALESCE(CASE
//             WHEN upper(ch.location_company) = 'AMÉRICA MÓVIL PERÚ SAC' then 'CLARO'
//             END,upper(ch.location_company)) as red,
//         decode(ch.priority,0,'CRÍTICA',1,'ALTA',2,'MEDIA',3,'BAJA') as severidad,
//         ch.categorization_tier_2 as motivo,
//         ch.categorization_tier_1 as areatecnologica,
//         upper(LISTAGG(r.REQUEST_DESCRIPTION01__C, ', ') WITHIN GROUP (ORDER BY ch.infrastructure_change_id)) || ':' AS elemento,
//         upper(ts.summary) as resumen,
//         ts.task_id as tarea,
//         upper(ch.infrastructure_change_id) as crq,
//         upper(ch.serviceci) as servicio,
//         upper(r.support_organization__C) as direccion,
//         upper(CH.ASGRP) as areaplanificador,
//         upper(ch.ASCHG) as planificador,
//         upper(ts.ASSIGNEE_GROUP) as areaejecutor,
//         upper(r.ASSIGNEE__C) as ejecutor,
//         upper(ch.support_group_name) as areagestor,
//         upper(ch.cab_manager___change_co_ord__) gestor
//         from aradmin.chg_infrastructure_change@dbl_rmdypr18 ch
//         inner join aradmin.tms_task@dbl_rmdypr18 ts on ch.infrastructure_change_id=ts.rootrequestid
//         inner join aradmin.GC_TMS_TASK_CI@dbl_rmdypr18  r on r.TASKID__C = ts.task_id
//         WHERE 
//         ch.infrastructure_change_id like '%${crqnumber.trim()}%'
//         GROUP BY ts.SCHEDULED_START_DATE, ts.SCHEDULED_END_DATE, ch.location_company, ch.priority, ch.categorization_tier_2, ch.categorization_tier_1, ch.serviceci, ts.summary, ts.task_id, ch.infrastructure_change_id, r.support_organization__C, CH.ASGRP, ch.ASCHG, ts.ASSIGNEE_GROUP, ch.support_group_name, ch.cab_manager___change_co_ord__, r.ASSIGNEE__C
//         ORDER BY crq desc
//         `
//         await initialize()
//         const res = await executeQuery(query)
//         console.log("Corriendo.......................................................")
//         console.log(res)
//         return res
//     } catch (error) {
//         console.log("error:")
//         console.log(error)
//         const res = responseFormat(false,400,error.message)
//         return res
//     }
// }

export async function PUT (request) {
    const today = new Date()

    try {
        const innerData = await request.json()

        console.log("-----------------------------------------------------------------------------------------------------------------")
        console.log(innerData)

        if (!(innerData.length)) {
            throw new Error("No hay elementos")
        }
        const insertGroup = innerData.map(item => {
            return(`('${item.inicio?item.inicio:today.toLocaleString()}','${item.fin?item.fin:today.toLocaleString()}','${item.red}','${item.severidad}','${item.motivo}','${item.areatecnologica}','${item.servicio}','${item.elemento}','${item.resumen}','${item.tarea}','${item.crq}','${item.direccion}','${item.areaplanificador}','${item.planificador}','${item.areaejecutor}','${item.ejecutor}','${item.areagestor}','${item.gestor}','${item.fondofecha}','${item.rojo}','${item.status}')`)
        })
        
        const dataToFill = insertGroup.join(",")

        const query = `
        INSERT INTO "TrabajosProgramados_ListaTrabajos" ("FECHA PROGRAMADA DE INICIO","FECHA PROGRAMADA DE TÉRMINO","RED","SEVERIDAD","MOTIVO/RED","ÁREA TECNOLÓGICA","SERVICIO","ELEMENTO DE RED - CI","RESUMEN DE LA TAREA","ID DE LA TAREA","ID DEL CRQ","DIRECCIÓN","ÁREA DEL PLANIFICADOR","PLANIFICADOR","ÁREA DEL EJECUTOR","EJECUTOR","ÁREA DEL GESTOR","GESTOR","FONDO_FECHA","TEXTO_ROJO","STATUS")
        VALUES
            ${dataToFill}
        ON CONFLICT ("ID DE LA TAREA") DO NOTHING;
        `
        console.log(query)
        // const query = {
        //     text: `UPDATE "TrabajosProgramados_ListaTrabajos" SET 
        //     "SEVERIDAD" = $2,
        //     "TEXTO_ROJO" = $3,
        //     "STATUS" = $4,
        //     "ÁREA TECNOLÓGICA" = $5
        //     WHERE "ID DE LA TAREA" = $1
        //     RETURNING *
        //     ;
        //     `,
        //     values: [
        //         innerData.tarea,
        //         innerData.severidad || "",
        //         innerData.rojo || "",
        //         innerData.status || "",
        //         innerData.areatecnologica || 'TECNOLOGÍA DE LA INFORMACIÓN'
        //     ]
        // }

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