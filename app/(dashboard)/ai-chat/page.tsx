import ChatBot from "@/components/ChatBot";
import API_URL from '@/services/api';

export default function AiChatPage() {
  return (
    <main className="min-h-screen">
      <ChatBot />
    </main>
  );
}