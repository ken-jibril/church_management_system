/**
 * Donations Management Page - Covenant Cloud Church Management System
 * Uses donationsService (mock-backed until backend endpoint is added).
 */
import { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  Filter,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  getDonations,
  createDonation,
  updateDonation,
  deleteDonation,
} from "../services/donationsService";
import { StatusBadge } from "../components/ui/Badge";
import Modal, { ConfirmDialog } from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";
import PageHeader from "../components/ui/PageHeader";

const DONATION_TYPES = [
  "Tithe",
  "Offering",
  "Special Offering",
  "Building Fund",
  "Missions",
  "Pledge",
  "Other",
];
const PAYMENT_METHODS = ["M-Pesa", "Cash", "Bank Transfer", "Cheque", "Card"];

const INITIAL_FORM = {
  donor: "",
  amount: "",
  type: "Tithe",
  date: new Date().toISOString().split("T")[0],
  method: "M-Pesa",
  reference: "",
  status: "confirmed",
  notes: "",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);

export default function Donations() {
  const { can } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewDonation, setViewDonation] = useState(null);
  const [editDonation, setEditDonation] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const loadDonations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDonations();
      setDonations(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to load donations.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const filtered = donations.filter((d) => {
    const donor = d.donor || "";
    const reference = d.reference || "";
    const matchSearch =
      donor.toLowerCase().includes(search.toLowerCase()) ||
      reference.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || d.type === filterType;
    const matchStatus = filterStatus === "all" || d.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const totalAmount = filtered.reduce((sum, d) => sum + (d.amount || 0), 0);
  const confirmedAmount = filtered
    .filter((d) => d.status === "confirmed")
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  const handleAdd = async () => {
    setSaving(true);
    try {
      const newDonation = await createDonation(form);
      setDonations([newDonation, ...donations]);
      setAddOpen(false);
      setForm(INITIAL_FORM);
    } catch (err) {
      alert(
        err?.response?.data?.detail || err.message || "Failed to add donation.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editDonation) return;
    setSaving(true);
    try {
      const updated = await updateDonation(editDonation.id, form);
      setDonations(
        donations.map((d) => (d.id === editDonation.id ? updated : d)),
      );
      setEditDonation(null);
      setForm(INITIAL_FORM);
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to update donation.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDonation(id);
      setDonations(donations.filter((d) => d.id !== id));
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to delete donation.",
      );
    }
  };

  const openEdit = (donation) => {
    setEditDonation(donation);
    setForm({ ...donation, amount: donation.amount.toString() });
  };

  const DonationForm = ({ onSubmit, submitLabel }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Donor Name *
          </label>
          <input
            value={form.donor}
            onChange={(e) => setForm({ ...form, donor: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Donor name or Anonymous"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (KES) *
          </label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0.00"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Donation Type
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {DONATION_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reference No.
          </label>
          <input
            value={form.reference}
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Transaction reference"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Additional notes..."
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setAddOpen(false);
            setEditDonation(null);
            setForm(INITIAL_FORM);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <PageHeader
          title="Donations"
          subtitle="Track and manage all church donations"
          icon={DollarSign}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={loadDonations}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-500"
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
              {can("donations", "create") && (
                <button
                  onClick={() => {
                    setForm(INITIAL_FORM);
                    setAddOpen(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
                >
                  <Plus size={16} />
                  Record Donation
                </button>
              )}
            </div>
          }
        />

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={loadDonations}
              className="text-red-600 hover:underline text-xs ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-2xl p-4">
            <p className="text-sm text-gray-500">Total (Filtered)</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {formatCurrency(totalAmount)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {filtered.length} records
            </p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {formatCurrency(confirmedAmount)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {filtered.filter((d) => d.status === "confirmed").length}{" "}
              confirmed
            </p>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {formatCurrency(totalAmount - confirmedAmount)}
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              {filtered.filter((d) => d.status === "pending").length} pending
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search donor or reference..."
            className="flex-1"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            {DONATION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Method
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      <DollarSign
                        size={40}
                        className="mx-auto mb-2 opacity-30"
                      />
                      <p>No donations found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((donation) => (
                    <tr
                      key={donation.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <DollarSign size={14} className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {donation.donor}
                            </p>
                            <p className="text-xs text-gray-500">
                              {donation.reference}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-700">
                          {donation.type}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-green-600">
                          {formatCurrency(donation.amount)}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-600">
                          {donation.method}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-gray-600">
                          {donation.date}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={donation.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewDonation(donation)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          {can("donations", "update") && (
                            <button
                              onClick={() => openEdit(donation)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition"
                              title="Edit"
                            >
                              <Edit2 size={15} />
                            </button>
                          )}
                          {can("donations", "delete") && (
                            <button
                              onClick={() => setDeleteTarget(donation)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setForm(INITIAL_FORM);
        }}
        title="Record Donation"
        size="lg"
      >
        <DonationForm onSubmit={handleAdd} submitLabel="Record Donation" />
      </Modal>
      <Modal
        isOpen={!!editDonation}
        onClose={() => {
          setEditDonation(null);
          setForm(INITIAL_FORM);
        }}
        title="Edit Donation"
        size="lg"
      >
        <DonationForm onSubmit={handleEdit} submitLabel="Save Changes" />
      </Modal>
      <Modal
        isOpen={!!viewDonation}
        onClose={() => setViewDonation(null)}
        title="Donation Details"
        size="sm"
      >
        {viewDonation && (
          <div className="space-y-3">
            {[
              { label: "Donor", value: viewDonation.donor },
              { label: "Amount", value: formatCurrency(viewDonation.amount) },
              { label: "Type", value: viewDonation.type },
              { label: "Method", value: viewDonation.method },
              { label: "Reference", value: viewDonation.reference },
              { label: "Date", value: viewDonation.date },
              {
                label: "Status",
                value: <StatusBadge status={viewDonation.status} />,
              },
              { label: "Notes", value: viewDonation.notes || "—" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center py-2 border-b border-gray-50"
              >
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-800">
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}
      </Modal>
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete Donation"
        message={`Delete donation from ${deleteTarget?.donor}? This cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </DashboardLayout>
  );
}
