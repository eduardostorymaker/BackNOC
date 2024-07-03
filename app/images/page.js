import Image from "next/image"

export default function imagesserv ({params}) { 
    console.log(params)
    return(
        <div className="w-full h-full">
            <Image 
                src={"/file/Energia.jpg"}
                layout="fill" // Esto ajustará la imagen al tamaño del contenedor
                objectFit="cover" // Esto asegura que la imagen cubra todo el espacio disponible
            />
        </div>
    )
}