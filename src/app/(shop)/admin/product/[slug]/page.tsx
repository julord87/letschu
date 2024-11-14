import { getProductBySlug } from "@/actions";
import Title from "@/components/ui/title/Title";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";


interface Props {
    params : {
        slug: string;
    }
}


export default async function ProductPage( { params }: Props ) {

    const { slug } = params;

    const product = await getProductBySlug(slug);

    // TODO: new
    if( !product ) {
        redirect('admin/products');
    }

    const title = slug === 'new' ? 'Nuevo Producto' : 'Editar producto';

  return (
    <>
        <Title title={ title } />
        
        <ProductForm product={ product } />
    </>
  );
}