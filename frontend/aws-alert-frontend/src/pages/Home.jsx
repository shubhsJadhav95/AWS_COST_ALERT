import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Navbar */}
      <header className="home-navbar">
        <div className="brand" onClick={() => navigate("/")}>
          ☁️ CostSpike SNS
        </div>

        <div className="nav-tag">
          AWS Cost Monitoring Platform
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="badge">AWS SNS Powered Alerts</span>

          <h1>Detect AWS Cost Spikes Before They Become Expensive</h1>

          <p>
            Upload AWS Cost & Usage Reports and automatically identify unusual
            spending patterns. Get instant AWS SNS notifications whenever
            unexpected cost spikes are detected.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/uploadfile")}
            >
              Upload Report
            </button>

            <button className="secondary-btn">Learn More</button>
          </div>
        </div>
      </section>

      {/* Service Information */}
      <section className="service-info">
        <h2>What Our Service Provides</h2>

        <div className="service-grid">
          <div className="service-card">
            <span>📊</span>
            <h3>Cost Spike Detection</h3>
            <p>Automatically identifies unusual increases in AWS spending.</p>
          </div>

          <div className="service-card">
            <span>📨</span>
            <h3>SNS Notifications</h3>
            <p>
              Sends real-time alerts using Amazon SNS when thresholds are
              exceeded.
            </p>
          </div>

          <div className="service-card">
            <span>⚡</span>
            <h3>Fast Analysis</h3>
            <p>Process billing reports instantly and generate insights.</p>
          </div>

          <div className="service-card">
            <span>💰</span>
            <h3>Cost Optimization</h3>
            <p>Identify high-cost services and reduce unnecessary spending.</p>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="workflow">
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">
            <span>1</span>
            <p>Upload AWS CUR CSV File</p>
          </div>

          <div className="step">
            <span>2</span>
            <p>Analyze Billing Data</p>
          </div>

          <div className="step">
            <span>3</span>
            <p>Detect Cost Spikes</p>
          </div>

          <div className="step">
            <span>4</span>
            <p>Send SNS Alerts</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Developed by Shubham Jadhav • COPYRIGHT ISSUED</p>
      </footer>
    </div>
  );
}

export default Home;