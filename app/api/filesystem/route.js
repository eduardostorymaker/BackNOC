import {NextResponse} from "next/server";
import fs from 'fs';
const path = require('path');
import { pipeline } from 'stream';
import { promisify } from 'util';
const pump = promisify(pipeline);

export async function GET(req,res) {
    
    try{
        //const { filename } = req.query
        console.log("iniciando del Request1")
        const filename = "Energia.jpg"
        //const filePath = `./public/file/${filename}`
        const filePath = path.join(process.cwd(), 'public', 'file', filename);
        console.log("iniciando del Request2")
        console.log(filePath)
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ status: 'fail', message: 'Archivo no encontrado' });
        }
        const headers = new Headers();
        headers.set("Content-Type", "image/*");
        const fileContent = fs.readFileSync(filePath);
        return new NextResponse(fileContent, { status: 200, statusText: "OK", headers });
    }
    catch (error) {
        console.error("Error al servir la imagen:", error);
        return res.status(500).json({ status: 'error', message: 'Error al servir la imagen' });
    }
}

export async function POST(req,res) {
    try{
        const formData = await req.formData();
        console.log(formData)
        const file = formData.get('test1')
        console.log(file)
        const filePath = `./public/file/${file.name}`;
        await pump(file.stream(), fs.createWriteStream(filePath));
        return NextResponse.json({status:"success",data:file.size})
    }
    catch (e) {
        return  NextResponse.json({status:"fail",data:e})
    }
}