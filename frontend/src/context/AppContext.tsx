import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

// ✅ GLOBAL AXIOS CONFIG
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "https://grocery-mart-npj4.vercel.app";

// ✅ FIXED INTERCEPTORS - FULL DUAL TOKEN SUPPORT (COOKIE + LOCALSTORAGE + HEADERS)
// ✅ FIXED INTERCEPTOR - cleaner priority, no conflicts
axios.interceptors.request.use(
  (config) => {
    // Check if this is a seller endpoint
    const isSellerEndpoint = config.url?.includes("/api/seller");

    if (isSellerEndpoint) {
      // Only use seller token for seller endpoints
      const sellerTokenCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('sellerToken='))
        ?.split('=')[1];
      const sellerToken = sellerTokenCookie || localStorage.getItem("seller_token");
      if (sellerToken) config.headers.Authorization = `Bearer ${sellerToken}`;
    } else {
      // Only use user token for user/product endpoints
      const userToken = localStorage.getItem("token");
      if (userToken) config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const skipAuthEndpoints = ['/isauth', '/login', '/signup']; // ✅ Added login/signup to skip
    const isAuthCheck = skipAuthEndpoints.some(endpoint => 
      error.config?.url?.includes(endpoint)
    );

    if (error.response?.status === 401 && !isAuthCheck && !error.config?._retry) {
      localStorage.removeItem("token");
      localStorage.removeItem("seller_token");
      document.cookie = "sellerToken=; Max-Age=0; path=/; SameSite=strict";
      sessionStorage.setItem("auth_expired", "true");
      toast.error("Session expired. Please login again", { id: "session-expired" });
    }
    return Promise.reject(error);
  }
);

// 🔹 TYPES
export type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  offerPrice: number;
  inStock: boolean;
  image?: string[];
};

export type Category = {
  _id: string;
  name: string;
  image: string;
  bgColor: string;
};

type CartItems = Record<string, number>;
type User = { _id?: string; name?: string; email?: string; cartItems: CartItems } | null;
type Seller = { _id?: string; name?: string; email?: string; cafeName?: string; storeName?: string } | null;

type AppContextType = {
  axios: typeof axios;
  navigate: NavigateFunction;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  seller: Seller;
  setSeller: React.Dispatch<React.SetStateAction<Seller>>;
  isSeller: boolean;
  setIsSeller: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  categories: Category[];
  showUserLogin: boolean;
  setShowUserLogin: React.Dispatch<React.SetStateAction<boolean>>;
  showUserSignup: boolean;
  setShowUserSignup: React.Dispatch<React.SetStateAction<boolean>>;
  showSellerLogin: boolean;
  setShowSellerLogin: React.Dispatch<React.SetStateAction<boolean>>;
  showSellerSignup: boolean;
  setShowSellerSignup: React.Dispatch<React.SetStateAction<boolean>>;
  currency: string;
  
  // User auth
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // Seller auth
  sellerLogin: (email: string, password: string) => Promise<void>;
  sellerSignup: (cafeName: string, email: string, password: string) => Promise<void>;
  sellerLogout: () => Promise<void>;
  // Cart
  addToCart: (itemId: string) => void;
  updateCart: (itemId: string, quantity: number) => void;
  removeCart: (itemId: string) => void;
  clearCart: () => Promise<void>;
  cartItems: CartItems;
  setCartItems: React.Dispatch<React.SetStateAction<CartItems>>;
  getCartCount: () => number;
  getCartAmount: () => number;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  fetchProducts: () => Promise<void>;
  fetchProduct: (id: string) => Promise<Product | null>;
  fetchCategories: () => Promise<void>;
  isLoading: boolean;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  // State
  
  const [user, setUser] = useState<User>(null);
  const [seller, setSeller] = useState<Seller>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showUserSignup, setShowUserSignup] = useState(false);
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [showSellerSignup, setShowSellerSignup] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartItems, setCartItems] = useState<CartItems>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Auth checks
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/isauth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user?.cartItems || {});
      }
    } catch (error: any) {
      if (error.response?.status !== 401) console.warn("User auth failed");
      setUser(null);
    }
  }, []);

  const fetchSeller = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/seller/isauth");
      if (data.success && data.seller) {
        setSeller(data.seller);
        setIsSeller(true);
      }
    } catch (error: any) {
      if (error.response?.status !== 401) console.warn("Seller auth failed");
      setSeller(null);
      setIsSeller(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) setProducts(data.products);
    } catch (error: any) {
      toast.error("Failed to load products");
    }
  }, []);

  // ✅ FIXED: Changed from /update to /list or /get based on typical backend routes
  const fetchCategories = useCallback(async () => {
    try {
      // Try multiple possible endpoints
      let data;
      try {
        const response = await axios.get("/api/category/list");
        data = response.data;
      } catch {
        // Fallback to /get if /list doesn't exist
        const response = await axios.get("/api/category/get");
        data = response.data;
      }
      
      if (data.success && data.categories) {
        setCategories(data.categories);
      } else if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.warn("Categories fetch failed - endpoint may not exist yet");
      // Set empty array to avoid repeated errors
      setCategories([]);
    }
  }, []);

  const fetchProduct = useCallback(async (id: string) => {
    try {
      const { data } = await axios.get(`/api/product/${id}`);
      return data.product;
    } catch {
      return null;
    }
  }, []);

