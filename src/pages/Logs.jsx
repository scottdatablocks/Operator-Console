import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { List, Terminal } from "lucide-react";

const mockLogs = [
  { time: "16:42:13", level: "info", message: "Preflight validation completed successfully" },
  { time: "16:41:58", level: "info", message: "Boot-Guard verified 127 files" },
  { time: "16:41:45", level: "warn", message: "High CPU usage detected: 85%" },
  { time: "16:41:30", level: "info", message: "Provider pod provider-node-7f9x4 restarted" },
  { time: "16:41:15", level: "info", message: "Runtime metrics collected" },
  { time: "16:41:00", level: "info", message: "Nginx configuration reloaded" },
  { time: "16:40:45", level: "error", message: "Failed to connect to metrics exporter" },
  { time: "16:40:30", level: "info", message: "Cloudflare cache purged" },
];

export default function Logs() {
  function getLevelBadge(level) {
    switch (level) {
      case "error": return <Badge variant="destructive">ERROR</Badge>;
      case "warn": return <Badge variant="warning">WARN</Badge>;
      case "info": return <Badge variant="success">INFO</Badge>;
      default: return <Badge variant="default">{level.toUpperCase()}</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
        <p className="text-muted-foreground">
          Real-time logs from Harmonix Observer and runtime subsystems
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Runtime Log Stream
          </CardTitle>
          <CardDescription>
            Log file: <code className="text-xs">/root/harmonix/ledger/runtime_v9.log</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm space-y-2 max-h-[500px] overflow-y-auto">
            {mockLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-4 text-xs">
                <span className="text-muted-foreground">{log.time}</span>
                {getLevelBadge(log.level)}
                <span className="flex-1 text-foreground">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Available Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 rounded bg-card border">
              <code>preflight_v9.log</code>
              <Badge variant="outline">2.3 KB</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-card border">
              <code>runtime_v9.log</code>
              <Badge variant="outline">15.7 KB</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-card border">
              <code>build_v9.log</code>
              <Badge variant="outline">4.1 KB</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-card border">
              <code>learning_v9.md</code>
              <Badge variant="outline">8.9 KB</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
