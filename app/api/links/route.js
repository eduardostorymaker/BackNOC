export const dynamic = 'force-dynamic'

import PoolPG from "../../lib/PoolPG";
import tryToQueryPostgres from "../../lib/tryToQueryPostgres"
import responseFormat from "../../lib/nextResponseFormat";

const poolPG = PoolPG()

export async function GET() {
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
    group by lgroup.id,lgroup.name,lbuble.id,lbuble.title
    order by lbuble.title;
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
            UPDATE "LinkBuble" SET 
            title = '${dataToUpdate.bubletitle}',
            linkgroup = ${dataToUpdate.groupid}
            WHERE id = ${parseInt(dataToUpdate.bubleid)};
            `

        const updateLinesFormat = (id,line,link,comment,priority) => {
            return `
            UPDATE "LinkLine" SET 
            line = '${line}',
            link = '${link}',
            comment = '${comment}',
            priority = ${parseInt(priority)}
            WHERE id = ${parseInt(id)};
            `
        } 

        const insertLinesFormat = (line, link, comment, priority, bubleid) => {
            return `
            INSERT INTO "LinkLine" (line, link, comment, priority, linkbuble)
            VALUES ('${line}','${link}','${comment}',${priority},${bubleid});
            `
        } 

        const deleteLinesFormat = (id) => {
            return `
            delete from "LinkLine"
            where id = ${parseInt(id)};

            `
        } 

        const isThereUpdate = dataToUpdate.lines.filter(item => item.todo === actionToDo.modified)
        const isThereAdd = dataToUpdate.lines.filter(item => item.todo === actionToDo.add)
        const isThereDelete = dataToUpdate.lines.filter(item => item.todo === actionToDo.delete)
        console.log("isThereUpdate")
        console.log(isThereUpdate)
        const updateLines = isThereUpdate?isThereUpdate.reduce((a,v)=>{
            return a+updateLinesFormat(v.id,v.line,v.link,v.comment,v.priority)
        },""):""

        const addLines = isThereAdd?isThereAdd.reduce((a,v)=>{
            return a+insertLinesFormat(v.line,v.link,v.comment,v.priority,dataToUpdate.bubleid)
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
        id_buble int;
        BEGIN 
        `

        const insertBuble = `
            INSERT INTO "LinkBuble" (title,linkgroup)
            VALUES ('${dataToInsert.bubletitle}',${dataToInsert.groupid})
            RETURNING id INTO id_buble; 
            `

        const insertLinesFormat = (line, link, comment, priority, linkbuble) => {
            return `
            INSERT INTO "LinkLine" (line, link, comment, priority, linkbuble)
            VALUES ('${line}','${link}','${comment}',${priority},id_buble);
            `
        } 

        const insertLines = dataToInsert.lines.reduce((a,v)=>{
            return a+insertLinesFormat(v.line, v.link, v.comment, v.priority, v.linkbuble)
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