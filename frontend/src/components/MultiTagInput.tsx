import { useMemo, useRef, useState } from "react";
import { Check, Plus, X } from "lucide-react";

interface MultiTagInputProps {
  /** Currently selected values */
  value: string[];
  /** Called with the next array whenever selection changes */
  onChange: (next: string[]) => void;
  /** Suggestion pool (curated presets + values already used in inventory) */
  suggestions?: string[];
  placeholder?: string;
  /** Allow typing values that aren't in the suggestion list */
  allowCreate?: boolean;
  /** Lowercase-normalise tags before storing (used for tags, not features) */
  normalize?: (raw: string) => string;
}

/**
 * Chip-based multi-select with typeahead and free entry.
 * Selected items render as removable chips; typing filters the merged
 * suggestion list and Enter / comma / click commits a value.
 */
export function MultiTagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Type and press Enter…",
  allowCreate = true,
  normalize,
}: MultiTagInputProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const clean = (raw: string) => {
    const trimmed = raw.trim();
    return normalize ? normalize(trimmed) : trimmed;
  };

  const addValue = (raw: string) => {
    const next = clean(raw);
    if (!next) return;
    // case-insensitive dedupe
    if (!value.some((v) => v.toLowerCase() === next.toLowerCase())) {
      onChange([...value, next]);
    }
    setQuery("");
  };

  const removeValue = (target: string) => {
    onChange(value.filter((v) => v !== target));
  };

  const filtered = useMemo(() => {
    const selectedLower = new Set(value.map((v) => v.toLowerCase()));
    const q = query.trim().toLowerCase();
    return suggestions
      .filter((s) => !selectedLower.has(s.toLowerCase()))
      .filter((s) => (q ? s.toLowerCase().includes(q) : true))
      .slice(0, 8);
  }, [suggestions, value, query]);

  const queryIsNew =
    query.trim().length > 0 &&
    !suggestions.some((s) => s.toLowerCase() === query.trim().toLowerCase()) &&
    !value.some((v) => v.toLowerCase() === query.trim().toLowerCase());

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (query.trim()) addValue(query);
    } else if (e.key === "Backspace" && !query && value.length > 0) {
      removeValue(value[value.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div
        className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-md border border-white/[0.12] bg-white/[0.05] px-2 py-1.5 transition focus-within:border-brand/50"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-brand/15 py-0.5 pl-2 pr-1 text-xs font-medium text-brand"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeValue(tag);
              }}
              className="flex size-4 items-center justify-center rounded transition hover:bg-brand/25"
              aria-label={`Remove ${tag}`}
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 bg-transparent px-1 py-0.5 text-sm text-white outline-none placeholder:text-white/25"
        />
      </div>

      {open && (filtered.length > 0 || (allowCreate && queryIsNew)) && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-white/10 bg-[#15151B] py-1 shadow-xl shadow-black/40">
          {allowCreate && queryIsNew && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addValue(query)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/[0.06]"
            >
              <Plus size={13} className="text-brand" />
              Add “<span className="font-medium text-white">{clean(query)}</span>”
            </button>
          )}
          {filtered.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addValue(suggestion)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/[0.06]"
            >
              <Check size={13} className="text-white/30" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
