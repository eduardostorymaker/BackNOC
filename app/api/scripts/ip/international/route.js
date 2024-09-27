export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server";

import PoolPG from "./../../../../lib/PoolPG";
import tryToQueryPostgres from "./../../../../lib/tryToQueryPostgres"
import responseFormat from "./../../../../lib/nextResponseFormat";

const poolPG = PoolPG()

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST (req, res) {

    function desencriptar(texto) {
        let desencriptado = '';
        for (let i = 0; i < texto.length; i++) {
            desencriptado += String.fromCharCode(texto.charCodeAt(i) - 5);
        }
        return desencriptado;
    }
    try {
        const dataToUpdate = await req.json()
        const device_username = dataToUpdate.du?desencriptar(dataToUpdate.du):"C15380"
        const device_password = dataToUpdate.dp?desencriptar(dataToUpdate.dp):"Claro4499$$"

        const { stdout } = await execPromise(`python ./app/api/scripts/ip/international/mi_script.py ${device_username} ${device_password}`); 
        //res.status(200).json({ output: stdout });
        return responseFormat({ output: stdout },200,false)
        } catch (error) {
        console.error('Error al ejecutar Python:', error);
        if (res && res.status) {
            //res.status(500).json({ error: 'Error al ejecutar Python' });
            return responseFormat({ error: 'Error al ejecutar Python' },500,error.message)
        } else {
            // Si `res` no es un objeto válido, simplemente logueamos el error
            //console.error('Error en la respuesta HTTP:', error);
            return responseFormat({ error: 'Error en la respuesta HTTP:' },500,error.message)
        }
    }
};

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

        const updateLinesFormat = (id,category) => {
            return `
            UPDATE "Ip_InternationalLinks" SET 
            category = '${category}'
            WHERE id = ${parseInt(id)};
            `
        } 

        const updateLines = dataToUpdate?dataToUpdate.reduce((a,v)=>{
            return a+updateLinesFormat(v.id,v.category)
        },""):""



        const commit = "COMMIT;"


        const query = begin + updateLines + commit

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

export async function OPTIONS(request) {
    return NextResponse.json(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Cambia '*' por tu dominio específico si es necesario
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}