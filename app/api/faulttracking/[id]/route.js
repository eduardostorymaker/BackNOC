export const dynamic = 'force-dynamic'

import PoolPG from "../../../lib/PoolPG";
import tryToQueryPostgres from "../../../lib/tryToQueryPostgres";

const poolPG = PoolPG()

export async function GET(request, { params }) {
    const faultId = params.id
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
         
        from "FaultTracking"
        where id = ${faultId};
    `
    const response = await tryToQueryPostgres(query,poolPG)
    return response
    
}