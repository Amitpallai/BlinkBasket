import React from "react";
import { useAppContext } from "../../context/AppContext";
import { NavLink, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

interface SidebarLink {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const PlusIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const OrdersIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const TransactionsIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h10M4 17h7M19 17l2 2 3-3" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const SellerLayout: React.FC = () => {
  const { axios, navigate } = useAppContext();

  const sidebarLinks: SidebarLink[] = [
    { name: "Add Product", path: "/seller", icon: <PlusIcon /> },
    { name: "Product List", path: "/seller/product-list", icon: <ListIcon /> },
    { name: "Orders", path: "/seller/orders", icon: <OrdersIcon /> },
    { name: "Transactions", path: "/seller/transactions", icon: <TransactionsIcon /> },
  ];

  const logout = async (): Promise<void> => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#1a1a1a]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        .seller-shell {
          font-family: 'DM Sans', sans-serif;
        }

        .seller-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          background: #ffffff;
          border-bottom: 1px solid #e8e8e4;
        }

        .seller-body {
          display: flex;
          padding-top: 56px;
          min-height: 100vh;
        }

        .seller-sidebar {
          position: fixed;
          top: 56px;
          left: 0;
          width: 200px;
          height: calc(100vh - 56px);
          background: #ffffff;
          border-right: 1px solid #e8e8e4;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .seller-content {
          margin-left: 200px;
          flex: 1;
          min-height: calc(100vh - 56px);
          padding: 32px;
        }

        @media (max-width: 768px) {
          .seller-sidebar {
            width: 52px;
            padding: 16px 0;
          }
          .seller-content {
            margin-left: 52px;
            padding: 20px 16px;
          }
        }
      `}</style>

      <div className="seller-shell">
        <nav className="seller-nav">
          <NavLink to="/" className="flex items-center gap-2 text-none">
            <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
            <span className="font-mono text-[13px] font-medium tracking-[0.08em] uppercase">
              Grocery Mart
            </span>
          </NavLink>

          <button onClick={logout} className="flex items-center gap-2">
            <LogoutIcon />
            Logout
          </button>
        </nav>

        <div className="seller-body">
          <aside className="seller-sidebar">
            <div className="px-5 pb-2 text-[10px] font-medium tracking-[0.12em] uppercase text-[#aaa] font-mono">
              Menu
            </div>

            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.name}
                end={item.path === "/seller"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 py-2.5 text-[13.5px] border-l-2 transition ${
                    isActive
                      ? "text-[#1a1a1a] font-medium border-l-[#1a1a1a] bg-[#f2f2ef]"
                      : "text-[#666] border-l-transparent hover:text-[#1a1a1a] hover:bg-[#f7f7f5]"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </aside>

          <main className="seller-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;