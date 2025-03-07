import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import MonthSelector from "./components/MonthSelector";
import UpdateModal from "./components/UpdateModal";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import PdfViewer from "./components/PdfViewer";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const App = () => {
  const [checklists, setChecklists] = useState([]);
  const [mqIdentifier, setMqIdentifier] = useState(2);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [makerStatus, setMakerStatus] = useState("");
  const [checkerStatus, setCheckerStatus] = useState("");
  const [reviewerStatus, setReviewerStatus] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) setUser({ role });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  useEffect(() => {
    fetchChecklists();
  }, [mqIdentifier]);

  const fetchChecklists = async () => {
    try {
      // const response = await axios.get(`http://localhost:8000/get-checklist/${mqIdentifier}`);
      const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:8000/get-checklist/${mqIdentifier}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
      checklist.Maker_Date = new Date().toLocaleString();

      if (evidence) {
        const reader = new FileReader();
        reader.readAsDataURL(evidence);
        reader.onload = () => {
          localStorage.setItem(`evidence_${checklistId}`, reader.result);
          console.log("Evidence stored in localStorage!");
        };
      }

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

  const [selectedPdf, setSelectedPdf] = useState(null);

  const viewEvidence = (checklistId) => {
    setSelectedPdf(checklistId);
  };

  return (
    <Router>
      <div className="p-8 bg-gray-100 min-h-screen">
        {user ? (
          <>
            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold">Logged in as: {user.role}</span>
              <button className="bg-red-500 text-white px-4 py-2" onClick={handleLogout}>Logout</button>
            </div>
            <h1 className="text-3xl font-bold text-center mb-8">Audit Checklist System</h1>

            <div className="flex justify-between">
              <MonthSelector mqIdentifier={mqIdentifier} setMqIdentifier={setMqIdentifier} />
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-3 px-6 text-left">Checklist Name</th>
                    <th className="py-3 px-6 text-left">Maker Status</th>
                    <th className="py-3 px-6 text-left">Checker Status</th>
                    <th className="py-3 px-6 text-left">Reviewer Status</th>
                    <th className="py-3 px-6 text-left">Evidence</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {checklists.map((item) => {
                    const isCheckerDisabled = item.Maker_Compliance_Status === "Non-Compliant";
                    const isReviewerDisabled =
                      item.Maker_Compliance_Status === "Non-Compliant" || item.Checker_Compliance_Status === "Non-Compliant";

                    const evidenceExists = localStorage.getItem(`evidence_${item.Unique_ID}`);

                    return (
                      <tr key={item.Unique_ID} className="border-b">
                        <td className="py-4 px-6">{item.Checklist_Name}</td>
                        <td className="py-4 px-6">{item.Maker_Compliance_Status}</td>
                        <td className="py-4 px-6">{item.Checker_Compliance_Status}</td>
                        <td className="py-4 px-6">{item.Reviewer_Compliance_Status}</td>
                        <td className="py-4 px-6">
                          {evidenceExists ? (
                            <button
                              onClick={() => viewEvidence(item.Unique_ID)}
                              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                              View
                            </button>
                          ) : (
                            "No Evidence"
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-6">
                          {user.role === "Maker" && (
                            <button
                              onClick={() => setSelectedChecklist(item)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                              Update
                            </button>
                          )}

                          {user.role === "Checker" && (
                            <button
                              onClick={() => setSelectedChecklist(item)}
                              className={`px-4 py-2 rounded ${isCheckerDisabled
                                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                  : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                              disabled={isCheckerDisabled}
                            >
                              Update
                            </button>
                          )}

                          {user.role === "Reviewer" && (
                            <button
                              onClick={() => setSelectedChecklist(item)}
                              className={`px-4 py-2 rounded ${isReviewerDisabled
                                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                  : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                              disabled={isReviewerDisabled}
                            >
                              Update
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {selectedPdf && <PdfViewer checklistId={selectedPdf} onClose={() => setSelectedPdf(null)} />}

            <UpdateModal
              role={user.role}
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
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Login setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
