import { useLocation } from "react-router-dom";
import { Toaster as SonnerToaster } from "sonner";
import { useAppContext } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./app/routes/AppRoutes";

function App() {
  const location = useLocation();
  const { isSeller, user, showSellerLogin, showSellerSignup } = useAppContext();

  // ✅ Routes where footer should be hidden (but navbar visible)
  const hideFooterRoutes = [
    "/cart",
    "/address",
    "/confirmation",
    "/payment",
    '/profile'
  ];
  
  // ✅ Routes where both navbar and footer should be hidden
  const hideBothRoutes = [
    "/login",
    "/seller/login",
    "/seller/signup"
  ];
  
  // Check if current path should hide footer only
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);
  
  // Check if current path should hide both navbar and footer
  const shouldHideBoth = hideBothRoutes.includes(location.pathname) 
    || showSellerLogin 
    || showSellerSignup
    || location.pathname.startsWith("/seller");

  return (
    <>
      {/* Navbar - Hidden only on auth/seller pages, visible on cart/address/confirmation */}
      {!shouldHideBoth && <Navbar />}

      <SonnerToaster 
        position="bottom-right"
       
        
      />

      {/* Main Content */}
      <main className={location.pathname.startsWith("/seller") ? "seller-layout" : ""}>
        <AppRoutes user={user} isSeller={isSeller} />
      </main>

      {/* Footer - Hidden on auth/seller pages AND cart/address/confirmation */}
      {!shouldHideBoth && !shouldHideFooter && <Footer />}
    </>
  );
}

export default App;