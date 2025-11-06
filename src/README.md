# Claude MCP Interface

A Claude-style interface for connecting to your Kali Linux MCP (Model Context Protocol) server.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Your Kali Linux MCP server running at `http://192.168.1.99:5000/`

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
The app will automatically open at `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 MCP Server Setup

Your Kali Linux MCP server must be running with CORS enabled. See `README-MCP-Setup.md` for detailed instructions.

### Quick Server Setup:

1. Install Flask and Flask-CORS:
```bash
pip install flask flask-cors
```

2. Add CORS to your server:
```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS
```

3. Run your server:
```bash
python mcp_server.py --server http://192.168.1.99:5000/
```

## 🌐 Connecting to MCP Server

1. Click "Connect to Kali Linux MCP Server" in the interface
2. Use "Test Connection" button to verify server is reachable
3. Click "Connect" to establish connection
4. Start using Kali Linux security tools through natural language!

## 🛠️ Troubleshooting

### "Failed to fetch" Error
- ✓ Ensure MCP server is running
- ✓ CORS is enabled on the server
- ✓ Both devices are on the same network
- ✓ Firewall allows port 5000
- ✓ Server is bound to `0.0.0.0`, not `127.0.0.1`

### Connection Timeout
- Check if server responds: `curl http://192.168.1.99:5000/health`
- Verify the IP address is correct
- Check server logs for errors

## 📚 Features

- 🎨 Claude-style dark theme interface
- 🔌 Real-time MCP server connection
- 🛠️ Kali Linux security tools integration
- 💬 Natural language command interface
- 🔍 Connection diagnostics and troubleshooting
- 📖 Built-in setup guide

## 🏗️ Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- Radix UI Components
- Lucide Icons

## 📄 License

MIT
