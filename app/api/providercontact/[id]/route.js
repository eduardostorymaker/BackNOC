export const dynamic = 'force-dynamic'

import PoolPG from "../../../lib/PoolPG";
import tryToQueryPostgres from "../../../lib/tryToQueryPostgres";

const poolPG = PoolPG()

export async function GET(request, { params }) {
    const providerId = params.id

    const queryLines = `select 
        id, 
        title
         
        from "ProviderContact"
        where id = ${providerId};
    `

    const provider = await tryToQueryPostgres(queryLines,poolPG)

    return provider
    
}