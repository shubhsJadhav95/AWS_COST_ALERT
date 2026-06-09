import React, { useRef, useState } from "react";
import "./UploadFile.css";

const UploadFile = () => {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  // File select
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Only CSV files are allowed");
      return;
    }

    fileRef.current = file;
    setFileName(file.name);
  };

  // Drag & drop
  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Only CSV files are allowed");
      return;
    }

    fileRef.current = file;
    setFileName(file.name);
  };

  // Upload to S3 backend
  const handleUpload = async () => {
    if (!fileRef.current) {
      alert("Please select a CSV file first.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", fileRef.current, fileRef.current.name);

     // const apiBaseUrl = import.meta.env.VITE_API_URL || "https://costspike.devcloudzone.store";
        const response = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text; // likely S3 URL
      }

      console.log("Upload success:", data);

      alert("File uploaded successfully!");

      fileRef.current = null;
      setFileName("");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      {/* Navbar */}
      <header className="navbar">
        <div className="logo">☁️ AWS Cost Spike Detector</div>
        <div className="user-profile">SNS Alert Monitoring System</div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <span className="hero-badge">AWS SNS Powered Notifications</span>

        <h1>Monitor AWS Cost Spikes in Real Time</h1>

        <p>
          Upload your AWS Cost & Usage Report (CUR) CSV file and automatically
          detect unusual spending increases. Receive SNS alerts when costs exceed thresholds.
        </p>
      </section>

      {/* Upload Section */}
      <section className="upload-section">
        <div className="upload-card">
          <div className="aws-icon">📊</div>

          <h2>Upload AWS Billing CSV</h2>
          <p>Select your AWS CUR file for analysis</p>

          {/* Dropzone */}
          <label
            className="dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              key="csv-input"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
            />

            <div className="upload-content">
              <div className="upload-icon">☁️</div>
              <h3>Choose CSV File</h3>
              <span>Drag & Drop or Click to Browse</span>
            </div>
          </label>

          {/* File Preview */}
          {fileName && (
            <div className="file-preview">
              <span>📄</span>
              <p>
                {fileName}
              </p>
            </div>
          )}

          {/* Upload Button */}
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={!fileRef.current || loading}
          >
            {loading ? "Analyzing..." : "Analyze Cost Report"}
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🚨</div>
          <h3>Cost Spike Detection</h3>
          <p>Detect unexpected AWS spending increases instantly.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📨</div>
          <h3>SNS Alerts</h3>
          <p>Receive real-time Amazon SNS notifications.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3>Usage Analytics</h3>
          <p>Visualize AWS service-wise spending trends.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Cost Optimization</h3>
          <p>Reduce unnecessary AWS costs effectively.</p>
        </div>
      </section>

      {/* Workflow */}
      <section className="workflow">
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <p>Upload CUR CSV</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <p>Analyze Data</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <p>Detect Spikes</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <p>Send SNS Alerts</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Developed By Shubham Jadhav</p>
      </footer>

    </div>
  );
};

export default UploadFile;