export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server";
import PoolPG from "../../lib/PoolPG";

const poolPG = PoolPG()

export async function GET() {
    const query = `select 
        id, 
        code, 
        name, 
        state, 
        subregion, 
        tecnologies, 
        latitude, 
        longitude, 
        department, 
        province, 
        district, 
        ppcc, 
        address, 
        codename,
        type  
        from "Sites";
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
}