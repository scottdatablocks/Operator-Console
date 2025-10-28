import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchProviderPods } from "@/utils/api";
import { Server, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Nodes() {
  const [pods, setPods] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadPods() {
    setLoading(true);
    try {
      const data = await fetchProviderPods();
      setPods(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPods();
    const interval = setInterval(loadPods, 15000);
    return () => clearInterval(interval);
  }, []);

  function getStatusIcon(pod) {
    const phase = pod.status?.phase?.toLowerCase();
    const ready = pod.status?.containerStatuses?.[0]?.ready;

    if (phase === "running" && ready) {
      return <CheckCircle className="h-5 w-5 text-emerald-400" />;
    }
    if (phase === "pending") {
      return <AlertCircle className="h-5 w-5 text-amber-400" />;
    }
    return <XCircle className="h-5 w-5 text-red-400" />;
  }

  function getStatusBadge(pod) {
    const phase = pod.status?.phase;
    const ready = pod.status?.containerStatuses?.[0]?.ready;

    if (phase === "Running" && ready) return <Badge variant="success">Ready</Badge>;
    if (phase === "Pending") return <Badge variant="warning">Pending</Badge>;
    if (phase === "Failed") return <Badge variant="destructive">Failed</Badge>;
    return <Badge variant="secondary">{phase || "Unknown"}</Badge>;
  }

  if (loading && !pods) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading provider nodes...</p>
        </div>
      </div>
    );
  }

  const items = pods?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Provider Nodes</h1>
          <p className="text-muted-foreground">
            Akash provider pods running in <code className="text-sm bg-muted px-2 py-1 rounded">akash-services</code>
          </p>
        </div>
        <Button onClick={loadPods} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pods</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              {items.filter(p => p.status?.phase === "Running" && p.status?.containerStatuses?.[0]?.ready).length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">
              {items.filter(p => p.status?.phase !== "Running" || !p.status?.containerStatuses?.[0]?.ready).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pods List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Active Pods</CardTitle>
          <CardDescription>
            {items.length === 0 ? "No pods found" : `${items.length} pod${items.length !== 1 ? "s" : ""} detected`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No provider pods detected. Check your cluster connection.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((pod, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border transition-colors hover:border-primary/50"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(pod)}
                    <div>
                      <p className="font-medium">{pod.metadata?.name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">
                        {pod.metadata?.namespace || "default"} •{" "}
                        {pod.status?.containerStatuses?.[0]?.restartCount || 0} restarts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(pod)}
                    <Badge variant="outline" className="font-mono text-xs">
                      {pod.status?.phase || "—"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
