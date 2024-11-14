import { getCategories, getProductBySlug, getTypes } from "@/actions";
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

    const [ product, categories, types ] = await Promise.all([
        getProductBySlug(slug),
        getCategories(),
        getTypes()
    ]);

    // TODO: new
    if( !product && slug !== 'new' ) {
        redirect('admin/products');
    }

    const title = slug === 'new' ? 'Nuevo Producto' : 'Editar producto';

  return (
    <>
        <Title title={ title } />
        
        <ProductForm product={ product ?? {}} categories={ categories } types={ types } />
    </>
  );
}