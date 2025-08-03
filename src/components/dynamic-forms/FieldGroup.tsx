/**
 * FieldGroup component with smooth collapsible functionality
 */

import { ChevronDown } from 'lucide-react';
import React from 'react';
import type { FieldGroupProps } from '../../types/formTypes';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';

const FieldGroup: React.FC<FieldGroupProps> = ({
  group,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <Collapsible
      className="border rounded-lg"
      open={isOpen}
      onOpenChange={onToggle}
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-all duration-200 ease-in-out">
          <div>
            <h3 className="text-base font-medium text-gray-900 transition-colors duration-200">
              {group.label}
            </h3>
          </div>
          <div className="flex items-center justify-center w-5 h-5">
            <ChevronDown
              className={`h-5 w-5 text-gray-600 transition-all duration-300 ease-in-out transform ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="border-t-1">
        <div className="p-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FieldGroup;
