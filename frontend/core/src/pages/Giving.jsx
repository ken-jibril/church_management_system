/**
 * Giving Management Page - Covenant Cloud Church Management System
 * Uses givingService (mock-backed until backend endpoint is added).
 */
import { useState, useEffect, useCallback } from "react";
import { HandCoins, Plus, Edit2, Trash2, Eye, Receipt, RefreshCw } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  getGiving,
  createGiving,
  updateGiving,
  deleteGiving,
} from "../services/givingService";
import Modal, { ConfirmDialog } from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";

const GIVING_CATEGORIES = [
  "Tithe",
  "Offering",
  "Building Fund",
  "Missions",
  "Pledge",
  "Special Offering",
  "Welfare",
  "Other",
];
const PAYMENT_METHODS = ["M-Pesa", "Cash", "Bank Transfer", "Cheque", "Card"];

const INITIAL_FORM = {
  member: "",
  category: "Tithe",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  period: "",
  method: "M-Pesa",
  receipt: "",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);

const categoryColors = {
  Tithe: "indigo",
  Offering: "blue",
  "Building Fund": "orange",
  Missions: "green",
  Pledge: "purple",
  "Special Offering": "rose",
  Welfare: "yellow",
  Other: "gray",
};

export default function Giving() {
  const { can } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [viewRecord, setViewRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const loadGiving = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGiving();
      setRecords(data);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Failed to load giving records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadGiving(); }, [loadGiving]);

  const periods = [...new Set(records.map((r) => r.period).filter(Boolean))];

  const filtered = records.filter((r) => {
    const member = r.member || "";
    const receipt = r.receipt || "";
    const matchSearch =
      member.toLowerCase().includes(search.toLowerCase()) ||
      receipt.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || r.category === filterCategory;
    const matchPeriod = filterPeriod === "all" || r.period === filterPeriod;
    return matchSearch && matchCat && matchPeriod;
  });

  const totalGiving = filtered.reduce((sum, r) => sum + (r.amount || 0), 0);

  const categoryTotals = GIVING_CATEGORIES.map((cat) => ({
    category: cat,
    total: filtered
      .filter((r) => r.category === cat)
      .reduce((sum, r) => sum + r.amount, 0),
    count: filtered.filter((r) => r.category === cat).length,
  })).filter((c) => c.count > 0);

  const handleAdd = async () => {
    try {
      const payload = { ...form, amount: parseFloat(form.amount) || 0 };
      const newRecord = await createGiving(payload);
      setRecords([newRecord, ...records]);
      setAddOpen(false);
      setForm(INITIAL_FORM);
    } catch (err) {
      alert(err?.response?.data?.detail || err.message || "Failed to add giving record.");
    }
  };

  const handleEdit = async () => {
    if (!editRecord) return;
    try {
      const payload = { ...form, amount: parseFloat(form.amount) || 0 };
      const updated = await updateGiving(editRecord.id, payload);
      setRecords(records.map((r) => (r.id === editRecord.id ? updated : r)));
      setEditRecord(null);
      setForm(INITIAL_FORM);
    } catch (err) {
      alert(err?.response?.data?.detail || err.message || "Failed to update giving record.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGiving(id);
      setRecords(records.filter((r) => r.id !== id));
    } catch (err) {
      alert(err?.response?.data?.detail || err.message || "Failed to delete giving record.");
    }
  };

  const openEdit = (record) => {
    setEditRecord(record);
    setForm({ ...record, amount: (record.amount || 0).toString() });
  };

  const GivingForm = ({ onSubmit, submitLabel }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Member Name *
          </label>
          <input
            value={form.member}
            onChange={(e) => setForm({ ...form, member: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Member name"
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
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {GIVING_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
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
            Period
          </label>
          <input
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. February 2026"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Receipt No.
          </label>
          <input
            value={form.receipt}
            onChange={(e) => setForm({ ...form, receipt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="RCP001"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setAddOpen(false);
            setEditRecord(null);
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
          title="Giving"
          subtitle="Track member giving and contributions"
          icon={HandCoins}
          actions={
            can("giving", "create") && (
              <button
                onClick={() => {
                  setForm(INITIAL_FORM);
                  setAddOpen(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
              >
                <Plus size={16} />
                Record Giving
              </button>
            )
          }
        />

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-indigo-50 rounded-2xl p-4 sm:col-span-2 lg:col-span-1">
            <p className="text-sm text-gray-500">Total Giving</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {formatCurrency(totalGiving)}
            </p>
            <p className="text-xs text-indigo-600 mt-1">
              {filtered.length} records
            </p>
          </div>
          {categoryTotals.slice(0, 3).map((cat) => (
            <div
              key={cat.category}
              className="bg-white rounded-2xl p-4 border border-gray-100"
            >
              <p className="text-sm text-gray-500">{cat.category}</p>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {formatCurrency(cat.total)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{cat.count} records</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search member or receipt..."
            className="flex-1"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {GIVING_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Periods</option>
            {periods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Method
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Period
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Receipt
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
                      <HandCoins
                        size={40}
                        className="mx-auto mb-2 opacity-30"
                      />
                      <p>No giving records found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                            {record.member.charAt(0)}
                          </div>
                          <p className="text-sm font-medium text-gray-800">
                            {record.member}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant={categoryColors[record.category] || "gray"}
                        >
                          {record.category}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-green-600">
                          {formatCurrency(record.amount)}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-600">
                          {record.method}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-gray-600">
                          {record.period}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                          {record.receipt}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewRecord(record)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          {can("giving", "update") && (
                            <button
                              onClick={() => openEdit(record)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition"
                              title="Edit"
                            >
                              <Edit2 size={15} />
                            </button>
                          )}
                          {can("giving", "delete") && (
                            <button
                              onClick={() => setDeleteTarget(record)}
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
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          setForm(INITIAL_FORM);
        }}
        title="Record Giving"
        size="lg"
      >
        <GivingForm onSubmit={handleAdd} submitLabel="Record Giving" />
      </Modal>
      <Modal
        isOpen={!!editRecord}
        onClose={() => {
          setEditRecord(null);
          setForm(INITIAL_FORM);
        }}
        title="Edit Giving Record"
        size="lg"
      >
        <GivingForm onSubmit={handleEdit} submitLabel="Save Changes" />
      </Modal>
      <Modal
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
        title="Giving Record"
        size="sm"
      >
        {viewRecord && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-xl font-bold text-indigo-600">
                {viewRecord.member.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {viewRecord.member}
                </p>
                <Badge variant={categoryColors[viewRecord.category] || "gray"}>
                  {viewRecord.category}
                </Badge>
              </div>
            </div>
            {[
              { label: "Amount", value: formatCurrency(viewRecord.amount) },
              { label: "Method", value: viewRecord.method },
              { label: "Date", value: viewRecord.date },
              { label: "Period", value: viewRecord.period },
              { label: "Receipt No.", value: viewRecord.receipt },
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
        title="Delete Giving Record"
        message={`Delete giving record for ${deleteTarget?.member}? This cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </DashboardLayout>
  );
}
