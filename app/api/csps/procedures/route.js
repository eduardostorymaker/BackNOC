export const dynamic = 'force-dynamic'

import PoolPG from "../../../lib/PoolPG";
import tryToQueryPostgres from "../../../lib/tryToQueryPostgres"
import responseFormat from "../../../lib/nextResponseFormat";
import { NextResponse } from "next/server";

const poolPG = PoolPG()

export async function GET() {

    const query = `
    select 
    pfs.id id, 
    pfs.name name, 
    pfs.file file, 
    pfs.priority priority, 
    pfs.group groupid, 
    pg.name as "group", 
    pg.folder folder
    from "Csps_ProceduresFileSystem" as pfs
    inner join "Csps_ProceduresGroup" as pg on pg.id = pfs.group
    order by pfs.priority
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

        const insertLinesFormat = (name, file, priority, group) => {
            return `
            INSERT INTO "Csps_ProceduresFileSystem" ("name", "file", "priority", "group")
            VALUES ('${name}', '${file}', ${priority}, '${group}');
            `
        } 

        const query = insertLinesFormat(dataToInsert.name, dataToInsert.file, dataToInsert.priority, dataToInsert.group)

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

export async function OPTIONS(request) {
    return NextResponse.json(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Cambia '*' por tu dominio específico si es necesario
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, UPDATE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}