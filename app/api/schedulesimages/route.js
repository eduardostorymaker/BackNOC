export const dynamic = 'force-dynamic'

import PoolPG from "../../lib/PoolPG";
import tryToQueryPostgres from "../../lib/tryToQueryPostgres"
import responseFormat from "../../lib/nextResponseFormat";

const poolPG = PoolPG()

export async function GET() {
    const query = `
    select 
        cfs.id,
        cfs.name,
        cfs.file,
        cfs.group as groupid,
        sg.name as group,
        sg.folder as folder
        from "SchedulesFileSystem" as cfs
        left join "SchedulesGroup" as sg on cfs.group = sg.id
        order by name desc
    ;
    `
    const response = await tryToQueryPostgres(query,poolPG)

    console.log()
    return response
    
}


export async function PUT (request) {
    try {

        const actionToDo = {
            add: "add",
            delete: "delete",
            modified: "modified",
            none: "none" 
        }
        
        const dataToUpdate = await request.json()

        const begin = "BEGIN;"

        const updateProvider = (name,id) => {
            return `
            UPDATE "SchedulesFileSystem" SET 
            name = '${name}'
            WHERE id = ${parseInt(id)};
            `
        } 
        const dataUpdate = dataToUpdate.map(item => updateProvider(item.name,item.id))
        const query = dataUpdate.join(" ")

        console.log(query)

        const response = await tryToQueryPostgres(query,poolPG)
        return response

    } catch (error) {
        console.log("error:")
        console.log(error)
        const res = responseFormat(false,400,error.message)
        return res
    }

}

export async function POST (request) {
    try {
        const dataToInsert = await request.json()

        const insertLinesFormat = (name, file, group) => {
            return `
            INSERT INTO "SchedulesFileSystem" (name, file, "group")
            VALUES ('${name}', '${file}', ${group});
            `
        } 

        const query = insertLinesFormat(dataToInsert.name, dataToInsert.file, dataToInsert.group)

        console.log(query)

        const response = await tryToQueryPostgres(query,poolPG)
        return response

    } catch (error) {
        console.log("error:")
        console.log(error)
        const res = responseFormat(false,400,error.message)
        return res
    }

}

export async function DELETE (request) {
    try {
        const dataToDelete = await request.json()

        const deleteLinesFormat = (id) => {
            return `
            delete from "SchedulesFileSystem"
            where id = ${id}
            `
        } 

        const query = deleteLinesFormat(dataToDelete.id)

        console.log(query)

        const response = await tryToQueryPostgres(query,poolPG)
        return response

    } catch (error) {
        console.log("error:")
        console.log(error)
        const res = responseFormat(false,400,error.message)
        return res
    }

}