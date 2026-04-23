import React from 'react';
import { Users, FileSearch, ClipboardCheck, ArrowRight, ShieldAlert, HeartHandshake } from 'lucide-react';
import './LandingView.css';

const LandingView = ({ onEnterDashboard }) => {
  return (
    <div className="landing-container">
      <div className="bg-glow glow-cyan"></div>
      
      <header className="landing-header">
        <div className="logo-container">
          <HeartHandshake className="logo-icon" size={32} color="var(--accent-cyan)" />
          <h1 className="logo-text">ReliefLink</h1>
        </div>
      </header>

      <main className="landing-content">
        <section className="hero-section animate-fade-in-up">
          <div className="badge">Centralized Coordination Hub</div>
          <h2 className="hero-title">
            Coordinate Relief. <br/><span className="highlight-cyan">Avoid Duplication.</span>
          </h2>
          <p className="hero-subtitle">
            After a disaster, multiple NGOs and Government agencies try to help. ReliefLink provides a unified platform to track who is doing what, preventing uneven recovery and wasted resources.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onEnterDashboard}>
              <span>Enter Coordination Dashboard</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </section>

        <section className="features-grid animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper cyan">
              <Users size={28} />
            </div>
            <h3>Active Deployment Map</h3>
            <p>See exactly which NGOs are in which villages. Are there 5 agencies distributing water in Zone A, but none in Zone B? Spot it instantly.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper orange">
              <ClipboardCheck size={28} />
            </div>
            <h3>Task & Resource Registry</h3>
            <p>Agencies can officially claim tasks (e.g., "Rebuilding 50 houses in Sector 4"). This common system prevents two organizations from doing the exact same work.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper cyan">
              <FileSearch size={28} />
            </div>
            <h3>Searchable Knowledge Base</h3>
            <p>Stop burying valuable lessons in long PDFs. Our system extracts insights from past disaster reports so planners can actually use them to prevent repeating mistakes.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingView;
