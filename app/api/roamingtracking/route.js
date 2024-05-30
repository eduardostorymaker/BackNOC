export const dynamic = 'force-dynamic'

import PoolPG from "../../lib/PoolPG";
import tryToQueryPostgres from "../../lib/tryToQueryPostgres"
import responseFormat from "../../lib/nextResponseFormat";

const poolPG = PoolPG()

export async function GET() {
    const query = `select 
    id,
    title,
    starttime,
    endtime,
    outtime,
    indicators,
    impact,
    reason,
    complains,
    boticket,
    inocticket,
    notes
    from "RoamingTracking"
    order by starttime desc
    ;
    `
    const response = await tryToQueryPostgres(query,poolPG)
    return response
    
}

export async function POST (request) {

    try {

        const innerData = await request.json()
            
        const query = {
            text: `INSERT INTO "RoamingTracking" (title,starttime,endtime,outtime,indicators,impact,reason,complains,boticket,inocticket,notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *
            ;
            `,
            values: [
                innerData.title||"",
                innerData.starttime||"2024-06-27T16:00:17.289Z",
                innerData.endtime||"2024-06-27T16:00:17.289Z",
                innerData.outtime||0,
                innerData.indicators||"",
                innerData.impact||"",
                innerData.reason||"",
                innerData.complains||false,
                innerData.boticket||"",
                innerData.inocticket||"",
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
            text: `UPDATE "RoamingTracking" SET 
            title = $2,
            starttime = $3,
            endtime = $4,
            outtime = $5,
            indicators = $6,
            impact = $7,
            reason = $8,
            complains = $9,
            boticket = $10,
            inocticket = $11,
            notes = $12
            WHERE ID = $1
            RETURNING *
            ;
            `,
            values: [
                innerData.id,
                innerData.title||"",
                innerData.starttime||"2024-06-27T16:00:17.289Z",
                innerData.endtime||"2024-06-27T16:00:17.289Z",
                innerData.outtime||0,
                innerData.indicators||"",
                innerData.impact||"",
                innerData.reason||"",
                innerData.complains||false,
                innerData.boticket||"",
                innerData.inocticket||"",
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