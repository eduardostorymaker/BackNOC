export const dynamic = 'force-dynamic'

import PoolPG from "../../lib/PoolPG";
import tryToQueryPostgres from "../../lib/tryToQueryPostgres"
import responseFormat from "../../lib/nextResponseFormat";

const poolPG = PoolPG()

export async function GET() {
    const query = `
    SELECT 
	prov.id,
	prov.title,
	json_agg(
		json_build_object(
			'id', lines.id,
			'priority', lines.priority,
	  		'line', lines.line
 		) ORDER BY (lines.priority)::integer
	) lines
	
    FROM "ProviderContactLines" as lines
    left join "ProviderContact" as prov on prov.id = lines.providercontact
    
    group by prov.title, prov.id
    order by prov.title
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
            UPDATE "ProviderContact" SET 
            title = '${dataToUpdate.dataProvider.title}'
            WHERE id = ${parseInt(dataToUpdate.dataProvider.id)};
            `

        const updateLinesFormat = (id,priority,line) => {
            return `
            UPDATE "ProviderContactLines" SET 
            priority = ${parseInt(priority)},
            line = '${line}'
            WHERE id = ${parseInt(id)};
            `
        } 


        const insertLinesFormat = (priority,line) => {
            return `
            INSERT INTO "ProviderContactLines" (priority, line, providercontact)
            VALUES (${priority},'${line}',${parseInt(dataToUpdate.dataProvider.id)});
            `
        } 

        const deleteLinesFormat = (id) => {
            return `
            delete from "ProviderContactLines"
            where id = ${parseInt(id)};

            `
        } 

        const isThereUpdate = dataToUpdate.dataLines.filter(item => item.todo === actionToDo.modified)
        const isThereAdd = dataToUpdate.dataLines.filter(item => item.todo === actionToDo.add)
        const isThereDelete = dataToUpdate.dataLines.filter(item => item.todo === actionToDo.delete)
        console.log("isThereUpdate")
        console.log(isThereUpdate)
        const updateLines = isThereUpdate?isThereUpdate.reduce((a,v)=>{
            return a+updateLinesFormat(v.id,v.priority,v.line)
        },""):""

        const addLines = isThereAdd?isThereAdd.reduce((a,v)=>{
            return a+insertLinesFormat(v.priority,v.line)
        },""):""

        const deleteLines = isThereDelete?isThereDelete.reduce((a,v)=>{
            return a+deleteLinesFormat(v.id)
        },""):""

        const commit = "COMMIT;"


        const query = begin + updateProvider + updateLines + addLines + deleteLines + commit

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
        id_provider int;
        BEGIN 
        `

        const insertProvider = `
            INSERT INTO "ProviderContact" (title)
            VALUES ('${dataToInsert.dataProvider.title}')
            RETURNING id INTO id_provider; 
            `

        const insertLinesFormat = (id,priority,line) => {
            return `
            INSERT INTO "ProviderContactLines" (priority, line, providercontact)
            VALUES (${priority},'${line}',id_provider);
            `
        } 

        const insertLines = dataToInsert.dataLines.reduce((a,v)=>{
            return a+insertLinesFormat(v.id,v.priority,v.line)
        },"")

        const commit = `
        END $$;
        COMMIT;
        `


        const query = begin + insertProvider + insertLines + commit

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