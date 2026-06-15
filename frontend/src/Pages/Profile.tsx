// Profile.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import TransactionsTable from "@/features/transactions/components/TransactionsTable";
import { fetchUserTransactions } from "@/features/transactions/api";
import type { Transaction } from "@/features/transactions/types";

// ── Custom Colors ──────────────────────────────────────
const PRIMARY_GREEN = "#008235";
const PRIMARY_GREEN_DARK = "#00662a";
const PRIMARY_GREEN_LIGHT = "#e8f5ed";

// ── Types ──────────────────────────────────────────────
interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  joinDate?: string;
  defaultAddress?: Address;
  ordersCount?: number;
  totalSpent?: number;
}

interface Address {
  _id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}

// CORRECT — matches actual API response
interface OrderProduct {
  _id: string;
  name: string;
  category: string;
  image: string[];
  offerPrice?: number;
  price?: number;
}

interface OrderItem {
  product: OrderProduct | null | string;
  quantity: number;
}

interface Order {
  _id: string;
  paymentType: string;
  amount: number; // ✅ matches API
  status: string;
  createdAt: string;
  items: OrderItem[]; // ✅ matches API
}

type TabType = "profile" | "orders" | "transactions" | "addresses" | "settings";

// ── Icons ──────────────────────────────────────────────
const UserIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const OrdersIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const AddressIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const StarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const RefreshIcon = ({ spinning }: { spinning: boolean }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      display: "inline-block",
      animation: spinning ? "spin 0.7s linear infinite" : "none",
    }}
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

// ── Order Status Badge ─────────────────────────────────
const OrderStatusBadge = ({ status }: { status: Order["status"] }) => {
  const config: Record<
    Order["status"],
    { color: string; bg: string; label: string }
  > = {
    pending: { color: "#f59e0b", bg: "#fef3c7", label: "Pending" },
    confirmed: {
      color: PRIMARY_GREEN,
      bg: PRIMARY_GREEN_LIGHT,
      label: "Confirmed",
    },
    processing: { color: "#3b82f6", bg: "#eff6ff", label: "Processing" },
    shipped: { color: "#8b5cf6", bg: "#f3e8ff", label: "Shipped" },
    delivered: {
      color: PRIMARY_GREEN,
      bg: PRIMARY_GREEN_LIGHT,
      label: "Delivered",
    },
    cancelled: { color: "#ef4444", bg: "#fee2e2", label: "Cancelled" },
  };
  const c = config[status] ?? {
    color: "#6b7280",
    bg: "#f3f4f6",
    label: status,
  };
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ color: c.color, backgroundColor: c.bg }}
    >
      {c.label}
    </span>
  );
};

// ── Delete Confirm Modal ───────────────────────────────
const DeleteConfirmModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onClick={onCancel}
  >
    <div
      className="bg-white rounded-2xl max-w-sm w-full p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Delete Account
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Are you sure you want to delete your account? This action cannot be
        undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ── Edit Profile Modal ─────────────────────────────────
