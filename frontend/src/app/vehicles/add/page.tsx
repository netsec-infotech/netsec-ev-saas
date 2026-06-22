"use client";
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import Image from 'next/image';

const CSS = `
.add-veh-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.add-veh-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.add-veh-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* Breadcrumb styling */
.add-veh-bc { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: #64748B; margin-bottom: 2px; }
.add-veh-bc-link { color: #64748B; text-decoration: none; cursor: pointer; }
.add-veh-bc-link:hover { color: #2a195c; }
.add-veh-bc-sep { color: #CBD5E1; }
.add-veh-bc-curr { color: #2A195C; }

/* Header and Actions bar */
.add-veh-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 4px; }
.add-veh-title { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 6px; letter-spacing: -0.02em; }
.add-veh-subtitle { font-size: 13.5px; color: #64748B; margin: 0; font-weight: 400; }

.add-veh-header-actions { display: flex; align-items: center; gap: 12px; }
.add-veh-btn { padding: 10px 22px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; border: 1.5px solid #E2E8F0; background: #fff; color: #475569; }
.add-veh-btn:hover { border-color: #2a195c; color: #2a195c; }
.add-veh-btn-draft { border-color: #8B5CF6; color: #8B5CF6; }
.add-veh-btn-draft:hover { background: #F5F3FF; }
.add-veh-btn-primary { background: #2a195c; color: #fff; border-color: #2a195c; }
.add-veh-btn-primary:hover { background: #4338CA; border-color: #4338CA; }

/* Workspace Grid Layout */
.add-veh-grid { display: grid; grid-template-columns: 7fr 3fr; gap: 20px; align-items: start; }
.add-veh-left-col { display: flex; flex-direction: column; gap: 20px; }
.add-veh-right-col { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 80px; }

/* Card styles */
.add-veh-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px; box-shadow: 0 1px 3px rgba(0,0,0,.01); }
.add-veh-card-title-row { display: flex; align-items: center; gap: 8px; border-bottom: 1.5px solid #F1F5F9; padding-bottom: 14px; margin-bottom: 20px; }
.add-veh-card-icon { color: #6366F1; display: flex; align-items: center; }
.add-veh-card-title { font-size: 14.5px; font-weight: 700; color: #1E293B; margin: 0; }

/* Form inputs styling */
.add-veh-form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px 14px; }
.add-veh-form-grid-span2 { grid-column: span 2; }
.add-veh-form-grid-span4 { grid-column: span 4; }

.add-veh-field { display: flex; flex-direction: column; gap: 6px; }
.add-veh-label { font-size: 11.5px; font-weight: 700; color: #334155; display: flex; align-items: center; gap: 4px; }
.add-veh-req { color: #EF4444; }
.add-veh-info-btn { background: none; border: none; padding: 0; display: inline-flex; align-items: center; color: #94A3B8; cursor: pointer; }
.add-veh-info-btn:hover { color: #6366F1; }

.add-veh-input { width: 100%; padding: 10px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; font-weight: 500; outline: none; background: #fff; color: #1E293B; transition: border-color .15s; }
.add-veh-input::placeholder { color: #94A3B8; font-weight: 400; }
.add-veh-input:focus { border-color: #6366F1; }
.add-veh-input:disabled { background: #F8FAFC; color: #64748B; cursor: not-allowed; }

.add-veh-select { width: 100%; padding: 10px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; font-weight: 500; outline: none; background: #fff; color: #1E293B; transition: border-color .15s; cursor: pointer; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 11px; padding-right: 32px; }
.add-veh-select:focus { border-color: #6366F1; }

.add-veh-textarea { width: 100%; height: 74px; padding: 10px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; font-weight: 500; outline: none; background: #fff; color: #1E293B; transition: border-color .15s; resize: none; font-family: inherit; }
.add-veh-textarea:focus { border-color: #6366F1; }
.add-veh-textarea-foot { display: flex; justify-content: flex-end; font-size: 10px; color: #94A3B8; margin-top: 4px; }

/* Document Upload layout */
.add-veh-upload-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; align-items: start; }
.add-veh-dropzone { border: 1.5px dashed #C084FC; background: #FAF5FF; border-radius: 10px; padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 8px; cursor: pointer; transition: background .15s; height: 160px; }
.add-veh-dropzone:hover { background: #F3E8FF; }
.add-veh-dropzone-ic { color: #A855F7; display: flex; align-items: center; }
.add-veh-dropzone-t { font-size: 12px; font-weight: 600; color: #2A195C; }
.add-veh-dropzone-b { font-size: 11.5px; color: #64748B; }
.add-veh-dropzone-s { font-size: 9.5px; color: #94A3B8; margin-top: 4px; }

.add-veh-docs-list { display: flex; flex-direction: column; gap: 10px; }
.add-veh-docs-title { font-size: 11.5px; font-weight: 700; color: #475569; margin: 0 0 4px; }
.add-veh-doc-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 12px; background: #FAFBFD; border: 1px solid #F1F5F9; border-radius: 8px; }
.add-veh-doc-row:hover { background: #F8FAFC; }
.add-veh-doc-l { display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 600; color: #475569; }
.add-veh-doc-ic { color: #94A3B8; display: flex; align-items: center; }
.add-veh-doc-btn { padding: 4px 12px; border: 1px solid #7C3AED; background: #fff; color: #7C3AED; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all .15s; }
.add-veh-doc-btn:hover { background: #7C3AED; color: #fff; }

/* Right Panel Cards */
.add-veh-preview-img-box { width: 100%; height: 130px; background: #FAFBFD; border: 1px solid #F1F5F9; border-radius: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 16px; position: relative; }
.add-veh-preview-img { width: auto; height: 100%; object-fit: contain; }

.add-veh-preview-table { width: 100%; display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.add-veh-preview-tr { display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; }
.add-veh-preview-td-lbl { color: #64748B; font-weight: 500; }
.add-veh-preview-td-val { color: #1E293B; font-weight: 700; }

.add-veh-badge { padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
.add-veh-badge-green { background: #DCFCE7; color: #15803D; }
.add-veh-badge-orange { background: #FEF3C7; color: #D97706; }
.add-veh-badge-red { background: #FEE2E2; color: #B91C1C; }
.add-veh-badge-gray { background: #F1F5F9; color: #475569; }

.add-veh-btn-full { width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; }

/* QR Code Section */
.add-veh-qr-box { display: flex; justify-content: center; padding: 12px; background: #FAFBFD; border: 1px dashed #E2E8F0; border-radius: 10px; margin: 12px 0 16px; min-height: 110px; align-items: center; }
.add-veh-qr-mock { display: flex; flex-direction: column; gap: 2px; }
.add-veh-qr-grid-row { display: flex; gap: 2px; }
.add-veh-qr-pixel { width: 5px; height: 5px; background: #E2E8F0; }
.add-veh-qr-pixel.active { background: #1E293B; }
.add-veh-qr-pixel.corner { background: #1E293B; outline: 1px solid #fff; }

.add-veh-qr-actions-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

/* Datepicker calendar icon alignment */
.add-veh-input-date { position: relative; }
.add-veh-date-picker-icon { position: absolute; right: 12px; top: 12px; color: #64748B; pointer-events: none; display: flex; align-items: center; }
.add-veh-input-date input { padding-right: 36px; }
`;

