import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';

export default function App() {
  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-200">
      <Sidebar />
      <ChatArea />
    </div>
  );
}
