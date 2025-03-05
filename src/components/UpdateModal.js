// UpdateModal.js
import React from 'react';

const UpdateModal = ({
  role,
  selectedChecklist,
  makerStatus,
  setMakerStatus,
  checkerStatus,
  setCheckerStatus,
  reviewerStatus,
  setReviewerStatus,
  evidence,
  setEvidence,
  handleMakerSubmit,
  handleCheckerSubmit,
  handleReviewerSubmit,
  setSelectedChecklist,
  error,
}) => {
  return (
    selectedChecklist && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg w-1/2">
          <h2 className="text-2xl font-bold mb-4">Update Checklist</h2>
          <p className="mb-4">Checklist: {selectedChecklist.Checklist_Name}</p>

          {/* Maker Status */}
          {role === "Maker" && (
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Maker Status:</label>
              <select
                value={makerStatus}
                onChange={(e) => setMakerStatus(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Select Status</option>
                <option value="Compliant">Compliant</option>
                <option value="Non-Compliant">Non-Compliant</option>
              </select>
            </div>
          )}

          {/* Evidence Upload */}
          {role === "Maker" && makerStatus === "Compliant" && (
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Upload Evidence:</label>
              <input
                type="file"
                onChange={(e) => setEvidence(e.target.files[0])}
                className="p-2 border rounded"
              />
            </div>
          )}

          {/* Checker Status */}
          {role === "Checker" && (
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Checker Status:</label>
              <select
                value={checkerStatus}
                onChange={(e) => setCheckerStatus(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Select Status</option>
                <option value="Compliant">Compliant</option>
                <option value="Non-Compliant">Non-Compliant</option>
              </select>
            </div>
          )}

          {/* Reviewer Status */}
          {role === "Reviewer" && (
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Reviewer Status:</label>
              <select
                value={reviewerStatus}
                onChange={(e) => setReviewerStatus(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Select Status</option>
                <option value="Compliant">Compliant</option>
                <option value="Non-Compliant">Non-Compliant</option>
              </select>
            </div>
          )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Buttons */}
          <div className="flex justify-end">
            <button
              onClick={() => setSelectedChecklist(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (role === "Maker") handleMakerSubmit(selectedChecklist.Unique_ID);
                else if (role === "Checker") handleCheckerSubmit(selectedChecklist.Unique_ID);
                else if (role === "Reviewer") handleReviewerSubmit(selectedChecklist.Unique_ID);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default UpdateModal;
