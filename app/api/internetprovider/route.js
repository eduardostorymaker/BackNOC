export const dynamic = 'force-dynamic'

import PoolPG from "../../lib/PoolPG";
import tryToQueryPostgres from "../../lib/tryToQueryPostgres"
import responseFormat from "../../lib/nextResponseFormat";

const poolPG = PoolPG()

export async function GET() {
    const query = `
    select 
        id, 
        type,
        provider,
        phone,
        "to",
        cc,
        subject,
        body

        from "InternetProvider"
        order by type, provider
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

        const updateProvider = `
            UPDATE "InternetProvider" SET 
            type = '${dataToUpdate.type}',
            provider = '${dataToUpdate.provider}',
            phone = '${dataToUpdate.phone}',
            "to" = '${dataToUpdate.to}',
            cc = '${dataToUpdate.cc}',
            subject = '${dataToUpdate.subject}',
            body = '${dataToUpdate.body}'

            WHERE id = ${parseInt(dataToUpdate.id)};
            `
        const query = updateProvider

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

        const insertLinesFormat = (type, provider, phone, to, cc, subject, body) => {
            return `
            INSERT INTO "InternetProvider" (type, provider, phone, "to", cc, subject, body)
            VALUES ('${type}', '${provider}', '${phone}', '${to}', '${cc}', '${subject}', '${body}');
            `
        } 

        const query = insertLinesFormat(dataToInsert.type, dataToInsert.provider, dataToInsert.phone, dataToInsert.to, dataToInsert.cc, dataToInsert.subject, dataToInsert.body)

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