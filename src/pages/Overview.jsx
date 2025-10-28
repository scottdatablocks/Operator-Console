import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchDashboardData } from "@/utils/api";
import { formatTimestamp, getStatusVariant } from "@/lib/utils";
import { Activity, Shield, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function Overview() {
  const [data, setData] = useState({ runtime: null, security: null, preflight: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchDashboardData();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading system overview...</p>
        </div>
      </div>
    );
  }

  const { runtime, security, preflight } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground">
          Real-time monitoring and validation across Akash provider nodes
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Runtime Card */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Runtime Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {runtime ? (
              <>
                <div className="text-2xl font-bold">
                  {runtime.cpu_pct}% CPU
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {runtime.mem_pct}% Memory • Load: {runtime.load1}
                </p>
                <Badge variant={getStatusVariant(runtime.status)} className="mt-2">
                  {runtime.status || "Running"}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Integrity</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {security ? (
              <>
                <div className="text-2xl font-bold">
                  {security.files_verified || 0} Files
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Boot-Guard verified
                </p>
                <Badge variant={getStatusVariant(security.status)} className="mt-2">
                  {security.status || "Verified"}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Preflight Card */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preflight Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {preflight ? (
              <>
                <div className="text-2xl font-bold">
                  {preflight.summary?.trustScore || preflight.header?.version || "N/A"}
                  {preflight.summary?.trustScore && "%"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Chart: {preflight.context?.chartVersion || preflight.header?.chartVersion || "—"}
                </p>
                <Badge
                  variant={getStatusVariant(preflight.summary?.overall || preflight.result)}
                  className="mt-2"
                >
                  {preflight.summary?.overall || preflight.result || "Unknown"}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Events
          </CardTitle>
          <CardDescription>
            Latest system events and status updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {security && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Boot-Guard Validation</p>
                    <p className="text-xs text-muted-foreground">
                      {security.files_verified} files verified
                    </p>
                  </div>
                </div>
                <Badge variant="success">{formatTimestamp(security.timestamp)}</Badge>
              </div>
            )}
            {preflight && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Preflight Validation</p>
                    <p className="text-xs text-muted-foreground">
                      {preflight.summary?.checks || 0} checks completed
                    </p>
                  </div>
                </div>
                <Badge variant="success">
                  {formatTimestamp(preflight.header?.ts || preflight.timestamp)}
                </Badge>
              </div>
            )}
            {runtime && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Runtime Status</p>
                    <p className="text-xs text-muted-foreground">
                      CPU: {runtime.cpu_pct}% • Mem: {runtime.mem_pct}%
                    </p>
                  </div>
                </div>
                <Badge variant="success">{formatTimestamp(runtime.timestamp)}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
