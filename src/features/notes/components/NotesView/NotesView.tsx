import Notes from '../Notes';

const NotesView = () => {
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Notes</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <Notes />
      </div>
    </div>
  );
};

export default NotesView;
