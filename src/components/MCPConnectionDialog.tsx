import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface MCPConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (config: MCPConfig) => void;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface MCPConfig {
  name: string;
  command: string;
  args: string[];
  serverUrl: string;
}

export function MCPConnectionDialog({ open, onOpenChange, onConnect, connectionStatus }: MCPConnectionDialogProps) {
  const [config, setConfig] = useState<MCPConfig>({
    name: 'kali_mcp',
    command: 'python',
    args: ['D:/MCP_kali/MCP-Kali-Server/mcp_server.py', '--server'],
    serverUrl: 'http://192.168.1.93:5000/'
  });

  const handleConnect = () => {
    onConnect(config);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2a2a2a] border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Connect to MCP Server
            {connectionStatus === 'connected' && <Badge className="bg-green-600">Connected</Badge>}
            {connectionStatus === 'connecting' && <Badge className="bg-yellow-600">Connecting...</Badge>}
            {connectionStatus === 'error' && <Badge className="bg-red-600">Error</Badge>}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure your Kali Linux MCP server connection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">Server Name</Label>
            <Input
              id="name"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="bg-[#1a1a1a] border-gray-700 text-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="command" className="text-gray-300">Command</Label>
            <Input
              id="command"
              value={config.command}
              onChange={(e) => setConfig({ ...config, command: e.target.value })}
              className="bg-[#1a1a1a] border-gray-700 text-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serverUrl" className="text-gray-300">Server URL</Label>
            <Input
              id="serverUrl"
              value={config.serverUrl}
              onChange={(e) => setConfig({ ...config, serverUrl: e.target.value })}
              className="bg-[#1a1a1a] border-gray-700 text-gray-200"
              placeholder="http://192.168.1.93:5000/"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="args" className="text-gray-300">Arguments (comma separated)</Label>
            <Input
              id="args"
              value={config.args.join(', ')}
              onChange={(e) => setConfig({ ...config, args: e.target.value.split(',').map(arg => arg.trim()) })}
              className="bg-[#1a1a1a] border-gray-700 text-gray-200"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400 bg-[#1a1a1a] p-3 rounded border border-gray-700">
            {connectionStatus === 'connected' && (
              <>
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Connected to {config.serverUrl}</span>
              </>
            )}
            {connectionStatus === 'connecting' && (
              <>
                <Loader2 size={16} className="animate-spin text-yellow-500" />
                <span>Connecting to MCP server...</span>
              </>
            )}
            {connectionStatus === 'error' && (
              <>
                <XCircle size={16} className="text-red-500" />
                <span>Failed to connect. Check server configuration.</span>
              </>
            )}
            {connectionStatus === 'disconnected' && (
              <span>Not connected</span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={connectionStatus === 'connecting' || connectionStatus === 'connected'}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {connectionStatus === 'connecting' ? 'Connecting...' : connectionStatus === 'connected' ? 'Connected' : 'Connect'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
