"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CatalogSuggestion {
  name: string;
  hint?: string;
}

interface CatalogComboboxProps {
  value: string;
  onChange: (value: string) => void;
  /** Called when a catalog entry is picked, so callers can prefill related fields. */
  onSelect?: (name: string) => void;
  search: (query: string) => CatalogSuggestion[];
  placeholder?: string;
  className?: string;
  id?: string;
}

/**
 * Free-text input with catalog suggestions. Typing anything is always allowed —
 * the list is a shortcut, not a constraint, since school catalogs vary.
 */
export function CatalogCombobox({
  value,
  onChange,
  onSelect,
  search,
  placeholder,
  className,
  id,
}: CatalogComboboxProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listId = `${inputId}-listbox`;

  const suggestions = useMemo(() => (open ? search(value) : []), [open, value, search]);

  function commit(name: string) {
    onChange(name);
    onSelect?.(name);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      commit(suggestions[activeIndex]!.name);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="relative">
      <Input
        id={inputId}
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        className={className}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          // Delay so a click on an option lands before the list unmounts.
          blurTimer.current = setTimeout(() => setOpen(false), 120);
        }}
      />
      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-panel-border/50 bg-panel shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li key={s.name} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                className={cn(
                  "flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left font-interface text-sm text-panel-foreground hover:bg-panel-card",
                  i === activeIndex && "bg-panel-card"
                )}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (blurTimer.current) clearTimeout(blurTimer.current);
                  commit(s.name);
                }}
              >
                <span>{s.name}</span>
                {s.hint && <span className="text-xs text-panel-muted">{s.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
