import os
import subprocess
import pypdf

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Campus Connect - Project Contribution & Engineering Work Breakdown Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');

  @page {
    size: A4 portrait;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #E2E8F0;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0F172A;
    line-height: 1.45;
    -webkit-font-smoothing: antialiased;
  }

  .page {
    width: 210mm;
    height: 297mm;
    max-height: 297mm;
    box-sizing: border-box;
    padding: 14mm 16mm 12mm 16mm;
    margin: 10px auto;
    background: #FFFFFF;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  @media print {
    body {
      background: #FFFFFF !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .page {
      margin: 0 !important;
      box-shadow: none !important;
      page-break-after: always;
      break-after: page;
      height: 297mm !important;
      max-height: 297mm !important;
    }
  }

  /* Running Header & Footer */
  .running-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid #E2E8F0;
    padding-bottom: 7px;
    font-size: 8.5pt;
    font-weight: 600;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .running-header .inst-tag {
    color: #1E293B;
    font-weight: 700;
  }

  .running-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1.5px solid #E2E8F0;
    padding-top: 7px;
    font-size: 8pt;
    font-weight: 600;
    color: #64748B;
  }

  .content-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 10px;
    padding-top: 8px;
    padding-bottom: 4px;
  }

  /* Typography */
  h1, h2, h3, h4 {
    color: #0F172A;
    font-weight: 800;
    letter-spacing: -0.3px;
  }
  .mono {
    font-family: 'JetBrains Mono', monospace;
  }

  /* Hero Section (Page 1) */
  .doc-hero {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    border-radius: 12px;
    padding: 16px 20px;
    color: #FFFFFF;
    position: relative;
    overflow: hidden;
  }
  .doc-hero::after {
    content: "";
    position: absolute;
    right: -20px;
    top: -30px;
    width: 140px;
    height: 140px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%);
    border-radius: 50%;
  }
  .hero-pretitle {
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #38BDF8;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .hero-pretitle span.dot {
    width: 6px;
    height: 6px;
    background: #38BDF8;
    border-radius: 50%;
    display: inline-block;
  }
  .hero-title {
    font-size: 20pt;
    font-weight: 800;
    color: #FFFFFF;
    line-height: 1.15;
    margin-bottom: 4px;
  }
  .hero-subtitle {
    font-size: 10pt;
    color: #94A3B8;
    font-weight: 500;
    margin-bottom: 12px;
  }
  .hero-meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 10px;
  }
  .hero-meta-item .label {
    font-size: 7pt;
    text-transform: uppercase;
    color: #94A3B8;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  .hero-meta-item .val {
    font-size: 8.5pt;
    font-weight: 700;
    color: #F8FAFC;
    margin-top: 1px;
  }

  /* Metric Badges / KPI bar */
  .kpi-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  .kpi-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 10px;
    padding: 10px 12px;
    text-align: center;
  }
  .kpi-num {
    font-size: 16pt;
    font-weight: 800;
    color: #0F172A;
    line-height: 1.1;
  }
  .kpi-label {
    font-size: 7.5pt;
    color: #64748B;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }

  /* Contribution High-Level Split Banner */
  .contrib-overview-card {
    background: #FFFFFF;
    border: 1.5px solid #CBD5E1;
    border-radius: 12px;
    padding: 12px 16px;
  }
  .section-heading-sm {
    font-size: 10.5pt;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .contrib-bar-wrap {
    height: 22px;
    background: #E2E8F0;
    border-radius: 11px;
    overflow: hidden;
    display: flex;
    margin-bottom: 10px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
  }
  .c-bar-rishi {
    width: 45%;
    background: linear-gradient(90deg, #1E40AF, #3B82F6);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 7.5pt;
    font-weight: 800;
    letter-spacing: 0.5px;
  }
  .c-bar-sriya {
    width: 30%;
    background: linear-gradient(90deg, #4338CA, #6366F1);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 7.5pt;
    font-weight: 800;
    letter-spacing: 0.5px;
  }
  .c-bar-shivangi {
    width: 25%;
    background: linear-gradient(90deg, #047857, #10B981);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 7.5pt;
    font-weight: 800;
    letter-spacing: 0.5px;
  }

  .contrib-legend-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 8px;
  }
  .legend-box {
    border-radius: 8px;
    padding: 8px 10px;
    border: 1px solid #E2E8F0;
  }
  .lb-rishi { background: #EFF6FF; border-color: #BFDBFE; }
  .lb-sriya { background: #EEF2FF; border-color: #C7D2FE; }
  .lb-shivangi { background: #ECFDF5; border-color: #A7F3D0; }

  .lb-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2px;
  }
  .lb-name {
    font-size: 8.5pt;
    font-weight: 800;
    color: #0F172A;
  }
  .lb-pct {
    font-size: 9pt;
    font-weight: 800;
  }
  .lb-rishi .lb-pct { color: #1D4ED8; }
  .lb-sriya .lb-pct { color: #4338CA; }
  .lb-shivangi .lb-pct { color: #047857; }

  .lb-role {
    font-size: 7pt;
    font-weight: 600;
    color: #475569;
  }
  .lb-roll {
    font-size: 7pt;
    font-family: 'JetBrains Mono', monospace;
    color: #64748B;
    margin-top: 1px;
  }

  /* Abstract Box (Page 1 bottom) */
  .summary-box {
    background: #F8FAFC;
    border-left: 3.5px solid #2563EB;
    border-radius: 4px 8px 8px 4px;
    padding: 9px 12px;
    font-size: 8pt;
    color: #334155;
    line-height: 1.45;
  }
  .summary-box strong {
    color: #0F172A;
  }

  /* Section Title Standard */
  .section-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 1.5px solid #E2E8F0;
  }
  .section-badge {
    background: #0F172A;
    color: #FFFFFF;
    font-size: 7.5pt;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .section-title {
    font-size: 11.5pt;
    font-weight: 800;
    color: #0F172A;
  }

  /* Member Detailed Cards (Page 2 & 3) */
  .member-card {
    background: #FFFFFF;
    border-radius: 10px;
    border: 1.5px solid #E2E8F0;
    padding: 11px 14px;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .mc-rishi {
    border-color: #93C5FD;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.06);
  }
  .mc-sriya {
    border-color: #A5B4FC;
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.06);
  }
  .mc-shivangi {
    border-color: #6EE7B7;
    box-shadow: 0 2px 8px rgba(5, 150, 105, 0.06);
  }

  .mc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 6px;
    border-bottom: 1px solid #F1F5F9;
  }
  .mc-id-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .mc-avatar-letter {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    color: #FFFFFF;
    font-weight: 800;
    font-size: 11pt;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .av-rishi { background: linear-gradient(135deg, #1E40AF, #3B82F6); }
  .av-sriya { background: linear-gradient(135deg, #4338CA, #6366F1); }
  .av-shivangi { background: linear-gradient(135deg, #047857, #10B981); }

  .mc-name-title h3 {
    font-size: 11pt;
    font-weight: 800;
    line-height: 1.15;
  }
  .mc-name-title .role {
    font-size: 7.5pt;
    color: #64748B;
    font-weight: 600;
  }
  .mc-stats-pills {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .pill-weight {
    padding: 3px 9px;
    border-radius: 9999px;
    font-size: 8pt;
    font-weight: 800;
  }
  .pw-rishi { background: #DBEAFE; color: #1E40AF; }
  .pw-sriya { background: #E0E7FF; color: #4338CA; }
  .pw-shivangi { background: #D1FAE5; color: #065F46; }

  .pill-rank {
    padding: 3px 8px;
    border-radius: 9999px;
    font-size: 7pt;
    font-weight: 700;
    text-transform: uppercase;
    background: #F1F5F9;
    color: #475569;
  }

  /* Sub-sections within member cards */
  .mc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .mc-box {
    background: #F8FAFC;
    border-radius: 6px;
    padding: 6px 9px;
  }
  .mc-box-title {
    font-size: 7.5pt;
    font-weight: 700;
    color: #1E293B;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .mc-box-title span.indicator {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }
  .ind-blue { background: #2563EB; }
  .ind-indigo { background: #6366F1; }
  .ind-emerald { background: #059669; }

  .mc-bullets {
    list-style: none;
    font-size: 7.3pt;
    color: #334155;
    line-height: 1.38;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .mc-bullets li {
    position: relative;
    padding-left: 10px;
  }
  .mc-bullets li::before {
    content: "▪";
    position: absolute;
    left: 0;
    color: #94A3B8;
    font-size: 9pt;
    line-height: 1;
  }
  .mc-bullets li strong {
    color: #0F172A;
  }

  .mc-code-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 2px;
  }
  .code-chip {
    background: #FFFFFF;
    border: 1px solid #CBD5E1;
    border-radius: 4px;
    padding: 1px 5px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 6.5pt;
    color: #0F172A;
    font-weight: 600;
  }

  /* Tables (Page 3 & 4) */
  .dense-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.2pt;
    background: #FFFFFF;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #E2E8F0;
  }
  .dense-table th {
    background: #0F172A;
    color: #FFFFFF;
    padding: 6px 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    text-align: left;
    font-size: 6.8pt;
  }
  .dense-table td {
    padding: 4.8px 8px;
    border-bottom: 1px solid #F1F5F9;
    color: #334155;
  }
  .dense-table tr:last-child td {
    border-bottom: none;
  }
  .dense-table tr:nth-child(even) td {
    background: #F8FAFC;
  }
  .dense-table td.strong {
    font-weight: 700;
    color: #0F172A;
  }
  .status-badge {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 9999px;
    font-size: 6.5pt;
    font-weight: 700;
    text-transform: uppercase;
  }
  .status-complete {
    background: #D1FAE5;
    color: #065F46;
  }

  /* Architecture & Tech Stack Grid (Page 4) */
  .tech-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  .tech-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 8px 10px;
  }
  .tech-card-title {
    font-size: 7.5pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #1E293B;
    margin-bottom: 4px;
    border-bottom: 1px solid #E2E8F0;
    padding-bottom: 3px;
  }
  .tech-list {
    list-style: none;
    font-size: 7pt;
    color: #475569;
    line-height: 1.4;
  }
  .tech-list li strong {
    color: #0F172A;
  }

  /* Verification & Signatures (Page 4) */
  .sign-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 8px;
  }
  .sign-card {
    border: 1.5px dashed #CBD5E1;
    border-radius: 8px;
    padding: 10px 12px;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 98px;
  }
  .sign-tag {
    font-size: 6.8pt;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748B;
  }
  .sign-line {
    border-bottom: 1px solid #94A3B8;
    margin-bottom: 4px;
  }
  .sign-name {
    font-size: 8.5pt;
    font-weight: 800;
    color: #0F172A;
  }
  .sign-meta {
    font-size: 6.8pt;
    color: #64748B;
    font-family: 'JetBrains Mono', monospace;
  }

  .faculty-block {
    background: #F8FAFC;
    border: 1.5px solid #CBD5E1;
    border-radius: 8px;
    padding: 9px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
  }
  .faculty-info {
    font-size: 7.5pt;
    color: #334155;
    line-height: 1.35;
  }
  .faculty-info strong {
    color: #0F172A;
    font-size: 8pt;
  }
  .faculty-seal {
    width: 140px;
    height: 48px;
    border: 1px dashed #94A3B8;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 6.8pt;
    font-weight: 700;
    color: #94A3B8;
    text-transform: uppercase;
    text-align: center;
    line-height: 1.2;
  }
</style>
</head>
<body>

<!-- ================= PAGE 1: EXECUTIVE OVERVIEW & CONTRIBUTION SPLIT ================= -->
<div class="page" id="page-1">
  <div class="running-header">
    <span class="inst-tag">IIIT Vadodara – International Campus Diu</span>
    <span>Campus Connect • Engineering Contribution Report</span>
    <span>Document Ref: CC-CR-2026-01</span>
  </div>

  <div class="content-body">
    <!-- Hero / Title -->
    <div class="doc-hero">
      <div class="hero-pretitle">
        <span class="dot"></span> Department of Computer Science & Engineering • B.Tech (2023–2027)
      </div>
      <div class="hero-title">Project Contribution & Engineering Work Breakdown Report</div>
      <div class="hero-subtitle">Campus Connect — High-Resilience Cloud-Native Integrated Digital Campus Ecosystem</div>
      
      <div class="hero-meta-grid">
        <div class="hero-meta-item">
          <div class="label">Project Title</div>
          <div class="val">Campus Connect</div>
        </div>
        <div class="hero-meta-item">
          <div class="label">Production Host</div>
          <div class="val">Cloudflare Pages SPA</div>
        </div>
        <div class="hero-meta-item">
          <div class="label">Backend & Storage</div>
          <div class="val">Supabase PostgreSQL 15</div>
        </div>
        <div class="hero-meta-item">
          <div class="label">GitHub Repository</div>
          <div class="val mono">rishi12145/Campus-Connect</div>
        </div>
      </div>
    </div>

    <!-- KPI Strip -->
    <div class="kpi-strip">
      <div class="kpi-card">
        <div class="kpi-num" style="color: #2563EB;">12</div>
        <div class="kpi-label">Functional Modules</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-num" style="color: #4F46E5;">12</div>
        <div class="kpi-label">Supabase Tables</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-num" style="color: #059669;">65/65</div>
        <div class="kpi-label">Verified Test Suites</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-num" style="color: #D97706;">100%</div>
        <div class="kpi-label">Implementation Status</div>
      </div>
    </div>

    <!-- Overall Contribution Distribution -->
    <div class="contrib-overview-card">
      <div class="section-heading-sm">
        <span>Team Contribution & Engineering Effort Distribution</span>
        <span style="font-size: 7.5pt; font-weight: 600; color: #64748B;">Total Effort: 100% • 3 Core Engineers</span>
      </div>

      <div class="contrib-bar-wrap">
        <div class="c-bar-rishi">Rishikesh Gopal (45%)</div>
        <div class="c-bar-sriya">Sriya Reddy (30%)</div>
        <div class="c-bar-shivangi">Shivangi Goutam (25%)</div>
      </div>

      <div class="contrib-legend-grid">
        <!-- Lead -->
        <div class="legend-box lb-rishi">
          <div class="lb-header">
            <div class="lb-name">Rishikesh Gopal</div>
            <div class="lb-pct">45% (Highest)</div>
          </div>
          <div class="lb-role">Lead Full-Stack Architect & Controller</div>
          <div class="lb-roll">ID: 202311072 • B.Tech CSE</div>
        </div>

        <!-- Sriya -->
        <div class="legend-box lb-sriya">
          <div class="lb-header">
            <div class="lb-name">Sriya Reddy</div>
            <div class="lb-pct">30% (Second)</div>
          </div>
          <div class="lb-role">Frontend Architect & UI/UX Designer</div>
          <div class="lb-roll">ID: 202311060 • B.Tech CSE</div>
        </div>

        <!-- Shivangi -->
        <div class="legend-box lb-shivangi">
          <div class="lb-header">
            <div class="lb-name">Shivangi Goutam</div>
            <div class="lb-pct">25% (Supporting)</div>
          </div>
          <div class="lb-role">Backend & Data Persistence Engineer</div>
          <div class="lb-roll">ID: 202311079 • B.Tech CSE</div>
        </div>
      </div>
    </div>

    <!-- Executive Summary Narrative -->
    <div class="summary-box">
      <strong>Executive Engineering Summary:</strong> Campus Connect is a mission-critical digital operating system engineered specifically for the students, faculty, and administrative staff of IIIT Vadodara – International Campus Diu. Built upon a modern, distributed architecture combining <strong>React 18 + Vite</strong>, <strong>Node.js / Express</strong>, and <strong>Supabase Cloud PostgreSQL</strong>, the system solves real-world campus fragmentation across twelve distinct functional domains. To guarantee uninterrupted academic continuity even during maritime network drops, the engineering team designed a proprietary <em>Dual-Engine Client-Server Persistence Layer</em> that dynamically toggles between remote cloud databases and client-side offline storage with automated synchronization upon network restoration.
    </div>

    <!-- Architectural Overview Table -->
    <div>
      <div class="section-banner">
        <span class="section-badge">Platform Overview</span>
        <span class="section-title">Core Subsystem Architecture & Engineering Scope</span>
      </div>
      <table class="dense-table">
        <thead>
          <tr>
            <th style="width: 20%;">Subsystem Tier</th>
            <th style="width: 32%;">Technical Components</th>
            <th style="width: 33%;">Key Engineering Capabilities</th>
            <th style="width: 15%;">Primary Lead</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="strong">Presentation & UI/UX</td>
            <td>React 18, Tailwind CSS, Lucide Icons, Framer Motion</td>
            <td>High-contrast editorial dark theme, responsive viewport adaptations, fluid animated micro-interactions</td>
            <td>Sriya Reddy (30%)</td>
          </tr>
          <tr>
            <td class="strong">Full-Stack Core & Auth</td>
            <td>Supabase Auth, RLS Policies, Dual-Engine Persistence</td>
            <td>Bcrypt-secured credentials, session persistence, role protection triggers, offline reconciliation engine</td>
            <td>Rishikesh Gopal (45%)</td>
          </tr>
          <tr>
            <td class="strong">Cloud Storage & Assets</td>
            <td>Supabase Object Storage, iLovePDF/iLoveIMG Bridge</td>
            <td>1 MB strictly enforced client-side validation, secure private bucket streaming, binary file optimization</td>
            <td>Shivangi Goutam (25%)</td>
          </tr>
          <tr>
            <td class="strong">DevOps & Verification</td>
            <td>Cloudflare Pages CI/CD, SPA Routing, Automated Tests</td>
            <td>Zero-dependency builds, monorepo workspaces, 65 automated tests covering functional & RLS security rules</td>
            <td>Rishikesh Gopal (45%)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="running-footer">
    <span>Indian Institute of Information Technology Vadodara – International Campus Diu</span>
    <span>Confidential • Academic Assessment Record</span>
    <span>Page 1 of 4</span>
  </div>
</div>

<!-- ================= PAGE 2: INDIVIDUAL CONTRIBUTION DOSSIER (RISHIKESH & SRIYA) ================= -->
<div class="page" id="page-2">
  <div class="running-header">
    <span class="inst-tag">IIIT Vadodara – International Campus Diu</span>
    <span>Detailed Engineering Dossier • Full-Stack & Frontend</span>
    <span>Document Ref: CC-CR-2026-01</span>
  </div>

  <div class="content-body">
    <div class="section-banner">
      <span class="section-badge">Member Dossier 01</span>
      <span class="section-title">Rishikesh Gopal — Lead Full-Stack Architect & Controller</span>
    </div>

    <!-- Rishikesh Gopal Detailed Card -->
    <div class="member-card mc-rishi">
      <div class="mc-header">
        <div class="mc-id-group">
          <div class="mc-avatar-letter av-rishi">RG</div>
          <div class="mc-name-title">
            <h3>Rishikesh Gopal <span style="font-size: 8pt; font-weight: 600; color: #2563EB;">(Lead Developer)</span></h3>
            <div class="role">Student ID: 202311072 • B.Tech CSE (2023–2027) • 202311072@iiitvadodara.ac.in</div>
          </div>
        </div>
        <div class="mc-stats-pills">
          <span class="pill-weight pw-rishi">45% Total Contribution</span>
          <span class="pill-rank">Highest Contributor</span>
        </div>
      </div>

      <div class="mc-grid">
        <div class="mc-box">
          <div class="mc-box-title">
            <span class="indicator ind-blue"></span> Core Architecture & Systems Ownership
          </div>
          <ul class="mc-bullets">
            <li><strong>End-to-End System Topology:</strong> Architected complete monorepo topology unifying React 18 client, Node.js Express backend, and Supabase PostgreSQL 15 database.</li>
            <li><strong>Supabase Authentication Lifecycle:</strong> Designed and deployed email/password registration, login, persistent session caching, and recovery routing in <code>AuthContext.jsx</code>.</li>
            <li><strong>Database Schema & Migration Authoring:</strong> Wrote production migration <code>supabase_auth_migration.sql</code> (12 tables, foreign key constraints, cascade triggers).</li>
            <li><strong>Enterprise Row Level Security (RLS):</strong> Implemented recursive-free <code>is_admin()</code> SECURITY DEFINER function and <code>trg_protect_profile_role</code> privilege-escalation prevention trigger.</li>
          </ul>
        </div>

        <div class="mc-box">
          <div class="mc-box-title">
            <span class="indicator ind-blue"></span> Offline Sync, Admin CMS & DevOps Lead
          </div>
          <ul class="mc-bullets">
            <li><strong>Dual-Engine Persistence Engine:</strong> Engineered <code>offlineSyncEngine.js</code> and <code>apiClient.js</code> with transparent offline caching, fallback routing, and auto-sync queue.</li>
            <li><strong>Admin Control Center (CMS):</strong> Built comprehensive administrative dashboard with real-time stats, role assignment controls, announcements broadcast, and content moderation.</li>
            <li><strong>DevOps & Cloudflare CI/CD Pipeline:</strong> Configured monorepo workspaces, fixed Vite build scripts, optimized bundle chunks, and established Cloudflare Pages SPA redirection.</li>
            <li><strong>Automated Test Engineering:</strong> Authored master test suite (42 functional tests) and security test harness (23 RLS tests) verifying 100% compliance.</li>
          </ul>
        </div>
      </div>

      <div>
        <div style="font-size: 7pt; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 2px;">Primary Files & Code Assets Authored by Rishikesh:</div>
        <div class="mc-code-chips">
          <span class="code-chip">supabase_auth_migration.sql</span>
          <span class="code-chip">supabase_schema.sql</span>
          <span class="code-chip">AuthContext.jsx</span>
          <span class="code-chip">offlineSyncEngine.js</span>
          <span class="code-chip">apiClient.js</span>
          <span class="code-chip">AdminDashboard.jsx</span>
          <span class="code-chip">LoginPage.jsx</span>
          <span class="code-chip">RegisterPage.jsx</span>
          <span class="code-chip">test_suite.js (42 tests)</span>
          <span class="code-chip">test_supabase_auth.js (23 tests)</span>
          <span class="code-chip">package.json (Workspaces & Scripts)</span>
        </div>
      </div>
    </div>

    <!-- Sriya Reddy Detailed Card -->
    <div class="section-banner" style="margin-top: 4px;">
      <span class="section-badge">Member Dossier 02</span>
      <span class="section-title">Sriya Reddy — Frontend Architect & UI/UX Designer</span>
    </div>

    <div class="member-card mc-sriya">
      <div class="mc-header">
        <div class="mc-id-group">
          <div class="mc-avatar-letter av-sriya">SR</div>
          <div class="mc-name-title">
            <h3>Sriya Reddy <span style="font-size: 8pt; font-weight: 600; color: #4338CA;">(Frontend Lead)</span></h3>
            <div class="role">Student ID: 202311060 • B.Tech CSE (2023–2027) • 202311060@iiitvadodara.ac.in</div>
          </div>
        </div>
        <div class="mc-stats-pills">
          <span class="pill-weight pw-sriya">30% Total Contribution</span>
          <span class="pill-rank">Second Highest</span>
        </div>
      </div>

      <div class="mc-grid">
        <div class="mc-box">
          <div class="mc-box-title">
            <span class="indicator ind-indigo"></span> Design System & Responsive Navigation
          </div>
          <ul class="mc-bullets">
            <li><strong>Editorial Design System:</strong> Crafted high-contrast visual architecture (Dark `#0D0D0D`/`#161616` background, Electric Lime accents, refined slate borders).</li>
            <li><strong>Responsive Viewport Adaptation:</strong> Built mobile-first navigation incorporating collapsible sidebar drawer, bottom navigation bar, and fluid CSS grid breakpoints.</li>
            <li><strong>Micro-Interactions & Transitions:</strong> Integrated Framer Motion animations for modal entries, tab switches, toast alert animations, and interactive hover cards.</li>
            <li><strong>Accessibility & Ergonomics:</strong> Implemented WCAG AA compliant contrast ratios, accessible form controls, keyboard navigation, and ARIA labels.</li>
          </ul>
        </div>

        <div class="mc-box">
          <div class="mc-box-title">
            <span class="indicator ind-indigo"></span> Core Module UIs & Student Experience
          </div>
          <ul class="mc-bullets">
            <li><strong>Academic Resources Portal UI:</strong> Designed interactive multi-parameter filtering drawer (semester, branch, subject, file format) and search bar.</li>
            <li><strong>Community Forum Interface:</strong> Designed threaded discussion board, upvote triggers, category tags, modal composer, and nested comment hierarchy.</li>
            <li><strong>Lost & Found Grid UI:</strong> Developed dual-tabbed Lost/Found item cards with claim-status badges, image zoom previews, and contact reveal modals.</li>
            <li><strong>Campus Exploration & Timetable UIs:</strong> Styled interactive bus schedule timetables, classroom routine calendar, and Diu tourist destination cards.</li>
          </ul>
        </div>
      </div>

      <div>
        <div style="font-size: 7pt; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 2px;">Primary Files & Code Assets Authored by Sriya:</div>
        <div class="mc-code-chips">
          <span class="code-chip">ResourcesPage.jsx</span>
          <span class="code-chip">DiscussionsPage.jsx</span>
          <span class="code-chip">LostFoundPage.jsx</span>
          <span class="code-chip">RoutinePage.jsx</span>
          <span class="code-chip">TransportPage.jsx</span>
          <span class="code-chip">ExplorePage.jsx</span>
          <span class="code-chip">Navbar.jsx & Sidebar.jsx</span>
          <span class="code-chip">tailwind.config.js</span>
          <span class="code-chip">index.css (Global Design System)</span>
        </div>
      </div>
    </div>
  </div>

  <div class="running-footer">
    <span>Indian Institute of Information Technology Vadodara – International Campus Diu</span>
    <span>Confidential • Academic Assessment Record</span>
    <span>Page 2 of 4</span>
  </div>
</div>

<!-- ================= PAGE 3: SHIVANGI DOSSIER & WORK BREAKDOWN STRUCTURE MATRIX ================= -->
<div class="page" id="page-3">
  <div class="running-header">
    <span class="inst-tag">IIIT Vadodara – International Campus Diu</span>
    <span>Backend Persistence Dossier & WBS Responsibility Matrix</span>
    <span>Document Ref: CC-CR-2026-01</span>
  </div>

  <div class="content-body">
    <div class="section-banner">
      <span class="section-badge">Member Dossier 03</span>
      <span class="section-title">Shivangi Goutam — Backend & Data Persistence Engineer</span>
    </div>

    <!-- Shivangi Goutam Detailed Card -->
    <div class="member-card mc-shivangi">
      <div class="mc-header">
        <div class="mc-id-group">
          <div class="mc-avatar-letter av-shivangi">SG</div>
          <div class="mc-name-title">
            <h3>Shivangi Goutam <span style="font-size: 8pt; font-weight: 600; color: #047857;">(Persistence & Data Engineer)</span></h3>
            <div class="role">Student ID: 202311079 • B.Tech CSE (2023–2027) • 202311079@iiitvadodara.ac.in</div>
          </div>
        </div>
        <div class="mc-stats-pills">
          <span class="pill-weight pw-shivangi">25% Total Contribution</span>
          <span class="pill-rank">Supporting Engineer</span>
        </div>
      </div>

      <div class="mc-grid">
        <div class="mc-box">
          <div class="mc-box-title">
            <span class="indicator ind-emerald"></span> Storage Engine & Client-Side File Validation
          </div>
          <ul class="mc-bullets">
            <li><strong>Supabase Cloud Storage Integration:</strong> Configured private object storage bucket <code>academic-resources</code> and implemented signed download URL generation.</li>
            <li><strong>1 MB Strict File Size Enforcer:</strong> Developed client-side file inspection middleware verifying maximum 1 MB limit for PDF, JPG, and PNG uploads.</li>
            <li><strong>External Compression Workflow:</strong> Integrated informative alert modals providing direct bridges to iLovePDF and iLoveIMG when uploads exceed quotas.</li>
            <li><strong>Storage Security Policies:</strong> Co-authored storage RLS policies granting public read access while restricting uploads/deletions to authenticated owners.</li>
          </ul>
        </div>

        <div class="mc-box">
          <div class="mc-box-title">
            <span class="indicator ind-emerald"></span> Database Seeding & Mock Schema Architecture
          </div>
          <ul class="mc-bullets">
            <li><strong>Master Seed Dataset Generation:</strong> Populated <code>initialData.js</code> with structured records across all 12 operational database tables.</li>
            <li><strong>Campus Domain Data Engineering:</strong> Curated official B.Tech CSE timetables, faculty contact books, Diu emergency service directories, and bus routes.</li>
            <li><strong>Schema Verification & Column Parity:</strong> Maintained schema synchronization between offline localStorage fallback structures and live Supabase PostgreSQL tables.</li>
            <li><strong>QA Test Execution:</strong> Participated in testing file upload flows, offline fallback recovery, and error boundary behaviors.</li>
          </ul>
        </div>
      </div>

      <div>
        <div style="font-size: 7pt; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 2px;">Primary Files & Code Assets Authored by Shivangi:</div>
        <div class="mc-code-chips">
          <span class="code-chip">initialData.js (12 Tables Seed)</span>
          <span class="code-chip">supabaseStorage.js</span>
          <span class="code-chip">fileUploadValidator.js</span>
          <span class="code-chip">resourceService.js</span>
          <span class="code-chip">download_diu_places_images.js</span>
          <span class="code-chip">server.js (Storage Routes)</span>
        </div>
      </div>
    </div>

    <!-- Complete Work Breakdown Structure (WBS) Matrix -->
    <div style="margin-top: 4px;">
      <div class="section-banner">
        <span class="section-badge">Responsibility Matrix</span>
        <span class="section-title">Module-by-Module Work Breakdown Structure (WBS)</span>
      </div>
      <table class="dense-table">
        <thead>
          <tr>
            <th style="width: 26%;">Functional Module / Component</th>
            <th style="width: 20%;">Primary Lead</th>
            <th style="width: 24%;">Supporting Member(s)</th>
            <th style="width: 18%; text-align: center;">Effort Split (R / S / Sh)</th>
            <th style="width: 12%; text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="strong">System Architecture & Monorepo</td>
            <td>Rishikesh Gopal (Lead)</td>
            <td>Sriya Reddy, Shivangi Goutam</td>
            <td style="text-align: center; font-family: monospace;">60% / 20% / 20%</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Complete</span></td>
          </tr>
          <tr>
            <td class="strong">Supabase Auth, RLS & Schema</td>
            <td>Rishikesh Gopal (Lead)</td>
            <td>Shivangi Goutam (Storage RLS)</td>
            <td style="text-align: center; font-family: monospace;">75% / 05% / 20%</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Complete</span></td>
          </tr>
          <tr>
            <td class="strong">Dual-Engine Offline Sync</td>
            <td>Rishikesh Gopal (Lead)</td>
            <td>Shivangi Goutam (Fallback Data)</td>
            <td style="text-align: center; font-family: monospace;">70% / 10% / 20%</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Complete</span></td>
          </tr>
          <tr>
            <td class="strong">Editorial Dark UI Design System</td>
            <td>Sriya Reddy (Lead)</td>
            <td>Rishikesh Gopal (Tailwind setup)</td>
            <td style="text-align: center; font-family: monospace;">15% / 75% / 10%</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Complete</span></td>
          </tr>
          <tr>
            <td class="strong">Academic Resources Hub</td>
            <td>Sriya Reddy (Lead UI)</td>
            <td>Shivangi Goutam (Storage / 1MB limit)</td>
            <td style="text-align: center; font-family: monospace;">20% / 45% / 35%</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Complete</span></td>
          </tr>
          <tr>
            <td class="strong">Supabase Storage & 1MB Validation</td>
            <td>Shivangi Goutam (Lead)</td>
            <td>Rishikesh Gopal (Security Policies)</td>
            <td style="text-align: center; font-family: monospace;">25% / 10% / 65%</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Complete</span></td>
          </tr>
          <tr>
            <td class="strong">Community Discussion Forum</td>
            <td>Sriya Reddy (Lead UI)</td>
            <td>Rishikesh Gopal (DB Comments schema)</td>
            <td style="text-align: center; font-family: monospace;">35% / 50% / 15%</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Complete</span></td>
          </tr>
          <tr>
            <td class="strong">Lost & Found Portal</td>
            <td>Sriya Reddy (Lead UI)</td>
            <td>Shivangi Goutam (Initial Seed Data)</td>
            <td style="text-align: center; font-family: monospace;">25% / 55% / 20%</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Complete</span></td>
          </tr>
          <tr>
            <td class="strong">Academic Timetable & Routines</td>
            <td>Shivangi Goutam (Data Lead)</td>
            <td>Sriya Reddy (Calendar UI)</td>
            <td style="text-align: center; font-family: monospace;">20% / 40% / 40%</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Complete</span></td>
          </tr>
          <tr>
            <td class="strong">Campus Transport & Transit Tracker</td>
            <td>Shivangi Goutam (Data Lead)</td>
            <td>Sriya Reddy (Timeline UI)</td>
            <td style="text-align: center; font-family: monospace;">20% / 40% / 40%</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Complete</span></td>
          </tr>
          <tr>
            <td class="strong">Admin Control Center (CMS)</td>
            <td>Rishikesh Gopal (Lead)</td>
            <td>Sriya Reddy (Theme alignment)</td>
            <td style="text-align: center; font-family: monospace;">80% / 15% / 05%</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Complete</span></td>
          </tr>
          <tr>
            <td class="strong">DevOps, CI/CD & Cloudflare</td>
            <td>Rishikesh Gopal (Lead)</td>
            <td>Shivangi Goutam (Image Lanczos scripts)</td>
            <td style="text-align: center; font-family: monospace;">75% / 10% / 15%</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Complete</span></td>
          </tr>
          <tr>
            <td class="strong">Automated Test Suites (65 Tests)</td>
            <td>Rishikesh Gopal (Lead)</td>
            <td>Shivangi Goutam (Mock tests validation)</td>
            <td style="text-align: center; font-family: monospace;">70% / 10% / 20%</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Complete</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="running-footer">
    <span>Indian Institute of Information Technology Vadodara – International Campus Diu</span>
    <span>Confidential • Academic Assessment Record</span>
    <span>Page 3 of 4</span>
  </div>
</div>

<!-- ================= PAGE 4: VERIFICATION, QUALITY ASSURANCE & FORMAL SIGN-OFF ================= -->
<div class="page" id="page-4">
  <div class="running-header">
    <span class="inst-tag">IIIT Vadodara – International Campus Diu</span>
    <span>Quality Assurance, Verification & Formal Approval</span>
    <span>Document Ref: CC-CR-2026-01</span>
  </div>

  <div class="content-body">
    <!-- Technology Stack Strip -->
    <div class="section-banner">
      <span class="section-badge">Technology Stack</span>
      <span class="section-title">Production Engineering Frameworks & Tooling</span>
    </div>

    <div class="tech-grid">
      <div class="tech-card">
        <div class="tech-card-title">Frontend Core</div>
        <ul class="tech-list">
          <li><strong>Framework:</strong> React 18.3.1 (SPA)</li>
          <li><strong>Bundler:</strong> Vite 5.4.14</li>
          <li><strong>Styling:</strong> Tailwind CSS 3.4</li>
          <li><strong>Motion:</strong> Framer Motion 11</li>
          <li><strong>Icons:</strong> Lucide React</li>
        </ul>
      </div>

      <div class="tech-card">
        <div class="tech-card-title">Backend API</div>
        <ul class="tech-list">
          <li><strong>Runtime:</strong> Node.js 20+ LTS</li>
          <li><strong>Server:</strong> Express 4.19</li>
          <li><strong>Architecture:</strong> RESTful Microservices</li>
          <li><strong>Security:</strong> Helmet, CORS</li>
          <li><strong>Validation:</strong> Joi / Schema Guard</li>
        </ul>
      </div>

      <div class="tech-card">
        <div class="tech-card-title">Database & Auth</div>
        <ul class="tech-list">
          <li><strong>Database:</strong> PostgreSQL 15</li>
          <li><strong>Host:</strong> Supabase Cloud</li>
          <li><strong>Security:</strong> RLS + Definer Triggers</li>
          <li><strong>Auth:</strong> Supabase GoTrue Auth</li>
          <li><strong>Storage:</strong> Private S3 Object Store</li>
        </ul>
      </div>

      <div class="tech-card">
        <div class="tech-card-title">DevOps & Edge</div>
        <ul class="tech-list">
          <li><strong>Edge Host:</strong> Cloudflare Pages</li>
          <li><strong>Routing:</strong> SPA Redirects engine</li>
          <li><strong>Version Control:</strong> GitHub (main)</li>
          <li><strong>Compression:</strong> Pillow Lanczos</li>
          <li><strong>CI/CD:</strong> Cloudflare Automated Build</li>
        </ul>
      </div>
    </div>

    <!-- QA & Verification Summary -->
    <div style="margin-top: 4px;">
      <div class="section-banner">
        <span class="section-badge">Verification Matrix</span>
        <span class="section-title">Automated Testing & Security Validation Results</span>
      </div>
      <table class="dense-table">
        <thead>
          <tr>
            <th style="width: 25%;">Test Suite Identifier</th>
            <th style="width: 35%;">Scope of Verification</th>
            <th style="width: 15%; text-align: center;">Tests Executed</th>
            <th style="width: 12%; text-align: center;">Passed</th>
            <th style="width: 13%; text-align: center;">Verification Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="strong">Functional Master Suite (test_suite.js)</td>
            <td>Module routing, initialData validation, offline sync engine, mock API fallback, data consistency</td>
            <td style="text-align: center; font-weight: 700;">42</td>
            <td style="text-align: center; color: #059669; font-weight: 700;">42</td>
            <td style="text-align: center;"><span class="status-badge status-complete">100% Pass</span></td>
          </tr>
          <tr>
            <td class="strong">Supabase Auth & RLS Harness (test_supabase_auth.js)</td>
            <td>UUID linking, password encryption, role escalation trigger, is_admin() recursion, storage privacy</td>
            <td style="text-align: center; font-weight: 700;">23</td>
            <td style="text-align: center; color: #059669; font-weight: 700;">23</td>
            <td style="text-align: center;"><span class="status-badge status-complete">100% Pass</span></td>
          </tr>
          <tr>
            <td class="strong">Asset Performance & Optimization Scan</td>
            <td>Zero files exceeding 5 MB limit, total public bundle under 15 MB, Cloudflare 25 MiB compliance</td>
            <td style="text-align: center; font-weight: 700;">14 Assets</td>
            <td style="text-align: center; color: #059669; font-weight: 700;">14</td>
            <td style="text-align: center;"><span class="status-badge status-complete">Compliant</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Formal Declaration -->
    <div class="summary-box" style="margin-top: 4px; border-left-color: #059669;">
      <strong>Team Honor Code & Authenticity Statement:</strong> We hereby certify that the engineering contributions documented in this report accurately represent the individual and collective work conducted for the <em>Campus Connect</em> ecosystem. All code committed to the official repository (<code>rishi12145/Campus-Connect</code>) has been rigorously tested, validated against institute standards, and successfully deployed to production.
    </div>

    <!-- Signatures Grid -->
    <div>
      <div style="font-size: 7.5pt; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 4px;">Student Developer Signatures & Endorsements:</div>
      <div class="sign-grid">
        <div class="sign-card">
          <div class="sign-tag">Lead Full-Stack Architect (45%)</div>
          <div>
            <div class="sign-line"></div>
            <div class="sign-name">Rishikesh Gopal</div>
            <div class="sign-meta">Roll: 202311072 • B.Tech CSE</div>
          </div>
        </div>

        <div class="sign-card">
          <div class="sign-tag">Frontend Architect (30%)</div>
          <div>
            <div class="sign-line"></div>
            <div class="sign-name">Sriya Reddy</div>
            <div class="sign-meta">Roll: 202311060 • B.Tech CSE</div>
          </div>
        </div>

        <div class="sign-card">
          <div class="sign-tag">Backend Engineer (25%)</div>
          <div>
            <div class="sign-line"></div>
            <div class="sign-name">Shivangi Goutam</div>
            <div class="sign-meta">Roll: 202311079 • B.Tech CSE</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Faculty / Evaluator Approval Block -->
    <div class="faculty-block">
      <div class="faculty-info">
        <strong>Academic Evaluation & Departmental Verification:</strong><br>
        Department of Computer Science & Engineering<br>
        Indian Institute of Information Technology Vadodara – International Campus Diu (IIITV-ICD)<br>
        <span style="font-size: 7pt; color: #64748B;">Date of Submission: November 2026 • Status: Production Verified</span>
      </div>
      <div class="faculty-seal">
        Evaluator Signature & Seal
      </div>
    </div>
  </div>

  <div class="running-footer">
    <span>Indian Institute of Information Technology Vadodara – International Campus Diu</span>
    <span>Confidential • Academic Assessment Record</span>
    <span>Page 4 of 4</span>
  </div>
</div>

</body>
</html>
"""

html_path = os.path.abspath("Campus_Connect_Team_Contributions.html")
pdf_path = os.path.abspath("Campus_Connect_Team_Contributions.pdf")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Wrote HTML to {html_path}")

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_path,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file:///{html_path.replace(os.sep, '/')}"
]

print("Executing Edge PDF conversion...")
result = subprocess.run(cmd, capture_output=True, text=True)
print("Subprocess returncode:", result.returncode)

if os.path.exists(pdf_path):
    size = os.path.getsize(pdf_path)
    print(f"PDF successfully created: {pdf_path} (Size: {size:,} bytes)")
    reader = pypdf.PdfReader(pdf_path)
    print(f"Total Pages in PDF: {len(reader.pages)}")
    for i, p in enumerate(reader.pages):
        print(f"  Page {i+1} Text preview: {p.extract_text()[:120].strip()}...")
else:
    print("PDF creation failed!")