export default function AddVehiclePage() {
  // Live Preview Form State
  const [formData, setFormData] = useState({
    vehicleId: 'Auto Generated',
    vehicleNumber: '',
    vehicleName: '',
    vehicleType: 'Electric Scooter',
    model: '',
    manufacturer: '',
    chassisNumber: '',
    motorNumber: '',
    batteryId: '',
    iotDeviceId: '',
    imeiNumber: '',
    simNumber: '',
    registrationNumber: '',
    color: '',
    purchaseDate: '',
    kmReading: '',
    vehicleWarranty: '',
    batteryWarranty: '',
    insuranceExpiry: '',
    city: '',
    station: '',
    vehicleStatus: 'Available',
    batteryStatus: 'Healthy',
    iotStatus: 'Not Connected',
    lastService: '',
    nextService: '',
    remarks: '',
  });

  const [qrGenerated, setQrGenerated] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [vehicleImage, setVehicleImage] = useState('/scooter_preview.png');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'remarks') {
      setCharacterCount(value.length);
    }
  };

  const handleGenerateQR = () => {
    setQrGenerated(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVehicleImage(URL.createObjectURL(file));
    }
  };

  // Mock QR code rendering
  const renderQrPixels = () => {
    const pixels = [];
    for (let r = 0; r < 14; r++) {
      const row = [];
      for (let c = 0; c < 14; c++) {
        // Corner squares
        const isCorner = 
          (r < 4 && c < 4) || 
          (r < 4 && c > 9) || 
          (r > 9 && c < 4);
        
        // Random pixels for data
        const isActive = isCorner || (qrGenerated && Math.random() > 0.45);
        row.push(
          <div 
            key={`${r}-${c}`} 
            className={`add-veh-qr-pixel ${isActive ? 'active' : ''} ${isCorner ? 'corner' : ''}`}
            style={isCorner ? { background: '#2a195c' } : undefined}
          />
        );
      }
      pixels.push(<div key={r} className="add-veh-qr-grid-row">{row}</div>);
    }
    return <div className="add-veh-qr-mock">{pixels}</div>;
  };

  // Determine badges based on status values
  const getVehicleStatusBadgeClass = () => {
    switch (formData.vehicleStatus) {
      case 'Available': return 'add-veh-badge-green';
      case 'Assigned': return 'add-veh-badge-orange';
      case 'Maintenance': return 'add-veh-badge-red';
      default: return 'add-veh-badge-gray';
    }
  };

  const getIotStatusBadgeClass = () => {
    switch (formData.iotStatus) {
      case 'Connected': return 'add-veh-badge-green';
      case 'Not Connected': return 'add-veh-badge-gray';
      case 'Alert': return 'add-veh-badge-red';
      default: return 'add-veh-badge-gray';
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="add-veh-shell">
        <Sidebar activePath="/vehicles/add" />
        <div className="add-veh-main">
          <TopBar />
          
          <div className="add-veh-page">
            {/* Breadcrumb */}
            <div className="add-veh-bc">
              <span className="add-veh-bc-link">Home</span>
              <span className="add-veh-bc-sep">&gt;</span>
              <span className="add-veh-bc-link">Vehicles</span>
              <span className="add-veh-bc-sep">&gt;</span>
              <span className="add-veh-bc-curr">Add New Vehicle</span>
            </div>

            {/* Title Header */}
            <div className="add-veh-header">
              <div>
                <h1 className="add-veh-title">Add New Vehicle</h1>
                <p className="add-veh-subtitle">Register a new vehicle to your fleet.</p>
              </div>
              <div className="add-veh-header-actions">
                <button className="add-veh-btn">Cancel</button>
                <button className="add-veh-btn add-veh-btn-draft">Save Draft</button>
                <button className="add-veh-btn add-veh-btn-primary">Add Vehicle</button>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="add-veh-grid">
              <div className="add-veh-left-col">
                
                {/* Card 1: Vehicle Information */}
                <div className="add-veh-card">
                  <div className="add-veh-card-title-row">
                    <span className="add-veh-card-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="1" y="3" width="15" height="13" rx="2"/>
                        <path d="M16 8h4l3 5v3h-7V8z"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                    </span>
                    <h2 className="add-veh-card-title">Vehicle Information</h2>
                  </div>

                  <div className="add-veh-form-grid">
                    {/* Row 1 */}
                    <div className="add-veh-field">
                      <label className="add-veh-label">Vehicle ID <span className="add-veh-req">*</span></label>
                      <input 
                        type="text" 
                        name="vehicleId"
                        className="add-veh-input" 
                        placeholder="Auto Generated" 
                        value={formData.vehicleId} 
                        disabled 
                      />
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">Vehicle Number <span className="add-veh-req">*</span></label>
                      <input 
                        type="text" 
                        name="vehicleNumber"
                        className="add-veh-input" 
                        placeholder="e.g. KA01AB1234" 
                        value={formData.vehicleNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">Vehicle Name <span className="add-veh-req">*</span></label>
                      <input 
                        type="text" 
                        name="vehicleName"
                        className="add-veh-input" 
                        placeholder="e.g. Evegah Scooter" 
                        value={formData.vehicleName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">Vehicle Type <span className="add-veh-req">*</span></label>
                      <select 
                        name="vehicleType" 
                        className="add-veh-select" 
                        value={formData.vehicleType}
                        onChange={handleInputChange}
                      >
                        <option value="Electric Scooter">Electric Scooter</option>
                        <option value="Cargo EV">Cargo EV</option>
                        <option value="Electric Cycle">Electric Cycle</option>
                      </select>
                    </div>

                    {/* Row 2 */}
                    <div className="add-veh-field">
                      <label className="add-veh-label">Model <span className="add-veh-req">*</span></label>
                      <select 
                        name="model" 
                        className="add-veh-select" 
                        value={formData.model}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Model</option>
                        <option value="EV-450X">EV-450X Pro</option>
                        <option value="EV-300S">EV-300S Lite</option>
                        <option value="EV-Cargo-Pro">EV-Cargo Pro</option>
                      </select>
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">Manufacturer <span className="add-veh-req">*</span></label>
                      <select 
                        name="manufacturer" 
                        className="add-veh-select" 
                        value={formData.manufacturer}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Manufacturer</option>
                        <option value="Evegah Power">Evegah Power</option>
                        <option value="Mahindra Electric">Mahindra Electric</option>
                        <option value="Hero Electric">Hero Electric</option>
                      </select>
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">Chassis Number <span className="add-veh-req">*</span></label>
                      <input 
                        type="text" 
                        name="chassisNumber"
                        className="add-veh-input" 
                        placeholder="Enter chassis number" 
                        value={formData.chassisNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">Motor Number <span className="add-veh-req">*</span></label>
                      <input 
                        type="text" 
                        name="motorNumber"
                        className="add-veh-input" 
                        placeholder="Enter motor number" 
                        value={formData.motorNumber}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Row 3 */}
                    <div className="add-veh-field">
                      <label className="add-veh-label">Battery ID</label>
                      <input 
                        type="text" 
                        name="batteryId"
                        className="add-veh-input" 
                        placeholder="Enter battery ID" 
                        value={formData.batteryId}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">
                        IoT Device ID
                        <button className="add-veh-info-btn" title="Unique hardware address of IoT unit." type="button">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                          </svg>
                        </button>
                      </label>
                      <input 
                        type="text" 
                        name="iotDeviceId"
                        className="add-veh-input" 
                        placeholder="Enter IoT device ID" 
                        value={formData.iotDeviceId}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">IMEI Number</label>
                      <input 
                        type="text" 
                        name="imeiNumber"
                        className="add-veh-input" 
                        placeholder="Enter IMEI number" 
                        value={formData.imeiNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">SIM Number</label>
                      <input 
                        type="text" 
                        name="simNumber"
                        className="add-veh-input" 
                        placeholder="Enter SIM number" 
                        value={formData.simNumber}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Row 4 */}
                    <div className="add-veh-field">
                      <label className="add-veh-label">Registration Number</label>
                      <input 
                        type="text" 
                        name="registrationNumber"
                        className="add-veh-input" 
                        placeholder="Enter registration number" 
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">Color</label>
                      <select 
                        name="color" 
                        className="add-veh-select" 
                        value={formData.color}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Color</option>
                        <option value="White">White</option>
                        <option value="Black">Black</option>
                        <option value="Purple">Purple</option>
                        <option value="Red">Red</option>
                      </select>
                    </div>
                    <div className="add-veh-field add-veh-input-date">
                      <label className="add-veh-label">Purchase Date</label>
                      <input 
                        type="date" 
                        name="purchaseDate"
                        className="add-veh-input" 
                        value={formData.purchaseDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">Current KM Reading</label>
                      <input 
                        type="number" 
                        name="kmReading"
                        className="add-veh-input" 
                        placeholder="Enter current KM" 
                        value={formData.kmReading}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Row 5 */}
                    <div className="add-veh-field add-veh-input-date">
                      <label className="add-veh-label">Vehicle Warranty Expiry</label>
                      <input 
                        type="date" 
                        name="vehicleWarranty"
                        className="add-veh-input" 
                        value={formData.vehicleWarranty}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="add-veh-field add-veh-input-date">
                      <label className="add-veh-label">Battery Warranty Expiry</label>
                      <input 
                        type="date" 
                        name="batteryWarranty"
                        className="add-veh-input" 
                        value={formData.batteryWarranty}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="add-veh-field add-veh-input-date add-veh-form-grid-span2">
                      <label className="add-veh-label">Insurance Expiry Date</label>
                      <input 
                        type="date" 
                        name="insuranceExpiry"
                        className="add-veh-input" 
                        value={formData.insuranceExpiry}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Row 6 */}
                    <div className="add-veh-field">
                      <label className="add-veh-label">Assigned City <span className="add-veh-req">*</span></label>
                      <select 
                        name="city" 
                        className="add-veh-select" 
                        value={formData.city}
                        onChange={handleInputChange}
                      >
                        <option value="">Select City</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="New Delhi">New Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                      </select>
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">Assigned Station <span className="add-veh-req">*</span></label>
                      <select 
                        name="station" 
                        className="add-veh-select" 
                        value={formData.station}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Station</option>
                        <option value="Koramangala Station">Koramangala Station</option>
                        <option value="Connaught Place Hub">Connaught Place Hub</option>
                        <option value="Andheri West Hub">Andheri West Hub</option>
                      </select>
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">Vehicle Status <span className="add-veh-req">*</span></label>
                      <select 
                        name="vehicleStatus" 
                        className="add-veh-select" 
                        value={formData.vehicleStatus}
                        onChange={handleInputChange}
                      >
                        <option value="Available">Available</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                    <div className="add-veh-field">
                      <label className="add-veh-label">Battery Status <span className="add-veh-req">*</span></label>
                      <select 
                        name="batteryStatus" 
                        className="add-veh-select" 
                        value={formData.batteryStatus}
                        onChange={handleInputChange}
                      >
                        <option value="Healthy">Healthy</option>
                        <option value="Charging">Charging</option>
                        <option value="Low SoC">Low SoC</option>
                        <option value="Service Required">Service Required</option>
                      </select>
                    </div>

                    {/* Row 7 */}
                    <div className="add-veh-field add-veh-form-grid-span2">
                      <label className="add-veh-label">IoT Status <span className="add-veh-req">*</span></label>
                      <select 
                        name="iotStatus" 
                        className="add-veh-select" 
                        value={formData.iotStatus}
                        onChange={handleInputChange}
                      >
                        <option value="Not Connected">Not Connected</option>
                        <option value="Connected">Connected</option>
                        <option value="Alert">Alert / Off-Route</option>
                      </select>
                    </div>
                    <div className="add-veh-field add-veh-input-date">
                      <label className="add-veh-label">Last Service Date</label>
                      <input 
                        type="date" 
                        name="lastService"
                        className="add-veh-input" 
                        value={formData.lastService}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="add-veh-field add-veh-input-date">
                      <label className="add-veh-label">Next Service Date</label>
                      <input 
                        type="date" 
                        name="nextService"
                        className="add-veh-input" 
                        value={formData.nextService}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Row 8 */}
                    <div className="add-veh-field add-veh-form-grid-span4">
                      <label className="add-veh-label">Remarks</label>
                      <textarea 
                        name="remarks"
                        className="add-veh-textarea" 
                        placeholder="Enter any additional remarks..." 
                        maxLength={500}
                        value={formData.remarks}
                        onChange={handleInputChange}
                      />
                      <div className="add-veh-textarea-foot">{characterCount}/500</div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Document Upload */}
                <div className="add-veh-card">
                  <div className="add-veh-card-title-row">
                    <span className="add-veh-card-icon" style={{ color: '#8B5CF6' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </span>
                    <div>
                      <h2 className="add-veh-card-title">Document Upload</h2>
                      <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0' }}>Upload all required documents related to this vehicle.</p>
                    </div>
                  </div>

                  <div className="add-veh-upload-grid">
                    {/* Left: drag area */}
                    <div className="add-veh-dropzone">
                      <div className="add-veh-dropzone-ic">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <div className="add-veh-dropzone-t">Drag & drop files here</div>
                      <div className="add-veh-dropzone-b">or</div>
                      <button className="add-veh-btn add-veh-btn-draft" style={{ padding: '6px 16px', fontSize: '11.5px' }} type="button">Browse Files</button>
                      <div className="add-veh-dropzone-s">Supported: JPG, PNG, PDF (Max 5MB each)</div>
                    </div>

                    {/* Right: checklist */}
                    <div className="add-veh-docs-list">
                      <h3 className="add-veh-docs-title">Required Documents</h3>
                      
                      <div className="add-veh-doc-row">
                        <span className="add-veh-doc-l">
                          <span className="add-veh-doc-ic">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                          </span>
                          Registration Certificate (RC)
                        </span>
                        <button className="add-veh-doc-btn" type="button">Upload</button>
                      </div>

                      <div className="add-veh-doc-row">
                        <span className="add-veh-doc-l">
                          <span className="add-veh-doc-ic">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                          </span>
                          Insurance Certificate
                        </span>
                        <button className="add-veh-doc-btn" type="button">Upload</button>
                      </div>

                      <div className="add-veh-doc-row">
                        <span className="add-veh-doc-l">
                          <span className="add-veh-doc-ic">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                          </span>
                          Permit (if applicable)
                        </span>
                        <button className="add-veh-doc-btn" type="button">Upload</button>
                      </div>

                      <div className="add-veh-doc-row">
                        <span className="add-veh-doc-l">
                          <span className="add-veh-doc-ic">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                          </span>
                          Purchase Invoice
                        </span>
                        <button className="add-veh-doc-btn" type="button">Upload</button>
                      </div>

                      <div className="add-veh-doc-row">
                        <span className="add-veh-doc-l">
                          <span className="add-veh-doc-ic">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                          </span>
                          Other Documents
                        </span>
                        <button className="add-veh-doc-btn" type="button">Upload</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Vehicle Image Upload */}
                <div className="add-veh-card" style={{ marginTop: '20px' }}>
                  <div className="add-veh-card-title-row">
                    <span className="add-veh-card-icon" style={{ color: '#F59E0B' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </span>
                    <div>
                      <h2 className="add-veh-card-title">Vehicle Image Upload</h2>
                      <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0' }}>Upload a high-quality photo of the physical vehicle for the preview card.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <label style={{ flex: '1', border: '1.5px dashed #C084FC', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#FAF5FF', cursor: 'pointer', height: '130px', transition: 'background 0.15s' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        style={{ display: 'none' }} 
                      />
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: '#A855F7', marginBottom: '8px' }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#2A195C' }}>Click to upload vehicle photo</span>
                      <span style={{ fontSize: '9.5px', color: '#94A3B8', marginTop: '4px' }}>Supported: PNG, JPG, JPEG (Max 4MB)</span>
                    </label>

                    <div style={{ width: '130px', height: '130px', borderRadius: '10px', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFBFD', flexShrink: 0 }}>
                      <img src={vehicleImage} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Scooter thumbnail" />
                    </div>
                  </div>
                </div>

              </div>

              <div className="add-veh-right-col">
                
                {/* Card 4: Vehicle Preview */}
                <div className="add-veh-card">
                  <div className="add-veh-card-title-row">
                    <h2 className="add-veh-card-title">Vehicle Preview</h2>
                  </div>
                  
                  <div className="add-veh-preview-img-box">
                    <img 
                      src={vehicleImage} 
                      alt="Vehicle Preview" 
                      style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
                      className="add-veh-preview-img" 
                    />
                  </div>

                  <div className="add-veh-preview-table">
                    <div className="add-veh-preview-tr">
                      <span className="add-veh-preview-td-lbl">Vehicle Number</span>
                      <span className="add-veh-preview-td-val">{formData.vehicleNumber || 'KA01AB1234'}</span>
                    </div>
                    <div className="add-veh-preview-tr">
                      <span className="add-veh-preview-td-lbl">Vehicle Name</span>
                      <span className="add-veh-preview-td-val">{formData.vehicleName || 'Evegah Scooter'}</span>
                    </div>
                    <div className="add-veh-preview-tr">
                      <span className="add-veh-preview-td-lbl">Vehicle Type</span>
                      <span className="add-veh-preview-td-val">{formData.vehicleType}</span>
                    </div>
                    <div className="add-veh-preview-tr">
                      <span className="add-veh-preview-td-lbl">Status</span>
                      <span className={`add-veh-badge ${getVehicleStatusBadgeClass()}`}>
                        {formData.vehicleStatus}
                      </span>
                    </div>
                  </div>

                  <button className="add-veh-btn add-veh-btn-full" style={{ borderColor: '#6366F1', color: '#6366F1' }} type="button">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/><path d="M1 12h22M12 1v22"/>
                    </svg>
                    View Full Details
                  </button>
                </div>

                {/* Card 4: QR Code Generation */}
                <div className="add-veh-card">
                  <div className="add-veh-card-title-row">
                    <div>
                      <h2 className="add-veh-card-title">QR Code Generation</h2>
                      <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0' }}>QR code will be used for vehicle identification.</p>
                    </div>
                  </div>

                  <div className="add-veh-qr-box">
                    {renderQrPixels()}
                  </div>

                  <button 
                    className="add-veh-btn add-veh-btn-full" 
                    style={{ borderColor: '#6366F1', color: '#6366F1', marginBottom: '12px' }}
                    onClick={handleGenerateQR}
                    type="button"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    Generate QR Code
                  </button>

                  <div className="add-veh-qr-actions-row">
                    <button className="add-veh-btn" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} disabled={!qrGenerated} type="button">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Download
                    </button>
                    <button className="add-veh-btn" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} disabled={!qrGenerated} type="button">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                      Print
                    </button>
                  </div>
                </div>

                {/* Card 5: IoT Device Overview */}
                <div className="add-veh-card">
                  <div className="add-veh-card-title-row">
                    <h2 className="add-veh-card-title">IoT Device Overview</h2>
                  </div>

                  <div className="add-veh-preview-table" style={{ marginBottom: '18px' }}>
                    <div className="add-veh-preview-tr">
                      <span className="add-veh-preview-td-lbl">IoT Device ID</span>
                      <span className="add-veh-preview-td-val">{formData.iotDeviceId || '--'}</span>
                    </div>
                    <div className="add-veh-preview-tr">
                      <span className="add-veh-preview-td-lbl">IMEI Number</span>
                      <span className="add-veh-preview-td-val">{formData.imeiNumber || '--'}</span>
                    </div>
                    <div className="add-veh-preview-tr">
                      <span className="add-veh-preview-td-lbl">SIM Number</span>
                      <span className="add-veh-preview-td-val">{formData.simNumber || '--'}</span>
                    </div>
                    <div className="add-veh-preview-tr">
                      <span className="add-veh-preview-td-lbl">IoT Status</span>
                      <span className={`add-veh-badge ${getIotStatusBadgeClass()}`}>
                        {formData.iotStatus}
                      </span>
                    </div>
                  </div>

                  <button className="add-veh-btn add-veh-btn-full" style={{ borderColor: '#6366F1', color: '#6366F1' }} type="button">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                    Bind IoT Device
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
