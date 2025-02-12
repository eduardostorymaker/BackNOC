import responseFormat from "./nextResponseFormat"

export default async function tryToQueryPostgres(query,poolPG) {
    try {

        const client = await poolPG.connect()
        const data = await client.query(query)
        client.release()

        const res = responseFormat(data.rows,200,false)
        return res

    } catch (error) {
        console.log("error:")
        console.log(error)
        const res = responseFormat(data.rows,500,error.message)
        return res
    }
}