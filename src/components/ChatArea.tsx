import { useState, useRef, KeyboardEvent } from 'react';
import { Minus, Square, X, Bell, Plus, Shuffle, Clock, ChevronDown, ArrowUp, ChevronRight, Plug, Terminal, HelpCircle } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { MCPConnectionDialog } from './MCPConnectionDialog';
import { MCPToolsPanel } from './MCPToolsPanel';
import { ServerSetupGuide } from './ServerSetupGuide';
import { useMCPConnection } from '../hooks/useMCPConnection';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

export function ChatArea() {
  const [showMCPDialog, setShowMCPDialog] = useState(false);
  const [showToolsPanel, setShowToolsPanel] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { connectionStatus, mcpConfig, messages, connect, disconnect, sendMessage } = useMCPConnection();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    await sendMessage(inputValue);
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isConnected = connectionStatus === 'connected';

  return (
    <div className="flex-1 flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-12 bg-[#212121] border-b border-gray-800 flex items-center justify-between px-4">
          <div className="flex-1 flex items-center gap-2">
            <button
              onClick={() => setShowToolsPanel(!showToolsPanel)}
              className="flex items-center gap-2 px-2 py-1 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            >
              <Terminal size={14} />
              <span>MCP Tools</span>
            </button>
            <Sheet open={showSetupGuide} onOpenChange={setShowSetupGuide}>
              <SheetTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors">
                  <HelpCircle size={14} />
                  <span>Setup Help</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#1a1a1a] border-gray-800 text-gray-200 w-[600px] max-w-[90vw] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-gray-200">MCP Server Setup Guide</SheetTitle>
                  <SheetDescription className="text-gray-400">
                    Follow these steps to connect your Kali Linux MCP server
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <ServerSetupGuide />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="text-sm text-gray-400">Claude — Control+Alt+Space</div>
          <div className="flex-1 flex items-center justify-end gap-4">
            <button className="text-gray-400 hover:text-gray-200 transition-colors">
              <Minus size={16} />
            </button>
            <button className="text-gray-400 hover:text-gray-200 transition-colors">
              <Square size={14} />
            </button>
            <button className="text-gray-400 hover:text-gray-200 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-8 relative">
          {/* Notification Bell */}
          <button className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors z-10">
            <Bell size={18} />
          </button>

          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Free Plan Badge */}
              <div className="mb-16 px-3 py-1.5 bg-[#2a2a2a] rounded-full text-xs text-gray-400 border border-gray-700">
                Free plan · <span className="text-gray-300">Upgrade</span>
              </div>

              {/* Greeting */}
              <div className="flex items-center gap-3 mb-12">
                <Sparkles size={32} className="text-orange-500" fill="currentColor" />
                <h1 className="text-4xl text-gray-300">Good evening, arul_kali_mcp</h1>
              </div>
            </div>
          ) : (
            /* Messages Area */
            <ScrollArea className="flex-1 py-8">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg, idx) => (
                  <div key={idx} className="space-y-2">
                    {msg.role === 'user' && (
                      <div className="flex justify-end">
                        <div className="bg-[#2a2a2a] rounded-2xl px-4 py-3 max-w-[80%]">
                          <p className="text-gray-200">{msg.content}</p>
                        </div>
                      </div>
                    )}
                    {msg.role === 'assistant' && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
                          <Sparkles size={16} fill="white" className="text-white" />
                        </div>
                        <div className="flex-1 space-y-2">
                          {msg.toolUsed && (
                            <Badge className="bg-blue-600 text-xs">Tool: {msg.toolUsed}</Badge>
                          )}
                          <div className="bg-[#2a2a2a] rounded-2xl px-4 py-3">
                            <pre className="text-gray-200 whitespace-pre-wrap font-sans text-sm">{msg.content}</pre>
                          </div>
                        </div>
                      </div>
                    )}
                    {msg.role === 'system' && (
                      <div className="flex justify-center">
                        <div className="bg-blue-900/30 border border-blue-700 rounded-lg px-4 py-2 text-sm text-blue-300">
                          {msg.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Input Area - Fixed at bottom */}
          <div className="py-4">
            <div className="w-full max-w-3xl mx-auto">
              <div className="bg-[#2a2a2a] rounded-2xl border border-gray-700 overflow-hidden">
                {/* Text Input */}
                <div className="p-4">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="How can I help you today?"
                    className="w-full bg-transparent text-gray-200 placeholder-gray-500 resize-none outline-none min-h-[60px]"
                    rows={3}
                  />
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between px-4 pb-4">
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors">
                      <Plus size={18} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors">
                      <Shuffle size={18} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors">
                      <Clock size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors">
                      Sonnet 4.5
                      <ChevronDown size={14} />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="w-8 h-8 flex items-center justify-center bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      <ArrowUp size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* MCP Connection Banner */}
              <div
                onClick={() => setShowMCPDialog(true)}
                className="mt-4 flex items-center justify-between px-4 py-3 bg-[#2a2a2a] rounded-xl border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Plug size={16} className={isConnected ? 'text-green-500' : 'text-gray-400'} />
                  <span className="text-sm text-gray-400">
                    {isConnected ? `Connected to ${mcpConfig?.name}` : 'Connect to Kali Linux MCP Server'}
                  </span>
                  {isConnected && <Badge className="bg-green-600 text-xs">Active</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded"></div>
                    <div className="w-4 h-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded"></div>
                    <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded"></div>
                  </div>
                  <ChevronRight size={16} className="text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MCP Tools Side Panel */}
      {showToolsPanel && (
        <div className="w-80 bg-[#1a1a1a] border-l border-gray-800">
          <div className="h-12 bg-[#212121] border-b border-gray-800 flex items-center justify-between px-4">
            <span className="text-sm text-gray-300">MCP Tools</span>
            <button
              onClick={() => setShowToolsPanel(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <X size={16} />
            </button>
          </div>
          <MCPToolsPanel isConnected={isConnected} />
        </div>
      )}

      {/* MCP Connection Dialog */}
      <MCPConnectionDialog
        open={showMCPDialog}
        onOpenChange={setShowMCPDialog}
        onConnect={connect}
        connectionStatus={connectionStatus}
      />
    </div>
  );
}
