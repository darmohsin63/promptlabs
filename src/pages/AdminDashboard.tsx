import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, Trash2, Users, FileText, LogOut, BarChart3, Eye } from "lucide-react";

interface Prompt {
  id: string;
  title: string;
  author: string;
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState<"prompts" | "users">("prompts");

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
    const [promptsRes, usersRes] = await Promise.all([
      supabase.from("prompts").select("id, title, author, created_at").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, email, display_name, created_at").order("created_at", { ascending: false }),
    ]);

    if (promptsRes.data) setPrompts(promptsRes.data);
    if (usersRes.data) setUsers(usersRes.data);
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
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">Manage prompts and users</p>
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
        <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-up stagger-1">
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
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{users.length}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 animate-fade-up stagger-2">
          <button
            onClick={() => setActiveTab("prompts")}
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
            onClick={() => setActiveTab("users")}
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
        </div>

        {/* Content */}
        {activeTab === "prompts" && (
          <div className="glass-table animate-fade-up stagger-3 overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-semibold text-foreground text-sm">Title</th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm hidden sm:table-cell">Author</th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm">Date</th>
                  <th className="text-right p-4 font-semibold text-foreground text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prompts.map((prompt, index) => (
                  <tr 
                    key={prompt.id} 
                    className="border-b border-border/30 hover:bg-primary/5 transition-colors animate-fade-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="p-4">
                      <p className="font-medium text-foreground line-clamp-1">{prompt.title}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{prompt.author}</p>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm hidden sm:table-cell">{prompt.author}</td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(prompt.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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
                ))}
              </tbody>
            </table>
            {prompts.length === 0 && (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No prompts yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="glass-table animate-fade-up stagger-3 overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-semibold text-foreground text-sm">User</th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm hidden sm:table-cell">Email</th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr 
                    key={u.id} 
                    className="border-b border-border/30 hover:bg-primary/5 transition-colors animate-fade-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                          {(u.display_name || u.email || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{u.display_name || "—"}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm hidden sm:table-cell">{u.email}</td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No users yet</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
