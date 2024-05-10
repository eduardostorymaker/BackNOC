export const dynamic = 'force-dynamic'

import PoolPG from "../../../lib/PoolPG";
import tryToQueryPostgres from "../../../lib/tryToQueryPostgres"
import responseFormat from "../../../lib/nextResponseFormat";

const poolPG = PoolPG()

export async function GET(req,{params}) {
    const query = `select 
    lgroup.id as groupid,
    lgroup.name as groupname,
    lbuble.id as bubleid,
    lbuble.title as bubletitle,
    json_agg(
        json_build_object(
            'id',line.id,
            'line',line.line,
            'link',line.link,
            'comment',line.comment,
            'priority',line.priority
        ) order by line.priority
    ) lines
    
    from "LinkLine" as line
    left join "LinkBuble" as lbuble on lbuble.id = line.linkbuble
    left join "LinkGroup" as lgroup on lgroup.id = lbuble.linkgroup
    where lbuble.id = ${params.id}
    group by lgroup.id,lgroup.name,lbuble.id,lbuble.title
    order by lbuble.title;
    `
    const response = await tryToQueryPostgres(query,poolPG)
    return response
    
}