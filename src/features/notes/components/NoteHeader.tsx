import { Button } from '@/components/ui/button';
import { PlusIcon, X } from 'lucide-react';

const NoteHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-lg font-semibold text-foreground">Notes</h1>
      <div className="flex items-center text-gray-600">
        <Button variant="ghost" size="sm">
          <PlusIcon className="w-4 h-4" />
          Add
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default NoteHeader;
