export const dynamic = 'force-dynamic'

import PoolPG from "../../lib/PoolPG";
import tryToQueryPostgres from "../../lib/tryToQueryPostgres"
import responseFormat from "../../lib/nextResponseFormat";

const poolPG = PoolPG()

export async function GET() {
    const query = `select 
            id, 
            state,
            title, 
            starttime, 
            endtime, 
            alarms, 
            message,
            ticket,
            notes 
             
            from "FaultTracking";
        `
    const response = await tryToQueryPostgres(query,poolPG)
    return response
    
}

export async function POST (request) {

    try {

        const innerData = await request.json()
        // const {state, title, starttime, endtime, alarms, message, ticket} = innerData
        
        // if (!(state && title && starttime && endtime && alarms && message && ticket)) {
        //     throw new Error("No se ingreso todos los parámetros")
        // }
            
        const query = {
            text: `INSERT INTO "FaultTracking" (state,title,starttime,endtime,alarms,message,ticket,notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
            ;
            `,
            values: [
                innerData.state||"",
                innerData.title||"",
                innerData.starttime||"",
                innerData.endtime||"",
                innerData.alarms||"",
                innerData.message||"",
                innerData.ticket||"",
                innerData.notes||""
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

export async function PUT (request) {

    try {
        const innerData = await request.json()

        if (!(innerData.id)) {
            throw new Error("No se ingreso el 'ID'")
        }
    
        const query = {
            text: `UPDATE "FaultTracking" SET 
            state = $2,
            title = $3,
            starttime = $4,
            endtime = $5,
            alarms = $6,
            message = $7,
            ticket = $8,
            notes = $9
            WHERE ID = $1
            RETURNING *
            ;
            `,
            values: [
                innerData.id,
                innerData.state||"",
                innerData.title||"",
                innerData.starttime||"",
                innerData.endtime||"",
                innerData.alarms||"",
                innerData.message||"",
                innerData.ticket||"",
                innerData.notes||""
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