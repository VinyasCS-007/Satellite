import React, { useEffect, useState } from 'react';
import SatelliteViewer from './components/SatelliteViewer';
import nasaLogo from './logo192.png';
import './App.css';
import axios from 'axios';
import DarkModeToggle from './components/DarkModeToggle';

window.CESIUM_BASE_URL = "/Cesium/";

function App() {
  const [collisions, setCollisions] = useState([]);
  const [satellites, setSatellites] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', norad_id: '', tle_line1: '', tle_line2: '', color: '' });
  const [addError, setAddError] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', norad_id: '', tle_line1: '', tle_line2: '' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const satellitesPerPage = 5;

  // Advanced filter state
  const [filterNorad, setFilterNorad] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  // Add state for warning popup
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    axios.get('/api/satellites/')
      .then(res => setSatellites(res.data))
      .catch(() => setSatellites([]));
    axios.get('/api/predict-collisions/')
      .then(res => setCollisions(res.data.collisions || []))
      .catch(() => setCollisions([]));
  }, []);

  const handleAddSatellite = (e) => {
    e.preventDefault();
    setAddError('');
    axios.post('/api/satellites/', addForm)
      .then(res => {
        axios.get('/api/satellites/')
          .then(res => setSatellites(res.data));
        setShowAddForm(false);
        setAddForm({ name: '', norad_id: '', tle_line1: '', tle_line2: '', color: '' });
      })
      .catch(() => setAddError('Failed to add satellite.'));
  };

  const handleDeleteSatellite = (id) => {
    axios.delete(`/api/satellites/${id}/`)
      .then(() => setSatellites(prev => prev.filter(sat => sat.id !== id)))
      .catch(() => alert('Failed to delete satellite.'));
  };

  // Advanced filtering
  const filteredSatellites = satellites.filter(sat => {
    const nameMatch = sat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const noradMatch = filterNorad ? String(sat.norad_id).includes(filterNorad) : true;
    let dateMatch = true;
    if (filterDateFrom) {
      dateMatch = dateMatch && new Date(sat.last_updated) >= new Date(filterDateFrom);
    }
    if (filterDateTo) {
      dateMatch = dateMatch && new Date(sat.last_updated) <= new Date(filterDateTo);
    }
    return nameMatch && noradMatch && dateMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSatellites.length / satellitesPerPage);
  const paginatedSatellites = filteredSatellites.slice((currentPage-1)*satellitesPerPage, currentPage*satellitesPerPage);

  // Confirmation dialog logic
  const openConfirm = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirm(true);
  };
  const handleConfirm = () => {
    if (confirmAction) confirmAction();
    setShowConfirm(false);
  };
  const handleCancelConfirm = () => {
    setShowConfirm(false);
    setConfirmAction(null);
    setConfirmMessage("");
  };

  // Edit satellite handlers
  const startEdit = (sat) => {
    setEditId(sat.id);
    setEditForm({
      name: sat.name,
      norad_id: sat.norad_id,
      tle_line1: sat.tle_line1,
      tle_line2: sat.tle_line2
    });
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ name: '', norad_id: '', tle_line1: '', tle_line2: '' });
  };
  const handleEditChange = (e) => {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    openConfirm('Save changes to this satellite?', () => {
      axios.put(`/api/satellites/${editId}/`, editForm)
        .then(() => {
          axios.get('/api/satellites/').then(res => setSatellites(res.data));
          cancelEdit();
        })
        .catch(() => alert('Failed to update satellite.'));
    });
  };
  const handleDelete = (id) => {
    openConfirm('Are you sure you want to delete this satellite?', () => {
      axios.delete(`/api/satellites/${id}/`)
        .then(() => setSatellites(prev => prev.filter(sat => sat.id !== id)))
        .catch(() => alert('Failed to delete satellite.'));
    });
  };

  // Analytics
  const totalSatellites = satellites.length;
  const totalCollisions = collisions.length;
  const fastestSat = satellites.length > 0 ? satellites.reduce((max, sat) => (sat.speed && sat.speed > (max.speed || 0) ? sat : max), {}) : null;
  const avgAltitude = satellites.length > 0 ? (satellites.reduce((sum, sat) => sum + (sat.altitude || 0), 0) / satellites.length / 1000).toFixed(2) : 'N/A';

  // Assign a color to each satellite (deterministic by id)
  const satelliteColors = {};
  const colorPalette = [
    '#ff6e7f', '#2d8cf0', '#43a047', '#fc3d21', '#fbc02d', '#8e24aa', '#00bcd4', '#ff9800', '#3949ab', '#1976d2',
    '#e91e63', '#009688', '#cddc39', '#607d8b', '#795548', '#d84315', '#00c853', '#1de9b6', '#00bfae', '#ffb300'
  ];
  satellites.forEach((sat, idx) => {
    satelliteColors[sat.id] = colorPalette[idx % colorPalette.length];
  });

  return (
    <div className={`modern-app-container${darkMode ? ' dark' : ''}`}>
      <header className="modern-header nasa-app-bar">
        <img src={nasaLogo} alt="NASA Logo" className="nasa-logo" />
        <span className="nasa-title">Satellite Collision Predictor</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </header>
      <main className="modern-main-grid" style={{display: 'flex', flexDirection: 'column', gap: 24}}>
        <div style={{display: 'flex', gap: 24}}>
          <section className="modern-card analytics-panel fade-in-up" style={{flex: 1, minHeight: 220, maxHeight: 300, overflowY: 'auto'}}>
            <div className="analytics-title">Live Analytics</div>
            <div className="analytics-row">Total Satellites: <span className="analytics-badge">{totalSatellites}</span></div>
            <div className="analytics-row">Active Collisions: <span className={`analytics-badge${totalCollisions > 0 ? ' red' : ' green'}`}>{totalCollisions}</span></div>
            <div className="analytics-row">Average Altitude: <span className="analytics-badge yellow">{avgAltitude} km</span></div>
            {fastestSat && fastestSat.name && (
              <div className="analytics-row">Fastest Satellite: <span className="analytics-badge">{fastestSat.name}</span> <span style={{fontSize:13, color:'#888'}}>({fastestSat.speed?.toFixed(2)} m/s)</span></div>
            )}
            {/* Show added satellites */}
            <div style={{marginTop: 18}}>
              <div style={{fontWeight: 600, color: '#fff', marginBottom: 6}}>Added Satellites:</div>
              <ul style={{paddingLeft: 18, color: '#fff'}}>
                {satellites.length === 0 ? (
                  <li>No satellites added yet.</li>
                ) : (
                  satellites.map(sat => (
                    <li key={sat.id}>
                      <span style={{fontWeight: 500}}>{sat.name}</span> (NORAD: {sat.norad_id})
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>
          <section className="modern-card add-satellite-panel fade-in-up" style={{flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', minHeight: 220, maxHeight: 300, overflowY: 'auto'}}>
            <div className="analytics-title">Add Satellite</div>
            <button className="modern-btn" onClick={() => setShowAddForm(f => !f)} style={{marginTop: 12, marginBottom: 12}}>
              {showAddForm ? 'Cancel' : 'Add Satellite'}
            </button>
            {showAddForm && (
              <form onSubmit={handleAddSatellite} style={{display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap'}}>
                <input required placeholder="Name" value={addForm.name} onChange={e => setAddForm(f => ({...f, name: e.target.value}))} />
                <input required placeholder="NORAD ID" type="number" value={addForm.norad_id} onChange={e => setAddForm(f => ({...f, norad_id: e.target.value}))} />
                <input required placeholder="TLE Line 1" value={addForm.tle_line1} onChange={e => setAddForm(f => ({...f, tle_line1: e.target.value}))} />
                <input required placeholder="TLE Line 2" value={addForm.tle_line2} onChange={e => setAddForm(f => ({...f, tle_line2: e.target.value}))} />
                <select required value={addForm.color} onChange={e => setAddForm(f => ({...f, color: e.target.value}))} style={{padding:'8px 12px', borderRadius:6, border:'1px solid #b0bec5'}}>
                  <option value="" disabled>Choose Color</option>
                  {colorPalette.map(color => (
                    <option key={color} value={color} style={{background: color, color: '#fff'}}>{color}</option>
                  ))}
                </select>
                <button type="submit" className="modern-btn add-btn">Add</button>
                {addError && <div className="auth-error">{addError}</div>}
              </form>
            )}
          </section>
        </div>
        <section className="modern-card fade-in-up" style={{marginBottom: 24}}>
          <div className="analytics-title">Satellites Management</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap'}}>
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{padding: '6px 12px', borderRadius: 6, border: '1px solid #b0bec5', minWidth: 180}}
            />
            <input
              type="text"
              placeholder="Filter by NORAD ID"
              value={filterNorad}
              onChange={e => setFilterNorad(e.target.value)}
              style={{padding: '6px 12px', borderRadius: 6, border: '1px solid #b0bec5', minWidth: 120}}
            />
            <label style={{fontSize: '0.98em'}}>From:
              <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} style={{marginLeft: 4, marginRight: 8}} />
            </label>
            <label style={{fontSize: '0.98em'}}>To:
              <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} style={{marginLeft: 4}} />
            </label>
          </div>
          <table className="collision-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>NORAD ID</th>
                <th>TLE Line 1</th>
                <th>TLE Line 2</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSatellites.length === 0 ? (
                <tr><td colSpan={7} style={{textAlign:'center'}}>No satellites found.</td></tr>
              ) : paginatedSatellites.map(sat => (
                <tr key={sat.id}>
                  <td><span style={{display:'inline-block',width:18,height:18,borderRadius:'50%',background:satelliteColors[sat.id],border:'2px solid #fff'}}></span></td>
                  {editId === sat.id ? (
                    <>
                      <td><input name="name" value={editForm.name} onChange={handleEditChange} /></td>
                      <td><input name="norad_id" value={editForm.norad_id} onChange={handleEditChange} /></td>
                      <td><input name="tle_line1" value={editForm.tle_line1} onChange={handleEditChange} /></td>
                      <td><input name="tle_line2" value={editForm.tle_line2} onChange={handleEditChange} /></td>
                      <td>{sat.last_updated ? new Date(sat.last_updated).toLocaleString() : '-'}</td>
                      <td>
                        <button className="modern-btn" style={{marginRight: 6}} onClick={handleEditSubmit}>Save</button>
                        <button className="modern-btn" onClick={cancelEdit}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{sat.name}</td>
                      <td>{sat.norad_id}</td>
                      <td style={{fontSize: '0.95em'}}>{sat.tle_line1}</td>
                      <td style={{fontSize: '0.95em'}}>{sat.tle_line2}</td>
                      <td>{sat.last_updated ? new Date(sat.last_updated).toLocaleString() : '-'}</td>
                      <td>
                        <button className="modern-btn" style={{marginRight: 6}} onClick={() => startEdit(sat)}>Edit</button>
                        <button className="modern-btn" onClick={() => handleDelete(sat.id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:12, marginTop:16}}>
            <button className="modern-btn" disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)}>Prev</button>
            <span>Page {currentPage} of {totalPages || 1}</span>
            <button className="modern-btn" disabled={currentPage===totalPages || totalPages===0} onClick={()=>setCurrentPage(p=>p+1)}>Next</button>
          </div>
        </section>
        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className="modern-modal-overlay">
            <div className="modern-modal">
              <div style={{marginBottom:18}}>{confirmMessage}</div>
              <div style={{display:'flex', gap:12, justifyContent:'flex-end'}}>
                <button className="modern-btn" onClick={handleConfirm}>Yes</button>
                <button className="modern-btn" onClick={handleCancelConfirm}>No</button>
              </div>
            </div>
          </div>
        )}
        <div style={{display: 'flex', gap: 24}}>
          <section className="modern-card fade-in-up" style={{flex: 2, height: 600, overflowY: 'auto'}}>
            <SatelliteViewer satellites={satellites} collisions={collisions} darkMode={darkMode} onDeleteSatellite={handleDeleteSatellite} />
          </section>
          <section className="modern-card fade-in-up" style={{flex: 1, minWidth: 350, height: 600, overflowY: 'auto'}}>
            <div className="analytics-title">Collision Prediction Interface</div>
            <button className="modern-btn" style={{marginBottom: 16}} onClick={() => {
              setShowWarning(true);
            }}>Check Prediction</button>
            {collisions.length === 0 ? (
              <div>No predicted collisions at this time.</div>
            ) : (
              <table className="collision-table">
                <thead>
                  <tr>
                    <th>Satellite 1</th>
                    <th>Satellite 2</th>
                    <th>Distance (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {collisions.map((col, idx) => (
                    <tr key={idx}>
                      <td>{col.satellite1 || '-'}</td>
                      <td>{col.satellite2 || '-'}</td>
                      <td>{col.distance_km ? col.distance_km.toFixed(2) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
        {/* Warning Popup */}
        {showWarning && (
          <div className="modern-modal-overlay">
            <div className="modern-modal">
              <div style={{marginBottom:18, color:'#fc3d21', fontWeight:600}}>
                Warning: Satellite collision prediction may take a few seconds and could impact performance. Do you want to proceed?
              </div>
              <div style={{display:'flex', gap:12, justifyContent:'flex-end'}}>
                <button className="modern-btn" onClick={() => {
                  axios.get('/api/predict-collisions/')
                    .then(res => setCollisions(res.data.collisions || []))
                    .catch(() => setCollisions([]));
                  setShowWarning(false);
                }}>Yes, Proceed</button>
                <button className="modern-btn" onClick={() => setShowWarning(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;