import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, Server, Code, Network } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function ServerSetupGuide() {
  return (
    <div className="space-y-4">
      <Alert className="border-blue-600 bg-blue-950/30">
        <AlertCircle className="h-4 w-4 text-blue-400" />
        <AlertTitle className="text-gray-200">MCP Server Required</AlertTitle>
        <AlertDescription className="text-gray-300">
          Your Kali Linux MCP server must be running at http://192.168.1.99:5000/ with CORS enabled.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="quick" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#2a2a2a]">
          <TabsTrigger value="quick" className="data-[state=active]:bg-orange-600">Quick Start</TabsTrigger>
          <TabsTrigger value="flask" className="data-[state=active]:bg-orange-600">Flask Server</TabsTrigger>
          <TabsTrigger value="debug" className="data-[state=active]:bg-orange-600">Debug</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-3">
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <Server size={18} />
                Start Your Server
              </CardTitle>
              <CardDescription className="text-gray-400">
                Run these commands in your Kali terminal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-xs text-gray-400 mb-1">1. Navigate to server directory:</div>
                <code className="block bg-[#1a1a1a] p-2 rounded text-sm text-green-400">
                  cd D:/MCP_kali/MCP-Kali-Server/
                </code>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">2. Install dependencies:</div>
                <code className="block bg-[#1a1a1a] p-2 rounded text-sm text-green-400">
                  pip install flask flask-cors
                </code>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">3. Run the server:</div>
                <code className="block bg-[#1a1a1a] p-2 rounded text-sm text-green-400">
                  python mcp_server.py --server http://192.168.1.99:5000/
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flask" className="space-y-3">
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <Code size={18} />
                Minimal Flask Server
              </CardTitle>
              <CardDescription className="text-gray-400">
                Add this to your mcp_server.py
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-[#1a1a1a] p-3 rounded text-xs text-gray-300 overflow-x-auto">
{`from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'message': 'Kali MCP Server is running'
    })

@app.route('/execute', methods=['POST'])
def execute():
    data = request.json
    message = data.get('message', '')
    
    # Your MCP tool logic here
    response = {
        'response': f'Received: {message}',
        'tool': 'kali_tool'
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug" className="space-y-3">
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <Network size={18} />
                Connection Diagnostics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-300">
              <div>
                <div className="text-gray-400 mb-1">Test from command line:</div>
                <code className="block bg-[#1a1a1a] p-2 rounded text-green-400">
                  curl http://192.168.1.99:5000/health
                </code>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Expected response:</div>
                <code className="block bg-[#1a1a1a] p-2 rounded text-blue-400">
                  {`{"status": "ok", "message": "..."}`}
                </code>
              </div>
              <div className="space-y-1 text-xs">
                <div className="text-gray-400">Common Issues:</div>
                <div>• Server not running → Start the server first</div>
                <div>• CORS blocked → Add flask-cors to your server</div>
                <div>• Wrong IP → Verify with: <code className="bg-gray-800 px-1">ifconfig</code></div>
                <div>• Firewall → Allow port 5000 in firewall settings</div>
                <div>• Different network → Both must be on same WiFi/LAN</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
