"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Download } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

type Quote = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  sport: string | null;
  quantity: string | null;
  description: string | null;
  status: string;
  createdAt: string;
};

const STATUS_FILTERS = ["all", "new", "viewed", "replied"] as const;

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Quote | null>(null);

  async function load() {
    setLoading(true);
    const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
    const res = await fetch(`/api/admin/quotes${params}`);
    const data = await res.json();
    if (data.ok) setQuotes(data.items);
    setLoading(false);
  }

  useEffect(() => {
    // Standard fetch-on-mount/on-filter-change; no data-fetching library in this project to defer to.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function updateStatus(id: string, status: string) {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    await fetch(`/api/admin/quotes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/quotes/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteTarget(null);
      load();
    }
  }

  const csv = useMemo(() => {
    const header = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Sport",
      "Quantity",
      "Message",
      "Status",
      "Date",
    ];
    const rows = quotes.map((q) => [
      q.name,
      q.email,
      q.phone ?? "",
      q.company ?? "",
      q.sport ?? "",
      q.quantity ?? "",
      (q.description ?? "").replace(/\n/g, " "),
      q.status,
      new Date(q.createdAt).toISOString(),
    ]);
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    return [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");
  }, [quotes]);

  function exportCsv() {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quote-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                statusFilter === s
                  ? "border-accent bg-accent text-ink"
                  : "border-[#222222] text-white/60 hover:border-accent/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-lg border border-[#222222] bg-[#1a1a1a] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-accent/60"
        >
          <Download size={16} />
          Export to CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#222222] bg-[#111111]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#222222] text-xs uppercase tracking-wide text-[#888888]">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Sport</th>
                <th className="px-5 py-3 font-medium">Quantity</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-[#888888]">
                    Loading…
                  </td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-[#888888]">
                    No quote requests found.
                  </td>
                </tr>
              ) : (
                quotes.map((q, i) => (
                  <Fragment key={q.id}>
                    <tr
                      onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                      className={`cursor-pointer border-b border-[#1a1a1a] transition-colors hover:bg-white/[0.03] ${
                        i % 2 === 1 ? "bg-white/[0.015]" : ""
                      }`}
                    >
                      <td className="px-5 py-3 font-medium text-white">
                        <span className="flex items-center gap-1.5">
                          {expandedId === q.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {q.name}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[#aaaaaa]">{q.email}</td>
                      <td className="px-5 py-3 text-[#aaaaaa]">{q.phone ?? "—"}</td>
                      <td className="px-5 py-3 text-[#aaaaaa]">{q.company ?? "—"}</td>
                      <td className="px-5 py-3 text-[#aaaaaa]">{q.sport ?? "—"}</td>
                      <td className="px-5 py-3 text-[#aaaaaa]">{q.quantity ?? "—"}</td>
                      <td className="px-5 py-3 text-[#aaaaaa]">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={q.status}
                          onChange={(e) => updateStatus(q.id, e.target.value)}
                          className="rounded-lg border border-[#333333] bg-[#1a1a1a] px-2 py-1 text-xs text-white outline-none focus:border-accent"
                        >
                          <option value="new">New</option>
                          <option value="viewed">Viewed</option>
                          <option value="replied">Replied</option>
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(q);
                            }}
                            aria-label="Delete"
                            className="grid h-8 w-8 place-items-center rounded-lg border border-[#222222] text-white/70 transition-colors hover:border-red-500 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === q.id && (
                      <tr className="border-b border-[#1a1a1a] bg-white/[0.02]">
                        <td colSpan={9} className="px-5 py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <StatusBadge status={q.status} />
                              <p className="mt-2 max-w-2xl whitespace-pre-wrap text-sm text-white/70">
                                {q.description || "No message provided."}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete quote request?"
        message={`This will permanently remove the request from "${deleteTarget?.name}".`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
