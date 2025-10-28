import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Activity, Shield, AlertTriangle, CheckCircle } from "lucide-react";

// Mock events - in production this would come from an API
const mockEvents = [
  { id: 1, type: "preflight", title: "Preflight Validation Completed", status: "success", timestamp: new Date(Date.now() - 300000).toISOString(), details: "All 42 checks passed" },
  { id: 2, type: "security", title: "Boot-Guard Verification", status: "success", timestamp: new Date(Date.now() - 900000).toISOString(), details: "127 files verified" },
  { id: 3, type: "deployment", title: "Provider Pod Restarted", status: "warning", timestamp: new Date(Date.now() - 1800000).toISOString(), details: "provider-node-7f9x4" },
  { id: 4, type: "runtime", title: "High CPU Usage Detected", status: "warning", timestamp: new Date(Date.now() - 3600000).toISOString(), details: "CPU usage reached 85%" },
  { id: 5, type: "preflight", title: "Chart Version Updated", status: "info", timestamp: new Date(Date.now() - 7200000).toISOString(), details: "Updated to v12.1.3" },
];

export default function Events() {
  function getEventIcon(type) {
    switch (type) {
      case "preflight": return <AlertTriangle className="h-5 w-5" />;
      case "security": return <Shield className="h-5 w-5" />;
      case "runtime": return <Activity className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  }

  function getStatusVariant(status) {
    switch (status) {
      case "success": return "success";
      case "warning": return "warning";
      case "error": return "destructive";
      default: return "default";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Events</h1>
        <p className="text-muted-foreground">
          Real-time event timeline and system activity log
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Event Timeline
          </CardTitle>
          <CardDescription>
            Latest system events and status changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-card border transition-colors hover:border-primary/50"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{event.title}</p>
                    <Badge variant={getStatusVariant(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.details}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
