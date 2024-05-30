export const dynamic = 'force-dynamic'

import PoolPG from "../../../lib/PoolPG";
import tryToQueryPostgres from "../../../lib/tryToQueryPostgres";

const poolPG = PoolPG()

export async function GET(request, { params }) {
    const providerId = params.id

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
    where id = ${params.id}
    ;
    `

    const lines = await tryToQueryPostgres(query,poolPG)

    return lines
    
}
