import { NextResponse } from "next/server";
import fs from 'fs';
const path = require('path');
import { pipeline } from 'stream';
import { promisify } from 'util';
const pump = promisify(pipeline);

// export async function GET(request,response) {
    
//     // console.log("iniciando del Request1 #############################################################################")
//     console.log("request")
//     console.log(request.search)
//     // console.log("iniciando del Request2 #############################################################################")
//     // const formData = await request.formData();
//     // console.log(formData)



//     const rutaDiscoC = 'C:\\Datos\\';

//     // Lee el contenido de la ruta
//     console.log("intentando leer la ruta")
//     fs.readdir(rutaDiscoC, (err, archivos) => {
//     if (err) {
//         console.error('Error al leer la ruta:', err);
//         return;
//     }

//     // Filtra solo las carpetas
//     const carpetas = archivos.filter(nombre => {
//         const rutaCompleta = `${rutaDiscoC}${nombre}`;
//         return fs.statSync(rutaCompleta).isDirectory();
//     });

//     console.log('Carpetas en la ruta del disco C:');
//     carpetas.forEach(carpetas => {
//         console.log(carpetas);
//     });
// });


//     try{
//         const filename = "7_2_2024_13_47_6_pruebaxls.xlsx"
//         //const filePath = `./public/file/${filename}`
//         const filePath = path.join(process.cwd(), 'public', 'ipmpls', filename);
//         console.log("iniciando del Request2")
//         console.log(filePath)
//         if (!fs.existsSync(filePath)) {
//             return res.status(404).json({ status: 'fail', message: 'Archivo no encontrado' });
//         }
//         const headers = new Headers();
//         headers.set("Content-Type", "image/*");
//         const fileContent = fs.readFileSync(filePath);
//         return new NextResponse(fileContent, { status: 200, statusText: "OK", headers });
//     }
//     catch (error) {
//         console.error("Error al servir la imagen:", error);
//         return res.status(500).json({ status: 'error', message: 'Error al servir la imagen' });
//     }
// }

// export async function GET(request,response) {
//     console.log("Entro al GET")
//     console.log("Obtenendo el request")
//     const data = await request.json()
//     console.log("Imprimiento Request")
//     console.log(data)
// }

export async function POST(req,res) {
    try{
        const formData = await req.formData();
        console.log(formData)
        const file = formData.get('file')
        const path = formData.get('path')
        const name = formData.get('name')
        const today = new Date()
        console.log(file)
        console.log(path)
        console.log(name)
        const fullPath = `C:\\Datos\\Servers\\nginx-1.26.1\\html\\cspsImages\\procedures\\${path}`

        await fs.promises.access(fullPath, fs.constants.F_OK)
            .catch(async () => {
                console.log('La carpeta no existe. Creándola...');
                await fs.promises.mkdir(fullPath, { recursive: true });
                console.log('¡Carpeta creada exitosamente!');
            });

        const splitFileName = file.name.split(".")
        const fullName = (today.getMonth() + 1) + "_" + today.getDate() + "_" + today.getFullYear() + "_" + today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds() + "_" + name.replaceAll(" ","")  + "." + splitFileName[splitFileName.length-1]
        const filePath = `${fullPath}/${fullName}`
        await pump(file.stream(), fs.createWriteStream(filePath));
        return NextResponse.json({status:"success",name:fullName,data:file.size})
    }
    catch (e) {
        return  NextResponse.json({status:"fail",data:e})
    }
}

export async function OPTIONS(request) {
    return NextResponse.json(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Cambia '*' por tu dominio específico si es necesario
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, UPDATE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}