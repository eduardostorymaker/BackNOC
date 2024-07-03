export const dynamic = 'force-dynamic'

import PoolPG from "../../../lib/PoolPG";
import tryToQueryPostgres from "../../../lib/tryToQueryPostgres";

const poolPG = PoolPG()

export async function GET(request, { params }) {
    const group = params.id

    const query = `
    select 
        cfs.id,
        cfs.name,
        cfs.file,
        sg.name as group,
        sg.folder as folder
        from "SchedulesFileSystem" as cfs
        left join "SchedulesGroup" as sg on cfs.group = sg.id
        where cfs.group = ${group}
        order by name desc
    ;
    `
    const response = await tryToQueryPostgres(query,poolPG)

    return response
    
}
