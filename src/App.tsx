import ContextView from './features/contact/ContactView';
import ConversationsView from './features/conversations/ConversationView';
import NotesView from './features/notes/components/NotesView';

function App() {
  return (
    <div className="p-4 h-screen">
      <div className="grid grid-cols-12 gap-4 h-full">
        <div className="col-span-3 h-full">
          <ContextView />
        </div>
        <div className="col-span-6 h-full">
          <ConversationsView />
        </div>
        <div className="col-span-3 h-full">
          <NotesView />
        </div>
      </div>
    </div>
  );
}

export default App;
