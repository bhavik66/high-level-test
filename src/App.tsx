import Layout from '@/components/Layout';
import ConversationsView from '@/features/conversations/ConversationView';
import ContextView from './features/contact/components/ContactView';
import NotesView from './features/notes/components/NotesView';

function App() {
  return (
    <div className="p-4 h-screen">
      <div className="grid grid-cols-12 gap-4 h-full">
        <Layout className="col-span-3 h-full">
          <ContextView />
        </Layout>
        <Layout className="col-span-6 h-full overflow-y-auto">
          <ConversationsView />
        </Layout>
        <Layout className="col-span-3 h-full">
          <NotesView />
        </Layout>
      </div>
    </div>
  );
}

export default App;
