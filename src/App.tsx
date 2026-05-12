import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter  as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CountryDetail from "./pages/CountryDetail";
import Compare from "./pages/Compare";
import Countries from "./pages/Countries";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router basename="/">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/country/:name" element={<CountryDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
