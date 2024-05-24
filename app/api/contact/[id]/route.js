export const dynamic = 'force-dynamic'

import PoolPG from "../../../lib/PoolPG";
import tryToQueryPostgres from "../../../lib/tryToQueryPostgres";

const poolPG = PoolPG()

export async function GET(request, { params }) {
    const contactId = params.id
    const query = `select 
    cg.id,
    cg.name, 
    cg.description,
    json_agg(
        json_build_object (
            'id',ci.id,
            'tag',ci.tag,
            'information',ci.information,
            'priority', ci.priority
        ) order by ci.priority
    ) lines
        
    from "ContactItem" ci 
    left join "ContactGroup" as cg
    on cg.id = ci.group
    where cg.id = ${contactId}
    group by cg.name,cg.id,cg.description
    order by cg.name
    ;
    `
    const response = await tryToQueryPostgres(query,poolPG)
    return response
    
}