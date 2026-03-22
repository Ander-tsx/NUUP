'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar…',
  className,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`custom-select-trigger ${open ? 'open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? 'text-[var(--text-1)]' : 'text-[var(--text-3)]'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="select-chevron w-4 h-4 shrink-0" />
      </button>

      {open && (
        <div className="custom-select-dropdown absolute z-[1000]" role="listbox">
          {/* "All" option */}
          <div
            role="option"
            aria-selected={value === ''}
            onClick={() => { onChange(''); setOpen(false); }}
            className={`custom-select-option ${value === '' ? 'selected' : ''}`}
          >
            <span className="flex items-center justify-between">
              {placeholder}
              {value === '' && <Check className="w-3.5 h-3.5 text-[#2185D5]" />}
            </span>
          </div>

          {options.map((opt) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`custom-select-option ${value === opt.value ? 'selected' : ''}`}
            >
              <span className="flex items-center justify-between">
                {opt.label}
                {value === opt.value && <Check className="w-3.5 h-3.5 text-[#2185D5]" />}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
