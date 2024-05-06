export const dynamic = 'force-dynamic'

import PoolPG from "../../lib/PoolPG";
import tryToQueryPostgres from "../../lib/tryToQueryPostgres"
import responseFormat from "../../lib/nextResponseFormat";

const poolPG = PoolPG()

export async function GET() {
    const query = `select 
            id, 
            title

            from "ProviderContact";
        `
    const response = await tryToQueryPostgres(query,poolPG)
    return response
    
}