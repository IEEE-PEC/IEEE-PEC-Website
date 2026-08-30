"use client";

import { useState, useMemo } from "react";
import { InventoryItem, InventoryCategory, InventoryTransaction } from "@/types";
import { initialInventoryItems, initialTransactions } from "@/data/inventory_data";
import { inventoryCategoryOptions } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  SlidersHorizontal,
  Package,
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  History,
  Send,
  Sparkles,
  LayoutGrid,
  List,
} from "lucide-react";
import { toast } from "sonner";

export default function InventoryCatalog() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Issue modal state
  const [selectedItemForBorrow, setSelectedItemForBorrow] = useState<InventoryItem | null>(null);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // Borrow form state
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowerSid, setBorrowerSid] = useState("");
  const [borrowQuantity, setBorrowQuantity] = useState("1");
  const [borrowPurpose, setBorrowPurpose] = useState("");

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const handleOpenBorrowModal = (item: InventoryItem) => {
    setSelectedItemForBorrow(item);
    setBorrowQuantity("1");
    setBorrowModalOpen(true);
  };

  const handleBorrowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForBorrow) return;

    const qty = parseInt(borrowQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      toast.error("Please enter a valid positive quantity");
      return;
    }

    if (qty > selectedItemForBorrow.quantity) {
      toast.error(`Only ${selectedItemForBorrow.quantity} units available in lab`);
      return;
    }

    if (!borrowerName.trim() || !borrowerSid.trim() || !borrowPurpose.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    // Update item stock
    const updatedItems = items.map((i) =>
      i.id === selectedItemForBorrow.id ? { ...i, quantity: i.quantity - qty } : i
    );
    setItems(updatedItems);

    // Record transaction
    const newTx: InventoryTransaction = {
      id: transactions.length + 1,
      item_id: selectedItemForBorrow.id,
      item_name: selectedItemForBorrow.item_name,
      borrowed_by: `${borrowerName} (${borrowerSid})`,
      quantity: qty,
      transaction_type: "Borrow",
      purpose: borrowPurpose,
      transaction_date: new Date().toISOString().split("T")[0],
    };
    setTransactions([newTx, ...transactions]);

    toast.success(
      `Issued ${qty}x ${selectedItemForBorrow.item_name} to ${borrowerName}!`,
      {
        description: "Please collect the component from IEEE Hardware Lab, Electrical Dept.",
      }
    );

    // Reset
    setBorrowModalOpen(false);
    setBorrowerName("");
    setBorrowerSid("");
    setBorrowPurpose("");
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#00629B] flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-foreground">{items.length}</p>
            <p className="text-xs text-muted-foreground font-medium">Total Cataloged Items</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-foreground">
              {items.reduce((acc, curr) => acc + curr.quantity, 0)}
            </p>
            <p className="text-xs text-muted-foreground font-medium">Available Units in Stock</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 flex items-center justify-center shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-foreground">{transactions.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Logged Lab Issues</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setHistoryModalOpen(true)}
            className="text-xs border-border"
          >
            Audit Log
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by component name, spec, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-border"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "table"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Table view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          {inventoryCategoryOptions.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-[#00629B] text-white shadow-sm font-semibold"
                    : "bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:text-foreground hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Results View */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-border">
          <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-bold text-foreground">No components found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search keywords or selecting a different category filter.
          </p>
        </div>
      ) : viewMode === "table" ? (
        <div className="rounded-2xl border border-border bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/60">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>Component Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description / Application</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item, idx) => {
                const isOutOfStock = item.quantity === 0;
                const isLowStock = item.quantity > 0 && item.quantity <= item.min_quantity;

                return (
                  <TableRow key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {item.item_name}
                    </TableCell>
                    <TableCell>
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-slate-800 text-[#00629B] dark:text-[#00A3E0] border border-blue-200 dark:border-slate-700">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {item.description}
                    </TableCell>
                    <TableCell className="text-center font-bold text-foreground font-mono">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          <XCircle className="w-3 h-3" /> Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" /> Available
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        disabled={isOutOfStock}
                        onClick={() => handleOpenBorrowModal(item)}
                        className="bg-[#00629B] hover:bg-[#004B7A] text-white text-xs disabled:opacity-40"
                      >
                        Request Issue
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isOutOfStock = item.quantity === 0;
            const isLowStock = item.quantity > 0 && item.quantity <= item.min_quantity;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 dark:bg-slate-800 text-[#00629B]">
                      {item.category}
                    </span>
                    {isOutOfStock ? (
                      <span className="text-[11px] font-bold text-rose-600">Out of stock</span>
                    ) : isLowStock ? (
                      <span className="text-[11px] font-bold text-amber-600">Low Stock ({item.quantity})</span>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600">{item.quantity} In Stock</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground line-clamp-1">{item.item_name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">ID: #{item.id}</span>
                  <Button
                    size="sm"
                    disabled={isOutOfStock}
                    onClick={() => handleOpenBorrowModal(item)}
                    className="bg-[#00629B] hover:bg-[#004B7A] text-white text-xs"
                  >
                    Issue Component
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Borrow Request Modal */}
      <Dialog open={borrowModalOpen} onOpenChange={setBorrowModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Request Component Issue
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Components are issued for academic research, hackathons, and IEEE project development.
            </DialogDescription>
          </DialogHeader>

          {selectedItemForBorrow && (
            <form onSubmit={handleBorrowSubmit} className="space-y-4 my-2">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700">
                <p className="text-xs font-bold text-[#00629B] dark:text-blue-300">
                  {selectedItemForBorrow.item_name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Category: {selectedItemForBorrow.category} • Available: {selectedItemForBorrow.quantity} units
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Student Name *</label>
                <Input
                  required
                  placeholder="e.g. Aryan Mahendru"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Student ID (SID) *</label>
                  <Input
                    required
                    placeholder="e.g. 21103045"
                    value={borrowerSid}
                    onChange={(e) => setBorrowerSid(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Quantity *</label>
                  <Input
                    type="number"
                    min={1}
                    max={selectedItemForBorrow.quantity}
                    required
                    value={borrowQuantity}
                    onChange={(e) => setBorrowQuantity(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Purpose / Project Title *</label>
                <Input
                  required
                  placeholder="e.g. TechSphere Robo Soccer / Smart Campus IoT"
                  value={borrowPurpose}
                  onChange={(e) => setBorrowPurpose(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setBorrowModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#00629B] hover:bg-[#004B7A] text-white"
                >
                  <Send className="w-3.5 h-3.5 mr-1" /> Submit Issue Request
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Transaction History Audit Log Modal */}
      <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              IEEE Lab Inventory Audit Log
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Recent component check-outs and return records from IEEE PEC Lab.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-border overflow-hidden my-2">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/60">
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Issued To</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="text-xs">
                    <TableCell className="font-mono text-muted-foreground">#{tx.id}</TableCell>
                    <TableCell className="font-semibold text-foreground">{tx.item_name}</TableCell>
                    <TableCell className="text-muted-foreground">{tx.borrowed_by}</TableCell>
                    <TableCell className="text-center font-bold font-mono">{tx.quantity}</TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-[180px]">{tx.purpose}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{tx.transaction_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
