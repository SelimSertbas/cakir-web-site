import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingProvider } from "@/lib/loading-context";
import { Suspense, lazy } from 'react';
import { Loading } from "@/components/ui/loading";

import Index from "./pages/Index";
import About from "./pages/About";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Ask from "./pages/Ask";
import Questions from "./pages/Questions";
import QuestionDetail from "@/pages/QuestionDetail";

// Lazy load heavy components
const WriterPanel = lazy(() => import("./pages/WriterPanel"));
const YouTube = lazy(() => import("./pages/Videos"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LoadingProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route 
              path="/videos" 
              element={
                <Suspense fallback={<Loading text="Yükleniyor..." />}>
                  <YouTube />
                </Suspense>
              } 
            />
            <Route path="/ask" element={<Ask />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/writer-panel" 
              element={
                <Suspense fallback={<Loading text="Yükleniyor..." />}>
                  <WriterPanel />
                </Suspense>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LoadingProvider>
  </QueryClientProvider>
);

export default App;
