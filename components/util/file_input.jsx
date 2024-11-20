import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function FileInput({
  accept,
  placeholder,
  value,
  onChange,
  onReset,
  ...props
}) {
  const inputRef = useRef();

  useEffect(() => {
    const input = inputRef.current;

    if (!value) {
      // Pass an empty FileList
      input.files = new DataTransfer().files;
      return;
    }

    input.files = value;
  }, [value]);

  return (
    <div className="flex gap-4">
      <Input
        ref={inputRef}
        {...props}
        type="file"
        placeholder={placeholder}
        accept={accept}
        onChange={onChange}
      />

      <Button variant="outline" onClick={onReset}>
        <RotateCcw />
      </Button>
    </div>
  );
}
