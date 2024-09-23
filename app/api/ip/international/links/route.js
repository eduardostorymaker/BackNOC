export const dynamic = 'force-dynamic'

import PoolPG from "../../../../lib/PoolPG";
import tryToQueryPostgres from "../../../../lib/tryToQueryPostgres";

const poolPG = PoolPG()

export async function GET(request, { params }) {
    //const providerId = params.id

    const queryLines = `select 
        *
         
        from "Ip_InternationalLinks"
        ;
    `

    const lines = await tryToQueryPostgres(queryLines,poolPG)

    return lines
    
}

export async function POST (request) {
    try {
        const dataToInsert = await request.json()

        const begin = `
        BEGIN;
        DO $$ 
        DECLARE 
        id_provider int;
        BEGIN 
        `

        const insertLink = `
            INSERT INTO "Ip_InternationalLinks" (interface, description, kind, trunk, ipv4, ipv6, source, category)
            VALUES ('${dataToInsert.interface}','${dataToInsert.description}','${dataToInsert.kind}','${dataToInsert.trunk}','${dataToInsert.ipv4}','${dataToInsert.ipv6}','${dataToInsert.source}','${dataToInsert.category}')
            RETURNING id; 
            `

        const commit = `
        END $$;
        COMMIT;
        `


        const query = insertLink 

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


        const insertLink = `
            Delete from "Ip_InternationalLinks" 
            Where id = ${dataToDelete.id}
            RETURNING id; 
            `


        const query = insertLink 

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