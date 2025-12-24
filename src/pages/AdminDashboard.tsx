import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { StatCardSkeleton } from "@/components/TableSkeleton";
import { 
  Shield, 
  LogOut, 
  FileText, 
  Clock,
  Calendar,
  Users,
  Crown,
  MessageSquare,
  Star,
  Megaphone
} from "lucide-react";

interface Prompt {
  id: string;
  scheduled_at: string | null;
  is_approved: boolean | null;
}

interface UserRole {
  user_id: string;
  role: "admin" | "user" | "pro";
}

interface Feedback {
  id: string;
  is_read: boolean;
}

export default function AdminDashboard() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [users, setUsers] = useState<{ id: string }[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
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
      supabase.from("prompts").select("id, scheduled_at, is_approved"),
      supabase.from("profiles").select("id"),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("feedback").select("id, is_read"),
    ]);

    if (promptsRes.data) setPrompts(promptsRes.data);
    if (usersRes.data) setUsers(usersRes.data);
    if (rolesRes.data) setUserRoles(rolesRes.data as UserRole[]);
    if (feedbackRes.data) setFeedback(feedbackRes.data);
    setDataLoading(false);
  };

  const unreadCount = feedback.filter(f => !f.is_read).length;
  const scheduledCount = prompts.filter(p => p.scheduled_at && new Date(p.scheduled_at) > new Date()).length;
  const pendingCount = prompts.filter(p => p.is_approved === false).length;
  const adminCount = userRoles.filter(r => r.role === "admin").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      icon: FileText,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      value: prompts.length,
      label: "Total Prompts",
      href: "/admin/prompts",
    },
    {
      icon: Clock,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      value: pendingCount,
      label: "Pending",
      href: "/admin/prompts?filter=pending",
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      icon: Calendar,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      value: scheduledCount,
      label: "Scheduled",
      href: "/admin/prompts?filter=scheduled",
    },
    {
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      value: users.length,
      label: "Total Users",
      href: "/admin/users",
    },
    {
      icon: Crown,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      value: adminCount,
      label: "Admins",
      href: "/admin/users?filter=admins",
    },
    {
      icon: MessageSquare,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      value: feedback.length,
      label: "Feedback",
      href: "/admin/feedback",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      icon: Star,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      value: "★",
      label: "Featured",
      href: "/admin/featured",
    },
    {
      icon: Megaphone,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      value: "📢",
      label: "Ads",
      href: "/admin/ads",
    },
  ];

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

        {/* Stats Cards Grid */}
        {dataLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-up stagger-1">
            {statCards.map((card, index) => (
              <button
                key={index}
                onClick={() => navigate(card.href)}
                className="glass-panel flex items-center gap-4 text-left hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center relative`}>
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  {card.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                      {card.badge}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">{card.value}</p>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}