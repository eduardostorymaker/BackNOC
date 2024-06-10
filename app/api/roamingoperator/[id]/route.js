export const dynamic = 'force-dynamic'

import PoolPG from "../../../lib/PoolPG";
import tryToQueryPostgres from "../../../lib/tryToQueryPostgres";

const poolPG = PoolPG()

export async function GET(request, { params }) {
    const providerId = params.id

    const queryLines = `select 
        id, 
        country,
        operator,
        phone,
        "to",
        cc,
        subject,
        body
         
        from "RoamingOperator"
        where id = ${providerId};
    `

    const lines = await tryToQueryPostgres(queryLines,poolPG)

    return lines
    
}
