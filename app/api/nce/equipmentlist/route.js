export const dynamic = 'force-dynamic'

import PoolPG from "../../../lib/PoolPG";
import tryToQueryPostgres from "../../../lib/tryToQueryPostgres"
import responseFormat from "../../../lib/nextResponseFormat";

const https = require('https')

const poolPG = PoolPG()

const getToken = async () => {
    try {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            // agent: new https.Agent({
            //     rejectUnauthorized: false, // Desactiva la verificación SSL
            //   }),
            body: JSON.stringify({
                "grantType": "password",
                "userName": "usr_noc_claro",
                "value": "Claro2024**"
            })
        }
        const api = "https://10.96.209.54:26335/rest/plat/smapp/v1/sessions"

        const response = await fetch(api,requestOptions)
        const dataInfo = await response.json()
        if (dataInfo.error) {
            throw new Error("Error "+ dataInfo.status + ": " +dataInfo.error)
        }
        console.log(dataInfo) 
        //const res = responseFormat(dataInfo,200,false)
        return {
            data: dataInfo,
            error: false
        }
        // setTryToDb(tryToDbStates.success)
        // setCanEdit(false)
        // setAreThereChanges(false)
    } catch (error) {
        console.log("Error en el update")
        console.log(error)
        // setTryToDb(tryToDbStates.fault)   
        const res = responseFormat(false,500,error)
        return {
            data: false,
            error: true
        }
    }
}

const getEquipmentList= async (token) => {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'X-AUTH-TOKEN': token },
            // agent: new https.Agent({
            //     rejectUnauthorized: false, // Desactiva la verificación SSL
            //   }),
            // body: JSON.stringify({
            //     "grantType": "password",
            //     "userName": "usr_noc_claro",
            //     "value": "Claro2024**"
            // })
        }
        const api = "https://10.96.209.54:26335/restconf/v2/data/huawei-nce-resource-inventory:network-elements"

        const response = await fetch(api,requestOptions)
        const dataInfo = await response.json()
        if (dataInfo.error) {
            throw new Error("Error "+ dataInfo.status + ": " +dataInfo.error)
        }
        console.log(dataInfo) 
        //const res = responseFormat(dataInfo,200,false)
        return {
            data: dataInfo,
            error: false
        }
        // setTryToDb(tryToDbStates.success)
        // setCanEdit(false)
        // setAreThereChanges(false)
    } catch (error) {
        console.log("Error en el update")
        console.log(error)
        // setTryToDb(tryToDbStates.fault)   
        const res = responseFormat(false,500,error)
        return {
            data: false,
            error: true
        }
    }
}

export async function GET() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
        const token = await getToken()
        if (token.error) {
            throw new Error("Error obteniendo el token ")
        }
        console.log(token.data) 
        const dataEquipment = await getEquipmentList(token.data.accessSession)
        if (dataEquipment.error) {
            throw new Error("Error obteniendo la data")
        }
        const res = responseFormat(dataEquipment.data,200,false)
        return res
        // setTryToDb(tryToDbStates.success)
        // setCanEdit(false)
        // setAreThereChanges(false)
    } catch (error) {
        console.log("Error en el update")
        console.log(error)
        // setTryToDb(tryToDbStates.fault)   
        const res = responseFormat(false,500,error)
        return res
    }

    // const query = `select 
    // id,
    // title,
    // starttime,
    // endtime,
    // outtime,
    // indicators,
    // impact,
    // reason,
    // complains,
    // boticket,
    // inocticket,
    // notes
    // from "RoamingTracking"
    // order by starttime desc
    // ;
    // `
    // const response = await tryToQueryPostgres(query,poolPG)
    // return response
    
    
}

export async function POST (request) {

    try {

        const innerData = await request.json()
            
        const query = {
            text: `INSERT INTO "RoamingTracking" (title,starttime,endtime,outtime,indicators,impact,reason,complains,boticket,inocticket,notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *
            ;
            `,
            values: [
                innerData.title||"",
                innerData.starttime||"2024-06-27T16:00:17.289Z",
                innerData.endtime||"2024-06-27T16:00:17.289Z",
                innerData.outtime||0,
                innerData.indicators||"",
                innerData.impact||"",
                innerData.reason||"",
                innerData.complains||false,
                innerData.boticket||"",
                innerData.inocticket||"",
                innerData.notes||""
            ]
        }
        
        const response = await tryToQueryPostgres(query,poolPG)
        return response
        
    } catch (error) {
        console.log("error:")
        console.log(error)
        const res = responseFormat(false,400,error.message)
        return res
    }
}

export async function PUT (request) {

    try {
        const innerData = await request.json()

        if (!(innerData.id)) {
            throw new Error("No se ingreso el 'ID'")
        }
    
        const query = {
            text: `UPDATE "RoamingTracking" SET 
            title = $2,
            starttime = $3,
            endtime = $4,
            outtime = $5,
            indicators = $6,
            impact = $7,
            reason = $8,
            complains = $9,
            boticket = $10,
            inocticket = $11,
            notes = $12
            WHERE ID = $1
            RETURNING *
            ;
            `,
            values: [
                innerData.id,
                innerData.title||"",
                innerData.starttime||"2024-06-27T16:00:17.289Z",
                innerData.endtime||"2024-06-27T16:00:17.289Z",
                innerData.outtime||0,
                innerData.indicators||"",
                innerData.impact||"",
                innerData.reason||"",
                innerData.complains||false,
                innerData.boticket||"",
                innerData.inocticket||"",
                innerData.notes||""
            ]
        }

        const response = await tryToQueryPostgres(query,poolPG)
        return response

    } catch (error) {
        console.log("error:")
        console.log(error)
        const res = responseFormat(false,400,error.message)
        return res
    }

}