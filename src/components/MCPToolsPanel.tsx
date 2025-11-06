import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Terminal, Network, FileSearch, Shield, Wrench } from 'lucide-react';

interface MCPTool {
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface MCPToolsPanelProps {
  isConnected: boolean;
}

export function MCPToolsPanel({ isConnected }: MCPToolsPanelProps) {
  const tools: MCPTool[] = [
    {
      name: 'nmap_scan',
      description: 'Network discovery and security auditing',
      icon: <Network size={16} />
    },
    {
      name: 'metasploit',
      description: 'Penetration testing framework',
      icon: <Shield size={16} />
    },
    {
      name: 'directory_scan',
      description: 'Web directory enumeration',
      icon: <FileSearch size={16} />
    },
    {
      name: 'exploit_search',
      description: 'Search for exploits and vulnerabilities',
      icon: <Wrench size={16} />
    },
    {
      name: 'run_command',
      description: 'Execute custom Kali commands',
      icon: <Terminal size={16} />
    }
  ];

  if (!isConnected) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-4 text-center">
        Connect to MCP server to view available tools
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-400">Available Tools</h3>
          <Badge className="bg-green-600 text-xs">Active</Badge>
        </div>
        
        {tools.map((tool) => (
          <button
            key={tool.name}
            className="w-full p-3 bg-[#2a2a2a] hover:bg-[#333333] rounded-lg border border-gray-700 hover:border-gray-600 transition-colors text-left"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-orange-500">{tool.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-200">{tool.name}</div>
                <div className="text-xs text-gray-500 mt-1">{tool.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
