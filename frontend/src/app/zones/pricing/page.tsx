"use client";
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import Link from 'next/link';

const DEFAULT_PRICING_CONFIGS = [
  { 
    id: '1', 
    zoneName: 'Connaught Place Zone', 
    city: 'New Delhi', 
    pricingModel: 'Hourly Based', 
    basePrice: 80, 
    extraPrice: 10, 
    packageDetails: [], 
    status: 'Active', 
    lastUpdated: '18 May 2024, 10:30 AM', 
    updatedBy: 'Akash Verma', 
    notes: '', 
    hourlyPricing: [
      { id: 1, model: 'Ather 450X', basePrice: '80', extraPrice: '10', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v1.webp' },
      { id: 2, model: 'TVS iQube', basePrice: '70', extraPrice: '8', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v2.webp' },
      { id: 3, model: 'Ola S1 Pro', basePrice: '75', extraPrice: '9', gracePeriod: '5', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v1.webp' },
      { id: 4, model: 'Bajaj Chetak', basePrice: '65', extraPrice: '7', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v2.webp' }
    ], 
    packages: [] 
  },
  { 
    id: '2', 
    zoneName: 'Cyber Hub Zone', 
    city: 'Gurugram', 
    pricingModel: 'Package Based', 
    basePrice: null, 
    extraPrice: null, 
    packageDetails: ['Ather 450X: 3 Hours - ₹199', 'Ola S1 Pro: 5 Hours - ₹299'], 
    status: 'Active', 
    lastUpdated: '17 May 2024, 04:15 PM', 
    updatedBy: 'Akash Verma', 
    notes: '', 
    hourlyPricing: [
      { id: 1, model: 'Ather 450X', basePrice: '80', extraPrice: '10', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v1.webp' },
      { id: 2, model: 'TVS iQube', basePrice: '70', extraPrice: '8', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v2.webp' },
      { id: 3, model: 'Ola S1 Pro', basePrice: '75', extraPrice: '9', gracePeriod: '5', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v1.webp' },
      { id: 4, model: 'Bajaj Chetak', basePrice: '65', extraPrice: '7', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v2.webp' }
    ], 
    packages: [
      { id: 1, model: 'Ather 450X', name: '3 Hours Plan', duration: 3, price: 199 },
      { id: 2, model: 'Ola S1 Pro', name: '5 Hours Plan', duration: 5, price: 299 }
    ] 
  },
  { 
    id: '3', 
    zoneName: 'Koramangala Zone', 
    city: 'Bangalore', 
    pricingModel: 'Hourly Based', 
    basePrice: 75, 
    extraPrice: 15, 
    packageDetails: [], 
    status: 'Active', 
    lastUpdated: '17 May 2024, 11:20 AM', 
    updatedBy: 'Akash Verma', 
    notes: '', 
    hourlyPricing: [
      { id: 1, model: 'Ather 450X', basePrice: '75', extraPrice: '15', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v1.webp' },
      { id: 2, model: 'TVS iQube', basePrice: '70', extraPrice: '8', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v2.webp' }
    ], 
    packages: [] 
  },
  { 
    id: '4', 
    zoneName: 'Bandra Zone', 
    city: 'Mumbai', 
    pricingModel: 'Package Based', 
    basePrice: null, 
    extraPrice: null, 
    packageDetails: ['Ather 450X: 2 Hours - ₹149', 'Ola S1 Pro: 4 Hours - ₹249', 'Ola S1 Pro: 8 Hours - ₹449'], 
    status: 'Active', 
    lastUpdated: '16 May 2024, 06:45 PM', 
    updatedBy: 'Akash Verma', 
    notes: '', 
    hourlyPricing: [
      { id: 1, model: 'Ather 450X', basePrice: '80', extraPrice: '10', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v1.webp' },
      { id: 2, model: 'TVS iQube', basePrice: '70', extraPrice: '8', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v2.webp' },
      { id: 3, model: 'Ola S1 Pro', basePrice: '75', extraPrice: '9', gracePeriod: '5', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v1.webp' },
      { id: 4, model: 'Bajaj Chetak', basePrice: '65', extraPrice: '7', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v2.webp' }
    ], 
    packages: [
      { id: 1, model: 'Ather 450X', name: '2 Hours Plan', duration: 2, price: 149 },
      { id: 2, model: 'Ola S1 Pro', name: '4 Hours Plan', duration: 4, price: 249 },
      { id: 3, model: 'Ola S1 Pro', name: '8 Hours Plan', duration: 8, price: 449 }
    ] 
  },
  { 
    id: '5', 
    zoneName: 'Salt Lake Zone', 
    city: 'Kolkata', 
    pricingModel: 'Hourly Based', 
    basePrice: 60, 
    extraPrice: 10, 
    packageDetails: [], 
    status: 'Active', 
    lastUpdated: '16 May 2024, 09:10 AM', 
    updatedBy: 'Akash Verma', 
    notes: '', 
    hourlyPricing: [
      { id: 1, model: 'Ather 450X', basePrice: '60', extraPrice: '10', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v1.webp' }
    ], 
    packages: [] 
  },
  { 
    id: '6', 
    zoneName: 'Viman Nagar Zone', 
    city: 'Pune', 
    pricingModel: 'Package Based', 
    basePrice: null, 
    extraPrice: null, 
    packageDetails: ['TVS iQube: 3 Hours - ₹179', 'Ola S1 Pro: 6 Hours - ₹329'], 
    status: 'Inactive', 
    lastUpdated: '15 May 2024, 03:00 PM', 
    updatedBy: 'Akash Verma', 
    notes: '', 
    hourlyPricing: [
      { id: 1, model: 'Ather 450X', basePrice: '80', extraPrice: '10', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v1.webp' },
      { id: 2, model: 'TVS iQube', basePrice: '70', extraPrice: '8', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v2.webp' },
      { id: 3, model: 'Ola S1 Pro', basePrice: '75', extraPrice: '9', gracePeriod: '5', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v1.webp' },
      { id: 4, model: 'Bajaj Chetak', basePrice: '65', extraPrice: '7', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v2.webp' }
    ], 
    packages: [
      { id: 1, model: 'TVS iQube', name: '3 Hours Plan', duration: 3, price: 179 },
      { id: 2, model: 'Ola S1 Pro', name: '6 Hours Plan', duration: 6, price: 329 }
    ] 
  },
  { 
    id: '7', 
    zoneName: 'Gachibowli Zone', 
    city: 'Hyderabad', 
    pricingModel: 'Hourly Based', 
    basePrice: 70, 
    extraPrice: 12, 
    packageDetails: [], 
    status: 'Active', 
    lastUpdated: '15 May 2024, 10:45 AM', 
    updatedBy: 'Akash Verma', 
    notes: '', 
    hourlyPricing: [
      { id: 1, model: 'Ather 450X', basePrice: '70', extraPrice: '12', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v1.webp' }
    ], 
    packages: [] 
  },
  { 
    id: '8', 
    zoneName: 'Ahmedabad One Zone', 
    city: 'Ahmedabad', 
    pricingModel: 'Package Based', 
    basePrice: null, 
    extraPrice: null, 
    packageDetails: ['Ather 450X: 2 Hours - ₹139', 'TVS iQube: 4 Hours - ₹239'], 
    status: 'Active', 
    lastUpdated: '14 May 2024, 05:30 PM', 
    updatedBy: 'Akash Verma', 
    notes: '', 
    hourlyPricing: [
      { id: 1, model: 'Ather 450X', basePrice: '80', extraPrice: '10', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v1.webp' },
      { id: 2, model: 'TVS iQube', basePrice: '70', extraPrice: '8', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v2.webp' },
      { id: 3, model: 'Ola S1 Pro', basePrice: '75', extraPrice: '9', gracePeriod: '5', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v1.webp' },
      { id: 4, model: 'Bajaj Chetak', basePrice: '65', extraPrice: '7', gracePeriod: '0', roundingRule: 'Per 15 Minutes', status: true, imgSrc: '/assets/v2.webp' }
    ], 
    packages: [
      { id: 1, model: 'Ather 450X', name: '2 Hours Plan', duration: 2, price: 139 },
      { id: 2, model: 'TVS iQube', name: '4 Hours Plan', duration: 4, price: 239 }
    ] 
  }
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.zp-shell { display: flex; min-height: 100vh; background: #F8F9FF; font-family: 'Inter', sans-serif; }
.zp-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.zp-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* Breadcrumb */
.zp-bc { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748B; font-weight: 500; }
.zp-bc a { color: #8B5CF6; text-decoration: none; font-weight: 600; transition: color .15s; }
.zp-bc a:hover { color: #6D28D9; }
.zp-bc-sep { color: #D8B4FE; font-weight: 600; }
.zp-bc-cur { color: #0F172A; font-weight: 700; }

/* Header title */
.zp-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-top: -4px; }
.zp-h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 6px; letter-spacing: -0.02em; }
.zp-sub { font-size: 13.5px; color: #64748B; margin: 0; font-weight: 500; }

.zp-btn-primary { 
  display: inline-flex; 
  align-items: center; 
  gap: 8px; 
  padding: 10px 18px; 
  background: #2a195c; 
  color: #fff; 
  border: 1.5px solid #2a195c; 
  border-radius: 8px; 
  font-size: 13px; 
  font-weight: 700; 
  cursor: pointer; 
  transition: all .15s; 
  text-decoration: none;
}
.zp-btn-primary:hover { background: #1e1145; border-color: #1e1145; }

/* Filters Bar */
.zp-filters-row { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
.zp-search-wrap { position: relative; width: 280px; }
.zp-search-ic { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94A3B8; display: flex; align-items: center; }
.zp-search-inp { width: 100%; padding: 10px 12px 10px 36px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; background: #fff; font-weight: 500; color: #1E293B; transition: border-color .15s; }
.zp-search-inp:focus { border-color: #2a195c; }
.zp-search-inp::placeholder { color: #94A3B8; }

.zp-btn-filter { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; font-weight: 700; color: #475569; cursor: pointer; transition: all .15s; }
.zp-btn-filter:hover { border-color: #2a195c; color: #2a195c; background: #FAFBFD; }

/* Table Section */
.zp-table-container { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.zp-table { width: 100%; border-collapse: collapse; text-align: left; }
.zp-table th { background: #FAFBFD; border-bottom: 1.5px solid #E2E8F0; padding: 14px 18px; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
.zp-table td { padding: 14px 18px; border-bottom: 1px solid #E2E8F0; font-size: 13px; color: #1E293B; vertical-align: middle; }
.zp-table tr:last-child td { border-bottom: none; }
.zp-table tr:hover td { background-color: #FAFBFD; }

/* Subtitle/Sublabel for columns */
.zp-cell-title { font-weight: 700; color: #1F2937; }
.zp-cell-sub { font-size: 11px; color: #6B7280; font-weight: 500; margin-top: 2px; }

/* Badges */
.zp-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; }
.zp-badge-hourly { background: #DEF7EC; color: #03543F; }
.zp-badge-package { background: #E1EFFE; color: #1E429F; }

.zp-status { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
.zp-status-active { background: #DEF7EC; color: #03543F; }
.zp-status-inactive { background: #FDE8E8; color: #9B1C1C; }

/* Action dots button */
.zp-action-btn { background: none; border: none; cursor: pointer; color: #64748B; width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.15s; }
.zp-action-btn:hover { background: #F1F5F9; color: #0F172A; }

.zp-action-wrap { position: relative; display: inline-block; }
.zp-dropdown { position: absolute; right: 0; top: 100%; width: 140px; background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,.08); z-index: 50; padding: 6px 0; margin-top: 4px; }
.zp-dropdown-item { width: 100%; text-align: left; padding: 8px 12px; background: none; border: none; font-size: 12.5px; font-weight: 600; color: #374151; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.zp-dropdown-item:hover { background: #F5F3FF; color: #6D28D9; }
.zp-dropdown-item-danger { color: #EF4444; }
.zp-dropdown-item-danger:hover { background: #FEF2F2; color: #EF4444; }

/* Pagination */
.zp-pag-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-top: 1px solid #E2E8F0; background: #fff; font-size: 12.5px; color: #475569; font-weight: 500; }
.zp-pag-controls { display: flex; align-items: center; gap: 6px; }
.zp-pag-btn { width: 30px; height: 30px; border-radius: 6px; border: 1.5px solid #E2E8F0; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12.5px; font-weight: 700; color: #475569; transition: all .15s; }
.zp-pag-btn:hover { border-color: #2a195c; color: #2a195c; }
.zp-pag-btn.active { background: #2a195c; border-color: #2a195c; color: #fff; }
.zp-pag-btn:disabled { opacity: 0.5; cursor: not-allowed; border-color: #E2E8F0; color: #94A3B8; }
.zp-pag-select { padding: 6px 10px; border: 1.5px solid #E2E8F0; border-radius: 6px; font-size: 12.5px; font-weight: 600; color: #475569; background: #fff; cursor: pointer; outline: none; }
.zp-pag-select:focus { border-color: #2a195c; }
`;

export default function ZonePricingPage() {
  const router = useRouter();
  const [configs, setConfigs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Load from localstorage or fall back to default configs
  useEffect(() => {
    const saved = localStorage.getItem('zone_pricing_configs');
    if (saved) {
      setConfigs(JSON.parse(saved));
    } else {
      localStorage.setItem('zone_pricing_configs', JSON.stringify(DEFAULT_PRICING_CONFIGS));
      setConfigs(DEFAULT_PRICING_CONFIGS);
    }
  }, []);

  // Sync back on state change
  const saveConfigs = (updated: any[]) => {
    localStorage.setItem('zone_pricing_configs', JSON.stringify(updated));
    setConfigs(updated);
  };

  // Close menus on click outside
  useEffect(() => {
    const closeAll = () => setActiveMenuId(null);
    document.addEventListener('click', closeAll);
    return () => document.removeEventListener('click', closeAll);
  }, []);

  const handleActionClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this pricing configuration?')) {
      const updated = configs.filter(c => c.id !== id);
      saveConfigs(updated);
    }
  };

  // Filter and Search Logic
  const filteredConfigs = useMemo(() => {
    return configs.filter(c => 
      c.zoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [configs, searchQuery]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="zp-shell">
        <Sidebar activePath="/zones/pricing" />
        <div className="zp-main">
          <TopBar 
            title="Hello, Akash" 
            subtitle="Zone Admin" 
            notificationCount={3}
            showSearch={false}
            hideZone={false}
          />
          
          <div className="zp-page">
            {/* Breadcrumb */}
            <div className="zp-bc">
              <Link href="/">Dashboard</Link>
              <span className="zp-bc-sep">&gt;</span>
              <span>Operations</span>
              <span className="zp-bc-sep">&gt;</span>
              <span className="zp-bc-cur">Zone Pricing</span>
            </div>

            {/* Title Row */}
            <div className="zp-title-row">
              <div>
                <h1 className="zp-h1">Zone Based Price Configuration</h1>
                <p className="zp-sub">Configure pricing model and rates for each zone. Choose between hourly based or package based pricing.</p>
              </div>
              <button 
                onClick={() => router.push('/zones/pricing/new')}
                className="zp-btn-primary"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px', verticalAlign: 'middle', display: 'inline-block' }}>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span style={{ verticalAlign: 'middle' }}>Add Zone Pricing</span>
              </button>
            </div>

            {/* Filters Row */}
            <div className="zp-filters-row">
              <div className="zp-search-wrap">
                <span className="zp-search-ic">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  className="zp-search-inp" 
                  placeholder="Search by zone name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button className="zp-btn-filter" onClick={() => alert('Filtering options coming soon!')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                More Filters
              </button>
            </div>

            {/* Table */}
            <div className="zp-table-container">
              <table className="zp-table">
                <thead>
                  <tr>
                    <th>Zone Name</th>
                    <th>Pricing Model</th>
                    <th>Base Price</th>
                    <th>Extra Price</th>
                    <th>Package Details</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConfigs.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#64748B', fontWeight: 500 }}>
                        No zone pricing configurations found.
                      </td>
                    </tr>
                  ) : (
                    filteredConfigs.map((config) => (
                      <tr key={config.id}>
                        <td>
                          <div className="zp-cell-title">{config.zoneName}</div>
                          <div className="zp-cell-sub">{config.city}</div>
                        </td>
                        <td>
                          <span className={`zp-badge ${config.pricingModel === 'Hourly Based' ? 'zp-badge-hourly' : 'zp-badge-package'}`}>
                            {config.pricingModel}
                          </span>
                        </td>
                        <td>
                          {config.pricingModel === 'Hourly Based' ? (
                            <div>
                              <span style={{ fontWeight: 700 }}>₹{config.basePrice}</span>
                              <div className="zp-cell-sub">Per Hour</div>
                            </div>
                          ) : (
                            <span style={{ color: '#9CA3AF', fontWeight: 500 }}>-</span>
                          )}
                        </td>
                        <td>
                          {config.pricingModel === 'Hourly Based' ? (
                            <div>
                              <span style={{ fontWeight: 700 }}>₹{config.extraPrice}</span>
                              <div className="zp-cell-sub">Per Extra 15 min</div>
                            </div>
                          ) : (
                            <span style={{ color: '#9CA3AF', fontWeight: 500 }}>-</span>
                          )}
                        </td>
                        <td>
                          {config.pricingModel === 'Package Based' && config.packageDetails && config.packageDetails.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              {config.packageDetails.slice(0, 3).map((det: string, idx: number) => (
                                <div key={idx} style={{ fontWeight: 600, fontSize: '12.5px' }}>{det}</div>
                              ))}
                              {config.packageDetails.length > 3 && (
                                <div className="zp-cell-sub" style={{ fontWeight: 600 }}>+{config.packageDetails.length - 3} more packages</div>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: '#9CA3AF', fontWeight: 500 }}>-</span>
                          )}
                        </td>
                        <td>
                          <span className={`zp-status ${config.status === 'Active' ? 'zp-status-active' : 'zp-status-inactive'}`}>
                            {config.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{config.lastUpdated}</div>
                          <div className="zp-cell-sub">{config.updatedBy}</div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="zp-action-wrap">
                            <button 
                              className="zp-action-btn"
                              onClick={(e) => handleActionClick(e, config.id)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </button>
                            
                            {activeMenuId === config.id && (
                              <div className="zp-dropdown">
                                <button 
                                  className="zp-dropdown-item"
                                  onClick={() => router.push(`/zones/pricing/new?id=${config.id}`)}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                  </svg>
                                  Edit Pricing
                                </button>
                                <button 
                                  className="zp-dropdown-item zp-dropdown-item-danger"
                                  onClick={() => handleDelete(config.id)}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="zp-pag-row">
                <div>
                  Showing 1 to {filteredConfigs.length} of {filteredConfigs.length} zone pricing configurations
                </div>
                <div className="zp-pag-controls">
                  <button className="zp-pag-btn" disabled>&lt;</button>
                  <button className="zp-pag-btn active">1</button>
                  <button className="zp-pag-btn" disabled>&gt;</button>
                  <select className="zp-pag-select" defaultValue="10 per page" onChange={() => {}}>
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
