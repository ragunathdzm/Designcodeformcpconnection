import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

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
    serverUrl: 'http://192.168.1.99:5000/'
  });
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  const handleConnect = () => {
    onConnect(config);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${config.serverUrl}/health`, {
        method: 'GET',
        mode: 'cors',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setTestStatus('success');
        setTestMessage(`✓ Server is reachable! ${data.message || ''}`);
      } else {
        setTestStatus('error');
        setTestMessage(`✗ Server responded with status ${response.status}`);
      }
    } catch (error) {
      setTestStatus('error');
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setTestMessage('✗ Connection timeout - server did not respond');
        } else if (error.message.includes('Failed to fetch')) {
          setTestMessage('✗ Cannot reach server. Check:\n• Server is running\n• CORS is enabled\n• Firewall allows port 5000');
        } else {
          setTestMessage(`✗ ${error.message}`);
        }
      }
    }
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
              placeholder="http://192.168.1.99:5000/"
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

          {/* Connection Status */}
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

          {/* Test Connection Result */}
          {testStatus !== 'idle' && (
            <Alert className={`${testStatus === 'success' ? 'border-green-600 bg-green-950/30' : testStatus === 'error' ? 'border-red-600 bg-red-950/30' : 'border-yellow-600 bg-yellow-950/30'}`}>
              {testStatus === 'testing' && <Loader2 className="h-4 w-4 animate-spin" />}
              {testStatus === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {testStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
              <AlertTitle className="text-gray-200">
                {testStatus === 'testing' ? 'Testing Connection...' : testStatus === 'success' ? 'Connection Test Passed' : 'Connection Test Failed'}
              </AlertTitle>
              <AlertDescription className="text-gray-300 whitespace-pre-line">
                {testMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Troubleshooting Help */}
          {connectionStatus === 'error' && (
            <Alert className="border-blue-600 bg-blue-950/30">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertTitle className="text-gray-200">Troubleshooting Steps</AlertTitle>
              <AlertDescription className="text-gray-300 text-xs space-y-1">
                <div>1. Start your MCP server: <code className="bg-gray-800 px-1 rounded">python mcp_server.py</code></div>
                <div>2. Add CORS to server: <code className="bg-gray-800 px-1 rounded">from flask_cors import CORS; CORS(app)</code></div>
                <div>3. Check server logs for errors</div>
                <div>4. Verify both devices are on same network</div>
                <div>5. Use "Test Connection" button above</div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-between gap-2">
          <Button
            onClick={handleTestConnection}
            disabled={testStatus === 'testing'}
            variant="outline"
            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            {testStatus === 'testing' ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </Button>
          <div className="flex gap-2">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
