import { NextResponse } from "next/server";

export default function nextResponseFormat (data,status,error) {

    const res = NextResponse.json(
        {
            data: data,        
            status: status,
            error: error
        },
        {status:status},
        {error:error}
    )
    res.headers.append('Access-Control-Allow-Credentials', "true")
    res.headers.append('Access-Control-Allow-Origin', '*') // replace this your actual origin
    res.headers.append('Access-Control-Allow-Methods', 'POST,PUT,GET,DELETE,PATCH')
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Authorization, Date, X-Api-Version'
    )
    return res
}