import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserRole } from '../types';
import { streams, skills, hobbies } from '../data/mockData';
import { GraduationCap, Users, Shield, X, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLogin: (email: string, password: string, role: UserRole) => Promise<void>;
  onSignup: (userData: any, password: string) => Promise<void>;
}

export function LoginPage({ onLogin, onSignup }: LoginPageProps) {
  const [activeRole, setActiveRole] = useState<UserRole>('user');
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'user' as UserRole, label: 'User', icon: GraduationCap, description: 'Discover and attend events' },
    { value: 'organizer' as UserRole, label: 'Organizer', icon: Users, description: 'Create and manage events' },
    { value: 'authority' as UserRole, label: 'Authority', icon: Shield, description: 'Review and approve events' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignup) {
        if (!name || !email || !password) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        if (activeRole === 'user' && (!selectedStream || selectedSkills.length === 0 || selectedHobbies.length === 0)) {
          setError('Please select your stream, at least one skill, and one hobby');
          setLoading(false);
          return;
        }

        const userData = {
          name,
          email,
          role: activeRole,
          ...(activeRole === 'user' && {
            stream: selectedStream,
            skills: selectedSkills,
            hobbies: selectedHobbies
          })
        };

        await onSignup(userData, password);
        setSuccess('Account created successfully! Logging you in...');
        setTimeout(() => {
          // Auto login after signup
          onLogin(email, password, activeRole);
        }, 1000);
      } else {
        if (!email || !password) {
          setError('Please enter your email and password');
          setLoading(false);
          return;
        }
        await onLogin(email, password, activeRole);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies(prev =>
      prev.includes(hobby) ? prev.filter(h => h !== hobby) : [...prev, hobby]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-50 animate-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-40 w-64 h-64 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-40"
          animate={{
            x: [0, -50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Sparkles className="w-10 h-10 text-blue-600" />
            </motion.div>
            <h1 className="text-5xl text-slate-800 drop-shadow-lg font-bold">Campus Unite</h1>
            <motion.div
              animate={{
                rotate: [0, -360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Sparkles className="w-10 h-10 text-blue-600" />
            </motion.div>
          </div>
          <p className="text-slate-600 text-lg">Connect, Learn, and Grow Together</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-2xl backdrop-blur-sm bg-white/95 border-2 border-slate-200 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600"></div>
          <CardHeader>
            <CardTitle className="text-slate-800">{isSignup ? 'Create Account' : 'Welcome Back'}</CardTitle>
            <CardDescription className="text-slate-600">
              {isSignup ? 'Sign up to get started' : 'Sign in to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeRole} onValueChange={(v) => setActiveRole(v as UserRole)}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                {roles.map(role => (
                  <TabsTrigger key={role.value} value={role.value} className="gap-2">
                    <role.icon className="w-4 h-4" />
                    {role.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {roles.map(role => (
                <TabsContent key={role.value} value={role.value}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <role.icon className="w-5 h-5 text-blue-600" />
                      <h3 className="text-slate-800 font-semibold">{role.label} Account</h3>
                    </div>
                    <p className="text-sm text-slate-600">{role.description}</p>
                  </motion.div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignup && (
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={`${role.value}@example.com`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-700">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    {isSignup && role.value === 'user' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="stream" className="text-slate-700">Stream</Label>
                          <Select value={selectedStream} onValueChange={setSelectedStream}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your stream" />
                            </SelectTrigger>
                            <SelectContent>
                              {streams.map(stream => (
                                <SelectItem key={stream} value={stream}>
                                  {stream}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700">Skills (Select your skills)</Label>
                          <div className="border rounded-lg p-3 max-h-48 overflow-y-auto bg-slate-50">
                            <div className="flex flex-wrap gap-2">
                              {skills.map(skill => (
                                <Badge
                                  key={skill}
                                  variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                                  className="cursor-pointer hover:bg-blue-100 transition-colors"
                                  onClick={() => toggleSkill(skill)}
                                >
                                  {skill}
                                  {selectedSkills.includes(skill) && (
                                    <X className="w-3 h-3 ml-1" />
                                  )}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {selectedSkills.length > 0 && (
                            <p className="text-sm text-slate-600">
                              {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700">Hobbies (Select your interests)</Label>
                          <div className="border rounded-lg p-3 max-h-48 overflow-y-auto bg-slate-50">
                            <div className="flex flex-wrap gap-2">
                              {hobbies.map(hobby => (
                                <Badge
                                  key={hobby}
                                  variant={selectedHobbies.includes(hobby) ? 'default' : 'outline'}
                                  className="cursor-pointer hover:bg-blue-100 transition-colors"
                                  onClick={() => toggleHobby(hobby)}
                                >
                                  {hobby}
                                  {selectedHobbies.includes(hobby) && (
                                    <X className="w-3 h-3 ml-1" />
                                  )}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {selectedHobbies.length > 0 && (
                            <p className="text-sm text-slate-600">
                              {selectedHobbies.length} hobby{selectedHobbies.length > 1 ? 'ies' : ''} selected
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="bg-green-50 text-green-900 border-green-200">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg" disabled={loading}>
                        {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
                      </Button>
                    </motion.div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignup(!isSignup);
                          setError('');
                          setSuccess('');
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                      </button>
                    </div>

                    {!isSignup && (
                      <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-600">
                        <p className="mb-1">Demo credentials:</p>
                        <p>User: user@example.com / password</p>
                        <p>Organizer: organizer@example.com / password</p>
                        <p>Authority: authority@example.com / password</p>
                      </div>
                    )}
                  </form>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}