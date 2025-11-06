import { useState, useCallback } from 'react';
import { MCPConfig } from '../components/MCPConnectionDialog';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface MCPMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolUsed?: string;
}

export function useMCPConnection() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [mcpConfig, setMcpConfig] = useState<MCPConfig | null>(null);
  const [messages, setMessages] = useState<MCPMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const connect = useCallback(async (config: MCPConfig) => {
    setConnectionStatus('connecting');
    setMcpConfig(config);

    try {
      // Create an abort controller for manual timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Test connection to the MCP server
      const response = await fetch(`${config.serverUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      setConnectionStatus('connected');
      setSessionId(data.sessionId || Date.now().toString());
      
      setMessages(prev => [...prev, {
        role: 'system',
        content: `✓ Connected to ${config.name} at ${config.serverUrl}\n${data.message || 'MCP tools are now available.'}`,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus('error');
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Connection timeout - server did not respond within 5 seconds';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot reach server - check if MCP server is running and CORS is enabled';
        } else {
          errorMessage = error.message;
        }
      }
      
      setMessages(prev => [...prev, {
        role: 'system',
        content: `✗ Failed to connect to ${config.serverUrl}\n\nError: ${errorMessage}\n\nPlease ensure:\n1. The MCP server is running at ${config.serverUrl}\n2. CORS is enabled on the server\n3. Your firewall allows the connection\n4. Both devices are on the same network`,
        timestamp: new Date()
      }]);
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnectionStatus('disconnected');
    setMcpConfig(null);
    setSessionId(null);
    setMessages(prev => [...prev, {
      role: 'system',
      content: 'Disconnected from MCP server.',
      timestamp: new Date()
    }]);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (connectionStatus !== 'connected' || !mcpConfig) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Please connect to MCP server first.',
        timestamp: new Date()
      }]);
      return;
    }

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: message,
      timestamp: new Date()
    }]);

    try {
      // Create an abort controller for manual timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      // Send message to MCP server
      const response = await fetch(`${mcpConfig.serverUrl}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: sessionId,
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || data.output || 'No response from server',
        timestamp: new Date(),
        toolUsed: data.tool || data.toolUsed
      }]);

    } catch (error) {
      console.error('Message send error:', error);
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout - command took longer than 30 seconds';
        } else {
          errorMessage = error.message;
        }
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error executing command: ${errorMessage}\n\nThe MCP server may be unavailable or the request timed out.`,
        timestamp: new Date()
      }]);
    }
  }, [connectionStatus, mcpConfig, sessionId]);

  return {
    connectionStatus,
    mcpConfig,
    messages,
    connect,
    disconnect,
    sendMessage
  };
}
