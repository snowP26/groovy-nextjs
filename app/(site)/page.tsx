import { getProducts } from "../../lib/shopify";

import HomeClient from "./home-client";

export default async function Home() {
    const products = await getProducts(4);
    return <HomeClient featuredProducts={products} />;
}

