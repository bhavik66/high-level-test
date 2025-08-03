import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ContactHeader = () => {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Left section with back button and title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">
          Contact Details
        </h1>
      </div>

      {/* Right section with navigation */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">1 of 356</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactHeader;
