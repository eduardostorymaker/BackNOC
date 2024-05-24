export const dynamic = 'force-dynamic'

import PoolPG from "../../lib/PoolPG";
import tryToQueryPostgres from "../../lib/tryToQueryPostgres"
import responseFormat from "../../lib/nextResponseFormat";

const poolPG = PoolPG()

export async function GET() {
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
    group by cg.name,cg.id,cg.description
    order by cg.name;
    `
    const response = await tryToQueryPostgres(query,poolPG)
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

        const updateBuble = `
            UPDATE "ContactGroup" SET 
            name = '${dataToUpdate.name}',
            description = '${dataToUpdate.description}'
            WHERE id = ${parseInt(dataToUpdate.id)};
            `

        const updateLinesFormat = (id,tag,information,priority) => {
            return `
            UPDATE "ContactItem" SET 
            tag = '${tag}',
            information = '${information}',
            priority = ${parseInt(priority)}
            WHERE id = ${parseInt(id)};
            `
        } 

        const insertLinesFormat = (tag,information,priority) => {
            return `
            INSERT INTO "ContactItem" (tag, information, priority, "group")
            VALUES ('${tag}','${information}','${priority}',${dataToUpdate.id});
            `
        } 

        const deleteLinesFormat = (id) => {
            return `
            delete from "ContactItem"
            where id = ${parseInt(id)};

            `
        } 

        const isThereUpdate = dataToUpdate.lines.filter(item => item.todo === actionToDo.modified)
        const isThereAdd = dataToUpdate.lines.filter(item => item.todo === actionToDo.add)
        const isThereDelete = dataToUpdate.lines.filter(item => item.todo === actionToDo.delete)
        console.log("isThereUpdate")
        console.log(isThereUpdate)
        const updateLines = isThereUpdate?isThereUpdate.reduce((a,v)=>{
            return a+updateLinesFormat(v.id,v.tag,v.information,v.priority)
        },""):""

        const addLines = isThereAdd?isThereAdd.reduce((a,v)=>{
            return a+insertLinesFormat(v.tag,v.information,v.priority)
        },""):""

        const deleteLines = isThereDelete?isThereDelete.reduce((a,v)=>{
            return a+deleteLinesFormat(v.id)
        },""):""

        const commit = "COMMIT;"


        const query = begin + updateBuble + updateLines + addLines + deleteLines + commit

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

        const begin = `
        BEGIN;
        DO $$ 
        DECLARE 
        id_group int;
        BEGIN 
        `

        const insertBuble = `
            INSERT INTO "ContactGroup" (name,description)
            VALUES ('${dataToInsert.name}','${dataToInsert.description}')
            RETURNING id INTO id_group; 
            `

        const insertLinesFormat = (tag, information, priority) => {
            return `
            INSERT INTO "ContactItem" (tag, information, priority, "group")
            VALUES ('${tag}','${information}',${priority},id_group);
            `
        } 

        const insertLines = dataToInsert.lines.reduce((a,v)=>{
            return a+insertLinesFormat(v.tag, v.information, v.priority)
        },"")

        const commit = `
        END $$;
        COMMIT;
        `


        const query = begin + insertBuble + insertLines + commit

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