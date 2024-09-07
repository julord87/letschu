import { titleFont } from "@/config/fonts";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";
import { ColorSelector, ProductSlideshow, QuantitySelector } from "@/components";

interface Props {
  params: {
    slug: string
  }
}

export default function({ params }: Props) {

const { slug } = params;
const product = initialData.products.find((product) => product.slug === slug)

if( !product ) {
  notFound();
}

  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
      {/* Slideshow */} 
      <div className="col-span-1 md:col-span-2">
        <ProductSlideshow title={product.title} images={product.images} />
      </div>



      {/* Product details */}
      <div className="col-span-1 px-5">
        <h1 className={` ${titleFont.className} antialiased font-bold text-xl`}>
          { product.title }
        </h1>
        <p className="text-lg mb-5">${ product.price }</p>

        {/* Select color */}
        <ColorSelector availableColors={product.colors} selectedColor="rojo"/>

        {/* Select quantity */}
        <QuantitySelector quantity={2}/>

        {/* Add to cart */}
        <button className="btn-primary my-5">
          Agregar al carrito
        </button>

        {/* Description */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p>{ product.description }</p>
      </div>
    </div>
  );
}