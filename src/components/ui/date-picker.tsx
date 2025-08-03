/**
 * DatePicker component using shadcn Calendar and Popover
 */

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  'aria-invalid'?: boolean;
  'data-field-id'?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value = '',
      onChange,
      onBlur,
      placeholder = 'Pick a date',
      className,
      min,
      max,
      disabled,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    // Convert string value to Date object
    const dateValue = value ? new Date(value) : undefined;

    // Convert min/max strings to Date objects
    const minDate = min ? new Date(min) : undefined;
    const maxDate = max ? new Date(max) : undefined;

    const handleSelect = (date: Date | undefined) => {
      if (date) {
        // Format as ISO date string (YYYY-MM-DD)
        const isoString = format(date, 'yyyy-MM-dd');
        onChange?.(isoString);
      } else {
        onChange?.('');
      }
      setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        onBlur?.();
      }
    };

    // Disable dates outside min/max range
    const isDateDisabled = (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    };

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !dateValue && 'text-muted-foreground',
              className
            )}
            disabled={disabled}
            {...props}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue ? format(dateValue, 'PPP') : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };
