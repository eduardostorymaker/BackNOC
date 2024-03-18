export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server";
import PoolPG from "../../lib/PoolPG";

const poolPG = PoolPG()

export async function GET() {

    try {

        const query = `select 
            id, 
            state, 
            title, 
            starttime, 
            endtime, 
            alarms, 
            message 
             
            from "FaultTracking";
        `
        const client = await poolPG.connect()
        const data = await client.query(query)
       
        //const res = await clientPG.query('SELECT * from "Sites";')
    
        client.release()
    
        // return Response.json({
        //     data: data.rows
        // })
        const res = NextResponse.json({
            data: data.rows
        })
        res.headers.append('Access-Control-Allow-Credentials', "true")
        res.headers.append('Access-Control-Allow-Origin', '*') // replace this your actual origin
        res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
        res.headers.append(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        )
        return res
    } catch (error) {
        console.log("error:")
        console.log(error)
        return NextResponse.json(
            {
            error: error.message
            },
            {
                status:500
            }
        )
    }
}

export async function POST (request) {
    // const query = `INSERT INTO "FaultTracking" (state,title,starttime,endtime,alarms,message)
    // VALUES ('Pendiente','Prueba desde Postgres','2024-04-01 10:24:30','2024-08-29 10:24:30','alarma1','mensaje1')
    // RETURNING *
    // ;
    // `
    try {

        const innerData = await request.json()
        //console.log(innerData)
        const {state, title, starttime, endtime, alarms, message} = innerData
        
        if (!(state && title && starttime && endtime && alarms && message)) {
            throw new Error("No se ingreso todos los parámetros")
        }
            
        const query = {
            text: `INSERT INTO "FaultTracking" (state,title,starttime,endtime,alarms,message)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *
            ;
            `,
            values: [state, title, starttime, endtime, alarms, message]
        }
    
        const client = await poolPG.connect()
        const data = await client.query(query)
    
        console.log("response")
        console.log(data)
       
        //const res = await clientPG.query('SELECT * from "Sites";')
    
        client.release()
    
        // return Response.json({
        //     data: data.rows
        // })
        const res = NextResponse.json({
            data: data.rows
        })
        res.headers.append('Access-Control-Allow-Credentials', "true")
        res.headers.append('Access-Control-Allow-Origin', '*') // replace this your actual origin
        res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
        res.headers.append(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        )
        return res
    } catch (error) {
        console.log("error:")
        console.log(error)
        return NextResponse.json(
            {
            error: error.message
            },
            {
                status:500
            }
        )
    }
}

export async function PUT (request) {
    // const query = `INSERT INTO "FaultTracking" (state,title,starttime,endtime,alarms,message)
    // VALUES ('Pendiente','Prueba desde Postgres','2024-04-01 10:24:30','2024-08-29 10:24:30','alarma1','mensaje1')
    // RETURNING *
    // ;
    // `
    
    // console.log(innerData)

    try {
        const innerData = await request.json()
        const {id, state, title, starttime, endtime, alarms, message} = innerData

        if (!(id && state && title && starttime && endtime && alarms && message)) {
            throw new Error("No se ingreso todos los parámetros")
        }
    
        const query = {
            text: `UPDATE "FaultTracking" SET 
            state = $2,
            title = $3,
            starttime = $4,
            endtime = $5,
            alarms = $6,
            message = $7
            WHERE ID = $1
            RETURNING *
            ;
            `,
            values: [id,state, title, starttime, endtime, alarms, message]
        }
    
        const client = await poolPG.connect()
        const data = await client.query(query)
    
        console.log("response")
        console.log(data)
       
        //const res = await clientPG.query('SELECT * from "Sites";')
    
        client.release()
    
        // return Response.json({
        //     data: data.rows
        // })
        const res = NextResponse.json({
            data: data.rows
        })
        res.headers.append('Access-Control-Allow-Credentials', "true")
        res.headers.append('Access-Control-Allow-Origin', '*') // replace this your actual origin
        res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
        res.headers.append(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        )
        return res

    } catch (error) {
        console.log("error:")
        console.log(error)
        return NextResponse.json(
            {
            error: error.message
            },
            {
                status:500
            }
        )
    }

}