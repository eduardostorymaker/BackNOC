export const dynamic = 'force-dynamic'

import PoolPG from "../../../../lib/PoolPG";
import tryToQueryPostgres from "../../../../lib/tryToQueryPostgres";

const poolPG = PoolPG()

export async function GET() {
    const query = `select 
    gp.title,
    gp.id,
    gp.order,
    json_agg(
        json_build_object(
            'id',le.id,
            'line',le.linetext,
            'link',le.order
        ) order by le.order
    ) lines
    from "Crq_EventsDetails_Lines" le
    inner join "Crq_EventsDetails_Group" gp on gp.id = le.group
    
    group by gp.title, gp.id, gp.order
    order by gp.order
    `
    const response = await tryToQueryPostgres(query,poolPG)
    return response
    
}