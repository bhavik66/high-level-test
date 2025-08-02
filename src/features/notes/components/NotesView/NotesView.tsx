import { PlusIcon, X } from 'lucide-react';
import Notes from '../Notes';

const NotesView = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-base leading-none font-semibold">Notes</h2>
        <div className="flex items-center text-gray-600">
          <button className="btn btn-ghost btn-sm">
            <PlusIcon className="w-4 h-4" />
            Add
          </button>
          <button className="btn btn-ghost btn-sm btn-circle">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mt-2">
        <Notes />
      </div>
    </>
  );
};

export default NotesView;
