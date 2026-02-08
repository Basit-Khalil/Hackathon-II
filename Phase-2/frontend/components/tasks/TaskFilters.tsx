// TaskFilters component for filtering tasks

'use client';

import { useState } from 'react';

interface TaskFiltersProps {
  onFilterChange: (filter: string) => void;
}

export default function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => handleFilter('all')}
        className={`px-4 py-2 rounded-md ${
          activeFilter === 'all'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        All Tasks
      </button>
      <button
        onClick={() => handleFilter('active')}
        className={`px-4 py-2 rounded-md ${
          activeFilter === 'active'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Active
      </button>
      <button
        onClick={() => handleFilter('completed')}
        className={`px-4 py-2 rounded-md ${
          activeFilter === 'completed'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Completed
      </button>
    </div>
  );
}