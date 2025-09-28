import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';
import React, { forwardRef, useEffect, useRef } from 'react';

const FileInput = forwardRef(
  ({ accept, placeholder, value, onChange, onReset, ...props }, ref) => {
    const inputRef = useRef();

    // Merge external ref with internal ref
    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(inputRef.current);
        } else {
          ref.current = inputRef.current;
        }
      }
    }, [ref]);

    // Handle file assignment
    useEffect(() => {
      const input = inputRef.current;
      if (!input) return;

      if (!value || (value.length !== undefined && value.length === 0)) {
        input.value = '';
        return;
      }

      try {
        if (value.length !== undefined) {
          // value is FileList or array-like
          const dataTransfer = new DataTransfer();
          for (let i = 0; i < value.length; i++) {
            dataTransfer.items.add(value[i]);
          }
          input.files = dataTransfer.files;
        }
      } catch (error) {
        console.warn('Could not set input files:', error);
        input.value = '';
      }
    }, [value]);

    const handleChange = event => {
      if (onChange) {
        onChange(event);
      }
    };

    const handleReset = event => {
      event.preventDefault();
      if (onReset) {
        onReset();
      }
    };

    return (
      <div className="flex gap-4">
        <Input
          ref={inputRef}
          {...props}
          type="file"
          placeholder={placeholder}
          accept={accept}
          onChange={handleChange}
        />

        {onReset && (
          <Button type="button" variant="outline" onClick={handleReset}>
            <RotateCcw />
          </Button>
        )}
      </div>
    );
  },
);

FileInput.displayName = 'FileInput';

export default FileInput;
