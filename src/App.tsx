import { ConfigurableGridLayout } from '@/shared/components/layout';

function App() {
  const handleError = (error: Error, componentName?: string) => {
    console.error('Layout error:', error, componentName);
  };

  return (
    <div className="p-2 sm:p-4 h-screen bg-gray-200">
      <ConfigurableGridLayout onError={handleError} />
    </div>
  );
}

export default App;
