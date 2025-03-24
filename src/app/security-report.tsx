"use client";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import "./security-report.css"; // 🔁 Optional: move styles to CSS module or global

export default function SecurityReport() {
  const [inputText, setInputText] = useState("");
  const [report, setReport] = useState("");
  const [filteredReport, setFilteredReport] = useState("");
  const [storedOptions, setStoredOptions] = useState<Record<string, string>>({});
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Load selected options from localStorage
  useEffect(() => {
    const savedOptions = localStorage.getItem("selectedOptions");
    if (savedOptions) {
      setStoredOptions(JSON.parse(savedOptions));
    }
  }, []);

  // Submit input to API
  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    const requestData = {
      formattedText: inputText,
      selectedOptions: storedOptions,
    };

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    if (response.ok) {
      setReport(data.bot);
      setFilteredReport(data.bot);
    } else {
      setReport("Error generating report. Please try again.");
    }
  };

  // Pie chart click handler
  const handleSectionClick = (sectionName: string) => {
    if (selectedSection === sectionName) {
      setSelectedSection(null);
    } else {
      setSelectedSection(sectionName);
    }
  };

  // Pie chart data
  const data = [
    { name: "Technical Controls", value: 100, color: "#dc2626" },
    { name: "Data Security", value: 100, color: "#f87171" },
    { name: "Access Control", value: 100, color: "#fca5a5" },
    { name: "Governance", value: 100, color: "#fee2e2" }
  ];

  return (
    <div className="flex flex-col items-center p-6">
      {/* Input Box */}
      <textarea
        className="w-full p-3 border rounded-md shadow-md"
        rows={4}
        placeholder="Enter your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      {/* Submit Button */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-2"
        onClick={handleSubmit}
      >
        Submit
      </button>

      {/* Pie Chart */}
      <div className="w-full max-w-4xl mt-10 flex justify-start pl-[100px]">
        <PieChart width={300} height={300}>
          {data.map((entry, index) => (
            <Pie
              key={index}
              data={[entry]}
              cx={150}
              cy={150}
              startAngle={180}
              endAngle={0}
              outerRadius={120 - index * 30}
              innerRadius={90 - index * 30}
              dataKey="value"
              isAnimationActive={false}
              onClick={() => handleSectionClick(entry.name)}
            >
              <Cell fill={entry.color} />
            </Pie>
          ))}
        </PieChart>
      </div>

      {/* Independent Text Box (Positioned 400px below, 100px from left) */}
      {selectedSection && (
        <div className="fixedBox">
          <h3 className="text-lg font-semibold">
            {selectedSection} - Security Report
          </h3>
          <pre className="responseText whitespace-pre-wrap text-sm">
            {filteredReport || "Loading report..."}
          </pre>
        </div>
      )}
    </div>
  );
}
