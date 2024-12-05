import React from 'react';
import { Input } from '../ui/Input';

interface DateRangePickerProps {
  value: {
    start: Date;
    end: Date;
  };
  onChange: (range: { start: Date; end: Date }) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <Input
          type="date"
          value={value.start.toISOString().split('T')[0]}
          onChange={(e) =>
            onChange({
              ...value,
              start: new Date(e.target.value),
            })
          }
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <Input
          type="date"
          value={value.end.toISOString().split('T')[0]}
          onChange={(e) =>
            onChange({
              ...value,
              end: new Date(e.target.value),
            })
          }
          className="mt-1"
        />
      </div>
    </div>
  );
}