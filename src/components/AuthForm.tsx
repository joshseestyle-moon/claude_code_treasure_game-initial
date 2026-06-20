import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface User {
  id: number;
  username: string;
  guest?: boolean;
}

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong');
        return;
      }

      onAuthSuccess(data as User);
    } catch {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl mb-8 text-amber-900">🏴‍☠️ Treasure Hunt Game 🏴‍☠️</h1>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-amber-900">Welcome, Treasure Hunter!</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => { setMode(v as 'login' | 'register'); setError(null); }}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
            </TabsList>

            {(['login', 'register'] as const).map((tab) => (
              <TabsContent key={tab} value={tab}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {loading ? 'Loading...' : tab === 'login' ? 'Login' : 'Register'}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-amber-300" />
            </div>
            <div className="relative flex justify-center text-xs text-amber-600">
              <span className="bg-white px-2">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-amber-400 text-amber-700 hover:bg-amber-50"
            onClick={() => onAuthSuccess({ id: 0, username: 'Guest', guest: true })}
          >
            Continue as Guest
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