const refreshAppData = useCallback(async () => {
  // Don't refresh if currently on seller pages — it can reset isSeller mid-session
  const isSellerPage = window.location.pathname.startsWith("/seller");
  if (isSellerPage) {
    await Promise.allSettled([fetchProducts()]);
  } else {
    await Promise.allSettled([fetchUser(), fetchSeller(), fetchProducts()]);
  }
}, [fetchProducts, fetchSeller, fetchUser]);

  // ✅ USER AUTH
  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await axios.post("/api/user/login", { email, password });
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user?.cartItems || {});
        if (data.token) localStorage.setItem("token", data.token);
        localStorage.removeItem("seller_token");
        document.cookie = "sellerToken=; Max-Age=0";
        sessionStorage.removeItem("auth_expired");
        toast.success("Login successful");
        setShowUserLogin(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  }, [navigate]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const { data } = await axios.post("/api/user/signup", { name, email, password });
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user?.cartItems || {});
        if (data.token) localStorage.setItem("token", data.token);
        localStorage.removeItem("seller_token");
        document.cookie = "sellerToken=; Max-Age=0";
        sessionStorage.removeItem("auth_expired");
        toast.success("Account created");
        setShowUserSignup(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  }, [navigate]);

  // ✅ SELLER AUTH - FIXED TOKEN HANDLING WITH BETTER ERROR HANDLING
