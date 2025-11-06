# MCP Server Connection Guide

This application connects to your Kali Linux MCP server running at `http://192.168.1.99:5000/`

## Prerequisites

Your Kali Linux MCP server must expose the following HTTP endpoints:

### Required Endpoints

1. **Health Check** (GET)
   ```
   GET /health
   
   Response:
   {
     "status": "ok",
     "message": "MCP Server is running",
     "sessionId": "optional-session-id"
   }
   ```

2. **Execute Command** (POST)
   ```
   POST /execute
   Content-Type: application/json
   
   Body:
   {
     "message": "scan network with nmap",
     "sessionId": "session-id",
     "timestamp": "2025-11-06T..."
   }
   
   Response:
   {
     "response": "Command output...",
     "tool": "nmap_scan",
     "status": "success"
   }
   ```

3. **Chat/Message** (POST) - Alternative endpoint
   ```
   POST /chat
   Content-Type: application/json
   
   Body:
   {
     "message": "user message here"
   }
   
   Response:
   {
     "response": "assistant response",
     "output": "tool output"
   }
   ```

4. **JSON-RPC** (POST) - For MCP protocol compliance
   ```
   POST /rpc
   Content-Type: application/json
   
   Body:
   {
     "jsonrpc": "2.0",
     "method": "tools/list",
     "id": "1"
   }
   
   Response:
   {
     "jsonrpc": "2.0",
     "result": {
       "tools": [...]
     },
     "id": "1"
   }
   ```

## CORS Configuration

Your MCP server MUST enable CORS to allow browser requests. Add these headers to your server responses:

```python
# For Flask
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Or manually:
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response
```

## Example MCP Server Implementation

Here's a minimal Flask server that implements the required endpoints:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'message': 'Kali MCP Server is running',
        'version': '1.0.0'
    })

@app.route('/execute', methods=['POST'])
def execute():
    data = request.json
    message = data.get('message', '')
    
    # Your MCP logic here
    # Parse message, determine tool, execute command
    
    response = {
        'response': f'Executed: {message}',
        'tool': 'kali_tool',
        'status': 'success'
    }
    return jsonify(response)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    
    # Process message with your MCP tools
    
    return jsonify({
        'response': 'Tool output here',
        'output': 'Command results'
    })

if __name__ == '__main__':
    app.run(host='192.168.1.99', port=5000, debug=True)
```

## Running Your Server

1. Make sure your MCP server is running:
   ```bash
   cd D:/MCP_kali/MCP-Kali-Server/
   python mcp_server.py --server http://192.168.1.99:5000/
   ```

2. Verify it's accessible:
   ```bash
   curl http://192.168.1.99:5000/health
   ```

3. Connect from this application by clicking "Connect to Kali Linux MCP Server"

## Troubleshooting

### Connection Failed
- Check if the server is running: `curl http://192.168.1.99:5000/health`
- Verify firewall allows port 5000
- Check if CORS is enabled on the server

### CORS Errors
- Add CORS headers to all server responses
- Use `flask-cors` package for Flask servers

### Timeout Errors
- Increase timeout values if commands take longer
- Check network connectivity between browser and server

### Server Not Responding
- Ensure server is bound to `0.0.0.0` or `192.168.1.99`, not `127.0.0.1`
- Check server logs for errors
- Verify the port (5000) is not blocked

## Network Requirements

- This browser app must be able to reach `http://192.168.1.99:5000/`
- Both devices must be on the same network OR port forwarding must be configured
- Firewall must allow incoming connections on port 5000
