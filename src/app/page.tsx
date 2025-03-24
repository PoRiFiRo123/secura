'use client';
import { useState, useEffect, useRef } from "react";
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import styles from '@/styles/Home.module.css';
import { PieChart, Pie, Cell } from 'recharts';
import Cookies from 'js-cookie';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [showGraph, setShowGraph] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({});
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const svgRef = useRef<any>(null);

  const dropdownOptions = [
    { title: "Products offered", options: ["Software services", "Financial services", "Healthcare", "Retail", "Manufacturing", "Other"] },
    { title: "Customers", options: ["B2B", "B2C", "B2G", "In-house", "Mixed (B2B and B2C)", "Other"] },
    { title: "Industry", options: ["Technology & Software", "Finance & Banking", "Healthcare & Biotech", "Retail & E-commerce", "Education", "Other"] },
    { title: "Sensitive data that you handle", options: ["Customer data - PII", "Financial Data", "Healthcare Data", "Intellectual Property", "Employee Data", "Other"] },
    { title: "Geography", options: ["North America", "Europe", "Asia", "South America", "Africa", "Australia"] }
  ];

  const pieData = [
    { name: "Technical Controls", value: 100, color: "#dc2626", api: "/api/generate-technical" },
    { name: "Data Security", value: 100, color: "#f87171", api: "/api/generate-security" },
    { name: "Access Control", value: 100, color: "#fca5a5", api: "/api/generate-access" },
    { name: "Governance", value: 100, color: "#fee2e2", api: "/api/generate-governance" }
  ];

  useEffect(() => {
    const storedOptions = Cookies.get('selectedOptions');
    if (storedOptions) {
      try {
        setSelectedOptions(JSON.parse(storedOptions));
      } catch (error) {
        console.error("Error parsing cookies:", error);
      }
    }
  }, []);

  const handleDropdownChange = (title: string, selectedValues: string[]) => {
    const updatedOptions = { ...selectedOptions, [title]: selectedValues };
    setSelectedOptions(updatedOptions);
    Cookies.set('selectedOptions', JSON.stringify(updatedOptions), { expires: 1 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowGraph(true);
  };

  const handleSectionClick = async (sectionName: string) => {
    if (selectedSection === sectionName) {
      setSelectedSection(null);
      return;
    }

    setSelectedSection(sectionName);
    setLoadingSection(sectionName);

    const pieItem = pieData.find(d => d.name === sectionName);
    if (!pieItem) return;

    const formattedOptions = Object.entries(selectedOptions)
      .map(([key, values]) => `- **${key}**: ${values.join(", ")}`)
      .join("\n");

    const formattedText = `**User's Business Information:**\n${formattedOptions}`;

    try {
      const response = await fetch(pieItem.api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formattedText }),
      });

      const data = await response.json();
      setResponses(prev => ({ ...prev, [sectionName]: data.bot }));
    } catch (error) {
      setResponses(prev => ({ ...prev, [sectionName]: "Failed to fetch AI response." }));
    } finally {
      setLoadingSection(null);
    }
  };

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.mainContainer}>
        <Topbar />
        <div className={styles.contentLayout}>
          {/* Dropdown Form */}
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            {dropdownOptions.map(({ title, options }, index) => (
              <div key={index} className={styles.box}>
                <Dropdown
                  title={title}
                  options={options}
                  onChange={(selectedValues: string[]) => handleDropdownChange(title, selectedValues)}
                />
              </div>
            ))}
            <div className={styles.submitContainer}>
              <Button type="submit">Submit</Button>
            </div>
          </form>

          {/* Pie Chart and AI Response */}
          {showGraph && (
            <div style={{ display: "flex", flexDirection: "row", marginTop: "300px", marginLeft: "100px", gap: "30px", alignItems: "flex-start" }}>
              {/* Pie Chart */}
              <div className={styles.pieChartContainer}>
                <PieChart width={400} height={300} ref={svgRef}>
                  {pieData.map((entry, index) => (
                    <Pie
                      key={index}
                      data={[entry]}
                      cx={200}
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

              {/* Divider */}
              <div style={{ height: "2px", backgroundColor: "black", width: "200px", alignSelf: "left" }} />

              {/* AI Response Section */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "600px" }}>
                {selectedSection && (
                  <>
                    <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                      {selectedSection}
                    </h2>
                    <div className={styles.fixedBox}>
                    <div className={styles.responseText}>
  {loadingSection === selectedSection ? (
    <p>Loading...</p>
  ) : (
    <div className={styles.markdownContent}>
      <ReactMarkdown>
        {responses[selectedSection] || "No response yet."}
      </ReactMarkdown>
    </div>
  )}
</div>

                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
