'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

export const Combobox = (
  { className = '', data, currentValue, onSelect },
  ref,
) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={'w-[200px] justify-between ' + className}
        >
          {currentValue || 'Select Value...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>Empty List</CommandEmpty>
            <CommandGroup>
              {data.map((entry, index) => (
                <CommandItem
                  key={entry.value}
                  value={entry.value}
                  onSelect={currentValue => {
                    setOpen(false);
                    onSelect(index);
                  }}
                >
                  {entry.value}
                  <Check
                    className={cn(
                      'ml-auto',
                      currentValue === entry.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
