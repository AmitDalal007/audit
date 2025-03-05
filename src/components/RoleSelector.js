import React from 'react';

const RoleSelector = ({ role, setRole }) => {
  return (
    <div className="flex mb-6 items-center space-x-2">
      <label className="block text-lg font-medium">Select Role:</label>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="Maker">Maker</option>
        <option value="Checker">Checker</option>
        <option value="Reviewer">Reviewer</option>
      </select>
    </div>
  );
};

export default RoleSelector;
