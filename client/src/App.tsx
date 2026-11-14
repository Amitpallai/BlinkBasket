import { useLocation } from "react-router-dom";
import { Toaster as SonnerToaster } from "sonner";
import { useAppContext } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./app/routes/AppRoutes";

function App() {
  const location = useLocation();
  const { isSeller, user, showSellerLogin, showSellerSignup } = useAppContext();

  const path = location.pathname;

  // Routes where footer should be hidden (navbar still visible)
  const hideFooterRoutes = [
    "/cart",
    "/address",
    "/confirmation",
    "/payment",
    "/profile",
    "/account",
  ];

  // Routes where BOTH navbar and footer are hidden
  const hideBothRoutes = [
    "/login",
    "/seller/login",
    "/seller/signup",
  ];

  const shouldHideFooter =
    hideFooterRoutes.some((r) => path === r || path.startsWith(r + "/"));

  const shouldHideBoth =
    hideBothRoutes.some((r) => path === r || path.startsWith(r + "/")) ||
    showSellerLogin ||
    showSellerSignup ||
    path.startsWith("/seller");

  return (
    <>
      {!shouldHideBoth && <Navbar />}

      <SonnerToaster position="bottom-right" />

      <main className={path.startsWith("/seller") ? "seller-layout" : ""}>
        <AppRoutes user={user} isSeller={isSeller} />
      </main>

      {!shouldHideBoth && !shouldHideFooter && <Footer />}
    </>
  );
}

export default App;