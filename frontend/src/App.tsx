import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./app/routes/AppRoutes";

function App() {
  const location = useLocation();
  const { isSeller, user, showSellerLogin, showSellerSignup } = useAppContext();

  // ✅ Hide Navbar/Footer on auth pages + modals
  const hideNavbarFooter = [
    "/login", 
    "/seller/login", 
    "/seller/signup"
  ].includes(location.pathname) || showSellerLogin || showSellerSignup;

  return (
    <>
      {/* Navbar - HIDDEN on auth/seller */}
      {!hideNavbarFooter && !location.pathname.startsWith("/seller") && <Navbar />}

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          },
        }}
      />

      {/* Main Content */}
      <main className={location.pathname.startsWith("/seller") ? "seller-layout" : ""}>
        <AppRoutes user={user} isSeller={isSeller} />
      </main>

      {/* Footer - HIDDEN on auth/seller */}
      {!hideNavbarFooter && !location.pathname.startsWith("/seller") && <Footer />}
    </>
  );
}

export default App;