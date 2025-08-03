import { QueryProvider } from '@/providers';
import { AppRouter } from '@/router/index.tsx';

function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}

export default App;
