import Header from "../components/header";
import Footer from "../components/footer";
import InitialLoader from "../components/initial-loader";
import { CartProvider } from "../context/cart";
import CartDrawer from "../components/cart-drawer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <InitialLoader />
            <Header />
            <CartDrawer />
            <main className="site-main">{children}</main>
            <Footer />
        </CartProvider>
    );
}
