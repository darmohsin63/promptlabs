import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TableSkeleton, StatCardSkeleton } from "@/components/TableSkeleton";
import { 
  Shield, 
  Trash2, 
  Users, 
  FileText, 
  LogOut, 
  Eye, 
  UserPlus, 
  Crown,
  UserX,
  Search,
  Plus,
  X,
  MessageSquare,
  Mail,
  Check,
  Calendar,
  User,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Prompt {
  id: string;
  title: string;
  author: string;
  created_at: string;
  scheduled_at: string | null;
  is_approved: boolean | null;
}

interface Profile {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  date_of_birth: string | null;
  avatar_url: string | null;
}

interface UserRole {
  user_id: string;
  role: "admin" | "user" | "pro";
}

interface Feedback {
  id: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function AdminDashboard() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [activeTab, setActiveTab] = useState<"prompts" | "users" | "feedback">("prompts");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setDataLoading(true);
    const [promptsRes, usersRes, rolesRes, feedbackRes] = await Promise.all([
      supabase.from("prompts").select("id, title, author, created_at, scheduled_at, is_approved").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, email, display_name, created_at, date_of_birth, avatar_url").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("feedback").select("*").order("created_at", { ascending: false }),
    ]);

    if (promptsRes.data) setPrompts(promptsRes.data);
    if (usersRes.data) setUsers(usersRes.data);
    if (rolesRes.data) setUserRoles(rolesRes.data as UserRole[]);
    if (feedbackRes.data) setFeedback(feedbackRes.data);
    setDataLoading(false);
  };

  const approvePrompt = async (id: string) => {
    const { error } = await supabase
      .from("prompts")
      .update({ 
        is_approved: true, 
        approved_at: new Date().toISOString(),
        approved_by: user?.id 
      })
      .eq("id", id);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Approved", description: "Prompt is now visible to everyone." });
      setPrompts(prompts.map(p => p.id === id ? { ...p, is_approved: true } : p));
    }
  };

  const isUserPro = (userId: string) => {
    return userRoles.some(r => r.user_id === userId && r.role === "pro");
  };

  const toggleProRole = async (userId: string) => {
    const currentlyPro = isUserPro(userId);
    
    if (currentlyPro) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "pro");
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Role updated", description: "Pro role removed." });
        setUserRoles(userRoles.filter(r => !(r.user_id === userId && r.role === "pro")));
      }
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "pro" });
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Role updated", description: "User is now a Pro." });
        setUserRoles([...userRoles, { user_id: userId, role: "pro" }]);
      }
    }
  };

  const deletePrompt = async (id: string) => {
    const { error } = await supabase.from("prompts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Prompt removed successfully." });
      setPrompts(prompts.filter((p) => p.id !== id));
    }
  };

  const isUserAdmin = (userId: string) => {
    return userRoles.some(r => r.user_id === userId && r.role === "admin");
  };

  const toggleAdminRole = async (userId: string) => {
    const currentlyAdmin = isUserAdmin(userId);
    
    if (userId === user?.id) {
      toast({ 
        title: "Cannot modify yourself", 
        description: "You cannot remove your own admin role.", 
        variant: "destructive" 
      });
      return;
    }

    if (currentlyAdmin) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Role updated", description: "Admin role removed." });
        setUserRoles(userRoles.filter(r => !(r.user_id === userId && r.role === "admin")));
      }
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Role updated", description: "User is now an admin." });
        setUserRoles([...userRoles, { user_id: userId, role: "admin" }]);
      }
    }
  };

  const deleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast({ 
        title: "Cannot delete yourself", 
        description: "You cannot delete your own account.", 
        variant: "destructive" 
      });
      return;
    }

    await supabase.from("prompts").delete().eq("user_id", userId);
    await supabase.from("user_roles").delete().eq("user_id", userId);
    
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "User deleted", description: "User and their data have been removed." });
      setUsers(users.filter(u => u.id !== userId));
      setUserRoles(userRoles.filter(r => r.user_id !== userId));
    }
  };

  const viewUserDetails = (u: Profile) => {
    setSelectedUser(u);
    setShowUserDetailModal(true);
  };

  const inviteNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingUser(true);

    try {
      // Generate a secure temporary password that will be changed on first login
      const tempPassword = crypto.randomUUID() + "!Aa1";
      
      // Create user with temporary password
      const { data, error } = await supabase.auth.signUp({
        email: newUserEmail,
        password: tempPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            display_name: newUserName || newUserEmail.split("@")[0],
          },
        },
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }

      // Send password reset email so user can set their own password
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        newUserEmail,
        { redirectTo: `${window.location.origin}/auth?type=recovery` }
      );

      if (resetError) {
        toast({ 
          title: "Partial success", 
          description: "Account created but couldn't send password setup email. User should use 'Forgot Password'.",
          variant: "destructive"
        });
      } else {
        toast({ 
          title: "Invitation sent", 
          description: "User will receive an email to set their password." 
        });
      }
      
      setShowAddUserModal(false);
      setNewUserEmail("");
      setNewUserName("");
      
      setTimeout(fetchData, 1000);
    } finally {
      setIsAddingUser(false);
    }
  };

  const filteredPrompts = prompts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeedback = feedback.filter(f =>
    f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markAsRead = async (id: string) => {
    const { error } = await supabase.from("feedback").update({ is_read: true }).eq("id", id);
    if (!error) {
      setFeedback(feedback.map(f => f.id === id ? { ...f, is_read: true } : f));
    }
  };

  const deleteFeedback = async (id: string) => {
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Feedback removed." });
      setFeedback(feedback.filter(f => f.id !== id));
    }
  };

  const unreadCount = feedback.filter(f => !f.is_read).length;
  const scheduledCount = prompts.filter(p => p.scheduled_at && new Date(p.scheduled_at) > new Date()).length;
  const pendingCount = prompts.filter(p => p.is_approved === false).length;
  const proCount = userRoles.filter(r => r.role === "pro").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const adminCount = userRoles.filter(r => r.role === "admin").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container pt-20 pb-12 px-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">Manage prompts, users, and content</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => { signOut(); navigate("/"); }}
            className="glass-card !rounded-xl flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        {dataLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8 animate-fade-up stagger-1">
            <div className="glass-panel flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{prompts.length}</p>
                <p className="text-sm text-muted-foreground">Total Prompts</p>
              </div>
            </div>
            <div className="glass-panel flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center relative">
                <Clock className="w-6 h-6 text-amber-500" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
            <div className="glass-panel flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{scheduledCount}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </div>
            <div className="glass-panel flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
            <div className="glass-panel flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{adminCount}</p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
            <div className="glass-panel flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center relative">
                <MessageSquare className="w-6 h-6 text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{feedback.length}</p>
                <p className="text-sm text-muted-foreground">Feedback</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-up stagger-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-11"
            />
          </div>
          {activeTab === "users" && (
            <Button 
              onClick={() => setShowAddUserModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 animate-fade-up stagger-2">
          <button
            onClick={() => { setActiveTab("prompts"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "prompts"
                ? "btn-primary !py-2.5"
                : "glass-card !rounded-xl text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Prompts</span>
            <span className="text-xs opacity-70">({prompts.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab("users"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "users"
                ? "btn-primary !py-2.5"
                : "glass-card !rounded-xl text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Users</span>
            <span className="text-xs opacity-70">({users.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab("feedback"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 relative ${
              activeTab === "feedback"
                ? "btn-primary !py-2.5"
                : "glass-card !rounded-xl text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Feedback</span>
            <span className="text-xs opacity-70">({feedback.length})</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {dataLoading ? (
          <TableSkeleton rows={5} columns={4} />
        ) : (
          <>
            {activeTab === "prompts" && (
              <div className="glass-table animate-fade-up stagger-3 overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 font-semibold text-foreground text-sm">Title</th>
                      <th className="text-left p-4 font-semibold text-foreground text-sm hidden sm:table-cell">Author</th>
                      <th className="text-left p-4 font-semibold text-foreground text-sm">Status</th>
                      <th className="text-left p-4 font-semibold text-foreground text-sm hidden md:table-cell">Date</th>
                      <th className="text-right p-4 font-semibold text-foreground text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrompts.map((prompt, index) => {
                      const isScheduled = prompt.scheduled_at && new Date(prompt.scheduled_at) > new Date();
                      const isPending = prompt.is_approved === false;
                      return (
                        <tr 
                          key={prompt.id} 
                          className={`border-b border-border/30 hover:bg-primary/5 transition-colors animate-fade-up ${isPending ? 'bg-amber-500/5' : ''}`}
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <td className="p-4">
                            <p className="font-medium text-foreground line-clamp-1">{prompt.title}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{prompt.author}</p>
                          </td>
                          <td className="p-4 text-muted-foreground text-sm hidden sm:table-cell">{prompt.author}</td>
                          <td className="p-4">
                            {isPending ? (
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center gap-1 w-fit">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            ) : isScheduled ? (
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/15 text-accent flex items-center gap-1 w-fit">
                                <Clock className="w-3 h-3" />
                                Scheduled
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary">
                                Published
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-muted-foreground text-sm hidden md:table-cell">
                            {isScheduled 
                              ? new Date(prompt.scheduled_at!).toLocaleDateString()
                              : new Date(prompt.created_at).toLocaleDateString()
                            }
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isPending && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => approvePrompt(prompt.id)}
                                  className="h-8 w-8 p-0 rounded-lg hover:bg-green-500/10 hover:text-green-600"
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/prompt/${prompt.id}`)}
                                className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10"
                              >
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deletePrompt(prompt.id)}
                                className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredPrompts.length === 0 && (
                  <div className="p-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {searchQuery ? "No prompts match your search" : "No prompts yet"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div className="glass-table animate-fade-up stagger-3 overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 font-semibold text-foreground text-sm">User</th>
                      <th className="text-left p-4 font-semibold text-foreground text-sm hidden sm:table-cell">Email</th>
                      <th className="text-left p-4 font-semibold text-foreground text-sm">Role</th>
                      <th className="text-left p-4 font-semibold text-foreground text-sm hidden md:table-cell">Joined</th>
                      <th className="text-right p-4 font-semibold text-foreground text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, index) => {
                      const isThisUserAdmin = isUserAdmin(u.id);
                      const isCurrentUser = u.id === user?.id;
                      
                      return (
                        <tr 
                          key={u.id} 
                          className={`border-b border-border/30 hover:bg-primary/5 transition-colors animate-fade-up ${
                            isCurrentUser ? "bg-primary/5" : ""
                          }`}
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden ${
                                isThisUserAdmin 
                                  ? "bg-gradient-to-br from-primary to-accent" 
                                  : "bg-muted-foreground/30"
                              }`}>
                                {u.avatar_url ? (
                                  <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  (u.display_name || u.email || "?")[0].toUpperCase()
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-foreground flex items-center gap-2">
                                  {u.display_name || "—"}
                                  {isCurrentUser && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground sm:hidden">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground text-sm hidden sm:table-cell">{u.email}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                isThisUserAdmin 
                                  ? "bg-primary/15 text-primary" 
                                  : "bg-muted text-muted-foreground"
                              }`}>
                                {isThisUserAdmin ? "Admin" : "User"}
                              </span>
                              {isUserPro(u.id) && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/15 text-accent">
                                  Pro
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground text-sm hidden md:table-cell">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => viewUserDetails(u)}
                                className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10"
                                title="View details"
                              >
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleAdminRole(u.id)}
                                disabled={isCurrentUser}
                                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs ${
                                  isThisUserAdmin 
                                    ? "hover:bg-accent/10 text-accent" 
                                    : "hover:bg-primary/10 text-primary"
                                }`}
                                title={isThisUserAdmin ? "Remove admin" : "Make admin"}
                              >
                                <Crown className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">
                                  {isThisUserAdmin ? "Remove" : "Admin"}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleProRole(u.id)}
                                className={`h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs ${
                                  isUserPro(u.id) 
                                    ? "hover:bg-amber-500/10 text-amber-500" 
                                    : "hover:bg-amber-500/10 text-muted-foreground"
                                }`}
                                title={isUserPro(u.id) ? "Remove Pro" : "Make Pro"}
                              >
                                <Crown className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">
                                  {isUserPro(u.id) ? "Unpro" : "Pro"}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteUser(u.id)}
                                disabled={isCurrentUser}
                                className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                                title="Delete user"
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
                  <div className="p-12 text-center">
                    <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {searchQuery ? "No users match your search" : "No users yet"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "feedback" && (
              <div className="glass-table animate-fade-up stagger-3 overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 font-semibold text-foreground text-sm">Email</th>
                      <th className="text-left p-4 font-semibold text-foreground text-sm">Message</th>
                      <th className="text-left p-4 font-semibold text-foreground text-sm hidden sm:table-cell">Date</th>
                      <th className="text-right p-4 font-semibold text-foreground text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeedback.map((f, index) => (
                      <tr 
                        key={f.id} 
                        className={`border-b border-border/30 hover:bg-primary/5 transition-colors animate-fade-up ${
                          !f.is_read ? "bg-primary/5" : ""
                        }`}
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-foreground text-sm">{f.email}</span>
                            {!f.is_read && (
                              <span className="px-2 py-0.5 bg-primary/15 text-primary text-xs rounded-full">New</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-muted-foreground text-sm line-clamp-2 max-w-md">{f.message}</p>
                        </td>
                        <td className="p-4 text-muted-foreground text-sm hidden sm:table-cell">
                          {new Date(f.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!f.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(f.id)}
                                className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4 text-primary" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteFeedback(f.id)}
                              className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                              title="Delete feedback"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredFeedback.length === 0 && (
                  <div className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {searchQuery ? "No feedback matches your search" : "No feedback yet"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Invite User Modal */}
      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent className="glass-panel border-glass-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Invite New User
            </DialogTitle>
            <DialogDescription>
              Send an invitation email. The user will set their own password securely.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={inviteNewUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newUserName">Display Name (optional)</Label>
              <Input
                id="newUserName"
                type="text"
                placeholder="John Doe"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="input-field"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newUserEmail">Email *</Label>
              <Input
                id="newUserEmail"
                type="email"
                placeholder="user@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                required
                className="input-field"
                maxLength={255}
              />
            </div>
            
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-xs text-primary flex items-center gap-2">
                <Shield className="w-4 h-4" />
                User will receive an email to set their own password securely
              </p>
            </div>
            
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddUserModal(false)}
                className="glass-card"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isAddingUser}
                className="btn-primary"
              >
                {isAddingUser ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Invitation
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Detail Modal */}
      <Dialog open={showUserDetailModal} onOpenChange={setShowUserDetailModal}>
        <DialogContent className="glass-panel border-glass-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              User Profile
            </DialogTitle>
            <DialogDescription>
              View complete user information
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white overflow-hidden ${
                  isUserAdmin(selectedUser.id) 
                    ? "bg-gradient-to-br from-primary to-accent" 
                    : "bg-muted-foreground/30"
                }`}>
                  {selectedUser.avatar_url ? (
                    <img src={selectedUser.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (selectedUser.display_name || selectedUser.email || "?")[0].toUpperCase()
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Display Name</p>
                    <p className="font-medium text-foreground">{selectedUser.display_name || "Not set"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p className="font-medium text-foreground">
                      {selectedUser.date_of_birth 
                        ? new Date(selectedUser.date_of_birth).toLocaleDateString("en-US", { 
                            year: "numeric", 
                            month: "long", 
                            day: "numeric" 
                          })
                        : "Not set"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Crown className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className={`font-medium ${isUserAdmin(selectedUser.id) ? "text-primary" : "text-foreground"}`}>
                      {isUserAdmin(selectedUser.id) ? "Administrator" : "User"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedUser.created_at).toLocaleDateString("en-US", { 
                        year: "numeric", 
                        month: "long", 
                        day: "numeric" 
                      })}
                    </p>
                  </div>
                </div>

                {/* Security notice */}
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                  <p className="text-xs text-accent flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Passwords are encrypted and cannot be viewed
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUserDetailModal(false)}
              className="glass-card"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
