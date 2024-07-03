import Image from "next/image"

export default function imagesservname ({params}) { 
    console.log(params.name)
    return(
        <div className="w-full h-full">
            <Image 
                src={`/file/${params.name}`}
                layout="fill" // Esto ajustará la imagen al tamaño del contenedor
                objectFit="cover" // Esto asegura que la imagen cubra todo el espacio disponible
            />
        </div>
    )
} 