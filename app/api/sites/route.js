export const dynamic = 'force-dynamic'

import PoolPG from "../../lib/PoolPG";
import tryToQueryPostgres from "../../lib/tryToQueryPostgres";

const poolPG = PoolPG()

export async function GET() {
    const query = `select 
        id, 
        code, 
        name, 
        state, 
        subregion, 
        tecnologies, 
        latitude, 
        longitude, 
        department, 
        province, 
        district, 
        ppcc, 
        address, 
        codename,
        type  
        from "Sites";
    `
    const response = await tryToQueryPostgres(query,poolPG)
    return response
}