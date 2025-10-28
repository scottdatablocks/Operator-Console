import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchPreflightReport } from "@/utils/api";
import { formatTimestamp, getStatusVariant } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Preflight() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadReport() {
    setLoading(true);
    try {
      const data = await fetchPreflightReport();
      setReport(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  if (loading && !report) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Running preflight checks...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No preflight report available</AlertDescription>
      </Alert>
    );
  }

  const { header, context, summary, results } = report;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preflight Validation</h1>
          <p className="text-muted-foreground">
            Pre-deployment system validation and chart verification
          </p>
        </div>
        <Button onClick={loadReport} variant="outline" size="sm" disabled={loading}>
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusVariant(summary?.overall)} className="text-lg">
              {summary?.overall || "Unknown"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.trustScore || 0}%</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checks Run</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.checks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary?.pass || 0} passed • {summary?.fail || 0} failed
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.durationSec || 0}s</div>
          </CardContent>
        </Card>
      </div>

      {/* Report Details */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
          <CardDescription>
            Version {header?.version} • Generated {formatTimestamp(header?.ts)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Chart</p>
              <p className="text-sm">{context?.chart || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Chart Version</p>
              <p className="text-sm">{context?.chartVersion || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Namespace</p>
              <p className="text-sm font-mono">{context?.namespace || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Mode</p>
              <Badge variant="outline">{header?.mode || "—"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Results */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Tier Validation Results</CardTitle>
          <CardDescription>
            Validation checks across {results?.length || 0} tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results && results.map((tier) => (
              <div
                key={tier.tier}
                className="flex items-center justify-between p-4 rounded-lg bg-card border"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold">
                    {tier.tier}
                  </div>
                  <div>
                    <p className="font-medium">Tier {tier.tier}</p>
                    {tier.issues && tier.issues.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {tier.issues.join("; ")}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={getStatusVariant(tier.status)}>
                  {tier.status || "Unknown"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
