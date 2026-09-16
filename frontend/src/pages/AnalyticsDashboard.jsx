import React, { useState } from 'react';
import StatCard from '../components/StatCard';

// Basic React Page: AnalyticsDashboard
// Implements Synopsis Step 7 & Section 5.6:
// KPIs, interactive filters, department & academic year distributions,
// attendance trends, popular events, and AI participation insights.
function AnalyticsDashboard({ aiInsights }) {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [selectedYearFilter, setSelectedYearFilter] = useState('All');

  const analytics = aiInsights.engagementAnalytics;

  // Simple filtering mock multiplier to show reactive updates when filter changes
  const getFilteredMultiplier = () => {
    if (selectedDeptFilter !== 'All' && selectedYearFilter !== 'All') return 0.35;
    if (selectedDeptFilter !== 'All') return 0.55;
    if (selectedYearFilter !== 'All') return 0.65;
    return 1.0;
  };

  const multiplier = getFilteredMultiplier();
  const displayRegistrations = Math.round(analytics.totalRegistrations * multiplier);
  const displayMembers = Math.round(analytics.activeMembers * multiplier);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-main-title">Student Engagement & Club Analytics</h1>
          <p className="page-main-subtitle">
            Comprehensive college-wide metrics, attendance trends, and AI-driven participation insights
          </p>
        </div>
      </div>

      {/* Synopsis Step 7 Filters: Department, Academic Year, Date Status */}
      <div className="analytics-filter-strip">
        <div className="filter-item">
          <label>Department Filter:</label>
          <select 
            className="form-select filter-dropdown"
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science & Engg</option>
            <option value="Info Science">Information Science & Engg</option>
            <option value="AI & Data Science">AI & Data Science</option>
            <option value="ECE">Electronics (ECE)</option>
            <option value="Mechanical">Mechanical / Civil</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Academic Year Filter:</label>
          <select 
            className="form-select filter-dropdown"
            value={selectedYearFilter}
            onChange={(e) => setSelectedYearFilter(e.target.value)}
          >
            <option value="All">All Academic Years</option>
            <option value="1st Year">1st Year (Freshmen)</option>
            <option value="2nd Year">2nd Year (Sophomore)</option>
            <option value="3rd Year">3rd Year (Junior)</option>
            <option value="4th Year">4th Year (Senior)</option>
          </select>
        </div>

        <div className="filter-status-indicator">
          <span className="status-dot"></span>
          Showing active metrics for: <strong>{selectedDeptFilter}</strong> • <strong>{selectedYearFilter}</strong>
        </div>
      </div>

      {/* Top Level KPIs (Section 5.6) */}
      <div className="stats-grid">
        <StatCard 
          icon="🏛️" 
          label="Total Active Clubs" 
          value={analytics.totalClubs} 
          note="+2 clubs added this year"
          color="blue" 
        />
        <StatCard 
          icon="👥" 
          label="Active Student Members" 
          value={displayMembers} 
          note="Across 12 registered societies"
          color="purple" 
        />
        <StatCard 
          icon="📅" 
          label="Events Hosted" 
          value={analytics.totalEvents} 
          note="34 completed • 4 upcoming"
          color="green" 
        />
        <StatCard 
          icon="🎫" 
          label="Total Registrations" 
          value={displayRegistrations} 
          note="Active student signups"
          color="orange" 
        />
        <StatCard 
          icon="📈" 
          label="Overall Attendance Rate" 
          value={`${analytics.overallAttendanceRate}%`} 
          note="Above 85% college target"
          color="blue" 
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Participation by Department (Bar Visualizer) */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Participation by Department</h3>
            <span className="chart-tag">Student Distribution</span>
          </div>

          <div className="bar-distribution-list">
            {analytics.departmentParticipation.map((item, idx) => (
              <div key={idx} className="bar-item">
                <div className="bar-labels">
                  <span className="bar-name">{item.dept}</span>
                  <span className="bar-meta">{Math.round(item.count * multiplier)} students ({item.percentage}%)</span>
                </div>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${item.percentage * 2.5}%`,
                      backgroundColor: ['#2563eb', '#7c3aed', '#ec4899', '#f59e0b', '#10b981'][idx % 5]
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Participation by Academic Year */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Participation by Academic Year</h3>
            <span className="chart-tag">Year-Wise Engagement</span>
          </div>

          <div className="year-columns-container">
            {analytics.yearParticipation.map((y, idx) => (
              <div key={idx} className="year-column-item">
                <div className="column-bar-wrapper">
                  <div 
                    className="column-bar" 
                    style={{ height: `${y.percentage * 2.2}px` }}
                  >
                    <span className="column-percent">{y.percentage}%</span>
                  </div>
                </div>
                <span className="column-label">{y.year}</span>
                <span className="column-count">{Math.round(y.count * multiplier)}</span>
              </div>
            ))}
          </div>

          <div className="chart-footer-note">
            💡 <strong>Observation:</strong> 3rd year students lead participation in technical hackathons and competitive coding.
          </div>
        </div>

        {/* Monthly Attendance Trends */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Event Attendance Rate (%)</h3>
            <span className="chart-tag">Consistency Trend</span>
          </div>

          <div className="trend-row-list">
            {analytics.monthlyAttendanceTrend.map((m, idx) => (
              <div key={idx} className="trend-row">
                <span className="trend-month">{m.month} 2026</span>
                <div className="trend-bar-bg">
                  <div 
                    className="trend-bar-fill" 
                    style={{ width: `${m.rate}%` }}
                  ></div>
                </div>
                <span className="trend-value">{m.rate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Events with Capacity Fill Rates */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Top Popular Events (Fill Rate)</h3>
            <span className="chart-tag">High Demand</span>
          </div>

          <div className="popular-events-list">
            {analytics.popularEvents.map((pop, idx) => (
              <div key={idx} className="pop-event-item">
                <div className="pop-event-info">
                  <strong>#{idx + 1} {pop.name}</strong>
                  <span>{pop.registrations} / {pop.capacity} registered</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${pop.fillRate}%`,
                      backgroundColor: pop.fillRate > 90 ? '#10b981' : '#3b82f6'
                    }}
                  ></div>
                </div>
                <small className="pop-rate">{pop.fillRate}% Capacity Filled</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Participation & Engagement Insights (Step 6 & 7 of Synopsis) */}
      <section className="section-card ai-insights-container">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="ai-sparkle-icon">🔮</span>
            <div>
              <h2 className="section-title">AI Predictive Engagement Insights</h2>
              <p className="section-subtitle">
                Machine-learning analysis on historical attendance patterns and student engagement cycles
              </p>
            </div>
          </div>
          <span className="ai-badge">Predictive Engine</span>
        </div>

        <div className="ai-insights-grid">
          {analytics.aiPredictiveInsights.map((insight, idx) => (
            <div key={idx} className="insight-box">
              <div className="insight-number">0{idx + 1}</div>
              <p className="insight-text">{insight}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AnalyticsDashboard;
