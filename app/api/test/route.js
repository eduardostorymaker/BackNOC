import PoolPG from "../../lib/PoolPG";
import tryToQueryPostgres from "../../lib/tryToQueryPostgres";

const poolPG = PoolPG()

export async function GET(req,res) {
    // console.log("req$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    // console.log(req)
    const query = `select 
        *
        from "test";
    `
    const response = await tryToQueryPostgres(query,poolPG)
    return response
}