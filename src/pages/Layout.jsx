import { Link, useLocation } from "react-router-dom";
import { Activity, Shield, AlertTriangle, Server, List, Info } from "lucide-react";

const navigation = [
  { name: "Overview", path: "/", icon: Activity },
  { name: "Nodes", path: "/nodes", icon: Server },
  { name: "Events", path: "/events", icon: List },
  { name: "Preflight", path: "/preflight", icon: AlertTriangle },
  { name: "Installer", path: "/installer", icon: Shield },
  { name: "Logs", path: "/logs", icon: List },
  { name: "About", path: "/about", icon: Info },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background harmonix-gradient">
      {/* Sidebar */}
      <aside className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col">
        {/* Brand Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-cyan-600 shadow-lg shadow-primary/50" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Harmonix
              </h1>
              <p className="text-xs text-muted-foreground">
                Operator Console v9.0
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Monitor • Validate • Deploy • Orchestrate
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Data Blocks LLC
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Powered by Harmonix™
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
