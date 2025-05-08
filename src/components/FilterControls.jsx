import React from 'react';

const monthRanges = [
  { label: 'Jan - Jun', fromMonth: '01', toMonth: '06' },
  { label: 'Jul - Nov', fromMonth: '07', toMonth: '11' },
  { label: 'Dec - Apr', fromMonth: '12', toMonth: '04' },
  { label: 'May - Sep', fromMonth: '05', toMonth: '09' },
  { label: 'All Months', fromMonth: '01', toMonth: '12' }
];

// Generate a list of individual years from 2024 to 2030
const generateYearRanges = () => {
  const minYear = 2025;
  const maxYear = 2030;
  const ranges = [];

  for (let year = minYear; year <= maxYear; year++) {
    ranges.push({
      label: `${year}`,  // Display just the year (e.g., 2024, 2025, etc.)
      value: year
    });
  }

  return ranges;
};

const yearRanges = generateYearRanges();

const FilterControls = ({ filter, setFilter }) => {
  const handleYearRangeChange = (e) => {
    const selectedYear = parseInt(e.target.value, 10);
    if (!selectedYear) return;

    setFilter(prev => ({
      ...prev,
      fromYear: selectedYear,  // Set the selected year as 'fromYear'
      toYear: selectedYear      // Set the same year as 'toYear'
    }));
  };

  const handleMonthRangeChange = (e) => {
    const selected = monthRanges.find(r => r.label === e.target.value);
    if (!selected) return;

    const fromMonthInt = parseInt(selected.fromMonth, 10);
    const toMonthInt = parseInt(selected.toMonth, 10);
    const crossesYear = fromMonthInt > toMonthInt;

    // Set toYear for cross-year month ranges (e.g., Dec - Apr)
    setFilter(prev => ({
      ...prev,
      fromMonth: selected.fromMonth,
      toMonth: selected.toMonth,
      toYear: crossesYear ? prev.fromYear + 1 : prev.toYear
    }));
  };


  return (
    <div className="flex flex-wrap justify-end gap-4 items-end">
      {/* Year Dropdown */}
      <div>
        <label className="text-sm text-gray-700">Year:</label>
        <select
          onChange={handleYearRangeChange}
          value={filter.fromYear}
          className="p-2 border border-gray-300 rounded-lg w-40"
        >
          {yearRanges.map(range => (
            <option key={range.label} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Month Range Dropdown */}
      <div>
        <label className="text-sm text-gray-700">Month Range:</label>
        <select
          onChange={handleMonthRangeChange}
          value={monthRanges.find(r =>
            r.fromMonth === filter.fromMonth && r.toMonth === filter.toMonth
          )?.label || 'All Months'}
          className="p-2 border border-gray-300 rounded-lg w-40"
        >
          {monthRanges.map(range => (
            <option key={range.label} value={range.label}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
