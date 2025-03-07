import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";

const PdfViewer = ({ checklistId, onClose }) => {
  const [pdfData, setPdfData] = useState(null);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const storedEvidence = localStorage.getItem(`evidence_${checklistId}`);
    if (storedEvidence) {
      const byteCharacters = atob(storedEvidence.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      setPdfData(URL.createObjectURL(blob));
    }
  }, [checklistId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-fit h-3/4 overflow-auto">
        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">Close</button>
        {pdfData ? (
          <Document file={pdfData} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        ) : (
          <p>No PDF found</p>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
