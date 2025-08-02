import Note from './components/Note';

function App() {
  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Note Component Demo
        </h1>

        <Note
          content={`<span class="tag-primary">@Aaron Site</span> Inspection completed. Heavy moss buildup on north side, moderate algae staining. Customer very satisfied with quote presentation. Chose Premium package. Payment processed via credit card. Mentioned neighbor also needs service.`}
          timestamp="2 hours ago"
        />
      </div>
    </div>
  );
}

export default App;
