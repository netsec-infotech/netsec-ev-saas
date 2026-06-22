"use client";
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { api } from '@/lib/api';

const CSS = `
.zn-shell { display: flex; min-height: 100vh; background: #F8F9FF; font-family: 'Inter', sans-serif; }
.zn-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.zn-page { flex: 1; padding: 20px 22px 70px; display: flex; flex-direction: column; gap: 20px; }

/* Custom top bar profile info */
.zn-top-info { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; background: #fff; border-bottom: 1px solid #E2E8F0; }
.zn-user-greet { display: flex; align-items: center; gap: 10px; }
.zn-user-avatar { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; background: #EEF2FF; }
.zn-user-text { display: flex; flex-direction: column; }
.zn-user-name { font-size: 13.5px; font-weight: 700; color: #1E293B; }
.zn-user-role { font-size: 11.5px; color: #64748B; }

.zn-top-actions { display: flex; align-items: center; gap: 16px; }
.zn-bell-btn { position: relative; width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #E2E8F0; display: flex; align-items: center; justify-content: center; color: #475569; background: #fff; cursor: pointer; }
.zn-bell-badge { position: absolute; top: -2px; right: -2px; width: 16px; height: 16px; border-radius: 50%; background: #2a195c; color: #fff; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }

/* Header Titles */
.zn-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 4px; }
.zn-h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 4px; letter-spacing: -0.02em; }
.zn-sub { font-size: 13px; color: #64748B; margin: 0; font-weight: 400; }

/* Stepper Progress Bar Row */
.zn-stepper { display: grid; grid-template-columns: 1fr auto 1.1fr auto 1fr; align-items: center; width: 100%; max-width: 900px; margin: 8px 0 16px; gap: 12px; }
.zn-step { display: flex; align-items: center; gap: 12px; padding: 12px 18px; border-radius: 10px; border: 1.5px solid #E5E7EB; background: #fff; }
.zn-step.active { border-color: #2a195c; background: #F5F3FF; }
.zn-step.completed { border-color: #82C43C; background: #F0FDF4; }
.zn-step-num { width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid #94A3B8; font-size: 11px; font-weight: 700; color: #64748B; display: flex; align-items: center; justify-content: center; transition: all .2s; }
.zn-step.active .zn-step-num { border-color: #2a195c; background: #2a195c; color: #fff; }
.zn-step.completed .zn-step-num { border-color: #82C43C; background: #82C43C; color: #fff; }
.zn-step-info { display: flex; flex-direction: column; }
.zn-step-title { font-size: 13px; font-weight: 700; color: #475569; }
.zn-step.active .zn-step-title { color: #2a195c; }
.zn-step.completed .zn-step-title { color: #15803D; }
.zn-step-desc { font-size: 11px; color: #94A3B8; font-weight: 400; margin-top: 1px; }
.zn-step.active .zn-step-desc { color: #6D28D9; }
.zn-step.completed .zn-step-desc { color: #15803D; }
.zn-step-arrow { font-size: 14px; color: #94A3B8; font-weight: bold; }
.zn-step-arrow.completed { color: #82C43C; }

/* Wizard Layout Cards */
.zn-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.02); padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.zn-card-title { font-size: 16px; font-weight: 700; color: #0F172A; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px; margin-bottom: 4px; }
.zn-card-subtitle { font-size: 13px; color: #64748B; font-weight: 400; margin-top: -12px; margin-bottom: 12px; display: block; }

/* Grid Layout for Columns */
.zn-cols-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
.zn-cols-layout-step3 { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: start; }

/* Form inputs styling */
.zn-form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-bottom: 4px; }
.zn-form-group { display: flex; flex-direction: column; gap: 6px; }
.zn-form-group-full { grid-column: span 2; display: flex; flex-direction: column; gap: 6px; }
.zn-label { font-size: 12px; font-weight: 600; color: #475569; }
.zn-label span { color: #EF4444; }

/* Input with icon styling */
.zn-input-icon-wrap { position: relative; display: flex; align-items: center; width: 100%; }
.zn-input-icon-wrap .zn-select, .zn-input-icon-wrap .zn-input { padding-left: 36px; }
.zn-input-icon-wrap .zn-input-icon { position: absolute; left: 12px; color: #94A3B8; display: flex; align-items: center; pointer-events: none; }

.zn-input, .zn-select, .zn-textarea { width: 100%; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; font-weight: 500; outline: none; color: #1E293B; background: #fff; transition: all .15s; }
.zn-input:focus, .zn-select:focus, .zn-textarea:focus { border-color: #2a195c; box-shadow: 0 0 0 3px rgba(42, 25, 92, 0.08); }
.zn-textarea { resize: vertical; min-height: 80px; font-family: inherit; }

/* Character Counter Inside Input */
.zn-input-wrap-counter { position: relative; display: flex; align-items: center; width: 100%; }
.zn-input-wrap-counter .zn-input { padding-right: 64px; }
.zn-input-counter { position: absolute; right: 12px; font-size: 11px; color: #94A3B8; pointer-events: none; font-weight: 500; }
.zn-textarea-counter { text-align: right; font-size: 11px; color: #94A3B8; font-weight: 500; margin-top: -2px; }

/* Dropdown status dot indicator */
.zn-status-wrapper { position: relative; }
.zn-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #82C43C; display: inline-block; margin-right: 6px; }

/* Error styling */
.zn-error { font-size: 11px; color: #EF4444; font-weight: 500; margin-top: 2px; }

/* Right Sidebar Panel: How it works */
.zn-right-sidebar { display: flex; flex-direction: column; gap: 16px; }
.zn-sb-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.zn-sb-title { font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 16px; display: block; }
.zn-sb-steps { display: flex; flex-direction: column; gap: 18px; }
.zn-sb-step-item { display: flex; gap: 12px; align-items: start; }
.zn-sb-step-ic { width: 32px; height: 32px; border-radius: 50%; background: #F5F3FF; color: #6D28D9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.zn-sb-step-info { display: flex; flex-direction: column; gap: 2px; }
.zn-sb-step-title { font-size: 12.5px; font-weight: 700; color: #1E293B; }
.zn-sb-step-desc { font-size: 11px; color: #64748B; line-height: 1.4; }

/* Info box panel */
.zn-info-box { background: #F5F3FF; border: 1.5px solid #DDD6FE; border-radius: 10px; padding: 14px 16px; display: flex; gap: 10px; align-items: start; }
.zn-info-box-ic { color: #6D28D9; flex-shrink: 0; margin-top: 2px; }
.zn-info-box-txt { font-size: 11.5px; color: #475569; line-height: 1.5; font-weight: 500; }

/* Actions Top Page Header */
.zn-top-actions-row { display: flex; align-items: center; gap: 10px; }
.zn-btn { display: flex; align-items: center; justify-content: center; gap: 7px; padding: 9px 18px; background: #fff; border: 1.5px solid #DDD6FE; border-radius: 8px; font-size: 13px; font-weight: 600; color: #2a195c; cursor: pointer; transition: all .15s; text-decoration: none; }
.zn-btn:hover { background: #F5F3FF; }
.zn-btn-row { display: flex; align-items: center; justify-content: space-between; margin-top: 24px; padding-top: 18px; border-top: 1.5px solid #E2E8F0; width: 100%; max-width: 900px; }
.zn-btn-primary { background: #82C43C; color: #fff; border-color: #82C43C; }
.zn-btn-primary:hover { background: #6da82e; border-color: #6da82e; color: #fff; }
.zn-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

/* Step 2 Map Layout */
.zn-map-grid { display: grid; grid-template-columns: 290px 1fr; gap: 20px; }
.zn-map-sidebar { display: flex; flex-direction: column; gap: 14px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.zn-map-wrapper { position: relative; border-radius: 12px; border: 1.5px solid #E2E8F0; overflow: hidden; background: #E5E7EB; height: 460px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.leaflet-container { width: 100%; height: 100%; z-index: 1; }

/* Drawing tools card buttons */
.zn-tools-list { display: flex; flex-direction: column; gap: 8px; }
.zn-tool-btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 10px 12px; background: #fff; border: 1.5px solid #E5E7EB; border-radius: 8px; font-size: 12.5px; font-weight: 600; color: #475569; cursor: pointer; transition: all .15s; }
.zn-tool-btn:hover { border-color: #C7D2FE; color: #2a195c; }
.zn-tool-btn.active { border-color: #2a195c; background: #F5F3FF; color: #2a195c; }
.zn-tool-btn-l { display: flex; align-items: center; gap: 8px; }
.zn-tool-radio { width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid #94A3B8; display: flex; align-items: center; justify-content: center; }
.zn-tool-btn.active .zn-tool-radio { border-color: #2a195c; }
.zn-tool-btn.active .zn-tool-radio::after { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #2a195c; display: block; }

/* Floating Search Panel inside Map */
.zn-map-search { position: absolute; left: 16px; top: 16px; display: flex; align-items: center; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 4px 10px; width: 280px; box-shadow: 0 4px 12px rgba(0,0,0,.08); z-index: 1000; }
.zn-map-search-input { border: none; font-size: 12.5px; outline: none; width: 100%; color: #1E293B; font-weight: 500; margin-left: 6px; }

/* Floating Top-Right layer panel inside map */
.zn-map-layers { position: absolute; right: 16px; top: 16px; display: flex; gap: 8px; z-index: 1000; }
.zn-map-layer-btn { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 11.5px; font-weight: 600; color: #475569; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.08); }
.zn-map-layer-btn:hover { border-color: #2a195c; color: #2a195c; }

/* Floating Bottom-Right zoom controls panel */
.zn-map-controls { position: absolute; right: 16px; bottom: 16px; display: flex; flex-direction: column; gap: 6px; z-index: 1000; }
.zn-map-ctrl-btn { width: 34px; height: 34px; border: 1.5px solid #E2E8F0; background: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #475569; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.08); font-size: 16px; font-weight: 700; transition: all .15s; }
.zn-map-ctrl-btn:hover { border-color: #2a195c; color: #2a195c; }

/* Map status text info line under canvas */
.zn-map-info-text { margin-top: 10px; font-size: 11.5px; color: #64748B; font-weight: 500; text-align: center; }

/* Stats box for drawing coordinates */
.zn-stats-card { background: #F9FAFB; border: 1.5px solid #E5E7EB; border-radius: 10px; padding: 12px 14px; }
.zn-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.zn-stat-el { display: flex; flex-direction: column; gap: 2px; }
.zn-stat-lbl { font-size: 10.5px; color: #6B7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.02em; }
.zn-stat-val { font-size: 14px; font-weight: 800; color: #111827; }

/* Coordinate list cards */
.zn-coord-list-title { display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 700; color: #374151; margin-top: 4px; }
.zn-coord-box { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; max-height: 120px; overflow-y: auto; background: #FAFAFA; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 8px 10px; }
.zn-coord-row { display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-family: monospace; color: #4B5563; }

/* Step 3 Review Panel */
.zn-review-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: flex; flex-direction: column; gap: 16px; }
.zn-review-sec { border-bottom: 1px solid #F1F5F9; padding-bottom: 14px; display: flex; flex-direction: column; gap: 10px; }
.zn-review-sec:last-child { border-bottom: none; }
.zn-review-sec-title { font-size: 13px; font-weight: 800; color: #2a195c; text-transform: uppercase; letter-spacing: 0.05em; }
.zn-review-list { display: flex; flex-direction: column; gap: 8px; }
.zn-review-row { display: flex; align-items: center; justify-content: space-between; font-size: 12.5px; }
.zn-review-lbl { color: #64748B; font-weight: 500; display: flex; align-items: center; gap: 6px; }
.zn-review-val { color: #1E293B; font-weight: 700; text-align: right; }
.zn-review-link { color: #2a195c; text-decoration: none; font-weight: 700; display: flex; align-items: center; gap: 4px; }
.zn-review-link:hover { text-decoration: underline; }

/* Custom Leaflet Pin styles */
.custom-center-pin { background: transparent !important; border: none !important; }
.zn-searchable-dropdown { position: relative; width: 100%; }
.zn-dropdown-popover { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1.5px solid #DDD6FE; border-radius: 8px; max-height: 200px; overflow-y: auto; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-top: 4px; }
.zn-dropdown-item { padding: 8px 12px; font-size: 13px; font-weight: 500; color: #374151; cursor: pointer; transition: all .15s; text-align: left; }
.zn-dropdown-item:hover { background: #F5F3FF; color: #2a195c; }
.zn-dropdown-empty { padding: 12px; font-size: 12px; color: #9CA3AF; text-align: center; }
`;

