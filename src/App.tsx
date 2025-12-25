import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { AnimatedLoader } from "@/components/AnimatedLoader";
import { AdManager } from "@/components/AdManager";

// Lazy load route components for code splitting
const Index = lazy(() => import("./pages/Index"));
const PromptDetail = lazy(() => import("./pages/PromptDetail"));
const Upload = lazy(() => import("./pages/Upload"));
const Auth = lazy(() => import("./pages/Auth"));
const AdminAuth = lazy(() => import("./pages/AdminAuth"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminPrompts = lazy(() => import("./pages/admin/AdminPrompts"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminFeedback = lazy(() => import("./pages/admin/AdminFeedback"));
const AdminFeatured = lazy(() => import("./pages/admin/AdminFeatured"));
const AdminAds = lazy(() => import("./pages/admin/AdminAds"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const About = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const SavedPrompts = lazy(() => import("./pages/SavedPrompts"));
const Search = lazy(() => import("./pages/Search"));
const Prompts = lazy(() => import("./pages/Prompts"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AdManager />
            <Suspense fallback={<AnimatedLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/prompt/:id" element={<PromptDetail />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<AdminAuth />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/prompts" element={<AdminPrompts />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/feedback" element={<AdminFeedback />} />
                <Route path="/admin/featured" element={<AdminFeatured />} />
                <Route path="/admin/ads" element={<AdminAds />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/saved-prompts" element={<SavedPrompts />} />
                <Route path="/search" element={<Search />} />
                <Route path="/prompts" element={<Prompts />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
