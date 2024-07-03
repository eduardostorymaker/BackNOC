export const dynamic = 'force-dynamic'

import PoolPG from "../../lib/PoolPG";
import tryToQueryPostgres from "../../lib/tryToQueryPostgres"
import responseFormat from "../../lib/nextResponseFormat";

const poolPG = PoolPG()

export async function GET() {
    const query = `
    select 
        id,
        name,
        folder,
        priority
        from "SchedulesGroup"
        order by priority
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
            UPDATE "RoamingOperator" SET 
            country = '${dataToUpdate.country}',
            operator = '${dataToUpdate.operator}',
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

        const insertLinesFormat = (country, operator, phone, to, cc, subject, body) => {
            return `
            INSERT INTO "RoamingOperator" (country, operator, phone, "to", cc, subject, body)
            VALUES ('${country}', '${operator}', '${phone}', '${to}', '${cc}', '${subject}', '${body}');
            `
        } 

        const query = insertLinesFormat(dataToInsert.country, dataToInsert.operator, dataToInsert.phone, dataToInsert.to, dataToInsert.cc, dataToInsert.subject, dataToInsert.body)

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