import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/TableSkeleton";
import { ArrowLeft, Search, Eye, Crown, Star, UserX, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Profile {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  avatar_url: string | null;
}

interface UserRole {
  user_id: string;
  role: "admin" | "user" | "pro" | "super_admin";
}

export default function AdminUsers() {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter"); // "admins"
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    setDataLoading(true);
    const [usersRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("id, email, display_name, created_at, avatar_url").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    if (usersRes.data) setUsers(usersRes.data);
    if (rolesRes.data) setUserRoles(rolesRes.data as UserRole[]);
    setDataLoading(false);
  };

  const isUserAdmin = (userId: string) => userRoles.some(r => r.user_id === userId && (r.role === "admin" || r.role === "super_admin"));
  const isUserPro = (userId: string) => userRoles.some(r => r.user_id === userId && r.role === "pro");
  const isUserSuperAdmin = (userId: string) => userRoles.some(r => r.user_id === userId && r.role === "super_admin");

  const toggleAdminRole = async (userId: string) => {
    if (!isSuperAdmin) {
      toast({ title: "Only Super Admin can manage admin roles", variant: "destructive" });
      return;
    }
    if (userId === user?.id) {
      toast({ title: "Cannot modify yourself", variant: "destructive" });
      return;
    }
    if (isUserSuperAdmin(userId)) {
      toast({ title: "Cannot modify Super Admin", variant: "destructive" });
      return;
    }
    const currentlyAdmin = userRoles.some(r => r.user_id === userId && r.role === "admin");
    if (currentlyAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (!error) {
        toast({ title: "Admin role removed" });
        setUserRoles(userRoles.filter(r => !(r.user_id === userId && r.role === "admin")));
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (!error) {
        toast({ title: "User is now an admin" });
        setUserRoles([...userRoles, { user_id: userId, role: "admin" }]);
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }
  };

  const toggleProRole = async (userId: string) => {
    if (!isSuperAdmin) {
      toast({ title: "Only Super Admin can manage Pro roles", variant: "destructive" });
      return;
    }
    if (isUserSuperAdmin(userId)) {
      toast({ title: "Cannot modify Super Admin", variant: "destructive" });
      return;
    }
    const currentlyPro = isUserPro(userId);
    if (currentlyPro) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "pro");
      if (!error) {
        toast({ title: "Pro role removed" });
        setUserRoles(userRoles.filter(r => !(r.user_id === userId && r.role === "pro")));
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "pro" });
      if (!error) {
        toast({ title: "User is now Pro" });
        setUserRoles([...userRoles, { user_id: userId, role: "pro" }]);
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }
  };

  const deleteUser = async (userId: string) => {
    if (!isSuperAdmin) {
      toast({ title: "Only Super Admin can delete users", variant: "destructive" });
      return;
    }
    if (userId === user?.id) {
      toast({ title: "Cannot delete yourself", variant: "destructive" });
      return;
    }
    if (isUserSuperAdmin(userId)) {
      toast({ title: "Cannot delete Super Admin", variant: "destructive" });
      return;
    }
    await supabase.from("prompts").delete().eq("user_id", userId);
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (!error) {
      toast({ title: "User deleted" });
      setUsers(users.filter(u => u.id !== userId));
      setUserRoles(userRoles.filter(r => r.user_id !== userId));
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const inviteNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingUser(true);
    try {
      const tempPassword = crypto.randomUUID() + "!Aa1";
      const { error } = await supabase.auth.signUp({
        email: newUserEmail,
        password: tempPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: { display_name: newUserName || newUserEmail.split("@")[0] },
        },
      });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      await supabase.auth.resetPasswordForEmail(newUserEmail, { redirectTo: `${window.location.origin}/auth?type=recovery` });
      toast({ title: "Invitation sent" });
      setShowAddUserModal(false);
      setNewUserEmail("");
      setNewUserName("");
      setTimeout(fetchData, 1000);
    } finally {
      setIsAddingUser(false);
    }
  };

  let filteredUsers = users.filter(u =>
    (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filter === "admins") {
    filteredUsers = filteredUsers.filter(u => isUserAdmin(u.id));
  }

  const getTitle = () => (filter === "admins" ? "Admin Users" : "All Users");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container pt-20 pb-12 px-4">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{getTitle()}</h1>
          <Button onClick={() => setShowAddUserModal(true)} className="btn-primary flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        {dataLoading ? (
          <TableSkeleton />
        ) : (
          <div className="glass-table overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-semibold text-foreground text-sm">User</th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm hidden sm:table-cell">Email</th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm">Role</th>
                  <th className="text-right p-4 font-semibold text-foreground text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isThisUserAdmin = isUserAdmin(u.id);
                  const isThisUserSuperAdmin = isUserSuperAdmin(u.id);
                  const isCurrentUser = u.id === user?.id;
                  return (
                    <tr key={u.id} className={`border-b border-border/30 hover:bg-primary/5 transition-colors ${isCurrentUser ? "bg-primary/5" : ""}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden ${isThisUserAdmin ? "bg-gradient-to-br from-primary to-accent" : "bg-muted-foreground/30"}`}>
                            {u.avatar_url ? (
                              <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (u.display_name || u.email || "?")[0].toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground flex items-center gap-2">
                              {u.display_name || "—"}
                              {isCurrentUser && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm hidden sm:table-cell">{u.email}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isThisUserSuperAdmin ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary to-accent text-white">Super Admin</span>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${isThisUserAdmin ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                              {isThisUserAdmin ? "Admin" : "User"}
                            </span>
                          )}
                          {isUserPro(u.id) && <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/15 text-accent">Pro</span>}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedUser(u)} className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10" title="View">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleAdminRole(u.id)}
                            disabled={isCurrentUser || !isSuperAdmin || isThisUserSuperAdmin}
                            className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs ${isThisUserAdmin ? "hover:bg-accent/10 text-accent" : "hover:bg-primary/10 text-primary"}`}
                            title={isThisUserAdmin ? "Remove admin" : "Make admin"}
                          >
                            <Crown className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleProRole(u.id)}
                            disabled={!isSuperAdmin || isThisUserSuperAdmin}
                            className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs ${isUserPro(u.id) ? "bg-amber-500/10 text-amber-500" : "hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500"}`}
                            title={isUserPro(u.id) ? "Remove Pro" : "Make Pro"}
                          >
                            <Star className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteUser(u.id)}
                            disabled={isCurrentUser || !isSuperAdmin || isThisUserSuperAdmin}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                            title="Delete"
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">No users found</div>
            )}
          </div>
        )}

        {/* Add User Modal */}
        <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
          <DialogContent className="glass-panel">
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={inviteNewUser} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required className="input-field mt-1.5" />
              </div>
              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="input-field mt-1.5" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddUserModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isAddingUser} className="btn-primary">{isAddingUser ? "Sending..." : "Send Invite"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* User Detail Modal */}
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="glass-panel">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
                    {selectedUser.avatar_url ? (
                      <img src={selectedUser.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      (selectedUser.display_name || selectedUser.email || "?")[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{selectedUser.display_name || "—"}</p>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Joined: {new Date(selectedUser.created_at).toLocaleDateString()}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}