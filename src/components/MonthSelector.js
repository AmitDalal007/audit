import React from 'react';

const MonthSelector = ({ mqIdentifier, setMqIdentifier }) => {
  return (
    <div className="flex mb-6 items-center space-x-2">
      <label className="block text-lg font-medium">Select Month:</label>
      <select
        value={mqIdentifier}
        onChange={(e) => setMqIdentifier(parseInt(e.target.value))}
        className="p-2 border rounded"
      >
        <option value={2}>February</option>
        <option value={3}>March</option>
      </select>
    </div>
  );
};

export default MonthSelector;
