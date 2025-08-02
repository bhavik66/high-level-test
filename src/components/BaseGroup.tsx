/**
 * BaseGroup component with collapsible functionality
 */

import { ChevronDown, ChevronRight } from 'lucide-react';
import React from 'react';
import type { BaseGroupProps } from '../types/formTypes';
import { Card, CardContent, CardHeader } from './ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

const BaseGroup: React.FC<BaseGroupProps> = ({
  group,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-blue-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {group.label}
                  </h3>
                  {group.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {group.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default BaseGroup;
