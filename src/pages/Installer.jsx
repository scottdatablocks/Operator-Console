import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Download, CheckCircle, AlertTriangle } from "lucide-react";

export default function Installer() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Harmonix Installer</h1>
        <p className="text-muted-foreground">
          Atomic deployment, rollback, and promotion tools
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Installation Status
          </CardTitle>
          <CardDescription>
            Script: <code className="text-xs">/root/harmonix/installer_v9.2.sh</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Current Version</p>
              <p className="text-2xl font-bold">v9.0</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Last Deployment</p>
              <Badge variant="success" className="text-sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                Success
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Deployment Workflow</h4>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Verify preflight completion
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Clear <code>/var/www/operator-console/v9/*</code>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Copy new build via scp/rsync
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Purge Cloudflare cache
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Reload Nginx
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Record build hash in ledger
              </li>
            </ol>
          </div>

          <div className="pt-4 border-t space-x-2">
            <Button disabled>
              <Download className="h-4 w-4 mr-2" />
              Deploy New Version
            </Button>
            <Button variant="outline" disabled>
              Rollback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
