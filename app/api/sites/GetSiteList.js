import PoolPG from "../../lib/PoolPG";

const poolPG = PoolPG()

export async function GetSiteList() {
    const client = await poolPG.connect()
    const data = await client.query('SELECT * from "Sites";')
 
    //const res = await clientPG.query('SELECT * from "Sites";')

    client.release()

    return data.rows
}

