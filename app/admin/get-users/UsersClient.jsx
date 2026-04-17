"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown, ChevronRight, Calendar, DollarSign, Tag,
  Home, Check, X, Clock, Trash2, Search, SlidersHorizontal,
  ArrowUpDown, RotateCcw, Users, Phone, Mail, ShieldCheck, KeyRound,
} from "lucide-react";
import { formatDateShort } from "../../utils/formatDate";

/* ─────────────────────────────────────────────────────────────────────────────
   UserRow — expandable row showing one user and all their bookings
───────────────────────────────────────────────────────────────────────────── */
const UserRow = ({ user, onApprovalChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApproval = async (bookingId, status) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        alert(`Failed to update booking status: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();
      alert(data.message || "Booking status updated successfully");
      if (onApprovalChange) onApprovalChange();
    } catch (error) {
      console.error("Error updating booking:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (loading) return;
    if (!confirm("Are you sure you want to delete this booking? This action cannot be undone.")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users?bookingId=${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        alert(`Failed to delete booking: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();
      alert(data.message || "Booking deleted successfully");
      if (onApprovalChange) onApprovalChange();
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { bg: "bg-emerald-50", text: "text-emerald-900", icon: Check, label: "Approved" },
      rejected: { bg: "bg-red-50", text: "text-red-800", icon: X, label: "Rejected" },
      pending: { bg: "bg-amber-50", text: "text-amber-950", icon: Clock, label: "Pending" },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 ${badge.bg} ${badge.text} rounded-full text-xs font-medium`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const providerBadge = user.provider === "google"
    ? <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200"><ShieldCheck className="h-3 w-3" />Google</span>
    : <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-purple-200"><KeyRound className="h-3 w-3" />Password</span>;

  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-luxury-stone/80 bg-white/95 shadow-glass transition-all duration-200 hover:shadow-luxury">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-luxury-sand/50"
      >
        <div className="flex flex-1 items-center gap-4 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-luxury-black font-semibold text-luxury-gold-light">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="text-left min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-luxury-black truncate">{user.name}</h3>
              {providerBadge}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
              <p className="flex items-center gap-1 text-xs text-luxury-charcoal/60">
                <Mail className="h-3 w-3 shrink-0" />{user.email}
              </p>
              {user.phone && (
                <p className="flex items-center gap-1 text-xs text-luxury-charcoal/60">
                  <Phone className="h-3 w-3 shrink-0" />{user.phone}
                </p>
              )}
              {!user.phone && (
                <p className="flex items-center gap-1 text-xs text-amber-600">
                  <Phone className="h-3 w-3 shrink-0" />No phone
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4 ml-2">
          <span className="rounded-full bg-luxury-gold/15 px-3 py-1 text-sm font-medium text-luxury-gold-dark ring-1 ring-luxury-gold/25">
            {user.bookings?.length || 0} {user.bookings?.length === 1 ? "Booking" : "Bookings"}
          </span>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-luxury-charcoal/45" />
          ) : (
            <ChevronRight className="h-5 w-5 text-luxury-charcoal/45" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-luxury-stone/60 bg-luxury-sand/40 px-6 py-4">
          {!user.bookings || user.bookings.length === 0 ? (
            <div className="py-8 text-center text-luxury-charcoal/60">
              <Home className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>No bookings found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-xl border border-luxury-stone/80 bg-white/95 p-4 shadow-sm transition hover:border-luxury-gold/30"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <Home className="mt-0.5 h-5 w-5 flex-shrink-0 text-luxury-gold-dark" />
                        <div>
                          <p className="font-semibold text-luxury-black">{booking.productName || "N/A"}</p>
                          {booking.resortRoom?._id && (
                            <p className="mt-0.5 text-xs text-luxury-charcoal/55">Room ID: {booking.resortRoom._id}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                        <button
                          type="button"
                          onClick={() => handleDelete(booking._id)}
                          disabled={loading}
                          className="rounded-lg p-2 text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                          title="Delete booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 border-t border-luxury-stone/50 pt-2 md:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
                          <DollarSign className="h-4 w-4 text-emerald-800" />
                        </div>
                        <div>
                          <p className="text-xs text-luxury-charcoal/55">Price</p>
                          <p className="font-semibold text-luxury-black">₹{booking.price || 0}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-luxury-sand ring-1 ring-luxury-stone/60">
                          <Tag className="h-4 w-4 text-luxury-gold-dark" />
                        </div>
                        <div>
                          <p className="text-xs text-luxury-charcoal/55">Offer</p>
                          <p className="font-semibold text-luxury-black">{booking.offer || "None"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-luxury-gold/15 ring-1 ring-luxury-gold/25">
                          <Calendar className="h-4 w-4 text-luxury-gold-dark" />
                        </div>
                        <div>
                          <p className="text-xs text-luxury-charcoal/55">Duration</p>
                          <p className="text-sm font-medium text-luxury-black">
                            {booking.startDate && booking.endDate ? (
                              <>
                                {formatDateShort(booking.startDate)}
                                {" – "}
                                {formatDateShort(booking.endDate)}
                              </>
                            ) : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-luxury-stone/50 pt-3">
                      <button
                        type="button"
                        onClick={() => handleApproval(booking._id, "approved")}
                        disabled={loading || booking.status === "approved"}
                        className="flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2 font-medium text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        {booking.status === "approved" ? "Approved" : "Approve"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproval(booking._id, "rejected")}
                        disabled={loading || booking.status === "rejected"}
                        className="flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2 font-medium text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        {booking.status === "rejected" ? "Rejected" : "Reject"}
                      </button>
                      {(booking.status === "approved" || booking.status === "rejected") && (
                        <button
                          type="button"
                          onClick={() => handleApproval(booking._id, "pending")}
                          disabled={loading}
                          className="flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl bg-luxury-gold px-4 py-2 font-medium text-luxury-black transition hover:bg-luxury-gold-light disabled:opacity-50"
                        >
                          <Clock className="h-4 w-4" />
                          Reset to Pending
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   UsersClient — main panel with search + filters
───────────────────────────────────────────────────────────────────────────── */
const UsersClient = ({ users: initialUsers }) => {
  const [users] = useState(initialUsers);

  // Filter / search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvider, setFilterProvider] = useState("all");   // all | google | credentials
  const [filterBookingStatus, setFilterBookingStatus] = useState("all"); // all | has-pending | has-approved | has-rejected | no-bookings
  const [sortBy, setSortBy] = useState("default"); // default | name-asc | name-desc | bookings-desc | bookings-asc
  const [showFilters, setShowFilters] = useState(false);

  const refreshUsers = () => window.location.reload();

  const clearFilters = () => {
    setSearchTerm("");
    setFilterProvider("all");
    setFilterBookingStatus("all");
    setSortBy("default");
  };

  const hasActiveFilters =
    searchTerm ||
    filterProvider !== "all" ||
    filterBookingStatus !== "all" ||
    sortBy !== "default";

  // ─── Derived filtered + sorted list ───────────────────────────────────────
  const filteredUsers = useMemo(() => {
    return users
      ?.filter((user) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          !q ||
          user.name?.toLowerCase().includes(q) ||
          user.email?.toLowerCase().includes(q) ||
          user.phone?.toLowerCase().includes(q);

        const matchesProvider =
          filterProvider === "all" ||
          user.provider === filterProvider;

        const bookings = user.bookings || [];
        const matchesBookingStatus =
          filterBookingStatus === "all" ? true
          : filterBookingStatus === "no-bookings" ? bookings.length === 0
          : filterBookingStatus === "has-pending" ? bookings.some((b) => b.status === "pending" || !b.status)
          : filterBookingStatus === "has-approved" ? bookings.some((b) => b.status === "approved")
          : filterBookingStatus === "has-rejected" ? bookings.some((b) => b.status === "rejected")
          : true;

        return matchesSearch && matchesProvider && matchesBookingStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") return a.name?.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name?.localeCompare(a.name);
        if (sortBy === "bookings-desc") return (b.bookings?.length || 0) - (a.bookings?.length || 0);
        if (sortBy === "bookings-asc") return (a.bookings?.length || 0) - (b.bookings?.length || 0);
        return 0;
      }) ?? [];
  }, [users, searchTerm, filterProvider, filterBookingStatus, sortBy]);

  // ─── Stats ──────────────────────────────────────────────────────────────
  const totalBookings = users?.reduce((s, u) => s + (u.bookings?.length || 0), 0) ?? 0;
  const pendingCount = users?.reduce(
    (s, u) => s + (u.bookings?.filter((b) => b.status === "pending" || !b.status).length || 0), 0
  ) ?? 0;
  const googleCount = users?.filter((u) => u.provider === "google").length ?? 0;

  return (
    <div className="min-h-screen bg-luxury-cream px-2 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        {/* Back link */}
        <div className="mb-4">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 rounded-2xl border border-luxury-stone bg-white/95 px-4 py-2 font-medium text-luxury-black shadow-sm transition hover:border-luxury-gold/40 hover:bg-luxury-sand/50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin Dashboard
          </a>
        </div>

        {/* ── Header + Stats ── */}
        <div className="mb-6 rounded-2xl border border-luxury-stone/80 bg-white/95 p-6 shadow-glass">
          <h1 className="mb-1 font-display text-3xl font-semibold text-luxury-black">User Management</h1>
          <p className="text-luxury-charcoal/75">View user details and manage their booking requests</p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Users", value: users?.length ?? 0, icon: Users, color: "text-luxury-black" },
              { label: "Total Bookings", value: totalBookings, icon: Home, color: "text-luxury-black" },
              { label: "Pending Approvals", value: pendingCount, icon: Clock, color: "text-amber-700" },
              { label: "Google Sign-ins", value: googleCount, icon: ShieldCheck, color: "text-blue-700" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-luxury-stone/60 bg-luxury-sand/40 px-4 py-3">
                <Icon className={`h-5 w-5 shrink-0 ${color}`} />
                <div>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-luxury-charcoal/60">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Search & Filter Panel ── */}
        <div className="mb-5 rounded-2xl border border-luxury-stone/80 bg-white/95 p-5 shadow-glass">
          {/* Row 1: Search + Filters toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-charcoal/45" />
              <input
                type="text"
                placeholder="Search by name, email or phone…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="luxury-input pl-10 pr-10"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-charcoal/40 hover:text-luxury-black"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filters toggle */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
                showFilters || hasActiveFilters
                  ? "border-luxury-gold/50 bg-luxury-gold/10 text-luxury-gold-dark"
                  : "border-luxury-stone bg-luxury-sand/80 text-luxury-black hover:bg-luxury-stone/60"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold text-xs font-bold text-luxury-black">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Row 2: Expanded filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-luxury-stone/60 pt-4 sm:grid-cols-3">
              {/* Provider */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-luxury-charcoal/60">
                  Login Method
                </label>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-luxury-gold-dark shrink-0" />
                  <select
                    value={filterProvider}
                    onChange={(e) => setFilterProvider(e.target.value)}
                    className="luxury-input py-2 flex-1"
                  >
                    <option value="all">All Methods</option>
                    <option value="google">Google Sign-in</option>
                    <option value="credentials">Email & Password</option>
                  </select>
                </div>
              </div>

              {/* Booking Status */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-luxury-charcoal/60">
                  Booking Status
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-luxury-gold-dark shrink-0" />
                  <select
                    value={filterBookingStatus}
                    onChange={(e) => setFilterBookingStatus(e.target.value)}
                    className="luxury-input py-2 flex-1"
                  >
                    <option value="all">All Users</option>
                    <option value="has-pending">Has Pending Bookings</option>
                    <option value="has-approved">Has Approved Bookings</option>
                    <option value="has-rejected">Has Rejected Bookings</option>
                    <option value="no-bookings">No Bookings</option>
                  </select>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-luxury-charcoal/60">
                  Sort By
                </label>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-luxury-gold-dark shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="luxury-input py-2 flex-1"
                  >
                    <option value="default">Default</option>
                    <option value="name-asc">Name A → Z</option>
                    <option value="name-desc">Name Z → A</option>
                    <option value="bookings-desc">Most Bookings</option>
                    <option value="bookings-asc">Fewest Bookings</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Result count + Clear */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-luxury-charcoal/60">
              Showing{" "}
              <span className="font-semibold text-luxury-black">{filteredUsers.length}</span>
              {" "}of{" "}
              <span className="font-semibold text-luxury-black">{users?.length ?? 0}</span> users
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* ── User List ── */}
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="rounded-2xl border border-luxury-stone/80 bg-white/95 p-12 text-center shadow-glass">
              <Users className="mx-auto mb-3 h-12 w-12 text-luxury-charcoal/25" />
              <p className="text-lg font-semibold text-luxury-charcoal/65">No users match your filters</p>
              <p className="mt-1 text-sm text-luxury-charcoal/45">Try adjusting the search or filter criteria</p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-luxury-gold px-5 py-2 text-sm font-bold text-luxury-black transition hover:bg-luxury-gold-light"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <UserRow key={user._id} user={user} onApprovalChange={refreshUsers} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersClient;
