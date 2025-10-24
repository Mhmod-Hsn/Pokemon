import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchInput({ 
  value, 
  onChange, 
  onClear,
  placeholder = "Search Pokémon..." 
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(localValue.trim());
  };

  const handleClear = () => {
    setLocalValue('');
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto mb-8">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder={placeholder}
            className="pl-9 pr-9"
          />
          {localValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button type="submit">
          Search
        </Button>
      </div>
      {value && (
        <p className="text-sm text-muted-foreground mt-2">
          Searching for: <span className="font-medium text-foreground">"{value}"</span>
        </p>
      )}
    </form>
  );
}

