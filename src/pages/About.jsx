import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, GitBranch, Package, Cpu } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
        <p className="text-muted-foreground">
          Harmonix Operator Console — Technical Information
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Console Information
          </CardTitle>
          <CardDescription>Version 9.0 Doctrine Edition</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Version</p>
              <Badge className="text-sm">v9.0.0 Doctrine Edition</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Maintainer</p>
              <p className="text-sm">Scott Redfern</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Organization</p>
              <p className="text-sm">Data Blocks LLC</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Primary Domain</p>
              <p className="text-sm font-mono">operator.data-blocks.ai/v9/</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Frontend Framework</span>
              <span className="font-mono">React 19.1.1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Build Tool</span>
              <span className="font-mono">Vite 7.1.7</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Routing</span>
              <span className="font-mono">React Router DOM 7.9.4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Styling</span>
              <span className="font-mono">Tailwind CSS 3.4.4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">UI Components</span>
              <span className="font-mono">Radix UI</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Deployment Environment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Production Node</span>
              <span className="font-mono">Node001 (138.128.186.74)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Web Server</span>
              <span className="font-mono">Nginx 1.24.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">OS</span>
              <span className="font-mono">Ubuntu 22.04 LTS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">CDN</span>
              <span className="font-mono">Cloudflare Edge</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Source Repository
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <a
              href="https://github.com/scottdatablocks/Operator-Console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              github.com/scottdatablocks/Operator-Console
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
