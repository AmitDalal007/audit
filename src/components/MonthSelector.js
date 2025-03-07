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
        <option value={1}>January</option>
        <option value={2} selected>February</option>
        <option value={3}>March</option>
        <option value={4}>April</option>
        <option value={5}>May</option>
        <option value={6}>June</option>
        <option value={7}>July</option>
        <option value={8}>August</option>
        <option value={9}>September</option>
        <option value={10}>October</option>
        <option value={11}>November</option>
        <option value={12}>December</option>
      </select>
    </div>
  );
};

export default MonthSelector;
