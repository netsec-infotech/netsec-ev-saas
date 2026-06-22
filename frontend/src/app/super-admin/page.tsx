"use client";
import { useState, useEffect, useRef } from 'react';

function AnimatedCount({ value }: { value: string | number }) {
  const [displayValue, setDisplayValue] = useState<string | number>(value);

  useEffect(() => {
    const str = String(value);
    const numericMatch = str.match(/[\d.]+/g);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }
    const numericStr = numericMatch.join('');
    const target = parseFloat(numericStr);
    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(start + easeProgress * (target - start));
      let formatted = String(current);
      if (str.includes('₹')) {
        formatted = '₹' + current.toLocaleString('en-IN');
      } else if (str.includes(',')) {
        formatted = current.toLocaleString('en-US');
      } else if (str.includes('%')) {
        formatted = current + '%';
      }
      setDisplayValue(formatted);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <>{displayValue}</>;
}
import Sidebar from '@/components/Sidebar';

const CSS = `
.ev-shell { display: flex; min-height: 100vh; background: #F3F4F9; font-family: 'Inter', sans-serif; }
.ev-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.ev-body { padding: 20px 22px 50px; flex: 1; display: flex; flex-direction: column; gap: 20px; }

/* Custom Super Admin Top Bar */
.sa-tb { height: 68px; background: #fff; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; padding: 0 22px; justify-content: space-between; position: sticky; top: 0; z-index: 90; }
.sa-tb-left { display: flex; flex-direction: column; }
.sa-tb-hello { font-size: 17px; font-weight: 800; color: #111827; display: flex; align-items: center; gap: 6px; }
.sa-tb-sub { font-size: 11.5px; color: #64748B; margin-top: 2px; }
.sa-tb-right { display: flex; align-items: center; gap: 14px; }
.sa-tb-search { display: flex; align-items: center; gap: 8px; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 8px 12px; background: #F8FAFC; width: 280px; }
.sa-tb-search input { border: none; outline: none; background: transparent; font-size: 12.5px; width: 100%; color: #334155; }
.sa-tb-search input::placeholder { color: #94A3B8; }
.sa-tb-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #E2E8F0; border-radius: 10px; background: #fff; color: #64748B; cursor: pointer; position: relative; transition: all 0.15s; }
.sa-tb-btn:hover { border-color: #6366F1; color: #6366F1; }
.sa-tb-badge { position: absolute; top: -3px; right: -3px; width: 15px; height: 15px; background: #EF4444; color: #fff; font-size: 8.5px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1.5px solid #fff; }
.sa-tb-prof { display: flex; align-items: center; gap: 10px; cursor: pointer; padding-left: 6px; }
.sa-tb-prof-av { width: 34px; height: 34px; border-radius: 50%; background: #6366F1; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.sa-tb-prof-info { display: flex; flex-direction: column; }
.sa-tb-prof-name { font-size: 12.5px; font-weight: 700; color: #1E293B; line-height: 1.2; }
.sa-tb-prof-role { font-size: 10px; color: #64748B; }

/* Sub Header with date range */
.sa-subhdr { display: flex; align-items: center; justify-content: flex-end; margin-bottom: 2px; }
.sa-date-selector { display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 8px 14px; font-size: 12.5px; font-weight: 600; color: #334155; cursor: pointer; }
.sa-date-selector:hover { border-color: #6366F1; }

/* KPI Grid */
.sa-kpis { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
.sa-kpi { background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,.04); }
.sa-kpi-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; }
.sa-kpi-lbl { font-size: 11px; font-weight: 600; color: #64748B; line-height: 1.3; }
.sa-kpi-ic { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kpi-purple { background: #EEF2FF; color: #6366F1; }
.kpi-green { background: #ECFDF5; color: #10B981; }
.kpi-blue { background: #EFF6FF; color: #3B82F6; }
.kpi-orange { background: #FFF7ED; color: #F97316; }
.sa-kpi-val { font-size: 20px; font-weight: 800; color: #0F172A; margin: 8px 0 6px; word-break: break-all; }
.sa-kpi-bot { display: flex; align-items: center; gap: 4px; font-size: 10.5px; color: #64748B; font-weight: 500; }
.trend-up { color: #10B981; font-weight: 700; display: flex; align-items: center; gap: 2px; }
.trend-dn { color: #EF4444; font-weight: 700; display: flex; align-items: center; gap: 2px; }

/* Row 1: Charts and Map */
.sa-row-1 { display: grid; grid-template-columns: 340px 280px 1fr; gap: 16px; min-height: 380px; }
.sa-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.04); display: flex; flex-direction: column; overflow: hidden; }
.sa-card-hdr { padding: 14px 16px; border-bottom: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.sa-card-tit { font-size: 13.5px; font-weight: 700; color: #0F172A; }
.sa-card-body { padding: 16px; flex: 1; display: flex; flex-direction: column; position: relative; }

/* Revenue chart styles */
.rev-val { font-size: 22px; font-weight: 800; color: #0F172A; line-height: 1.1; }
.rev-sub { font-size: 11px; color: #10B981; font-weight: 600; margin-top: 4px; margin-bottom: 16px; display: flex; align-items: center; gap: 3px; }
.rev-sub span { color: #64748B; font-weight: 500; }
.sa-select-sm { padding: 4px 8px; border: 1.5px solid #E2E8F0; border-radius: 6px; font-size: 11.5px; font-weight: 600; color: #475569; outline: none; background: #fff; cursor: pointer; }

/* Donut chart legend */
.donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
.donut-num { font-size: 22px; font-weight: 800; color: #0F172A; line-height: 1; }
.donut-lbl { font-size: 9.5px; color: #94A3B8; margin-top: 2px; font-weight: 600; text-transform: uppercase; }
.donut-legend { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
.legend-item { display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #475569; border-bottom: 1px solid #F1F5F9; padding-bottom: 4px; }
.legend-item-l { display: flex; align-items: center; gap: 5px; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; }
.legend-val { font-weight: 700; color: #0F172A; }
.legend-pct { font-size: 10px; color: #64748B; font-weight: 400; }

/* Top tenants list inside revenue card */
.top-tenants { border-top: 1px solid #F1F5F9; margin-top: 12px; padding-top: 10px; }
.top-tenants-hdr { font-size: 10.5px; font-weight: 700; color: #94A3B8; margin-bottom: 8px; letter-spacing: 0.03em; }
.tenant-rank-item { display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; padding: 4.5px 0; }
.tenant-rank-l { display: flex; align-items: center; gap: 8px; }
.tenant-idx { width: 16px; height: 16px; background: #EEF2FF; color: #6366F1; font-size: 9.5px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.tenant-name { font-weight: 600; color: #334155; }
.tenant-rev { font-weight: 700; color: #1E293B; }

/* Live Map styling */
.map-canvas { background: #F8FAFC; flex: 1; border-radius: 8px; overflow: hidden; position: relative; border: 1px solid #E2E8F0; }
.map-controls { position: absolute; left: 12px; top: 12px; display: flex; flex-direction: column; gap: 6px; z-index: 5; }
.map-ctrl-btn { width: 28px; height: 28px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #475569; font-weight: bold; font-size: 16px; cursor: pointer; transition: all 0.15s; }
.map-ctrl-btn:hover { border-color: #6366F1; color: #6366F1; }
.map-mode-ctrl { position: absolute; left: 12px; top: 90px; display: flex; flex-direction: column; gap: 4px; z-index: 5; }
.map-mode-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 4px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 8px; font-weight: 700; color: #64748B; cursor: pointer; min-width: 32px; }
.map-mode-btn.act { border-color: #6366F1; color: #6366F1; background: #EEF2FF; }
.map-mode-btn svg { width: 14px; height: 14px; }
.map-tag { position: absolute; background: #fff; border: 1px solid #E2E8F0; border-radius: 6px; padding: 3px 6px; font-size: 9px; font-weight: 700; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.tag-inride { border-left: 3px solid #6366F1; }
.tag-online { border-left: 3px solid #10B981; }
.tag-lowbat { border-left: 3px solid #F97316; }
.tag-offline { border-left: 3px solid #64748B; }
.tag-dot { width: 5px; height: 5px; border-radius: 50%; }
.dot-inride { background: #6366F1; }
.dot-online { background: #10B981; }
.dot-lowbat { background: #F97316; }
.dot-offline { background: #64748B; }

/* Row 2: Activities, Health, Tickets, Quick Actions */
.sa-row-2 { display: grid; grid-template-columns: 1fr 280px 280px; gap: 16px; }
.sa-dt-table { width: 100%; border-collapse: collapse; }
.sa-dt-table th { font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; padding: 8px 12px; background: #F8FAFC; border-bottom: 1px solid #F1F5F9; }
.sa-dt-table td { padding: 9px 12px; font-size: 12px; border-bottom: 1px solid #F1F5F9; vertical-align: middle; color: #334155; }
.sa-dt-table tr:hover td { background: #F8FAFC; }
.sa-dt-table tr:last-child td { border-bottom: none; }
.sa-viewall { font-size: 11px; font-weight: 700; color: #6366F1; text-decoration: none; }
.sa-viewall:hover { text-decoration: underline; }

.tenant-logo-name { display: flex; align-items: center; gap: 8px; }
.tenant-icon-placeholder { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; color: #fff; }

.sys-health-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F1F5F9; }
.sys-health-row:last-child { border-bottom: none; }
.sys-health-info { display: flex; flex-direction: column; gap: 1px; }
.sys-health-lbl { font-size: 11.5px; font-weight: 700; color: #1E293B; }
.sys-health-desc { font-size: 10.5px; color: #64748B; }
.sys-health-badge { padding: 2px 6px; background: #ECFDF5; color: #047857; border-radius: 4px; font-size: 9.5px; font-weight: 700; text-transform: uppercase; }

/* Quick Actions Card */
.qa-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.qa-btn { display: flex; align-items: center; gap: 8px; padding: 10px 10px; background: #FFF; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 10.5px; font-weight: 700; color: #475569; cursor: pointer; transition: all 0.15s; font-family: inherit; justify-content: flex-start; text-align: left; }
.qa-btn:hover { border-color: #6366F1; color: #6366F1; background: #F8FAFC; }
.qa-btn svg { width: 14px; height: 14px; color: #6366F1; flex-shrink: 0; }

/* Footer */
.sa-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #E2E8F0; padding: 14px 22px; font-size: 11px; color: #64748B; font-weight: 500; background: #fff; flex-shrink: 0; margin-top: 20px; }

@keyframes drawPath {
  to { stroke-dashoffset: 0; }
}
@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-draw {
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: drawPath 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.animate-draw-large {
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  animation: drawPath 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.animate-scale-in {
  transform-origin: center;
  animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
`;

export default function SuperAdminDashboard() {
  const [selectedWeekRange, setSelectedWeekRange] = useState('May 12 - May 18, 2024');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ev-shell">
        <div className="ev-main" style={{ marginLeft: 0, width: '100%' }}>
          
          {/* Custom Super Admin Top Bar */}
          <header className="sa-tb">
            <div className="sa-tb-left">
              <h1 className="sa-tb-hello">Welcome back, Super Admin! 🌟</h1>
              <p className="sa-tb-sub">Here&apos;s what&apos;s happening across the platform today.</p>
            </div>
            
            <div className="sa-tb-right">
              {/* Search Bar */}
              <div className="sa-tb-search">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input type="text" placeholder="Search tenants, franchises, zones..." />
              </div>

              {/* Notification Bell */}
              <button className="sa-tb-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="sa-tb-badge">3</span>
              </button>

              {/* Help button */}
              <button className="sa-tb-btn" title="Help & Documentation">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </button>

              {/* Theme toggle */}
              <button className="sa-tb-btn" title="Toggle Light/Dark Mode">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </button>

              {/* Profile card */}
              <div className="sa-tb-prof">
                <div className="sa-tb-prof-av">SU</div>
                <div className="sa-tb-prof-info">
                  <span className="sa-tb-prof-name">Super Admin</span>
                  <span className="sa-tb-prof-role">Platform Owner</span>
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </header>

          <div className="ev-body">
            
            {/* Sub header with Date range */}
            <div className="sa-subhdr">
              <div className="sa-date-selector">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{selectedWeekRange}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="sa-kpis">
              {[
                { label: 'Total Tenants', value: '128', change: '12.5%', up: true, since: 'last week', class: 'kpi-purple', icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                )},
                { label: 'Active Tenants', value: '96', change: '9.8%', up: true, since: 'last week', class: 'kpi-green', icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="10" width="20" height="12" rx="2" />
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  </svg>
                )},
                { label: 'Total Franchisees', value: '312', change: '15.6%', up: true, since: 'last week', class: 'kpi-purple', icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                )},
                { label: 'Active Zones', value: '584', change: '8.3%', up: true, since: 'last week', class: 'kpi-blue', icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                )},
                { label: 'Monthly Recurring Revenue', value: '₹1,24,75,320', change: '18.7%', up: true, since: 'last week', class: 'kpi-green', icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                )},
                { label: 'Total API Calls (Today)', value: '24.8M', change: '6.2%', up: true, since: 'yesterday', class: 'kpi-blue', icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                )}
              ].map(k => (
                <div key={k.label} className="sa-kpi">
                  <div className="sa-kpi-top">
                    <span className="sa-kpi-lbl">{k.label}</span>
                    <span className={`sa-kpi-ic ${k.class}`}>{k.icon}</span>
                  </div>
                  <div className="sa-kpi-val"><AnimatedCount value={k.value} /></div>
                  <div className="sa-kpi-bot">
                    <span className={k.up ? 'trend-up' : 'trend-dn'}>
                      {k.up ? '↑' : '↓'} {k.change}
                    </span>
                    <span>from {k.since}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 1: Revenue Line Chart, Tenant Distribution Donut, Live Platform Map */}
            <div className="sa-row-1">
              {/* SaaS Revenue Overview */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-tit">SaaS Revenue Overview</span>
                  <select className="sa-select-sm">
                    <option>This Week</option>
                    <option>This Month</option>
                  </select>
                </div>
                <div className="sa-card-body">
                  <div className="rev-val"><AnimatedCount value="₹1,24,75,320" /></div>
                  <div className="rev-sub">
                    ↑ 18.7% <span>vs Apr 12 - Apr 18, 2024</span>
                  </div>
                  
                  {/* Revenue Line Chart - Rendered via custom Inline SVG */}
                  <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', height: '110px' }}>
                    <svg viewBox="0 0 300 110" width="100%" height="100%" style={{ overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid Lines */}
                      <line x1="0" y1="100" x2="300" y2="100" stroke="#F1F5F9" strokeWidth="1.5" />
                      <line x1="0" y1="70" x2="300" y2="70" stroke="#F1F5F9" strokeWidth="1.5" />
                      <line x1="0" y1="40" x2="300" y2="40" stroke="#F1F5F9" strokeWidth="1.5" />
                      <line x1="0" y1="10" x2="300" y2="10" stroke="#F1F5F9" strokeWidth="1.5" />

                      {/* Area Fill under spline */}
                      <path className="animate-scale-in" d="M 0 65 Q 25 55, 50 78 T 100 50 T 150 55 T 200 68 T 250 40 T 300 55 L 300 100 L 0 100 Z" fill="url(#gradient)" style={{ transformOrigin: 'bottom' }} />

                      {/* Spline Path */}
                      <path className="animate-draw-large" d="M 0 65 Q 25 55, 50 78 T 100 50 T 150 55 T 200 68 T 250 40 T 300 55" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" />

                      {/* Interactive Nodes */}
                      {[
                        { cx: 0, cy: 65, day: '12 May' },
                        { cx: 50, cy: 78, day: '13 May' },
                        { cx: 100, cy: 50, day: '14 May' },
                        { cx: 150, cy: 55, day: '15 May' },
                        { cx: 200, cy: 68, day: '16 May' },
                        { cx: 250, cy: 40, day: '17 May' },
                        { cx: 300, cy: 55, day: '18 May' }
                      ].map((pt, idx) => (
                        <g key={idx}>
                          <circle cx={pt.cx} cy={pt.cy} r="3.5" fill="#6366F1" stroke="#fff" strokeWidth="1.5" />
                          <text x={pt.cx} y="112" fontSize="7.5" fill="#94A3B8" textAnchor="middle" fontWeight="bold">{pt.day}</text>
                        </g>
                      ))}
                    </svg>
                  </div>

                  {/* Top 5 tenants rank list */}
                  <div className="top-tenants">
                    <div className="top-tenants-hdr">Top 5 Tenants by Revenue</div>
                    {[
                      { name: 'EcoRide Solutions', revenue: '₹18,75,320' },
                      { name: 'GreenMove Mobility', revenue: '₹16,25,450' },
                      { name: 'VoltEdge Rentals', revenue: '₹12,10,230' },
                      { name: 'EvoFleet Services', revenue: '₹9,80,120' },
                      { name: 'NextGen Mobility', revenue: '₹7,65,600' }
                    ].map((t, idx) => (
                      <div className="tenant-rank-item" key={t.name}>
                        <div className="tenant-rank-l">
                          <span className="tenant-idx">{idx + 1}</span>
                          <span className="tenant-name">{t.name}</span>
                        </div>
                        <span className="tenant-rev">{t.revenue}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Tenant Distribution */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-tit">Tenant Distribution</span>
                </div>
                <div className="sa-card-body" style={{ alignItems: 'center', justifyContent: 'center' }}>
                  {/* Donut SVG */}
                  <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                    <svg viewBox="0 0 100 100" width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
                      {/* Active slice: 59.4% (length = 186.6) */}
                      <circle className="animate-scale-in" cx="50" cy="50" r="40" fill="transparent" stroke="#6366F1" strokeWidth="12" strokeDasharray="149.2 102.1" strokeDashoffset="0" style={{ transformOrigin: '50px 50px' }} />
                      {/* Trial slice: 24.2% (length = 60.8) */}
                      <circle className="animate-scale-in" cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="12" strokeDasharray="60.8 190.5" strokeDashoffset="-149.2" style={{ transformOrigin: '50px 50px' }} />
                      {/* Suspended: 10.9% (length = 27.4) */}
                      <circle className="animate-scale-in" cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="12" strokeDasharray="27.4 223.9" strokeDashoffset="-210" style={{ transformOrigin: '50px 50px' }} />
                      {/* Inactive: 5.5% (length = 13.8) */}
                      <circle className="animate-scale-in" cx="50" cy="50" r="40" fill="transparent" stroke="#94A3B8" strokeWidth="12" strokeDasharray="13.8 237.5" strokeDashoffset="-237.4" style={{ transformOrigin: '50px 50px' }} />
                    </svg>
                    <div className="donut-center">
                      <span className="donut-num"><AnimatedCount value="128" /></span>
                      <span className="donut-lbl">Tenants</span>
                    </div>
                  </div>

                  {/* Legend Grid */}
                  <div className="donut-legend" style={{ width: '100%' }}>
                    {[
                      { color: '#6366F1', label: 'Active', count: 76, pct: '59.4%' },
                      { color: '#10B981', label: 'Trial', count: 31, pct: '24.2%' },
                      { color: '#F59E0B', label: 'Suspended', count: 14, pct: '10.9%' },
                      { color: '#94A3B8', label: 'Inactive', count: 7, pct: '5.5%' }
                    ].map(l => (
                      <div className="legend-item" key={l.label}>
                        <div className="legend-item-l">
                          <span className="legend-dot" style={{ background: l.color }} />
                          <span>{l.label}</span>
                        </div>
                        <span className="legend-val">
                          {l.count} <span className="legend-pct">({l.pct})</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  <a href="/super-admin/tenants" className="sa-viewall" style={{ marginTop: '16px', display: 'block' }}>View All Tenants →</a>
                </div>
              </div>

              {/* Live Platform Map */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-tit">Live Platform Map</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select className="sa-select-sm">
                      <option>All Zones</option>
                      <option>Delhi NCR</option>
                    </select>
                    <button className="sa-select-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                      </svg>
                      Layers
                    </button>
                  </div>
                </div>
                <div className="sa-card-body" style={{ padding: 0 }}>
                  <div className="map-canvas">
                    {/* Map Controls */}
                    <div className="map-controls">
                      <button className="map-ctrl-btn">+</button>
                      <button className="map-ctrl-btn">-</button>
                    </div>

                    <div className="map-mode-ctrl">
                      <button className="map-mode-btn act">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>
                        Live
                      </button>
                      <button className="map-mode-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        History
                      </button>
                      <button className="map-mode-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 22 12 17 22 22 12 2"/></svg>
                        Geofence
                      </button>
                      <button className="map-mode-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        Heatmap
                      </button>
                    </div>

                    {/* SVG Map Lines, Geofence areas, and routes */}
                    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                      {/* Polygon Geofence for Connaught Place */}
                      <polygon points="170 100, 240 70, 270 140, 210 180" fill="rgba(99, 102, 241, 0.08)" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
                      
                      {/* Routes */}
                      <path d="M 50 110 C 90 90, 140 100, 190 120 C 230 145, 270 120, 310 160" fill="none" stroke="#6366F1" strokeWidth="1.8" strokeDasharray="4 4" />
                      <path d="M 120 40 C 180 80, 210 110, 220 150 C 240 190, 290 220, 320 250" fill="none" stroke="#3B82F6" strokeWidth="1.8" strokeDasharray="4 4" />
                      
                      {/* Nodes */}
                      <circle cx="50" cy="110" r="5" fill="#10B981" stroke="#fff" strokeWidth="1.5" />
                      <text x="50" y="123" fontSize="8" fill="#64748B" fontWeight="bold" textAnchor="middle">Rajendra Place</text>
                      
                      <circle cx="120" cy="40" r="5" fill="#6366F1" stroke="#fff" strokeWidth="1.5" />
                      <text x="120" y="33" fontSize="8" fill="#64748B" fontWeight="bold" textAnchor="middle">Karol Bagh</text>
                      
                      <circle cx="210" cy="140" r="6" fill="#2A195C" stroke="#fff" strokeWidth="2" />
                      <text x="210" y="128" fontSize="8.5" fill="#1E293B" fontWeight="800" textAnchor="middle">Connaught Place</text>

                      <circle cx="310" cy="160" r="5" fill="#6366F1" stroke="#fff" strokeWidth="1.5" />
                      <text x="320" y="163" fontSize="8" fill="#64748B" fontWeight="bold" textAnchor="start">Jantar Mantar</text>

                      <circle cx="250" cy="200" r="5" fill="#10B981" stroke="#fff" strokeWidth="1.5" />
                      <text x="258" y="203" fontSize="8" fill="#64748B" fontWeight="bold" textAnchor="start">Pragati Maidan</text>

                      <circle cx="290" cy="240" r="5" fill="#3B82F6" stroke="#fff" strokeWidth="1.5" />
                      <text x="290" y="253" fontSize="8" fill="#64748B" fontWeight="bold" textAnchor="middle">India Gate</text>
                    </svg>

                    {/* Floating tags */}
                    <div className="map-tag tag-inride" style={{ left: '190px', top: '48px' }}>
                      <span className="tag-dot dot-inride" />
                      <span>EV-12KA-1234</span>
                    </div>

                    <div className="map-tag tag-online" style={{ left: '80px', top: '100px' }}>
                      <span className="tag-dot dot-online" />
                      <span>EV-12KA-5678</span>
                    </div>

                    <div className="map-tag tag-lowbat" style={{ left: '300px', top: '80px' }}>
                      <span className="tag-dot dot-lowbat" />
                      <span>EV-12KA-6789</span>
                    </div>

                    <div className="map-tag tag-offline" style={{ left: '110px', top: '160px' }}>
                      <span className="tag-dot dot-offline" />
                      <span>EV-12KA-9012</span>
                    </div>

                    <div className="map-tag tag-inride" style={{ left: '260px', top: '185px' }}>
                      <span className="tag-dot dot-inride" />
                      <span>EV-12KA-3456</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Recent Activities, System Health, Support Tickets, Quick Actions */}
            <div className="sa-row-2">
              
              {/* Recent Tenant Activities */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-tit">Recent Tenant Activities</span>
                  <a href="/super-admin/audit-logs" className="sa-viewall">View All</a>
                </div>
                <div className="sa-card-body" style={{ padding: 0 }}>
                  <table className="sa-dt-table">
                    <thead>
                      <tr>
                        <th>Tenant Name</th>
                        <th>Activity</th>
                        <th>User</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { tenant: 'EcoRide Solutions', color: '#6366F1', activity: 'New franchise onboarded', user: 'John Doe', time: '2 min ago' },
                        { tenant: 'GreenMove Mobility', color: '#10B981', activity: 'Subscription renewed', user: 'Jane Smith', time: '15 min ago' },
                        { tenant: 'VoltEdge Rentals', color: '#F59E0B', activity: 'Zone created: South Zone', user: 'Mike Johnson', time: '30 min ago' },
                        { tenant: 'EvoFleet Services', color: '#EF4444', activity: 'Plan upgraded to Enterprise', user: 'Sarah Williams', time: '1 hr ago' },
                        { tenant: 'NextGen Mobility', color: '#3B82F6', activity: 'Domain verified', user: 'David Brown', time: '2 hrs ago' }
                      ].map((row, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="tenant-logo-name">
                              <span className="tenant-icon-placeholder" style={{ background: row.color }}>
                                {row.tenant[0]}
                              </span>
                              <span style={{ fontWeight: '600' }}>{row.tenant}</span>
                            </div>
                          </td>
                          <td>{row.activity}</td>
                          <td style={{ color: '#64748B' }}>{row.user}</td>
                          <td style={{ color: '#94A3B8', fontWeight: '500' }}>{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Health */}
              <div className="sa-card">
                <div className="sa-card-hdr">
                  <span className="sa-card-tit">System Health</span>
                  <a href="/super-admin/system-monitoring" className="sa-viewall">View All</a>
                </div>
                <div className="sa-card-body" style={{ padding: '0 16px' }}>
                  {[
                    { label: 'Server Status', desc: 'All systems operational', status: 'Healthy' },
                    { label: 'Database', desc: 'Response time 32ms', status: 'Healthy' },
                    { label: 'API Gateway', desc: '99.99% uptime', status: 'Healthy' },
                    { label: 'Storage', desc: '2.4 TB / 10 TB used', status: 'Healthy' },
                    { label: 'Backup', desc: 'Last backup 2 hrs ago', status: 'Healthy' }
                  ].map(h => (
                    <div className="sys-health-row" key={h.label}>
                      <div className="sys-health-info">
                        <span className="sys-health-lbl">{h.label}</span>
                        <span className="sys-health-desc">{h.desc}</span>
                      </div>
                      <span className="sys-health-badge">{h.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support Tickets & Quick Actions combined */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Support Tickets */}
                <div className="sa-card" style={{ flex: 1 }}>
                  <div className="sa-card-hdr">
                    <span className="sa-card-tit">Support Ticket Overview</span>
                    <a href="/super-admin/support-tickets" className="sa-viewall">View All</a>
                  </div>
                  <div className="sa-card-body" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px' }}>
                    <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                      <svg viewBox="0 0 100 100" width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                        <circle className="animate-scale-in" cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" strokeWidth="12" strokeDasharray="103 148" strokeDashoffset="0" style={{ transformOrigin: '50px 50px' }} />
                        <circle className="animate-scale-in" cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="12" strokeDasharray="58 193" strokeDashoffset="-103" style={{ transformOrigin: '50px 50px' }} />
                        <circle className="animate-scale-in" cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="12" strokeDasharray="19 232" strokeDashoffset="-161" style={{ transformOrigin: '50px 50px' }} />
                        <circle className="animate-scale-in" cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="12" strokeDasharray="71 180" strokeDashoffset="-180" style={{ transformOrigin: '50px 50px' }} />
                      </svg>
                      <div className="donut-center">
                        <span className="donut-num" style={{ fontSize: '16px' }}><AnimatedCount value="78" /></span>
                        <span className="donut-lbl" style={{ fontSize: '7px' }}>Total</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                      {[
                        { color: '#EF4444', label: 'Open', count: 32, pct: '41.0%' },
                        { color: '#F59E0B', label: 'In Progress', count: 18, pct: '23.0%' },
                        { color: '#3B82F6', label: 'Pending', count: 6, pct: '7.0%' },
                        { color: '#10B981', label: 'Resolved', count: 22, pct: '28.0%' }
                      ].map(s => (
                        <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#475569' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
                            <span>{s.label}</span>
                          </div>
                          <span style={{ fontWeight: '700' }}>{s.count} ({s.pct})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="sa-card" style={{ flex: 'none' }}>
                  <div className="sa-card-hdr">
                    <span className="sa-card-tit">Quick Actions</span>
                  </div>
                  <div className="sa-card-body" style={{ padding: '12px' }}>
                    <div className="qa-grid">
                      {[
                        { label: 'Add Tenant', route: '/super-admin/tenants', icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                        )},
                        { label: 'Onboard Franchise', route: '/super-admin/franchise-onboarding', icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        )},
                        { label: 'Create Zone', route: '/super-admin/zones', icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 22 12 17 22 22 12 2" /></svg>
                        )},
                        { label: 'Add Domain', route: '/super-admin/domain-management', icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                        )},
                        { label: 'Create Subscription', route: '/super-admin/subscriptions', icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                        )},
                        { label: 'Generate Invoice', route: '/super-admin/saas-revenue', icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                        )},
                        { label: 'Feature Toggles', route: '/super-admin/feature-toggles', icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
                        )},
                        { label: 'System Backup', route: '/super-admin/backup-restore', icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                        )}
                      ].map(action => (
                        <a key={action.label} href={action.route} style={{ textDecoration: 'none' }}>
                          <button className="qa-btn">
                            {action.icon}
                            <span>{action.label}</span>
                          </button>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          <footer className="sa-footer">
            <span>© 2024 Evegah. All rights reserved.</span>
            <span>v2.5.0</span>
          </footer>
        </div>
      </div>
    </>
  );
}
