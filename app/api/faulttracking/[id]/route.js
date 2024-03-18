export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server";
import PoolPG from "../../../lib/PoolPG";

const poolPG = PoolPG()

export async function GET(request, { params }) {
    const faultId = params.id

    const query = `select 
        id, 
        state, 
        title, 
        starttime, 
        endtime, 
        alarms, 
        message 
         
        from "FaultTracking"
        where id = ${faultId};
    `
    const client = await poolPG.connect()
    
    const data = await client.query(query)
     
    client.release()

    const res = NextResponse.json({
        // data: data.rows
        data: data.rows[0]
    })
    res.headers.append('Access-Control-Allow-Credentials', "true")
    res.headers.append('Access-Control-Allow-Origin', '*') // replace this your actual origin
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    return res
}