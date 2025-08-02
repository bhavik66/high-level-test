import ConversationsView from '@/features/conversations/ConversationView';
import ContextView from './features/contact/components/ContactView';
import LayoutContainer from './features/layout/components/LayoutContainer';
import NotesView from './features/notes/components/NotesView';

function App() {
  return (
    <div className="p-4 h-screen">
      <div className="grid grid-cols-12 gap-4 h-full">
        <LayoutContainer className="col-span-3 h-full">
          <ContextView />
        </LayoutContainer>
        <LayoutContainer className="col-span-6 h-full overflow-y-auto">
          <ConversationsView />
        </LayoutContainer>
        <LayoutContainer className="col-span-3 h-full overflow-y-auto">
          <NotesView />
        </LayoutContainer>
      </div>
    </div>
  );
}

export default App;
