import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Search } from 'lucide-react';

const SearchFieldInput = () => {
  return (
    <div className="relative w-full mb-3">
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search Fields and Folders"
          className="pl-10 pr-12 h-12 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-200 focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 h-8 w-8 p-0 hover:bg-gray-100"
        >
          <Menu className="h-4 w-4 text-gray-400" />
        </Button>
      </div>
    </div>
  );
};

export default SearchFieldInput;
