export const dynamic = 'force-dynamic'

import PoolPG from "../../../lib/PoolPG";
import tryToQueryPostgres from "../../../lib/tryToQueryPostgres";
import nextResponseFormat from "../../../lib/nextResponseFormat";

const poolPG = PoolPG()

export async function GET() {
    const query = `select 
            id, 
            name

            from "LinkGroup";
        `
    const response = await tryToQueryPostgres(query,poolPG)
    return response
    
}