interface Coordinate {
  lat: number;
  lng: number;
}

const LOCATION_DATA: Record<string, Record<string, string[]>> = {
  "Andhra Pradesh": {
    "Visakhapatnam": ["Gajuwaka", "Madhurawada", "MVP Colony"],
    "Vijayawada": ["Benz Circle", "One Town", "Patamata"],
    "Guntur": ["Arundelpet", "Lakshmipuram", "Brodipet"]
  },
  "Arunachal Pradesh": {
    "Itanagar": ["Ganga", "Naharlagun", "Senki View"],
    "Tawang": ["Tawang Town", "War Memorial Area"]
  },
  "Assam": {
    "Guwahati": ["Paltan Bazaar", "Dispur", "Ganeshguri", "Khanapara"],
    "Dibrugarh": ["Jalan Nagar", "Amolapatty"]
  },
  "Bihar": {
    "Patna": ["Fraser Road", "Kankarbagh", "Patliputra Colony", "Bailey Road"],
    "Gaya": ["AP Colony", "Bodhgaya Area"]
  },
  "Chhattisgarh": {
    "Raipur": ["Pandri", "Shankar Nagar", "Tatibandh"],
    "Bilaspur": ["Vyapaar Vihar", "Mungeli Road"]
  },
  "Goa": {
    "Panaji": ["Miramar", "Altinho", "Dona Paula"],
    "Margao": ["Fatorda", "Aquem"]
  },
  "Gujarat": {
    "Ahmedabad": ["Satellite", "C G Road", "Vastrapur", "Prahlad Nagar"],
    "Surat": ["Adajan", "Dumas Road", "Varachha"],
    "Vadodara": ["Alkapuri", "Akota", "Fatehgunj"]
  },
  "Haryana": {
    "Gurugram": ["Sector 29", "DLF Phase 3", "Cyber City", "Golf Course Road"],
    "Faridabad": ["Sector 15", "Sector 21", "NIT Faridabad"]
  },
  "Himachal Pradesh": {
    "Shimla": ["Mall Road", "Chotta Shimla", "Sanjauli"],
    "Dharamshala": ["McLeod Ganj", "Kotwali Bazaar"]
  },
  "Jharkhand": {
    "Ranchi": ["Lalpur", "Harmu", "Kanke Road"],
    "Jamshedpur": ["Bistupur", "Sakchi", "Telco Colony"]
  },
  "Karnataka": {
    "Bengaluru": ["Indiranagar", "Koramangala", "Whitefield", "Jayanagar", "HSR Layout", "Malleshwaram"],
    "Mysore": ["Gokulam", "Vidyaranyapuram", "Jayalakshmipuram"]
  },
  "Kerala": {
    "Thiruvananthapuram": ["Kazhakoottam", "Vazhuthacaud", "Palayam"],
    "Kochi": ["Ernakulam", "Fort Kochi", "Kakkanad", "Edappally"]
  },
  "Madhya Pradesh": {
    "Indore": ["Vijay Nagar", "Palasia", "Rajendra Nagar"],
    "Bhopal": ["Arera Colony", "MP Nagar", "Kolar Road"]
  },
  "Maharashtra": {
    "Mumbai": ["Andheri", "Bandra", "Colaba", "Borivali", "Dadar", "Juhu", "Powai"],
    "Pune": ["Kothrud", "Hinjawadi", "Viman Nagar", "Koregaon Park", "Baner"]
  },
  "Manipur": {
    "Imphal": ["Khuman Lampak", "Thangmeiband"]
  },
  "Meghalaya": {
    "Shillong": ["Police Bazar", "Laitumkhrah"]
  },
  "Mizoram": {
    "Aizawl": ["Chanmari", "Zarkawt"]
  },
  "Nagaland": {
    "Kohima": ["BOC Area", "Lerie"],
    "Dimapur": ["Duncan Basti", "Purana Bazar"]
  },
  "Odisha": {
    "Bhubaneswar": ["Saheed Nagar", "Patia", "Kharavela Nagar"],
    "Cuttack": ["Link Road", "Buxi Bazaar"]
  },
  "Punjab": {
    "Ludhiana": ["Sarabha Nagar", "Model Town"],
    "Amritsar": ["Ranjit Avenue", "Golden Temple Area"]
  },
  "Rajasthan": {
    "Jaipur": ["C Scheme", "Malviya Nagar", "Vaishali Nagar", "Raja Park"],
    "Jodhpur": ["Sardarpura", "Shastri Nagar"]
  },
  "Sikkim": {
    "Gangtok": ["MG Marg", "Deorali", "Tadong"]
  },
  "Tamil Nadu": {
    "Chennai": ["Adyar", "T. Nagar", "Velachery", "Mylapore", "Anna Nagar"],
    "Coimbatore": ["RS Puram", "Gandhipuram", "Peelamedu"]
  },
  "Telangana": {
    "Hyderabad": ["Gachibowli", "Jubilee Hills", "Madhapur", "Banjara Hills", "Kondapur", "Secunderabad"]
  },
  "Tripura": {
    "Agartala": ["Banamalipur", "Melarmath"]
  },
  "Uttar Pradesh": {
    "Lucknow": ["Hazratganj", "Gomti Nagar", "Aliganj", "Indira Nagar"],
    "Noida": ["Sector 62", "Sector 18", "Sector 15"],
    "Kanpur": ["Swaroop Nagar", "Civil Lines"]
  },
  "Uttarakhand": {
    "Dehradun": ["Rajpur Road", "Dehrakhas", "Dalanwala"],
    "Haridwar": ["Ranipur", "Har Ki Pauri Area"]
  },
  "West Bengal": {
    "Kolkata": ["Salt Lake", "New Town", "Park Street", "Gariahat", "Ballygunge"],
    "Howrah": ["Shibpur", "Liluah"]
  },
  "Delhi": {
    "New Delhi": ["Connaught Place", "Karol Bagh", "Lajpat Nagar", "Saket", "Vasant Kunj", "Dwarka", "Rohini"]
  },
  "Jammu & Kashmir": {
    "Srinagar": ["Lal Chowk", "Rajbagh", "Dal Lake Area"],
    "Jammu": ["Gandhi Nagar", "Trikuta Nagar"]
  },
  "Ladakh": {
    "Leh": ["Leh Market", "Chanspa"]
  },
  "Puducherry": {
    "Pondicherry": ["White Town", "Heritage Town"]
  }
};

const LOCALITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Connaught Place": { lat: 28.6315, lng: 77.2197 },
  "Karol Bagh": { lat: 28.6442, lng: 77.1895 },
  "Lajpat Nagar": { lat: 28.5685, lng: 77.2435 },
  "Saket": { lat: 28.5224, lng: 77.2120 },
  "Vasant Kunj": { lat: 28.5387, lng: 77.1614 },
  "Dwarka": { lat: 28.5921, lng: 77.0601 },
  "Rohini": { lat: 28.7441, lng: 77.1232 },
  "Andheri": { lat: 19.1136, lng: 72.8697 },
  "Bandra": { lat: 19.0596, lng: 72.8295 },
  "Colaba": { lat: 18.9067, lng: 72.8147 },
  "Borivali": { lat: 19.2288, lng: 72.8541 },
  "Dadar": { lat: 19.0178, lng: 72.8478 },
  "Juhu": { lat: 19.1012, lng: 72.8258 },
  "Powai": { lat: 19.1176, lng: 72.9060 },
  "Kothrud": { lat: 18.5074, lng: 73.8077 },
  "Hinjawadi": { lat: 18.5913, lng: 73.7389 },
  "Viman Nagar": { lat: 18.5679, lng: 73.9143 },
  "Koregaon Park": { lat: 18.5362, lng: 73.8930 },
  "Baner": { lat: 18.5590, lng: 73.7797 },
  "Indiranagar": { lat: 12.9718, lng: 77.6412 },
  "Koramangala": { lat: 12.9352, lng: 77.6244 },
  "Whitefield": { lat: 12.9698, lng: 77.7500 },
  "Jayanagar": { lat: 12.9308, lng: 77.5838 },
  "HSR Layout": { lat: 12.9141, lng: 77.6413 },
  "Malleshwaram": { lat: 12.9984, lng: 77.5714 },
  "Adyar": { lat: 13.0033, lng: 80.2550 },
  "T. Nagar": { lat: 13.0418, lng: 80.2341 },
  "Velachery": { lat: 12.9815, lng: 80.2180 },
  "Mylapore": { lat: 13.0333, lng: 80.2685 },
  "Anna Nagar": { lat: 13.0850, lng: 80.2101 },
  "Gachibowli": { lat: 17.4401, lng: 78.3489 },
  "Jubilee Hills": { lat: 17.4325, lng: 78.4070 },
  "Madhapur": { lat: 17.4483, lng: 78.3915 },
  "Banjara Hills": { lat: 17.4156, lng: 78.4418 },
  "Kondapur": { lat: 17.4622, lng: 78.3568 },
  "Secunderabad": { lat: 17.4399, lng: 78.4983 },
  "Hazratganj": { lat: 26.8486, lng: 80.9474 },
  "Gomti Nagar": { lat: 26.8524, lng: 80.9995 },
  "Sector 62": { lat: 28.6273, lng: 77.3725 },
  "Sector 18": { lat: 28.5708, lng: 77.3261 },
  "Salt Lake": { lat: 22.5804, lng: 88.4116 },
  "New Town": { lat: 22.5854, lng: 88.4797 },
  "Park Street": { lat: 22.5484, lng: 88.3560 },
  "C Scheme": { lat: 26.9116, lng: 75.8022 },
  "Malviya Nagar": { lat: 26.8549, lng: 75.8063 },
  "Satellite": { lat: 23.0305, lng: 72.5178 },
  "Vastrapur": { lat: 23.0350, lng: 72.5293 },
  "Sardarpura": { lat: 26.2790, lng: 73.0118 },
  "Visakhapatnam": { lat: 17.6868, lng: 83.2185 },
  "Vijayawada": { lat: 16.5062, lng: 80.6480 },
  "Patna": { lat: 25.5941, lng: 85.1376 },
  "Guwahati": { lat: 26.1445, lng: 91.7362 },
  "Kochi": { lat: 9.9312, lng: 76.2673 },
  "Thiruvananthapuram": { lat: 8.5241, lng: 76.9366 },
  "Bhopal": { lat: 23.2599, lng: 77.4126 },
  "Indore": { lat: 22.7196, lng: 75.8577 },
  "Bhubaneswar": { lat: 20.2961, lng: 85.8245 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Lucknow": { lat: 26.8467, lng: 80.9462 },
  "Dehradun": { lat: 30.3165, lng: 78.0322 },
  "Srinagar": { lat: 34.0837, lng: 74.7973 }
};

const getLocalityCoords = (loc: string, city: string) => {
  if (LOCALITY_COORDINATES[loc]) return LOCALITY_COORDINATES[loc];
  if (LOCALITY_COORDINATES[city]) return LOCALITY_COORDINATES[city];
  return { lat: 28.6315, lng: 77.2197 };
};

