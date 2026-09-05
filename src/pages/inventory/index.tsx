"use client";

import { useState, useEffect } from "react";
import PageHead from "@/components/layout/PageHead";
import { initialInventoryItems, initialTransactions } from "@/data/inventory_data";
import { projectsData } from "@/data/projects_data";
import { eventsData } from "@/data/events_data";
import { teamMembersData } from "@/data/team_details";
import {
  Package,
  FolderGit2,
  Calendar,
  Users,
  Shield,
  Plus,
  Trash2,
  Lock,
  LogOut,
  Search,
  CheckCircle2,
  AlertTriangle,
  History,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { toast } from "sonner";
import { InventoryCategory, InventoryItem, InventoryTransaction } from "@/types";

const ADMIN_PASSCODE = "ieeepec2026";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [activeTab, setActiveTab] = useState("inventory");

  // State for modules
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventoryItems);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(initialTransactions);
  const [inventorySearch, setInventorySearch] = useState("");
  const [projects, setProjects] = useState(projectsData);
  const [events, setEvents] = useState(eventsData);
  const [team, setTeam] = useState(teamMembersData);

  // Add Item Modal
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<InventoryCategory>("Microcontroller");
  const [newItemQty, setNewItemQty] = useState("10");
  const [newItemDesc, setNewItemDesc] = useState("");

  // Check sessionStorage on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem("ieee_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE || passcode.trim() === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("ieee_admin_auth", "true");
      toast.success("Admin access granted!");
    } else {
      toast.error("Invalid Admin Passcode. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("ieee_admin_auth");
    setPasscode("");
    toast.info("Logged out of Admin Portal.");
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: InventoryItem = {
      id: inventory.length + 1,
      item_name: newItemName,
      category: newItemCategory,
      quantity: parseInt(newItemQty, 10) || 1,
      min_quantity: 5,
      description: newItemDesc || "Added by Lab Administrator",
    };

    setInventory([newItem, ...inventory]);
    toast.success(`Component "${newItemName}" added to catalog!`);
    setAddItemModalOpen(false);
    setNewItemName("");
    setNewItemDesc("");
  };

  const handleDeleteItem = (id: number) => {
    setInventory(inventory.filter((i) => i.id !== id));
    toast.success("Item removed from catalog.");
  };

  const handleUpdateStock = (id: number, delta: number) => {
    setInventory(
      inventory.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );
  };

  const filteredInventory = inventory.filter((i) =>
    i.item_name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    i.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  // If NOT authenticated, render Secure Gatekeeper
  if (!isAuthenticated) {
    return (
      <>
        <PageHead
          title="Admin Login | IEEE PEC Student Branch"
          description="Authorized login portal for IEEE PEC Student Branch administrators."
        />

        <section className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-xl space-y-6">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#00629B]/10 text-[#00629B] flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-extrabold text-foreground">
                IEEE PEC Staff Portal
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enter your administrative key to manage hardware inventory stock, projects, event schedules, and team records.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Admin Passcode
                </label>
                <Input
                  type="password"
                  required
                  placeholder="Enter passcode (e.g. ieeepec2026)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#00629B] hover:bg-[#004B7A] text-white rounded-xl font-semibold shadow-md"
              >
                <Shield className="w-4 h-4 mr-2" /> Verify & Access Portal
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-[11px] text-muted-foreground">
                For administrative credentials, contact the IEEE PEC Secretary.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <>
      <PageHead
        title="Admin Console | IEEE PEC Student Branch"
        description="Unified CMS Portal for IEEE PEC Student Branch. Manage hardware inventory, projects portfolio, event calendar, and executive team members."
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#002855] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5 text-[#00A3E0]" />
              Staff CMS Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              IEEE PEC SB Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Internal manager for Hardware Lab inventory, projects, events, and leadership records.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs"
          >
            <LogOut className="w-4 h-4 mr-1.5" /> Logout
          </Button>
        </div>
      </section>

      {/* Admin Tabs */}
      <section className="py-12 bg-slate-50 dark:bg-slate-950 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 max-w-2xl mx-auto mb-8 h-12 bg-white dark:bg-slate-900 border border-border shadow-sm">
              <TabsTrigger value="inventory" className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Package className="w-4 h-4" /> Lab Inventory ({inventory.length})
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                <FolderGit2 className="w-4 h-4" /> Projects ({projects.length})
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Events ({events.length})
              </TabsTrigger>
              <TabsTrigger value="team" className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" /> Team ({team.length})
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: HARDWARE LAB INVENTORY */}
            <TabsContent value="inventory" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Hardware Lab Inventory Ledger</h3>
                  <p className="text-xs text-muted-foreground">Internal management of 94+ lab components, sensors, and microcontrollers.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Filter components..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="pl-8 h-9 text-xs"
                    />
                  </div>
                  <Button
                    onClick={() => setAddItemModalOpen(true)}
                    className="bg-[#00629B] hover:bg-[#004B7A] text-white text-xs shrink-0"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Component
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/60">
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Component Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-center">Units in Lab</TableHead>
                      <TableHead className="text-center">Adjust Quantity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.slice(0, 30).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">#{item.id}</TableCell>
                        <TableCell className="font-semibold text-foreground text-sm">{item.item_name}</TableCell>
                        <TableCell>
                          <span className="px-2 py-0.5 rounded text-xs bg-blue-50 text-[#00629B]">
                            {item.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-bold font-mono text-sm">{item.quantity}</TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateStock(item.id, -1)}
                              className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleUpdateStock(item.id, 1)}
                              className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200"
                            >
                              +
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-rose-600 hover:bg-rose-50 h-8 px-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* TAB 2: PROJECTS */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Innovations & Projects</h3>
                  <p className="text-xs text-muted-foreground">Verified student projects and bot displays.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-[#00629B]">
                        {proj.category}
                      </span>
                      <h4 className="font-bold text-base text-foreground mt-1">{proj.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{proj.description}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                      {proj.status}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 3: EVENTS */}
            <TabsContent value="events" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Events & Workshops</h3>
                  <p className="text-xs text-muted-foreground">Manage Techadroit, PECFEST, and speaker sessions.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((ev) => (
                  <div key={ev.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                        {ev.category}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">{ev.date}</span>
                    </div>
                    <h4 className="font-bold text-base text-foreground">{ev.title}</h4>
                    <p className="text-xs text-muted-foreground">{ev.location} • {ev.time}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 4: TEAM */}
            <TabsContent value="team" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Executive Committee & Leadership</h3>
                  <p className="text-xs text-muted-foreground">Leadership roster for IEEE PEC Student Branch.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.map((m) => {
                  const initials = m.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <div key={m.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#002855] via-[#00629B] to-[#00A3E0] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-foreground truncate">{m.name}</h4>
                        <p className="text-xs text-[#00629B] truncate">{m.role}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{m.department}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Add Item Dialog */}
      <Dialog open={addItemModalOpen} onOpenChange={setAddItemModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add Component to Lab Inventory</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddItem} className="space-y-3.5 my-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Component Name *</label>
              <Input
                required
                placeholder="e.g. Raspberry Pi 4 Model B"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as InventoryCategory)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
                >
                  <option value="Microcontroller">Microcontroller</option>
                  <option value="Sensor">Sensor</option>
                  <option value="Actuator">Actuator</option>
                  <option value="Power">Power</option>
                  <option value="Tool">Tool</option>
                  <option value="Component">Component</option>
                  <option value="Communication">Communication</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Stock Quantity</label>
                <Input
                  type="number"
                  min={1}
                  required
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Description</label>
              <Textarea
                placeholder="Technical specifications or use-case notes..."
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                className="min-h-[80px] text-xs"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setAddItemModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#00629B] hover:bg-[#004B7A] text-white">
                Add Component
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
