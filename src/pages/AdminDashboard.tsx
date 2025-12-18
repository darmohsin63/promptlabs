import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, Trash2, Users, FileText } from "lucide-react";

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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage prompts and users</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => { signOut(); navigate("/"); }}>
            Sign Out
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("prompts")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "prompts"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            <FileText className="w-4 h-4" />
            Prompts ({prompts.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "users"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            <Users className="w-4 h-4" />
            Users ({users.length})
          </button>
        </div>

        {activeTab === "prompts" && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Title</th>
                  <th className="text-left p-4 font-medium text-foreground">Author</th>
                  <th className="text-left p-4 font-medium text-foreground">Date</th>
                  <th className="text-right p-4 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prompts.map((prompt) => (
                  <tr key={prompt.id} className="border-t border-border">
                    <td className="p-4 text-foreground">{prompt.title}</td>
                    <td className="p-4 text-muted-foreground">{prompt.author}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(prompt.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePrompt(prompt.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {prompts.length === 0 && (
              <p className="p-8 text-center text-muted-foreground">No prompts yet</p>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Name</th>
                  <th className="text-left p-4 font-medium text-foreground">Email</th>
                  <th className="text-left p-4 font-medium text-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="p-4 text-foreground">{u.display_name || "—"}</td>
                    <td className="p-4 text-muted-foreground">{u.email}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="p-8 text-center text-muted-foreground">No users yet</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
