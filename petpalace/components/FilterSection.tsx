'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FilterOption {
  label: string;
  count: number;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
}

export default function FilterSection({ title, options }: FilterSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? options : options.slice(0, 4);
  const remaining = options.length - 4;

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <h4 className="font-medium text-gray-900">{title}</h4>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div className="mt-2 space-y-2">
        {visible.map((opt, i) => (
          <label
            key={i}
            className="flex items-center gap-2 p-1 cursor-pointer"
          >
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
            <span className="text-xs text-gray-500 ml-auto">
              ({opt.count})
            </span>
          </label>
        ))}

        {!expanded && remaining > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            +{remaining} more
          </button>
        )}
      </div>
    </div>
  );
}
