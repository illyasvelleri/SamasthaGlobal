import ChatbotUI from './chatbot-ui/page';

export const metadata = {
  title: 'Samastha Smart City - AI Assistant',
  description: 'Your intelligent assistant for Samastha Smart City services',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function Home() {
  return <ChatbotUI />;
}