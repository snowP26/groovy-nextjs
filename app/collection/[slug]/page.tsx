import { notFound } from "next/navigation";
import { getProductByHandle } from "../../../lib/shopify";
import ProductDetail from "../../components/product-detail";

const SLUG_ALIAS: Record<string, string> = {
    "graphic-tee-black": "graphic-tee",
    "graphic-tee-white": "graphic-tee",
};

export default async function ProductPage(props: PageProps<"/collection/[slug]">) {
    const { slug } = await props.params;
    const handle = SLUG_ALIAS[slug] ?? slug;
    const product = await getProductByHandle(handle);
    if (!product) notFound();
    return <ProductDetail product={product} />;
}
