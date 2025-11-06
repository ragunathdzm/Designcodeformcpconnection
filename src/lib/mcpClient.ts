/**
 * MCP (Model Context Protocol) Client for Kali Linux Server
 * 
 * This client communicates with your Kali Linux MCP server running at http://192.168.1.93:5000/
 */

export interface MCPRequest {
  method: string;
  params?: Record<string, any>;
  id?: string;
}

export interface MCPResponse {
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id?: string;
}

export class MCPClient {
  private serverUrl: string;
  private requestId: number = 0;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Test server connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.serverUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * List available MCP tools
   */
  async listTools(): Promise<any[]> {
    const response = await this.makeRequest({
      method: 'tools/list'
    });
    return response.result?.tools || [];
  }

  /**
   * Execute a tool with parameters
   */
  async executeTool(toolName: string, params: Record<string, any>): Promise<any> {
    const response = await this.makeRequest({
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: params
      }
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.result;
  }

  /**
   * Send a chat message to the MCP server
   */
  async sendMessage(message: string): Promise<string> {
    try {
      const response = await fetch(`${this.serverUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || data.output || JSON.stringify(data);
    } catch (error) {
      throw new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Make a generic MCP JSON-RPC request
   */
  private async makeRequest(request: MCPRequest): Promise<MCPResponse> {
    const id = request.id || `${++this.requestId}`;
    
    try {
      const response = await fetch(`${this.serverUrl}/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          ...request,
          id
        }),
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        error: {
          code: -1,
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        id
      };
    }
  }

  /**
   * Execute a raw command on Kali Linux
   */
  async executeCommand(command: string): Promise<string> {
    const response = await this.makeRequest({
      method: 'system/execute',
      params: { command }
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.result?.output || '';
  }
}