// ✅ FIXED SELLER LOGIN
const sellerLogin = useCallback(async (email: string, password: string) => {
  try {
    // Don't clear tokens before — the interceptor will send whatever exists
    // which is fine since backend validates credentials anyway
    const { data } = await axios.post("/api/seller/login", { email, password });

    if (data.success) {
      // 1. Store token FIRST before any state updates
      if (data.token) {
        localStorage.setItem("seller_token", data.token);
        document.cookie = `sellerToken=${data.token}; path=/; SameSite=strict; Max-Age=86400`;
      }

      // 2. Clear user token to avoid conflict
      localStorage.removeItem("token");
      document.cookie = "token=; Max-Age=0; path=/";

      // 3. Update state
      setSeller(data.seller);
      setIsSeller(true);
      setUser(null); // clear any user session
      sessionStorage.removeItem("auth_expired");

      toast.success("Seller login successful!");
      setShowSellerLogin(false);

      // 4. Navigate last
      navigate("/seller");
    } else {
      toast.error(data.message || "Login failed");
    }
  } catch (error: any) {
    console.error("Seller login error:", error);
    toast.error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Seller login failed. Please check your credentials."
    );
  }
}, [navigate]);

  const sellerSignup = useCallback(async (cafeName: string, email: string, password: string) => {
    try {
      const { data } = await axios.post("/api/seller/signup", { cafeName, email, password });
      if (data.success) {
        setSeller(data.seller);
        setIsSeller(true);
        if (data.token) {
          localStorage.setItem("seller_token", data.token);
          document.cookie = `sellerToken=${data.token}; path=/; SameSite=strict`;
        }
        localStorage.removeItem("token");
        sessionStorage.removeItem("auth_expired");
        toast.success("Seller account created!");
        setShowSellerSignup(false);
        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Seller signup error:", error);
      toast.error(error.response?.data?.message || "Seller signup failed");
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try { await axios.get("/api/user/logout"); } catch {}
    setUser(null);
    setCartItems({});
    setSeller(null);
    setIsSeller(false);
    localStorage.removeItem("token");
    localStorage.removeItem("seller_token");
    document.cookie = "sellerToken=; Max-Age=0";
    sessionStorage.removeItem("auth_expired");
    toast.success("Logged out");
    navigate("/");
  }, [navigate]);

  const sellerLogout = useCallback(async () => {
    try { await axios.get("/api/seller/logout"); } catch {}
    setSeller(null);
    setIsSeller(false);
    localStorage.removeItem("seller_token");
    localStorage.removeItem("token");
    document.cookie = "sellerToken=; Max-Age=0";
    sessionStorage.removeItem("auth_expired");
    toast.success("Seller logged out");
    navigate("/");
  }, [navigate]);

  // Cart functions
  const addToCart = useCallback((itemId: string) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    toast.success("Added to cart");
  }, [navigate, user]);

  const updateCart = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) return removeCart(itemId);
    setCartItems((prev) => ({ ...prev, [itemId]: quantity }));
  }, []);

  const removeCart = useCallback((itemId: string) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  }, []);

  const clearCart = useCallback(async () => {
    setCartItems({});

    if (!user) return;

    try {
      await axios.post("/api/cart/update", { cartItems: {} });
    } catch (error) {
      console.warn("Failed to persist cart clear", error);
    }
  }, [user]);

  const getCartCount = useCallback(() =>
    Object.values(cartItems).reduce((a, b) => a + (b || 0), 0), [cartItems]);

  const getCartAmount = useCallback(() => {
    let total = 0;
    Object.entries(cartItems).forEach(([id, qty]) => {
      const product = products.find((p) => p._id === id);
      if (product) total += product.offerPrice * qty;
    });
    return total;
  }, [cartItems, products]);

  // ✅ INIT
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      if (sessionStorage.getItem("auth_expired") === "true") {
        sessionStorage.removeItem("auth_expired");
        setIsLoading(false);
        return;
      }
      await Promise.allSettled([fetchUser(), fetchSeller(), fetchProducts(), fetchCategories()]);
      setIsLoading(false);
    };
    init();
  }, [fetchUser, fetchSeller, fetchProducts, fetchCategories]); // ✅ Added dependencies

  // Auto refresh key app data when user returns to the tab or reconnects.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void refreshAppData();
      }
    };

    const handleFocus = () => {
      void refreshAppData();
    };

    const handleOnline = () => {
      void refreshAppData();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("online", handleOnline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleOnline);
    };
  }, [refreshAppData]);

  // Modal sync
  useEffect(() => {
    if (showUserLogin || showUserSignup) {
      setShowSellerLogin(false);
      setShowSellerSignup(false);
    }
  }, [showUserLogin, showUserSignup]);

  useEffect(() => {
    if (showSellerLogin || showSellerSignup) {
      setShowUserLogin(false);
      setShowUserSignup(false);
    }
  }, [showSellerLogin, showSellerSignup]);

  // Cart sync
  useEffect(() => {
    if (!user || isLoading) return;

    const timer = setTimeout(() => {
      axios.post("/api/cart/update", { cartItems }).catch(console.warn);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cartItems, user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        axios, navigate, user, setUser, seller, setSeller, isSeller, setIsSeller,
        products, categories, showUserLogin, setShowUserLogin, showUserSignup, setShowUserSignup,
        showSellerLogin, setShowSellerLogin, showSellerSignup, setShowSellerSignup,
        currency, login, signup, logout, sellerLogin, sellerSignup, sellerLogout,
        addToCart, updateCart, removeCart, clearCart, cartItems, setCartItems, getCartCount, getCartAmount,
        searchQuery, setSearchQuery, fetchProducts, fetchProduct, fetchCategories, isLoading,
        
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppContextProvider");
  return context;
};