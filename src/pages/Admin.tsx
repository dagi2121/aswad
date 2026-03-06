import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Search,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

// Mock Data
const MOCK_BOOKINGS = [
  { id: 1, client: "Abebe Kebede", package: "Starter Identity", date: "2024-03-15", status: "pending", amount: "15,000 ETB" },
  { id: 2, client: "Sara Tadesse", package: "Professional Brand", date: "2024-03-14", status: "completed", amount: "35,000 ETB" },
  { id: 3, client: "Tech Solutions PLC", package: "Enterprise Suite", date: "2024-03-12", status: "in-progress", amount: "65,000 ETB" },
  { id: 4, client: "Cafe Aroma", package: "Starter Identity", date: "2024-03-10", status: "completed", amount: "15,000 ETB" },
];

const MOCK_MESSAGES = [
  { id: 1, from: "John Doe", email: "john@example.com", subject: "Logo Design Inquiry", date: "2h ago", read: false },
  { id: 2, from: "Alice Smith", email: "alice@test.com", subject: "Rebranding Project", date: "5h ago", read: true },
  { id: 3, from: "Marketing Team", email: "marketing@company.com", subject: "Partnership Proposal", date: "1d ago", read: true },
];

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Fallback for demo purposes if Supabase is not fully configured
    if (email === 'admin' && password === 'admin123') {
       setIsAuthenticated(true);
       setLoading(false);
       return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-zinc-400 text-sm">Please sign in to continue</p>
            {import.meta.env.VITE_SUPABASE_URL && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-medium uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Supabase Connected
              </div>
            )}
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 uppercase">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="Enter email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="Enter password"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 mt-4 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <p className="text-xs text-center text-zinc-500 mt-4">
              Demo access: admin / admin123
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">ASWAD <span className="text-orange-500">ADMIN</span></h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Users} label="Bookings" active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
          <SidebarItem icon={MessageSquare} label="Messages" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-zinc-400 hover:text-white w-full px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-6 sticky top-0 backdrop-blur-md z-10">
          <h1 className="text-lg font-bold capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                placeholder="Search..." 
                className="bg-zinc-950 border border-zinc-800 rounded-full pl-10 pr-4 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500 w-64"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'bookings' && <BookingsView />}
          {activeTab === 'messages' && <MessagesView />}
          {activeTab === 'settings' && <div className="text-zinc-500">Settings panel coming soon...</div>}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all",
        active ? "bg-orange-500/10 text-orange-500 font-medium" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}

function DashboardView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="130,000 ETB" change="+12%" />
        <StatCard title="Active Bookings" value="8" change="+2" />
        <StatCard title="New Messages" value="12" change="+5" />
        <StatCard title="Pending Review" value="3" change="-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b border-zinc-800/50 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">New booking from Tech Corp</p>
                  <p className="text-xs text-zinc-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col gap-2 border-zinc-700 hover:bg-zinc-800 hover:text-white">
              <Users className="w-6 h-6" />
              Add Client
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 border-zinc-700 hover:bg-zinc-800 hover:text-white">
              <MessageSquare className="w-6 h-6" />
              Send Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change }: any) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
      <p className="text-zinc-400 text-xs uppercase font-bold mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <span className={cn("text-xs font-bold px-2 py-1 rounded-full", isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
          {change}
        </span>
      </div>
    </div>
  );
}

function BookingsView() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs font-bold">
          <tr>
            <th className="px-6 py-4">Client</th>
            <th className="px-6 py-4">Package</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {MOCK_BOOKINGS.map((booking) => (
            <tr key={booking.id} className="hover:bg-zinc-800/50 transition-colors">
              <td className="px-6 py-4 font-medium text-white">{booking.client}</td>
              <td className="px-6 py-4 text-zinc-300">{booking.package}</td>
              <td className="px-6 py-4 text-zinc-400">{booking.date}</td>
              <td className="px-6 py-4 text-white font-mono">{booking.amount}</td>
              <td className="px-6 py-4">
                <StatusBadge status={booking.status} />
              </td>
              <td className="px-6 py-4">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };
  
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize", styles[status as keyof typeof styles])}>
      {status}
    </span>
  );
}

function MessagesView() {
  return (
    <div className="space-y-4">
      {MOCK_MESSAGES.map((msg) => (
        <div key={msg.id} className={cn("p-4 rounded-xl border transition-all cursor-pointer", msg.read ? "bg-zinc-900 border-zinc-800" : "bg-zinc-800/50 border-orange-500/20")}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{msg.from}</span>
              <span className="text-xs text-zinc-500">&lt;{msg.email}&gt;</span>
            </div>
            <span className="text-xs text-zinc-500">{msg.date}</span>
          </div>
          <h4 className="text-sm font-medium text-zinc-200 mb-1">{msg.subject}</h4>
          <p className="text-sm text-zinc-400 line-clamp-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
          </p>
        </div>
      ))}
    </div>
  );
}
