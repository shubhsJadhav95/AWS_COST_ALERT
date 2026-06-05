import React, { useState } from "react";
import "./UploadFile.css";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // File select
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      alert("Only CSV files are allowed");
      return;
    }

    setFile(selectedFile);
  };

  // Drag & drop support
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];

    if (!droppedFile) return;

    if (!droppedFile.name.endsWith(".csv")) {
      alert("Only CSV files are allowed");
      return;
    }

    setFile(droppedFile);
  };

  // Upload handler (API ready)
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Replace with your backend URL
      const response = await fetch("YOUR_API_URL_HERE", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload success:", data);

      alert("File uploaded successfully!");
      setFile(null);
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
          detect unusual spending increases. Receive SNS alerts when costs
          exceed thresholds.
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
          {file && (
            <div className="file-preview">
              <span>📄</span>
              <p>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}

          {/* Upload Button */}
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={!file || loading}
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
        <p>AWS Cost Spike Detection & SNS Notification Platform</p>
      </footer>
    </div>
  );
};

export default UploadFile;