import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
}

export default function AuthCard({ onLogin, onRegister }: AuthCardProps) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("secret123");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">Welcome to PFM Dashboard</CardTitle>
          <CardDescription>
            Sign in or create an account to start managing your finances
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-email"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="input-password"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => onRegister(email, password)}
              className="flex-1"
              data-testid="button-register"
            >
              Register
            </Button>
            <Button
              onClick={() => onLogin(email, password)}
              className="flex-1"
              data-testid="button-login"
            >
              Login
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            After login, link a sandbox bank and open the Dashboard
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