const EditProfileModal = ({
  profile,
  onClose,
  onSave,
  saving,
}: {
  profile: UserProfile;
  onClose: () => void;
  onSave: (data: Partial<UserProfile>) => void;
  saving: boolean;
}) => {
  const [formData, setFormData] = useState({
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim()) {
      toast.error("First name and email are required");
      return;
    }
    onSave(formData);
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008235] text-sm";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Edit Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: PRIMARY_GREEN }}
              onMouseEnter={(e) =>
                !saving &&
                (e.currentTarget.style.backgroundColor = PRIMARY_GREEN_DARK)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = PRIMARY_GREEN)
              }
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Toggle Switch ──────────────────────────────────────
const ToggleSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    aria-checked={checked}
    role="switch"
    className="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    style={{ backgroundColor: checked ? PRIMARY_GREEN : "#e5e7eb" }}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-5" : "translate-x-0.5"
      }`}
    />
  </button>
);

// ── Skeleton Loader ────────────────────────────────────
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// ── Main Profile Component ─────────────────────────────
const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, currency } = useAppContext();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null,
  );
  const [refreshingTransactions, setRefreshingTransactions] = useState(false);

  // ── Fetch all profile data ──────────────────────────
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [profileRes, ordersRes, transactionsRes, addressesRes] =
          await Promise.allSettled([
            axios.get("/api/user/profile"),
            axios.get("/api/order/user"),
            fetchUserTransactions(),
            axios.get("/api/address/get"),
          ]);

        if (
          profileRes.status === "fulfilled" &&
          profileRes.value.data.success
        ) {
          setProfile(profileRes.value.data.user);
        } else {
          toast.error("Failed to load profile");
        }

        if (ordersRes.status === "fulfilled" && ordersRes.value.data.success) {
          setOrders(ordersRes.value.data.orders ?? []);
        }

        if (transactionsRes.status === "fulfilled") {
          setTransactions(transactionsRes.value ?? []);
        }

        if (
          addressesRes.status === "fulfilled" &&
          addressesRes.value.data.success
        ) {
          setAddresses(addressesRes.value.data.address ?? []);
        }
      } catch {
        toast.error("Something went wrong loading your profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  // ── Handlers ───────────────────────────────────────
  const handleRefreshTransactions = async () => {
    setRefreshingTransactions(true);
    try {
      const data = await fetchUserTransactions();
      setTransactions(data ?? []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to refresh transactions");
    } finally {
      setTimeout(() => setRefreshingTransactions(false), 600);
    }
  };

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    try {
      setSaving(true);
      const response = await axios.put("/api/user/profile", data);
      if (response.data.success) {
        setProfile(response.data.user);
        toast.success("Profile updated successfully");
        setShowEditModal(false);
      } else {
        toast.error(response.data.message ?? "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      setDeletingAddressId(id);
      await axios.delete(`/api/address/delete/${id}`);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteConfirm(false);
    toast.error("Account deletion not implemented yet");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      toast.error("Logout failed, please try again");
    }
  };

  const getInitials = (p: UserProfile) => {
    const first = p.firstName?.[0]?.toUpperCase() ?? "";
    const last = p.lastName?.[0]?.toUpperCase() ?? "";
    return first + last || "?";
  };

  const formatJoinDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatOrderDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ── Loading State ──────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-lg" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl p-6 space-y-5">
                <Skeleton className="h-6 w-48" />
                <div className="grid sm:grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-3 w-20 mb-2" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Not Logged In ──────────────────────────────────
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <UserIcon />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            Not logged in
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Please login to view your profile
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 text-white rounded-lg transition-colors text-sm font-medium"
            style={{ backgroundColor: PRIMARY_GREEN }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = PRIMARY_GREEN_DARK)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = PRIMARY_GREEN)
            }
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const tabs: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    { id: "profile", label: "Profile", icon: <UserIcon /> },
    {
      id: "orders",
      label: "My Orders",
      icon: <OrdersIcon />,
      badge: orders.length,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: <OrdersIcon />,
      badge: transactions.length,
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: <AddressIcon />,
      badge: addresses.length,
    },
    { id: "settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  return (
    <>
      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className="min-h-screen bg-gray-100 pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">My Account</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your profile, orders and addresses
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* ── Sidebar ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-24">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-base font-bold flex-shrink-0"
                      style={{ color: PRIMARY_GREEN }}
                    >
                      {getInitials(profile)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                        activeTab === tab.id
                          ? "text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      style={
                        activeTab === tab.id
                          ? { backgroundColor: PRIMARY_GREEN }
                          : {}
                      }
                    >
                      <div className="flex items-center gap-2">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            activeTab === tab.id
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  ))}

                  <hr className="my-2 border-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogoutIcon />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Main Content ── */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Profile Information
                      </h2>
                      <p className="text-sm text-gray-500">
                        View and edit your personal details
                      </p>
                    </div>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                      style={{ color: PRIMARY_GREEN }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          PRIMARY_GREEN_LIGHT)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <EditIcon /> Edit
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">
                          First Name
                        </label>
                        <p className="text-base font-medium text-gray-900 mt-1">
                          {profile.firstName || "—"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">
                          Last Name
                        </label>
                        <p className="text-base font-medium text-gray-900 mt-1">
                          {profile.lastName || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">
                          Email Address
                        </label>
                        <p className="text-base font-medium text-gray-900 mt-1 break-all">
                          {profile.email || "—"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">
                          Phone Number
                        </label>
                        <p className="text-base font-medium text-gray-900 mt-1">
                          {profile.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">
                          Member Since
                        </label>
                        <div className="flex items-center gap-1.5 mt-1">
                          <CalendarIcon />
                          <p className="text-base font-medium text-gray-900">
                            {formatJoinDate(profile.joinDate)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">
                          Total Spent
                        </label>
                        <p className="text-base font-medium text-gray-900">
                          {currency}
                          {profile.totalSpent?.toLocaleString() ?? "0"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="bg-gray-50 p-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      Account Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                        <p
                          className="text-2xl font-bold"
                          style={{ color: PRIMARY_GREEN }}
                        >
                          {orders.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Total Orders
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                        <div
                          className="flex items-center justify-center gap-0.5"
                          style={{ color: PRIMARY_GREEN }}
                        >
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon key={i} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">5.0 Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                      My Orders
                    </h2>
                    <p className="text-sm text-gray-500">
                      Track and manage your orders
                    </p>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                      <div className="px-6 py-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                          <OrdersIcon />
                        </div>
                        <p className="text-gray-500 mb-2 text-sm">
                          No orders yet
                        </p>
                        <button
                          onClick={() => navigate("/products")}
                          className="text-sm font-medium"
                          style={{ color: PRIMARY_GREEN }}
                        >
                          Start Shopping →
                        </button>
                      </div>
                    ) : (
                      orders.map((order) => {
                        const validItems =
                          order.items?.filter(
                            (item) =>
                              item?.product && typeof item.product !== "string",
                          ) ?? [];

                        return (
                          <div
                            key={order._id}
                            className="p-5 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                              <div>
                                {/* ✅ use _id instead of orderId */}
                                <p className="text-sm font-semibold text-gray-900">
                                  Order #{order._id.slice(-8).toUpperCase()}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {formatOrderDate(order.createdAt)}
                                </p>
                              </div>
                              <OrderStatusBadge
                                status={order.status as Order["status"]}
                              />
                            </div>

                            <div className="space-y-2">
                              {validItems.slice(0, 2).map((item, idx) => {
                                const product = item.product as OrderProduct;
                                const price =
                                  product.offerPrice ?? product.price ?? 0;
                                return (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-gray-600 truncate pr-4">
                                      {/* ✅ product.name, not item.name */}
                                      {product.name} ×{item.quantity}
                                    </span>
                                    <span className="font-medium flex-shrink-0">
                                      {currency}
                                      {(price * item.quantity).toLocaleString()}
                                    </span>
                                  </div>
                                );
                              })}
                              {validItems.length > 2 && (
                                <p className="text-xs text-gray-400">
                                  +{validItems.length - 2} more items
                                </p>
                              )}
                            </div>

                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                              <span className="text-sm font-semibold text-gray-900">
                                {/* ✅ amount not total */}
                                Total: {currency}
                                {(order.amount ?? 0).toLocaleString()}
                              </span>
                              <button
                                onClick={() => navigate(`/my-orders/`)}
                                className="text-xs font-medium flex items-center gap-1"
                                style={{ color: PRIMARY_GREEN }}
                              >
                                View Details <ChevronRight />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Transactions Tab */}
              {activeTab === "transactions" && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Transactions
                      </h2>
                      <p className="text-sm text-gray-500">
                        View all your payment transactions
                      </p>
                    </div>

                    <button
                      onClick={handleRefreshTransactions}
                      disabled={refreshingTransactions || loading}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshIcon spinning={refreshingTransactions} />
                      Refresh
                    </button>
                  </div>

                  <div className="p-6">
                    {refreshingTransactions ? (
                      <div className="py-8 text-center text-sm text-gray-400">
                        Refreshing transactions…
                      </div>
                    ) : (
                      <TransactionsTable
                        transactions={transactions}
                        currency={currency}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Saved Addresses
                      </h2>
                      <p className="text-sm text-gray-500">
                        Manage your delivery addresses
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/add-address")}
                      className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors"
                      style={{ backgroundColor: PRIMARY_GREEN }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          PRIMARY_GREEN_DARK)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = PRIMARY_GREEN)
                      }
                    >
                      + Add New
                    </button>
                  </div>

                  <div className="p-6">
                    {addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                          <AddressIcon />
                        </div>
                        <p className="text-gray-500 mb-2 text-sm">
                          No saved addresses
                        </p>
                        <button
                          onClick={() => navigate("/add-address")}
                          className="text-sm font-medium"
                          style={{ color: PRIMARY_GREEN }}
                        >
                          Add your first address →
                        </button>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <div
                            key={address._id}
                            className="border rounded-lg p-4 relative transition-shadow hover:shadow-sm"
                            style={{
                              borderColor: address.isDefault
                                ? PRIMARY_GREEN
                                : "#e5e7eb",
                            }}
                          >
                            {address.isDefault && (
                              <span
                                className="absolute -top-2 left-4 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                                style={{ backgroundColor: PRIMARY_GREEN }}
                              >
                                Default
                              </span>
                            )}
                            <p className="font-semibold text-gray-900 mt-1">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {address.street}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} -{" "}
                              {address.pincode}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.country}
                            </p>
                            <div className="flex gap-3 mt-3 pt-2 border-t border-gray-50">
                              <button
                                onClick={() =>
                                  navigate(`/edit-address/${address._id}`)
                                }
                                className="text-xs font-medium"
                                style={{ color: PRIMARY_GREEN }}
                              >
                                Edit
                              </button>
                              {!address.isDefault && (
                                <button
                                  disabled={deletingAddressId === address._id}
                                  className="text-xs text-red-500 font-medium disabled:opacity-50"
                                  onClick={() =>
                                    handleDeleteAddress(address._id)
                                  }
                                >
                                  {deletingAddressId === address._id
                                    ? "Deleting…"
                                    : "Delete"}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Account Settings
                    </h2>
                    <p className="text-sm text-gray-500">
                      Manage your account preferences
                    </p>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <div className="p-6 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          Email Notifications
                        </p>
                        <p className="text-sm text-gray-500">
                          Receive order updates and promotions
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications((prev) => !prev)}
                      />
                    </div>

                    <div className="p-6 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">SMS Alerts</p>
                        <p className="text-sm text-gray-500">
                          Get delivery updates via text
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={smsAlerts}
                        onChange={() => setSmsAlerts((prev) => !prev)}
                      />
                    </div>

                    <div className="p-6">
                      <p className="font-medium text-gray-900 mb-1">
                        Delete Account
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        Permanently remove your account and all data. This
                        cannot be undone.
                      </p>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Modals ── */}
        {showEditModal && (
          <EditProfileModal
            profile={profile}
            onClose={() => !saving && setShowEditModal(false)}
            onSave={handleUpdateProfile}
            saving={saving}
          />
        )}

        {showDeleteConfirm && (
          <DeleteConfirmModal
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </div>
    </>
  );
};

export default Profile;
