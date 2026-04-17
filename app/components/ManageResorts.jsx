"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Edit, Trash2, Eye, EyeOff,
  Search, Filter, CheckSquare, Square, X,
  SlidersHorizontal, ArrowUpDown, IndianRupee, RotateCcw, MapPin
} from "lucide-react";
import BackButton from "./ui/BackButton";

const ManageResorts = () => {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailable, setFilterAvailable] = useState("all");
  const [selectedResorts, setSelectedResorts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [editingResort, setEditingResort] = useState(null);

  // New filter states
  const [sortBy, setSortBy] = useState("default");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch resorts
  useEffect(() => {
    fetchResorts();
  }, []);

  const fetchResorts = async () => {
    try {
      const response = await fetch("/api/admin/add-product");
      const data = await response.json();
      if (data.success) {
        setResorts(data.products);
      }
    } catch (error) {
      console.error("Error fetching resorts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete single resort
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resort?")) return;

    try {
      const response = await fetch(`/api/admin/product/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        alert("Resort deleted successfully!");
        fetchResorts();
      } else {
        alert("Failed to delete resort");
      }
    } catch (error) {
      console.error("Error deleting resort:", error);
      alert("Error deleting resort");
    }
  };

  // Toggle availability
  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/product/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !currentStatus }),
      });
      const data = await response.json();

      if (data.success) {
        fetchResorts();
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedResorts.length} resorts?`)) return;

    try {
      const response = await fetch("/api/admin/product/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedResorts }),
      });
      const data = await response.json();

      if (data.success) {
        alert(`${data.deletedCount} resorts deleted!`);
        setSelectedResorts([]);
        fetchResorts();
      }
    } catch (error) {
      console.error("Error bulk deleting:", error);
    }
  };

  // Bulk price update
  const handleBulkPriceUpdate = async () => {
    const percentage = prompt("Enter percentage to increase/decrease price (e.g., 10 or -10):");
    if (!percentage) return;

    try {
      const response = await fetch("/api/admin/product/bulk-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedResorts,
          percentage: parseFloat(percentage)
        }),
      });
      const data = await response.json();

      if (data.success) {
        alert("Prices updated successfully!");
        fetchResorts();
      }
    } catch (error) {
      console.error("Error updating prices:", error);
    }
  };

  // Select/deselect resort
  const toggleSelectResort = (id) => {
    setSelectedResorts(prev =>
      prev.includes(id)
        ? prev.filter(resortId => resortId !== id)
        : [...prev, id]
    );
  };

  // Select all visible
  const toggleSelectAll = () => {
    if (selectedResorts.length === filteredResorts.length) {
      setSelectedResorts([]);
    } else {
      setSelectedResorts(filteredResorts.map(r => r._id));
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterAvailable("all");
    setSortBy("default");
    setPriceMin("");
    setPriceMax("");
  };

  const hasActiveFilters =
    searchTerm || filterAvailable !== "all" || sortBy !== "default" || priceMin || priceMax;

  // ─── Filter + Sort pipeline ───────────────────────────────────────────────
  const filteredResorts = resorts
    .filter((resort) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        resort.title?.toLowerCase().includes(q) ||
        resort.address?.toLowerCase().includes(q) ||
        resort.desc?.toLowerCase().includes(q);

      const matchesAvailability =
        filterAvailable === "all"
          ? true
          : filterAvailable === "available"
            ? resort.available !== false
            : resort.available === false;

      const price = Number(resort.price) || 0;
      const matchesMin = priceMin === "" || price >= Number(priceMin);
      const matchesMax = priceMax === "" || price <= Number(priceMax);

      return matchesSearch && matchesAvailability && matchesMin && matchesMax;
    })
    .sort((a, b) => {
      if (sortBy === "name-asc") return a.title?.localeCompare(b.title);
      if (sortBy === "name-desc") return b.title?.localeCompare(a.title);
      if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
      if (sortBy === "available-first") return (b.available !== false ? 1 : 0) - (a.available !== false ? 1 : 0);
      return 0;
    });

  useEffect(() => {
    setShowBulkActions(selectedResorts.length > 0);
  }, [selectedResorts]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-luxury-cream">
        <div className="text-lg text-luxury-charcoal/70">Loading resorts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-cream px-2 py-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-luxury-black sm:text-4xl">Manage Resorts</h1>
            <p className="mt-2 text-luxury-charcoal/70">
              <span className="font-semibold text-luxury-black">{resorts.length}</span> total ·{" "}
              <span className="font-semibold text-luxury-gold-dark">{filteredResorts.length}</span> shown
            </p>
          </div>
          <div className="flex items-center gap-3">
            <BackButton href="/admin" label="Back to Console" />
          </div>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="mb-4 rounded-2xl border border-luxury-stone/80 bg-white/95 p-5 shadow-glass">
          {/* Row 1: Search + Toggle Filters + Select All */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-charcoal/45" />
              <input
                type="text"
                placeholder="Search by name, address or description…"
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

            {/* Toggle extra filters */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${showFilters || hasActiveFilters
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

            {/* Select All */}
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center justify-center gap-2 rounded-2xl border border-luxury-stone bg-luxury-sand/80 px-4 py-2.5 text-sm font-semibold text-luxury-black transition hover:bg-luxury-stone/80"
            >
              {selectedResorts.length === filteredResorts.length && filteredResorts.length > 0 ? (
                <CheckSquare className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              Select All
            </button>
          </div>

          {/* Row 2: Expanded Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-luxury-stone/60 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Availability */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-luxury-charcoal/60">
                  Availability
                </label>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-luxury-gold-dark shrink-0" />
                  <select
                    value={filterAvailable}
                    onChange={(e) => setFilterAvailable(e.target.value)}
                    className="luxury-input py-2 flex-1"
                  >
                    <option value="all">All Resorts</option>
                    <option value="available">Available Only</option>
                    <option value="unavailable">Unavailable Only</option>
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
                    <option value="default">Default Order</option>
                    <option value="name-asc">Name A → Z</option>
                    <option value="name-desc">Name Z → A</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="available-first">Available First</option>
                  </select>
                </div>
              </div>

              {/* Min Price */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-luxury-charcoal/60">
                  Min Price (₹)
                </label>
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-luxury-gold-dark shrink-0" />
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="luxury-input py-2 flex-1"
                  />
                </div>
              </div>

              {/* Max Price */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-luxury-charcoal/60">
                  Max Price (₹)
                </label>
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-luxury-gold-dark shrink-0" />
                  <input
                    type="number"
                    min="0"
                    placeholder="No limit"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="luxury-input py-2 flex-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Clear filters */}
          {hasActiveFilters && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl border border-luxury-gold/40 bg-luxury-black p-4 text-white shadow-luxury">
            <div className="flex items-center gap-3">
              <div className="bg-luxury-gold/20 p-2 rounded-lg">
                <CheckSquare className="w-5 h-5 text-luxury-gold-light" />
              </div>
              <span className="font-medium">{selectedResorts.length} properties selected</span>
            </div>
            <div className="flex w-full md:w-auto items-center gap-3">
              <button
                onClick={handleBulkPriceUpdate}
                className="flex-1 md:flex-none rounded-xl bg-luxury-gold px-4 py-2 text-sm font-bold text-luxury-black transition hover:bg-luxury-gold-light"
              >
                Update Price
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex-1 md:flex-none rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedResorts([])}
                className="rounded-lg p-2 transition hover:bg-white/10"
                aria-label="Clear selection"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Resort Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResorts.map((resort) => (
            <ResortCard
              key={resort._id}
              resort={resort}
              isSelected={selectedResorts.includes(resort._id)}
              onToggleSelect={() => toggleSelectResort(resort._id)}
              onDelete={() => handleDelete(resort._id)}
              onToggleAvailability={() => handleToggleAvailability(resort._id, resort.available)}
              onEdit={() => setEditingResort(resort)}
            />
          ))}
        </div>

        {filteredResorts.length === 0 && (
          <div className="rounded-2xl border border-luxury-stone/80 bg-white/95 p-12 text-center shadow-glass">
            <Search className="mx-auto mb-3 h-12 w-12 text-luxury-charcoal/25" />
            <p className="text-lg font-semibold text-luxury-charcoal/65">No resorts match your filters</p>
            <p className="mt-1 text-sm text-luxury-charcoal/45">Try adjusting your search or filters</p>
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
        )}
      </div>

      {/* Edit Modal */}
      {editingResort && (
        <EditResortModal
          resort={editingResort}
          onClose={() => setEditingResort(null)}
          onSave={() => {
            setEditingResort(null);
            fetchResorts();
          }}
        />
      )}
    </div>
  );
};

// Resort Card Component
const ResortCard = ({ resort, isSelected, onToggleSelect, onDelete, onToggleAvailability, onEdit }) => {
  return (
    <div className={`overflow-hidden rounded-2xl border border-luxury-stone/80 bg-white/95 shadow-glass transition-all duration-200 hover:shadow-luxury ${isSelected ? 'ring-2 ring-luxury-gold' : ''}`}>
      {/* Image */}
      <div className="relative h-48">
        <Image
          src={resort.image || '/placeholder.jpg'}
          alt={resort.title}
          fill
          className="object-cover"
        />

        {/* Select Checkbox */}
        <button
          onClick={onToggleSelect}
          className="absolute left-3 top-3 rounded-lg bg-white/95 p-2 shadow-md transition hover:bg-luxury-sand"
        >
          {isSelected ? (
            <CheckSquare className="h-5 w-5 text-luxury-gold-dark" />
          ) : (
            <Square className="h-5 w-5 text-luxury-charcoal/40" />
          )}
        </button>

        {/* Availability Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${resort.available !== false ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
          {resort.available !== false ? 'Available' : 'Unavailable'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 truncate font-display text-lg font-semibold text-luxury-black">{resort.title}</h3>

        {resort.address && (
          <div className="mb-2 flex items-center gap-1.5 text-xs text-luxury-charcoal/60">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-luxury-gold-dark" />
            <span className="truncate">{resort.address}</span>
          </div>
        )}

        <div className="mb-4 space-y-1">
          <p className="text-2xl font-bold text-luxury-black">₹{resort.price}</p>
          {resort.pricing?.weekendFullDay && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-medium text-amber-700">
                WE 24hr: ₹{resort.pricing.weekendFullDay.toLocaleString()}
              </span>
              {resort.pricing.weekendHalfDay && (
                <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-medium text-amber-700">
                  WE 12hr: ₹{resort.pricing.weekendHalfDay.toLocaleString()}
                </span>
              )}
              {resort.pricing.weekdayFullDay && (
                <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs font-medium text-blue-700">
                  WD 24hr: ₹{resort.pricing.weekdayFullDay.toLocaleString()}
                </span>
              )}
              {resort.pricing.weekdayHalfDay && (
                <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs font-medium text-blue-700">
                  WD 12hr: ₹{resort.pricing.weekdayHalfDay.toLocaleString()}
                </span>
              )}
            </div>
          )}
          {resort.offer && (
            <p className="text-sm font-medium text-emerald-700">{resort.offer}</p>
          )}
          <p className="line-clamp-2 text-sm text-luxury-charcoal/75">{resort.desc}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-luxury-black px-3 py-2 text-white transition hover:bg-luxury-charcoal"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={onToggleAvailability}
            className="rounded-xl border border-luxury-stone bg-luxury-sand/80 px-3 py-2 text-luxury-black transition hover:bg-luxury-stone/80"
            title={resort.available !== false ? "Mark Unavailable" : "Mark Available"}
          >
            {resort.available !== false ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl bg-red-50 px-3 py-2 text-red-700 transition hover:bg-red-100"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Modal Component
const EditResortModal = ({ resort, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: resort.title,
    price: resort.price,
    offer: resort.offer || "",
    desc: resort.desc || "",
    amen: Array.isArray(resort.amen) ? resort.amen.join(", ") : resort.amen || "",
    address: resort.address || "",
    latitude: resort.latitude || "",
    longitude: resort.longitude || "",
    available: resort.available !== false,
    // Per-resort pricing
    "pricing.weekendFullDay": resort.pricing?.weekendFullDay ?? "",
    "pricing.weekendHalfDay": resort.pricing?.weekendHalfDay ?? "",
    "pricing.weekdayFullDay": resort.pricing?.weekdayFullDay ?? "",
    "pricing.weekdayHalfDay": resort.pricing?.weekdayHalfDay ?? "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build the payload — convert nested pricing keys back to an object
      const payload = {
        title: formData.title,
        price: formData.price,
        offer: formData.offer,
        desc: formData.desc,
        amen: formData.amen,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        available: formData.available,
        pricing: {
          weekendFullDay: formData["pricing.weekendFullDay"] !== "" ? parseFloat(formData["pricing.weekendFullDay"]) : null,
          weekendHalfDay: formData["pricing.weekendHalfDay"] !== "" ? parseFloat(formData["pricing.weekendHalfDay"]) : null,
          weekdayFullDay: formData["pricing.weekdayFullDay"] !== "" ? parseFloat(formData["pricing.weekdayFullDay"]) : null,
          weekdayHalfDay: formData["pricing.weekdayHalfDay"] !== "" ? parseFloat(formData["pricing.weekdayHalfDay"]) : null,
        },
      };
      const response = await fetch(`/api/admin/product/${resort._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        alert("Resort updated successfully!");
        onSave();
      } else {
        alert("Failed to update resort");
      }
    } catch (error) {
      console.error("Error updating resort:", error);
      alert("Error deleting resort");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-luxury-stone/80 bg-white/95 shadow-luxury">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-luxury-black">Edit Resort</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 transition hover:bg-luxury-sand"
            >
              <X className="h-6 w-6 text-luxury-charcoal" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="luxury-label">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="luxury-input"
                  required
                />
              </div>

              <div>
                <label className="luxury-label">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="luxury-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="luxury-label">Address (Compulsory)</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="luxury-input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="luxury-label">Latitude (Optional)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="luxury-input"
                />
              </div>
              <div>
                <label className="luxury-label">Longitude (Optional)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="luxury-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="luxury-label">Offer</label>
                <input
                  type="text"
                  value={formData.offer}
                  onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                  className="luxury-input"
                />
              </div>

              <div>
                <label className="luxury-label">Amenities</label>
                <input
                  type="text"
                  value={formData.amen}
                  onChange={(e) => setFormData({ ...formData, amen: e.target.value })}
                  className="luxury-input"
                  placeholder="WiFi, AC, TV (comma separated)"
                />
              </div>
            </div>

            {/* Pricing Schedule */}
            <div className="rounded-2xl border border-luxury-gold/30 bg-luxury-gold/5 p-4 space-y-4">
              <h3 className="text-sm font-semibold text-luxury-black flex items-center gap-2">
                <span>💰</span> Pricing Schedule
              </h3>

              {/* Weekend */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-600">Weekend (Fri / Sat / Sun)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="luxury-label">Weekend 24hr (₹)</label>
                    <input
                      type="number"
                      value={formData["pricing.weekendFullDay"]}
                      onChange={(e) => setFormData({ ...formData, "pricing.weekendFullDay": e.target.value })}
                      className="luxury-input"
                      placeholder="e.g. 18000"
                    />
                  </div>
                  <div>
                    <label className="luxury-label">Weekend 12hr (₹)</label>
                    <input
                      type="number"
                      value={formData["pricing.weekendHalfDay"]}
                      onChange={(e) => setFormData({ ...formData, "pricing.weekendHalfDay": e.target.value })}
                      className="luxury-input"
                      placeholder="e.g. 12000"
                    />
                  </div>
                </div>
              </div>

              {/* Weekday */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-600">Weekday (Mon – Thu)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="luxury-label">Weekday 24hr (₹)</label>
                    <input
                      type="number"
                      value={formData["pricing.weekdayFullDay"]}
                      onChange={(e) => setFormData({ ...formData, "pricing.weekdayFullDay": e.target.value })}
                      className="luxury-input"
                      placeholder="e.g. 15000"
                    />
                  </div>
                  <div>
                    <label className="luxury-label">Weekday 12hr (₹)</label>
                    <input
                      type="number"
                      value={formData["pricing.weekdayHalfDay"]}
                      onChange={(e) => setFormData({ ...formData, "pricing.weekdayHalfDay": e.target.value })}
                      className="luxury-input"
                      placeholder="e.g. 10000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-luxury-stone/50 bg-luxury-sand/20 p-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-luxury-black">Visibility Status</h3>
                <p className="text-xs text-luxury-charcoal/60">
                  {formData.available ? "Publicly visible on the home page." : "Hidden from public view."}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formData.available}
                onClick={() => setFormData({ ...formData, available: !formData.available })}
                className={`relative h-7 w-12 rounded-full transition-colors ${formData.available ? "bg-luxury-gold" : "bg-luxury-stone"
                  }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${formData.available ? "left-6" : "left-1"
                    }`}
                />
              </button>
            </div>

            <div>
              <label className="luxury-label">Description</label>
              <textarea
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                className="luxury-input min-h-[120px]"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-2xl bg-luxury-gold py-3 font-semibold text-luxury-black shadow-luxury-gold transition hover:bg-luxury-gold-light disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-luxury-stone bg-luxury-sand/80 px-6 py-3 font-semibold text-luxury-black transition hover:bg-luxury-stone/80"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageResorts;
