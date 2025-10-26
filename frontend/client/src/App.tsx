import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { api, setAuthToken, getAuthToken } from "./lib/api";
import AuthCard from "@/components/AuthCard";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Accounts from "@/pages/Accounts";
import Budgets from "@/pages/Budgets";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());
  const { toast } = useToast();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password);
      setAuthToken(response.token);
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      await api.auth.register(email, password);
      toast({
        title: "Registration successful",
        description: "You can now log in with your credentials",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    queryClient.clear();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const handleLinkBank = async () => {
    try {
      const { link_token } = await api.plaid.createLinkToken();
      
      if (typeof window.Plaid !== 'undefined') {
        const handler = window.Plaid.create({
          token: link_token,
          onSuccess: async (public_token: string) => {
            try {
              await api.plaid.setAccessToken(public_token);
              toast({
                title: "Bank linked successfully",
                description: "Your bank account has been connected",
              });
              queryClient.invalidateQueries({ queryKey: ['/api/plaid/accounts'] });
              queryClient.invalidateQueries({ queryKey: ['/api/plaid/transactions'] });
            } catch (error: any) {
              toast({
                title: "Failed to link bank",
                description: error.message,
                variant: "destructive",
              });
            }
          },
          onExit: () => {
            console.log('Plaid Link closed');
          },
        });
        handler.open();
      } else {
        toast({
          title: "Plaid not loaded",
          description: "Please refresh the page and try again",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not initialize Plaid Link",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return <AuthCard onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <AppLayout onLogout={handleLogout} onLinkBank={handleLinkBank}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/accounts" component={Accounts} />
        <Route path="/budgets" component={Budgets} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
