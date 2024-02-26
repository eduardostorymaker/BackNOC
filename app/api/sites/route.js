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
    return NextResponse.json({
        data: data.rows
    })
}