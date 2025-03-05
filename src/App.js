import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import RoleSelector from "./components/RoleSelector";
import MonthSelector from "./components/MonthSelector";
import UpdateModal from "./components/UpdateModal";

const App = () => {
  const [checklists, setChecklists] = useState([]);
  const [mqIdentifier, setMqIdentifier] = useState(2);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [makerStatus, setMakerStatus] = useState("");
  const [checkerStatus, setCheckerStatus] = useState("");
  const [reviewerStatus, setReviewerStatus] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [error, setError] = useState("");
  const [role, setRole] = useState("Maker");

  useEffect(() => {
    fetchChecklists();
  }, [mqIdentifier]);

  const fetchChecklists = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/get-checklist/${mqIdentifier}`);
      setChecklists(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch checklists. Please check the backend server.");
      console.error(err);
    }
  };

  const handleMakerSubmit = async (checklistId) => {
    if (!makerStatus) {
      setError("Please select Compliant or Non-Compliant.");
      return;
    }

    if (makerStatus === "Compliant" && !evidence) {
      setError("Please upload supporting evidence for Compliant status.");
      return;
    }

    try {
      const checklist = checklists.find((c) => c.Unique_ID === checklistId);
      checklist.Maker_Compliance_Status = makerStatus;
      checklist.Evidence = evidence ? evidence.name : "NULL";
      checklist.Maker_Date = new Date().toLocaleString();

      await axios.put(`http://localhost:8000/update-checklist/${checklistId}`, checklist);
      fetchChecklists();
      setError("");
      setSelectedChecklist(null);
    } catch (err) {
      setError("Failed to update checklist. Please try again.");
      console.error(err);
    }
  };

  const handleCheckerSubmit = async (checklistId) => {
    if (!checkerStatus) {
      setError("Please select Compliant or Non-Compliant.");
      return;
    }

    try {
      const checklist = checklists.find((c) => c.Unique_ID === checklistId);
      checklist.Checker_Compliance_Status = checkerStatus;
      checklist.Checker_Date = new Date().toLocaleString();

      await axios.put(`http://localhost:8000/update-checklist/${checklistId}`, checklist);
      fetchChecklists();
      setError("");
      setSelectedChecklist(null);
    } catch (err) {
      setError("Failed to update checklist. Please try again.");
      console.error(err);
    }
  };

  const handleReviewerSubmit = async (checklistId) => {
    if (!reviewerStatus) {
      setError("Please select Compliant or Non-Compliant.");
      return;
    }

    try {
      const checklist = checklists.find((c) => c.Unique_ID === checklistId);
      checklist.Reviewer_Compliance_Status = reviewerStatus;
      checklist.Reviewer_Date = new Date().toLocaleString();

      await axios.put(`http://localhost:8000/update-checklist/${checklistId}`, checklist);
      fetchChecklists();
      setError("");
      setSelectedChecklist(null);
    } catch (err) {
      setError("Failed to update checklist. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Audit Checklist System</h1>

      <div className="flex justify-between">
        <MonthSelector mqIdentifier={mqIdentifier} setMqIdentifier={setMqIdentifier} />
        <RoleSelector role={role} setRole={setRole} />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-6 text-left">Checklist Name</th>
              <th className="py-3 px-6 text-left">Maker Status</th>
              <th className="py-3 px-6 text-left">Checker Status</th>
              <th className="py-3 px-6 text-left">Reviewer Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {checklists.map((item) => (
              <tr key={item.Unique_ID} className="border-b">
                <td className="py-4 px-6">{item.Checklist_Name}</td>
                <td className="py-4 px-6">{item.Maker_Compliance_Status}</td>
                <td className="py-4 px-6">{item.Checker_Compliance_Status}</td>
                <td className="py-4 px-6">{item.Reviewer_Compliance_Status}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => setSelectedChecklist(item)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UpdateModal
        role={role}
        selectedChecklist={selectedChecklist}
        makerStatus={makerStatus}
        setMakerStatus={setMakerStatus}
        checkerStatus={checkerStatus}
        setCheckerStatus={setCheckerStatus}
        reviewerStatus={reviewerStatus}
        setReviewerStatus={setReviewerStatus}
        evidence={evidence}
        setEvidence={setEvidence}
        handleMakerSubmit={handleMakerSubmit}
        handleCheckerSubmit={handleCheckerSubmit}
        handleReviewerSubmit={handleReviewerSubmit}
        setSelectedChecklist={setSelectedChecklist}
        error={error}
      />
    </div>
  );
};

export default App;