export default function AddZonePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Searchable dropdown state
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [stateSearchText, setStateSearchText] = useState('');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearchText, setCitySearchText] = useState('');
  const [localityDropdownOpen, setLocalityDropdownOpen] = useState(false);
  const [localitySearchText, setLocalitySearchText] = useState('');

  const stateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const localityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (stateRef.current && !stateRef.current.contains(e.target as Node)) {
        setStateDropdownOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
      if (localityRef.current && !localityRef.current.contains(e.target as Node)) {
        setLocalityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        setIsEditing(true);
        setEditId(id);
        api.get('/zones')
          .then(res => {
            if (res && res.data) {
              const zone = res.data.find((z: any) => String(z.id) === String(id));
              if (zone) {
                const pts = Array.isArray(zone.points) ? zone.points : JSON.parse(zone.points || '[]');
                setFormData({
                  name: zone.name,
                  code: zone.code,
                  country: zone.country || 'India',
                  state: zone.state || '',
                  city: zone.city || '',
                  locality: zone.locality || '',
                  type: zone.type || 'Operational Zone',
                  priority: zone.priority || 'High',
                  status: zone.status || 'active',
                  timezone: zone.timezone || '(GMT+05:30) Asia/Kolkata',
                  max_vehicles: zone.max_vehicles || 250,
                  description: zone.description || '',
                  start_date: zone.start_date ? zone.start_date.split('T')[0] : '',
                  end_date: zone.end_date ? zone.end_date.split('T')[0] : '',
                  notes: zone.notes || '',
                  map_link: zone.map_link || ''
                });
                setPoints(pts);
              }
            }
          })
          .catch(err => {
            console.error('Error fetching zone for edit:', err);
          });
      }
    }
  }, []);

  const handleStateSelect = (selectedState: string) => {
    const cities = Object.keys(LOCATION_DATA[selectedState] || {});
    const firstCity = cities[0] || '';
    const localities = LOCATION_DATA[selectedState]?.[firstCity] || [];
    const firstLocality = localities[0] || '';
    
    setFormData(prev => ({
      ...prev,
      state: selectedState,
      city: firstCity,
      locality: firstLocality,
      name: `${firstLocality} Zone`,
      code: `${firstLocality.toUpperCase().substring(0, 3)}Z-001`,
      map_link: `https://maps.google.com/?q=${getLocalityCoords(firstLocality, firstCity).lat},${getLocalityCoords(firstLocality, firstCity).lng}`
    }));
    
    const defaultCoords = getLocalityCoords(firstLocality, firstCity);
    setPoints([
      { lat: defaultCoords.lat, lng: defaultCoords.lng },
      { lat: defaultCoords.lat + 0.001, lng: defaultCoords.lng + 0.009 },
      { lat: defaultCoords.lat - 0.005, lng: defaultCoords.lng + 0.011 },
      { lat: defaultCoords.lat - 0.011, lng: defaultCoords.lng - 0.001 },
      { lat: defaultCoords.lat - 0.013, lng: defaultCoords.lng - 0.010 },
      { lat: defaultCoords.lat - 0.008, lng: defaultCoords.lng - 0.014 },
      { lat: defaultCoords.lat - 0.002, lng: defaultCoords.lng - 0.011 },
      { lat: defaultCoords.lat, lng: defaultCoords.lng }
    ]);
    
    setStateSearchText('');
    setStateDropdownOpen(false);
  };

  const handleCitySelect = (selectedCity: string) => {
    const localities = LOCATION_DATA[formData.state]?.[selectedCity] || [];
    const firstLocality = localities[0] || '';
    
    setFormData(prev => ({
      ...prev,
      city: selectedCity,
      locality: firstLocality,
      name: `${firstLocality} Zone`,
      code: `${firstLocality.toUpperCase().substring(0, 3)}Z-001`,
      map_link: `https://maps.google.com/?q=${getLocalityCoords(firstLocality, selectedCity).lat},${getLocalityCoords(firstLocality, selectedCity).lng}`
    }));
    
    const defaultCoords = getLocalityCoords(firstLocality, selectedCity);
    setPoints([
      { lat: defaultCoords.lat, lng: defaultCoords.lng },
      { lat: defaultCoords.lat + 0.001, lng: defaultCoords.lng + 0.009 },
      { lat: defaultCoords.lat - 0.005, lng: defaultCoords.lng + 0.011 },
      { lat: defaultCoords.lat - 0.011, lng: defaultCoords.lng - 0.001 },
      { lat: defaultCoords.lat - 0.013, lng: defaultCoords.lng - 0.010 },
      { lat: defaultCoords.lat - 0.008, lng: defaultCoords.lng - 0.014 },
      { lat: defaultCoords.lat - 0.002, lng: defaultCoords.lng - 0.011 },
      { lat: defaultCoords.lat, lng: defaultCoords.lng }
    ]);
    
    setCitySearchText('');
    setCityDropdownOpen(false);
  };

  const handleLocalitySelect = (selectedLocality: string) => {
    setFormData(prev => ({
      ...prev,
      locality: selectedLocality,
      name: `${selectedLocality} Zone`,
      code: `${selectedLocality.toUpperCase().substring(0, 3)}Z-001`,
      map_link: `https://maps.google.com/?q=${getLocalityCoords(selectedLocality, formData.city).lat},${getLocalityCoords(selectedLocality, formData.city).lng}`
    }));
    
    const defaultCoords = getLocalityCoords(selectedLocality, formData.city);
    setPoints([
      { lat: defaultCoords.lat, lng: defaultCoords.lng },
      { lat: defaultCoords.lat + 0.001, lng: defaultCoords.lng + 0.009 },
      { lat: defaultCoords.lat - 0.005, lng: defaultCoords.lng + 0.011 },
      { lat: defaultCoords.lat - 0.011, lng: defaultCoords.lng - 0.001 },
      { lat: defaultCoords.lat - 0.013, lng: defaultCoords.lng - 0.010 },
      { lat: defaultCoords.lat - 0.008, lng: defaultCoords.lng - 0.014 },
      { lat: defaultCoords.lat - 0.002, lng: defaultCoords.lng - 0.011 },
      { lat: defaultCoords.lat, lng: defaultCoords.lng }
    ]);
    
    setLocalitySearchText('');
    setLocalityDropdownOpen(false);
  };

  // Form Fields State
  const [formData, setFormData] = useState({
    name: 'Connaught Place Zone',
    code: 'CPZ-001',
    country: 'India',
    state: 'Delhi',
    city: 'New Delhi',
    locality: 'Connaught Place',
    type: 'Operational Zone',
    priority: 'High',
    status: 'active',
    timezone: '(GMT+05:30) Asia/Kolkata',
    max_vehicles: 250,
    description: 'Operational zone for Connaught Place area including inner circle.',
    start_date: '2024-05-15',
    end_date: '',
    notes: '',
    map_link: 'https://maps.google.com/?q=28.6315,77.2197'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredStates = Object.keys(LOCATION_DATA).filter(st =>
    st.toLowerCase().includes(stateSearchText.toLowerCase())
  );

  const filteredCities = Object.keys(LOCATION_DATA[formData.state] || {}).filter(ct =>
    ct.toLowerCase().includes(citySearchText.toLowerCase())
  );

  const filteredLocalities = (LOCATION_DATA[formData.state]?.[formData.city] || []).filter(loc =>
    loc.toLowerCase().includes(localitySearchText.toLowerCase())
  );

  // Geofence Drawing State (seeded default Connaught Place points for convenience)
  const [points, setPoints] = useState<Coordinate[]>([
    { lat: 28.6315, lng: 77.2197 },
    { lat: 28.6328, lng: 77.2289 },
    { lat: 28.6261, lng: 77.2314 },
    { lat: 28.6198, lng: 77.2190 },
    { lat: 28.6181, lng: 77.2093 },
    { lat: 28.6232, lng: 77.2051 },
    { lat: 28.6289, lng: 77.2078 },
    { lat: 28.6315, lng: 77.2197 }
  ]);
  const [activeTool, setActiveTool] = useState<string>('polygon');

  // Leaflet references
  const mapRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const centerMarkerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Avoid stale closures in Leaflet events
  const pointsRef = useRef<Coordinate[]>([]);
  const activeToolRef = useRef<string>('polygon');

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    activeToolRef.current = activeTool;
    // update dragging property of markers when activeTool changes
    if (mapRef.current && (window as any).L) {
      markersRef.current.forEach(m => {
        if (activeTool === 'edit') {
          m.dragging?.enable();
        } else {
          m.dragging?.disable();
        }
      });
    }
  }, [activeTool]);

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // Initialize Map in Step 2 / Step 3
  useEffect(() => {
    if ((step !== 2 && step !== 3) || !leafletLoaded) return;
    const L = (window as any).L;
    if (!L) return;

    const mapId = step === 2 ? 'new-zone-map' : 'preview-zone-map';
    const container = document.getElementById(mapId);
    if (!container) return;

    const centerCoords = LOCALITY_COORDINATES[formData.locality] || { lat: 28.6315, lng: 77.2197 };

    // Create Leaflet Map instance
    const map = L.map(mapId, {
      center: [centerCoords.lat, centerCoords.lng],
      zoom: 14,
      zoomControl: false,
      dragging: true,
      scrollWheelZoom: true
    });
    mapRef.current = map;

    // CartoDB Voyager Map Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    if (step === 2) {
      polylineRef.current = L.polyline([], { color: '#2a195c', weight: 3, dashArray: '5, 5' }).addTo(map);
      polygonRef.current = L.polygon([], { color: '#2a195c', fillColor: '#6D28D9', fillOpacity: 0.15, weight: 2.5 }).addTo(map);

      // Initial draw from state
      syncMapLayers();

      // Map click handler
      map.on('click', (e: any) => {
        const tool = activeToolRef.current;

        if (tool === 'polygon') {
          const newPt = { lat: e.latlng.lat, lng: e.latlng.lng };
          // If closed polyline check
          const updated = [...pointsRef.current, newPt];
          setPoints(updated);
          setTimeout(syncMapLayers, 0);
        } else if (tool === 'circle') {
          // Draw a circle centered at click point
          const circlePoints = generateCirclePoints(e.latlng.lat, e.latlng.lng, 400);
          setPoints(circlePoints);
          setTimeout(syncMapLayers, 0);
          setActiveTool('move');
        }
      });
    } else {
      // Step 3 Review Static Map Preview
      if (points.length > 0) {
        const latlngs = points.map(pt => [pt.lat, pt.lng]);
        const poly = L.polygon(latlngs, { color: '#2a195c', fillColor: '#6D28D9', fillOpacity: 0.15, weight: 2.5 }).addTo(map);
        
        // Add a center pin marker
        const center = getPointsCenter(points);
        L.marker([center.lat, center.lng], {
          icon: L.divIcon({
            className: 'custom-center-pin',
            html: `
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#2a195c" stroke="#fff" stroke-width="1.5" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3" fill="#fff"/>
                </svg>
                <div style="margin-top: 4px; background: rgba(42, 25, 92, 0.95); color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                  ${formData.locality || 'Connaught Place'}
                </div>
              </div>
            `,
            iconSize: [60, 60],
            iconAnchor: [30, 32]
          })
        }).addTo(map);

        map.fitBounds(poly.getBounds(), { padding: [20, 20] });
      }
    }

    // Call size invalidation to solve Next/React flex dimension loading bugs
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [step, leafletLoaded]);

  const getPointsCenter = (coords: Coordinate[]) => {
    if (coords.length === 0) return { lat: 28.6315, lng: 77.2197 };
    let sumLat = 0, sumLng = 0;
    coords.forEach(c => {
      sumLat += c.lat;
      sumLng += c.lng;
    });
    return { lat: sumLat / coords.length, lng: sumLng / coords.length };
  };

  const generateCirclePoints = (centerLat: number, centerLng: number, radiusMeters: number) => {
    const pointsList = [];
    const numberOfPoints = 4; // 4-dot circle as requested
    const earthRadius = 6378137; // in meters
    
    for (let i = 0; i < numberOfPoints; i++) {
      const angle = (i * 2 * Math.PI) / numberOfPoints;
      const dx = radiusMeters * Math.cos(angle);
      const dy = radiusMeters * Math.sin(angle);
      
      const lat = centerLat + (dy / earthRadius) * (180 / Math.PI);
      const lng = centerLng + (dx / (earthRadius * Math.cos(centerLat * Math.PI / 180))) * (180 / Math.PI);
      
      pointsList.push({ lat, lng });
    }
    // close path
    pointsList.push(pointsList[0]);
    return pointsList;
  };

  const handleMapSearch = async () => {
    if (!mapSearchQuery.trim()) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        if (mapRef.current) {
          mapRef.current.setView([newLat, newLng], 14);
        }
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      console.error("Error searching location:", err);
    }
  };

  const syncMapLayers = () => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    const map = mapRef.current;
    const pts = pointsRef.current;

    // Clear old markers & center marker
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    if (centerMarkerRef.current) {
      map.removeLayer(centerMarkerRef.current);
      centerMarkerRef.current = null;
    }

    // Draw boundary markers
    pts.forEach((p, idx) => {
      // Don't draw marker for closing duplicates in list
      if (idx === pts.length - 1 && idx > 0 && p.lat === pts[0].lat && p.lng === pts[0].lng) return;

      const marker = L.marker([p.lat, p.lng], {
        draggable: activeToolRef.current === 'edit',
        icon: L.divIcon({
          className: 'custom-draw-marker',
          html: `<div style="width: 10px; height: 10px; border-radius: 50%; border: 2px solid #2a195c; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5]
        })
      }).addTo(map);

      marker.on('click', () => {
        const tool = activeToolRef.current;
        if (tool === 'polygon' && idx === 0 && pts.length >= 3) {
          if (pts[pts.length - 1].lat !== pts[0].lat || pts[pts.length - 1].lng !== pts[0].lng) {
            const updated = [...pts, { lat: pts[0].lat, lng: pts[0].lng }];
            setPoints(updated);
            pointsRef.current = updated;
            setTimeout(syncMapLayers, 0);
          }
        }
      });

      marker.on('drag', (e: any) => {
        const newLatLng = e.target.getLatLng();
        const updatedPts = [...pointsRef.current];
        updatedPts[idx] = { lat: newLatLng.lat, lng: newLatLng.lng };
        
        // Sync closed point if it's the first one
        if (idx === 0 && updatedPts[updatedPts.length - 1]?.lat === pts[0]?.lat) {
          updatedPts[updatedPts.length - 1] = { lat: newLatLng.lat, lng: newLatLng.lng };
        }
        
        pointsRef.current = updatedPts;
        setPoints(updatedPts);
        
        // Update lines
        const latlngs = updatedPts.map(pt => [pt.lat, pt.lng]);
        polylineRef.current.setLatLngs(latlngs);
        polygonRef.current.setLatLngs(latlngs);
        
        // Update center pin
        if (centerMarkerRef.current) {
          const newCtr = getPointsCenter(updatedPts);
          centerMarkerRef.current.setLatLng(newCtr);
        }
      });

      markersRef.current.push(marker);
    });

    // Draw lines
    const latlngs = pts.map(pt => [pt.lat, pt.lng]);
    polylineRef.current.setLatLngs(latlngs);
    polygonRef.current.setLatLngs(latlngs);

    // Draw center pin label
    if (pts.length > 0) {
      const center = getPointsCenter(pts);
      centerMarkerRef.current = L.marker([center.lat, center.lng], {
        icon: L.divIcon({
          className: 'custom-center-pin',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#2a195c" stroke="#fff" stroke-width="1.5" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3" fill="#fff"/>
              </svg>
              <div style="margin-top: 4px; background: rgba(42, 25, 92, 0.95); color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                ${formData.locality || 'Connaught Place'}
              </div>
            </div>
          `,
          iconSize: [60, 60],
          iconAnchor: [30, 32]
        })
      }).addTo(map);
    }
  };

  // Calculations
  const perimeter = useMemo(() => {
    if (points.length < 2) return 0;
    const getDistance = (p1: Coordinate, p2: Coordinate) => {
      const R = 6371e3; // meters
      const phi1 = p1.lat * Math.PI/180;
      const phi2 = p2.lat * Math.PI/180;
      const deltaPhi = (p2.lat - p1.lat) * Math.PI/180;
      const deltaLambda = (p2.lng - p1.lng) * Math.PI/180;

      const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    let total = 0;
    for (let i = 0; i < points.length; i++) {
      const next = (i + 1) % points.length;
      total += getDistance(points[i], points[next]);
    }
    return total;
  }, [points]);

  const area = useMemo(() => {
    if (points.length < 3) return 0;
    let sum = 0;
    const latMid = points.reduce((s, c) => s + c.lat, 0) / points.length;
    const mPerDegLat = 111132;
    const mPerDegLng = 40075000 * Math.cos(latMid * Math.PI / 180) / 360;
    
    const projected = points.map(c => ({
      x: c.lng * mPerDegLng,
      y: c.lat * mPerDegLat
    }));
    
    for (let i = 0; i < projected.length; i++) {
      const j = (i + 1) % projected.length;
      sum += projected[i].x * projected[j].y;
      sum -= projected[j].x * projected[i].y;
    }
    return Math.abs(sum) / 2;
  }, [points]);

  const formattedArea = useMemo(() => {
    return `${(area / 1000000).toFixed(2)} km²`;
  }, [area]);

  const formattedPerimeter = useMemo(() => {
    return `${(perimeter / 1000).toFixed(2)} km`;
  }, [perimeter]);

  const handleCopyCoords = () => {
    if (points.length === 0) return;
    const text = points.map(p => `${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}`).join('\n');
    navigator.clipboard.writeText(text);
    alert('Coordinates copied to clipboard!');
  };

  const handleClearDrawing = () => {
    setPoints([]);
    setTimeout(syncMapLayers, 0);
  };

  // Form Validation
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Zone name is required';
    if (!formData.code.trim()) errors.code = 'Zone code is required';
    if (!formData.locality.trim()) errors.locality = 'Locality is required';
    if (!formData.start_date) errors.start_date = 'Start date is required';
    if (formData.max_vehicles <= 0) errors.max_vehicles = 'Max vehicles limit must be greater than 0';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Navigation Steps
  const nextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (points.length < 3) {
        alert('Please draw a geofence with at least 3 points on the map!');
        return;
      }
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        points: points
      };

      let response;
      if (isEditing && editId) {
        response = await api.put(`/zones/${editId}`, payload);
      } else {
        response = await api.post('/zones', payload);
      }

      if (response.status === 'success') {
        alert(isEditing ? 'Zone updated successfully!' : 'Zone created successfully!');
        router.push('/zones');
      } else {
        alert('Error: ' + response.message);
      }
    } catch (err: any) {
      console.error(err);
      alert('Failed to save zone: ' + err.message);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="zn-shell">
        <Sidebar activePath="/zones" />
        <div className="zn-main">
          {/* Top Bar Info */}
          <div className="zn-top-info">
            <div className="zn-user-greet">
              <div className="zn-user-avatar" style={{ background: '#2a195c', color: '#fff', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="zn-user-text">
                <span className="zn-user-name">Hello, Akash 👋</span>
                <span className="zn-user-role">Zone Employee</span>
              </div>
            </div>
            <div className="zn-top-actions">
              <button className="zm-zone-select" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', border: '1.5px solid #E2E8F0', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#334155', background: '#fff', cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ color: '#2a195c' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Connaught Place Zone
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <button className="zn-bell-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="zn-bell-badge">3</span>
              </button>
            </div>
          </div>

          <div className="zn-page">
            {/* Header Titles & Buttons Row */}
            <div className="zn-header-row">
              <div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <span style={{ cursor: 'pointer' }} onClick={() => router.push('/zones')}>Zone Management</span>
                  <span style={{ fontSize: '10px' }}>&gt;</span>
                  <span style={{ color: '#64748B' }}>Add New Zone</span>
                </div>
                <h1 className="zn-h1">Add New Zone</h1>
              </div>

              {/* Wizard Top Action Buttons */}
              <div className="zn-top-actions-row">
                <Link href="/zones" className="zn-btn" style={{ borderColor: '#EF4444', color: '#EF4444' }}>Cancel</Link>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="zn-stepper">
              <div className={`zn-step ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <span className="zn-step-num">{step > 1 ? '✓' : '1'}</span>
                <div className="zn-step-info">
                  <span className="zn-step-title">Zone Details</span>
                  <span className="zn-step-desc">{step > 1 ? 'Basic information added' : 'Enter basic information'}</span>
                </div>
              </div>
              <span className={`zn-step-arrow ${step > 1 ? 'completed' : ''}`}>───</span>
              <div className={`zn-step ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <span className="zn-step-num">{step > 2 ? '✓' : '2'}</span>
                <div className="zn-step-info">
                  <span className="zn-step-title">Draw Geo Fence</span>
                  <span className="zn-step-desc">{step > 2 ? 'Zone boundary drawn' : 'Mark the zone on map'}</span>
                </div>
              </div>
              <span className={`zn-step-arrow ${step > 2 ? 'completed' : ''}`}>───</span>
              <div className={`zn-step ${step === 3 ? 'active' : ''}`}>
                <span className="zn-step-num">3</span>
                <div className="zn-step-info">
                  <span className="zn-step-title">Review & Confirm</span>
                  <span className="zn-step-desc">Verify and save zone</span>
                </div>
              </div>
            </div>

            {/* STEP 1: ZONE DETAILS FORM */}
            {step === 1 && (
              <div className="zn-cols-layout">
                {/* Left Card: Input fields */}
                <div className="zn-card">
                  <span className="zn-card-title">Location & Zone Information</span>
                  <span className="zn-card-subtitle">Fill in the details to define your new operational zone.</span>
                  
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2a195c', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Location Hierarchy</span>
                  <div className="zn-form-grid">
                    <div className="zn-form-group">
                      <label className="zn-label">Country <span>*</span></label>
                      <select className="zn-select" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)}>
                        <option value="India">India</option>
                      </select>
                    </div>

                    <div className="zn-form-group">
                      <label className="zn-label">State <span>*</span></label>
                      <div className="zn-searchable-dropdown" ref={stateRef}>
                        <input
                          type="text"
                          className="zn-input"
                          placeholder="Search State..."
                          value={stateDropdownOpen ? stateSearchText : formData.state}
                          onFocus={() => {
                            setStateDropdownOpen(true);
                            setStateSearchText('');
                          }}
                          onChange={(e) => {
                            setStateDropdownOpen(true);
                            setStateSearchText(e.target.value);
                          }}
                        />
                        {stateDropdownOpen && (
                          <div className="zn-dropdown-popover">
                            {filteredStates.length > 0 ? (
                              filteredStates.map(st => (
                                <div key={st} className="zn-dropdown-item" onClick={() => handleStateSelect(st)}>
                                  {st}
                                </div>
                              ))
                            ) : (
                              <div className="zn-dropdown-empty">No states found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="zn-form-group">
                      <label className="zn-label">City <span>*</span></label>
                      <div className="zn-searchable-dropdown" ref={cityRef}>
                        <input
                          type="text"
                          className="zn-input"
                          placeholder="Search City..."
                          value={cityDropdownOpen ? citySearchText : formData.city}
                          onFocus={() => {
                            setCityDropdownOpen(true);
                            setCitySearchText('');
                          }}
                          onChange={(e) => {
                            setCityDropdownOpen(true);
                            setCitySearchText(e.target.value);
                          }}
                        />
                        {cityDropdownOpen && (
                          <div className="zn-dropdown-popover">
                            {filteredCities.length > 0 ? (
                              filteredCities.map(ct => (
                                <div key={ct} className="zn-dropdown-item" onClick={() => handleCitySelect(ct)}>
                                  {ct}
                                </div>
                              ))
                            ) : (
                              <div className="zn-dropdown-empty">No cities found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="zn-form-group">
                      <label className="zn-label">Area / Locality <span>*</span></label>
                      <div className="zn-searchable-dropdown" ref={localityRef}>
                        <input
                          type="text"
                          className="zn-input"
                          placeholder="Search Area / Locality..."
                          value={localityDropdownOpen ? localitySearchText : formData.locality}
                          onFocus={() => {
                            setLocalityDropdownOpen(true);
                            setLocalitySearchText('');
                          }}
                          onChange={(e) => {
                            setLocalityDropdownOpen(true);
                            setLocalitySearchText(e.target.value);
                          }}
                        />
                        {localityDropdownOpen && (
                          <div className="zn-dropdown-popover">
                            {filteredLocalities.length > 0 ? (
                              filteredLocalities.map(loc => (
                                <div key={loc} className="zn-dropdown-item" onClick={() => handleLocalitySelect(loc)}>
                                  {loc}
                                </div>
                              ))
                            ) : (
                              <div className="zn-dropdown-empty">No localities found</div>
                            )}
                          </div>
                        )}
                      </div>
                      {formErrors.locality && <span className="zn-error">{formErrors.locality}</span>}
                    </div>
                  </div>

                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2a195c', marginTop: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Zone Details</span>
                  <div className="zn-form-grid">
                    <div className="zn-form-group">
                      <label className="zn-label">Zone Name <span>*</span></label>
                      <div className="zn-input-wrap-counter">
                        <input
                          type="text"
                          className="zn-input"
                          maxLength={100}
                          placeholder="e.g. Connaught Place Zone"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                        <span className="zn-input-counter">{formData.name.length} / 100</span>
                      </div>
                      {formErrors.name && <span className="zn-error">{formErrors.name}</span>}
                    </div>

                    <div className="zn-form-group">
                      <label className="zn-label">Zone Code <span>*</span></label>
                      <div className="zn-input-wrap-counter">
                        <input
                          type="text"
                          className="zn-input"
                          maxLength={50}
                          placeholder="e.g. CPZ-001"
                          value={formData.code}
                          onChange={(e) => handleInputChange('code', e.target.value)}
                        />
                        <span className="zn-input-counter">{formData.code.length} / 50</span>
                      </div>
                      {formErrors.code && <span className="zn-error">{formErrors.code}</span>}
                    </div>

                    <div className="zn-form-group">
                      <label className="zn-label">Zone Type <span>*</span></label>
                      <select className="zn-select" value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)}>
                        <option value="Operational Zone">Operational Zone</option>
                        <option value="Hub Zone">Hub Zone</option>
                        <option value="No-Ride Zone">No-Ride Zone</option>
                        <option value="Charging Zone">Charging Zone</option>
                      </select>
                    </div>

                    <div className="zn-form-group">
                      <label className="zn-label">Zone Priority <span>*</span></label>
                      <select className="zn-select" value={formData.priority} onChange={(e) => handleInputChange('priority', e.target.value)}>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div className="zn-form-group">
                      <label className="zn-label">Zone Status <span>*</span></label>
                      <select className="zn-select" value={formData.status} onChange={(e) => handleInputChange('status', e.target.value)}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="zn-form-group">
                      <label className="zn-label">Time Zone <span>*</span></label>
                      <select className="zn-select" value={formData.timezone} onChange={(e) => handleInputChange('timezone', e.target.value)}>
                        <option value="(GMT+05:30) Asia/Kolkata">(GMT+05:30) Asia/Kolkata</option>
                      </select>
                    </div>
                  </div>

                  <div className="zn-form-group-full">
                    <label className="zn-label">Description (Optional)</label>
                    <textarea
                      className="zn-textarea"
                      maxLength={200}
                      placeholder="Operational zone description..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                    <div className="zn-textarea-counter">{formData.description.length} / 200</div>
                  </div>

                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2a195c', marginTop: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Additional Information (Optional)</span>
                  <div className="zn-form-grid">
                    <div className="zn-form-group">
                      <label className="zn-label">Operational Start Date</label>
                      <input
                        type="date"
                        className="zn-input"
                        value={formData.start_date}
                        onChange={(e) => handleInputChange('start_date', e.target.value)}
                      />
                    </div>

                    <div className="zn-form-group">
                      <label className="zn-label">Operational End Date</label>
                      <input
                        type="date"
                        className="zn-input"
                        value={formData.end_date}
                        onChange={(e) => handleInputChange('end_date', e.target.value)}
                      />
                    </div>

                    <div className="zn-form-group">
                      <label className="zn-label">Max Vehicles Allowed</label>
                      <input
                        type="number"
                        className="zn-input"
                        value={formData.max_vehicles}
                        onChange={(e) => handleInputChange('max_vehicles', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="zn-form-group-full">
                    <label className="zn-label">Notes (Optional)</label>
                    <textarea
                      className="zn-textarea"
                      maxLength={200}
                      placeholder="Add any internal notes about this zone..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                    />
                    <div className="zn-textarea-counter">{formData.notes.length} / 200</div>
                  </div>

                  <div className="zn-form-group-full">
                    <label className="zn-label">Exact Zone Map Link (Optional)</label>
                    <input
                      type="text"
                      className="zn-input"
                      placeholder="https://maps.google.com/?q=28.6315,77.2197"
                      value={formData.map_link}
                      onChange={(e) => handleInputChange('map_link', e.target.value)}
                    />
                    <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Paste Google Maps link of the exact operational area</span>
                  </div>
                </div>

                {/* Right Card: How it works */}
                <div className="zn-right-sidebar">
                  <div className="zn-sb-card">
                    <span className="zn-sb-title">How it works?</span>
                    <div className="zn-sb-steps">
                      <div className="zn-sb-step-item">
                        <div className="zn-sb-step-ic">📝</div>
                        <div className="zn-sb-step-info">
                          <span className="zn-sb-step-title">1. Enter Zone Details</span>
                          <span className="zn-sb-step-desc">Provide the location hierarchy and basic information for the zone.</span>
                        </div>
                      </div>
                      <div className="zn-sb-step-item">
                        <div className="zn-sb-step-ic">🖱️</div>
                        <div className="zn-sb-step-info">
                          <span className="zn-sb-step-title">2. Draw Geo Fence</span>
                          <span className="zn-sb-step-desc">Go to the map and draw the boundary of the zone.</span>
                        </div>
                      </div>
                      <div className="zn-sb-step-item">
                        <div className="zn-sb-step-ic">💾</div>
                        <div className="zn-sb-step-info">
                          <span className="zn-sb-step-title">3. Review & Save</span>
                          <span className="zn-sb-step-desc">Review the zone details and save it for future operations.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="zn-info-box">
                    <span className="zn-info-box-ic">ℹ️</span>
                    <span className="zn-info-box-txt">
                      Providing the exact map link helps us auto-capture coordinates and speed up the zone creation process.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: DRAW GEOFENCE MAP */}
            {step === 2 && (
              <div className="zn-card">
                <span className="zn-card-title">Draw Geo Fence</span>
                <span className="zn-card-subtitle">Draw a boundary on the map to define the operational zone.</span>
                
                <div className="zn-map-grid">
                  {/* Left Column: Drawing Tools */}
                  <div className="zn-map-sidebar">
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B' }}>How to draw?</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px', color: '#475569', lineHeight: '1.4' }}>
                      <div style={{ display: 'flex', gap: '6px' }}><span style={{ color: '#2a195c', fontWeight: 800 }}>1.</span> <span>Click on the map to add points on the boundary.</span></div>
                      <div style={{ display: 'flex', gap: '6px' }}><span style={{ color: '#2a195c', fontWeight: 800 }}>2.</span> <span>Continue adding points to outline the zone area.</span></div>
                      <div style={{ display: 'flex', gap: '6px' }}><span style={{ color: '#2a195c', fontWeight: 800 }}>3.</span> <span>Click on the first point to close the shape.</span></div>
                      <div style={{ display: 'flex', gap: '6px' }}><span style={{ color: '#2a195c', fontWeight: 800 }}>4.</span> <span>You can drag points to adjust the boundary.</span></div>
                    </div>

                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B', marginTop: '10px' }}>Drawing Tools</span>
                    <div className="zn-tools-list">
                      <button className={`zn-tool-btn ${activeTool === 'move' ? 'active' : ''}`} onClick={() => setActiveTool('move')}>
                        <div className="zn-tool-btn-l">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                          </svg>
                          <span>Select / View</span>
                        </div>
                        <span className="zn-tool-radio" />
                      </button>

                      <button className={`zn-tool-btn ${activeTool === 'polygon' ? 'active' : ''}`} onClick={() => setActiveTool('polygon')}>
                        <div className="zn-tool-btn-l">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                            <polygon points="12 2 22 8.5 22 19.5 12 22 2 19.5 2 8.5" />
                          </svg>
                          <span>Draw Polygon</span>
                        </div>
                        <span className="zn-tool-radio" />
                      </button>

                      <button className={`zn-tool-btn ${activeTool === 'circle' ? 'active' : ''}`} onClick={() => setActiveTool('circle')}>
                        <div className="zn-tool-btn-l">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                          <span>Draw Circle (4 Dots)</span>
                        </div>
                        <span className="zn-tool-radio" />
                      </button>

                      <button className={`zn-tool-btn ${activeTool === 'edit' ? 'active' : ''}`} onClick={() => setActiveTool('edit')}>
                        <div className="zn-tool-btn-l">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          <span>Edit Points</span>
                        </div>
                        <span className="zn-tool-radio" />
                      </button>
                    </div>

                    <button className="zn-btn" style={{ borderColor: '#EF4444', color: '#EF4444', marginTop: '10px', justifyContent: 'center' }} onClick={handleClearDrawing}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      <span>Clear Drawing</span>
                    </button>

                    <div className="zn-info-box" style={{ marginTop: 'auto', padding: '10px 12px' }}>
                      <span className="zn-info-box-ic" style={{ fontSize: '13px' }}>💡</span>
                      <span className="zn-info-box-txt" style={{ fontSize: '11px' }}>
                        Double click on the last point or click on the first point to close the polygon.
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Leaflet Map Viewport */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="zn-map-wrapper">
                      {/* Floating panels on map */}
                      <div className="zn-map-search" style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" style={{ minWidth: '14px' }}>
                          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input 
                          type="text" 
                          className="zn-map-search-input" 
                          placeholder="Search location..." 
                          value={mapSearchQuery} 
                          onChange={(e) => setMapSearchQuery(e.target.value)} 
                          onKeyDown={(e) => { if (e.key === 'Enter') handleMapSearch(); }}
                        />
                        <button 
                          onClick={handleMapSearch} 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: '#2a195c', padding: '2px 6px' }}
                        >
                          Go
                        </button>
                      </div>

                      <div className="zn-map-layers">
                        <button className="zn-map-layer-btn">📚 Layers</button>
                        <button className="zn-map-layer-btn">🚦 Traffic</button>
                      </div>

                      <div className="zn-map-controls">
                        <button className="zn-map-ctrl-btn" onClick={() => mapRef.current?.zoomIn()}>+</button>
                        <button className="zn-map-ctrl-btn" onClick={() => mapRef.current?.zoomOut()}>-</button>
                        <button className="zn-map-ctrl-btn" title="Center on Locality" onClick={() => {
                          const centerCoords = LOCALITY_COORDINATES[formData.locality] || { lat: 28.6315, lng: 77.2197 };
                          mapRef.current?.setView([centerCoords.lat, centerCoords.lng], 14);
                        }}>🎯</button>
                      </div>

                      {!leafletLoaded ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B', fontSize: '13px' }}>
                          Loading Map...
                        </div>
                      ) : (
                        <div id="new-zone-map" style={{ width: '100%', height: '100%' }} />
                      )}
                    </div>
                    <div className="zn-map-info-text">
                      Click on the map to add points. Click on the first point (or double click) to close the polygon.
                    </div>
                  </div>
                </div>

                {/* Bottom summaries & coordinates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '20px', marginTop: '10px' }}>
                  {/* Summary Cards */}
                  <div className="zn-card" style={{ padding: '16px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 'bold', color: '#1E293B' }}>Current Zone Summary</span>
                    <div className="zn-stats-card" style={{ marginTop: '4px' }}>
                      <div className="zn-stats-row">
                        <div className="zn-stat-el">
                          <span className="zn-stat-lbl">Total Points</span>
                          <span className="zn-stat-val">{points.length}</span>
                        </div>
                        <div className="zn-stat-el">
                          <span className="zn-stat-lbl">Perimeter</span>
                          <span className="zn-stat-val">{formattedPerimeter}</span>
                        </div>
                        <div className="zn-stat-el">
                          <span className="zn-stat-lbl">Area</span>
                          <span className="zn-stat-val">{formattedArea}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coordinates boundary table */}
                  <div className="zn-card" style={{ padding: '16px' }}>
                    <div className="zn-coord-list-title">
                      <span>Zone Boundaries ({points.length} Points)</span>
                      {points.length > 0 && (
                        <button className="zn-btn" style={{ padding: '4px 10px', fontSize: '11px', height: '26px' }} onClick={handleCopyCoords}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 3 }}>
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          Copy Points
                        </button>
                      )}
                    </div>

                    <div className="zn-coord-box" style={{ marginTop: '8px' }}>
                      {points.length === 0 ? (
                        <span style={{ gridColumn: 'span 2', fontSize: '12px', color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>
                          No points plotted yet.
                        </span>
                      ) : (
                        points.map((p, idx) => (
                          <div key={idx} className="zn-coord-row">
                            <span>{idx+1}. &nbsp;{p.lat.toFixed(5)}, {p.lng.toFixed(5)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & CONFIRM */}
            {step === 3 && (
              <div className="zn-cols-layout-step3">
                {/* Left Panel: Zone Summary details */}
                <div className="zn-review-card">
                  <span className="zn-card-title" style={{ borderBottom: 'none', paddingBottom: 0 }}>Zone Summary</span>
                  <span className="zn-card-subtitle" style={{ margin: 0 }}>Please review all the information before saving the zone.</span>
                  
                  <div className="zn-review-sec">
                    <span className="zn-review-sec-title">Location Hierarchy</span>
                    <div className="zn-review-list">
                      <div className="zn-review-row">
                        <span className="zn-review-lbl">🇮🇳 Country</span>
                        <span className="zn-review-val">{formData.country}</span>
                      </div>
                      <div className="zn-review-row">
                        <span className="zn-review-lbl">📍 State</span>
                        <span className="zn-review-val">{formData.state}</span>
                      </div>
                      <div className="zn-review-row">
                        <span className="zn-review-lbl">🏢 City</span>
                        <span className="zn-review-val">{formData.city}</span>
                      </div>
                      <div className="zn-review-row">
                        <span className="zn-review-lbl">🗺️ Area / Locality</span>
                        <span className="zn-review-val">{formData.locality}</span>
                      </div>
                    </div>
                  </div>

                  <div className="zn-review-sec">
                    <span className="zn-review-sec-title">Zone Information</span>
                    <div className="zn-review-list">
                      <div className="zn-review-row">
                        <span className="zn-review-lbl">Zone Name</span>
                        <span className="zn-review-val">{formData.name}</span>
                      </div>
                      <div className="zn-review-row">
                        <span className="zn-review-lbl">Zone Type</span>
                        <span className="zn-review-val">{formData.type}</span>
                      </div>
                      <div className="zn-review-row">
                        <span className="zn-review-lbl">Zone Status</span>
                        <span className="zn-review-val">🟢 Active</span>
                      </div>
                      {formData.description && (
                        <div className="zn-review-row">
                          <span className="zn-review-lbl">Description</span>
                          <span className="zn-review-val" style={{ maxWidth: '180px', fontSize: '11.5px', color: '#64748B' }}>{formData.description}</span>
                        </div>
                      )}
                      {formData.map_link && (
                        <div className="zn-review-row">
                          <span className="zn-review-lbl">Exact Zone Map Link</span>
                          <span className="zn-review-val">
                            <a href={formData.map_link} target="_blank" rel="noreferrer" className="zn-review-link">
                              Link 🔗
                            </a>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="zn-review-sec">
                    <span className="zn-review-sec-title">Zone Statistics</span>
                    <div className="zn-review-list">
                      <div className="zn-review-row">
                        <span className="zn-review-lbl">Total Points</span>
                        <span className="zn-review-val">{points.length}</span>
                      </div>
                      <div className="zn-review-row">
                        <span className="zn-review-lbl">Perimeter</span>
                        <span className="zn-review-val">{formattedPerimeter}</span>
                      </div>
                      <div className="zn-review-row">
                        <span className="zn-review-lbl">Area</span>
                        <span className="zn-review-val">{formattedArea}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Map Preview & coordinates table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="zn-card" style={{ padding: '20px' }}>
                    <span className="zn-card-title">Zone Map Preview</span>
                    <div className="zn-map-wrapper" style={{ minHeight: '340px' }}>
                      <div className="zn-map-layers">
                        <button className="zn-map-layer-btn">📚 Layers</button>
                        <button className="zn-map-layer-btn">🚦 Traffic</button>
                      </div>

                      <div className="zn-map-controls">
                        <button className="zn-map-ctrl-btn" onClick={() => mapRef.current?.zoomIn()}>+</button>
                        <button className="zn-map-ctrl-btn" onClick={() => mapRef.current?.zoomOut()}>-</button>
                        <button className="zn-map-ctrl-btn" style={{ fontSize: '13px' }}>🖥️</button>
                      </div>

                      {!leafletLoaded ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B', fontSize: '13px' }}>
                          Loading Preview Map...
                        </div>
                      ) : (
                        <div id="preview-zone-map" style={{ width: '100%', height: '100%' }} />
                      )}
                    </div>
                  </div>

                  <div className="zn-card" style={{ padding: '20px' }}>
                    <div className="zn-coord-list-title">
                      <span>Zone Boundaries ({points.length} Points)</span>
                      <button className="zn-btn" style={{ padding: '4px 10px', fontSize: '11px', height: '26px' }} onClick={handleCopyCoords}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 3 }}>
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy Points
                      </button>
                    </div>

                    <div className="zn-coord-box" style={{ marginTop: '10px' }}>
                      {points.map((p, idx) => (
                        <div key={idx} className="zn-coord-row">
                          <span>{idx+1}. &nbsp;{p.lat.toFixed(5)}, {p.lng.toFixed(5)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom info disclaimer banner */}
            {step === 3 && (
              <div className="zn-info-box" style={{ background: '#F5F3FF', borderColor: '#C7D2FE', padding: '12px 16px' }}>
                <span className="zn-info-box-ic" style={{ fontSize: '16px' }}>ℹ️</span>
                <span className="zn-info-box-txt" style={{ fontSize: '12px', color: '#4338CA' }}>
                  Please review all the information carefully. Once saved, the zone will be available in the zone list and can be managed from the Zone Management section.
                </span>
              </div>
            )}

            {/* Bottom Navigation buttons for all steps */}
            <div className="zn-btn-row">
              {step === 1 && (
                <>
                  <Link href="/zones" className="zn-btn" style={{ borderColor: '#EF4444', color: '#EF4444' }}>
                    Cancel
                  </Link>
                  <button className="zn-btn zn-btn-primary" onClick={nextStep}>
                    Next: Draw Geo Fence
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <button className="zn-btn" onClick={prevStep}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back: Zone Details
                  </button>
                  <button className="zn-btn zn-btn-primary" onClick={nextStep} disabled={points.length < 3}>
                    Next: Review & Confirm
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </>
              )}
              {step === 3 && (
                <>
                  <button className="zn-btn" onClick={prevStep}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back: Draw Geo Fence
                  </button>
                  <button className="zn-btn zn-btn-primary" onClick={handleSubmit}>
                    Save Zone
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
