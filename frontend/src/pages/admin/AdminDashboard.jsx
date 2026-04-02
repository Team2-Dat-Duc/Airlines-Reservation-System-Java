import { useState, useEffect,useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard'); 
    const [stats, setStats] = useState(null);
    const [listData, setListData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showFlightModal, setShowFlightModal] = useState(false);
    const [editingFlightId, setEditingFlightId] = useState(null);
    const [flightForm, setFlightForm] = useState({
        name: '', aircraft: 'Airbus A321', flightNumber: '', dep: '', arr: '', depTime: '', arrTime: '', depDate: '', price: 0
    });

    const fetchWithAuth = useCallback(async (method, url, data = null) => {
        try {
            return await axiosClient({ method, url, data });
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError("Truy cập từ chối. Chỉ dành cho Admin.");
                setTimeout(() => navigate('/'), 3000);
            }
            throw err;
        }
    }, [navigate]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                if (activeTab === 'dashboard') setStats(await fetchWithAuth('get', '/admin/dashboard'));
                else if (activeTab === 'flights') setListData(await fetchWithAuth('get', '/admin/flights'));
                else if (activeTab === 'bookings') setListData(await fetchWithAuth('get', '/admin/bookings'));
                else if (activeTab === 'users') setListData(await fetchWithAuth('get', '/admin/users'));
            } catch (err) { console.error(err); } 
            finally { setIsLoading(false); }
        };
        loadData();
    }, [activeTab, fetchWithAuth]); 

    const openAddModal = () => {
        setEditingFlightId(null);
        setFlightForm({ name: '', aircraft: 'Airbus A321', flightNumber: '', dep: '', arr: '', depTime: '', arrTime: '', depDate: '', price: 0 });
        setShowFlightModal(true);
    };

    const openEditModal = (flight) => {
        setEditingFlightId(flight._id);
        setFlightForm({ ...flight });
        setShowFlightModal(true);
    };

    const handleSaveFlight = async (e) => {
        e.preventDefault();
        try {
           
            const payload = {
                ...flightForm,
                seats: editingFlightId ? flightForm.seats : {
                    economyLite: { total: 50, booked: 0, priceAddOn: 0, baggage: '7kg Cabin' },
                    economyStandard: { total: 100, booked: 0, priceAddOn: 30, baggage: '20kg Checked' },
                    business: { total: 20, booked: 0, priceAddOn: 150, baggage: '40kg Checked' }
                }
            };

            if (editingFlightId) {
                const updated = await fetchWithAuth('put', `/admin/flights/${editingFlightId}`, payload);
                setListData(listData.map(f => f._id === editingFlightId ? updated : f));
                alert("Cập nhật thành công!");
            } else {
                const created = await fetchWithAuth('post', '/admin/flights', payload);
                setListData([created, ...listData]);
                alert("Thêm chuyến bay thành công!");
            }
            setShowFlightModal(false);
        } catch  { alert("Lỗi lưu chuyến bay"); }
    };

    const handleDeleteFlight = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa chuyến bay này?")) return;
        try {
            await fetchWithAuth('delete', `/admin/flights/${id}`);
            setListData(listData.filter(f => f._id !== id));
        } catch { alert("Lỗi xóa chuyến bay"); }
    };

    const handleForceCancel = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn ép hủy vé này không? Hệ thống sẽ nhả ghế cho người khác.")) return;
        try {
            await fetchWithAuth('put', `/admin/bookings/${id}/cancel`);
            setListData(listData.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b));
            alert("Đã hủy vé thành công!");
        } catch (err) { alert(err.response?.data?.message || "Lỗi hủy vé"); }
    };

    const handleToggleRole = async (id) => {
        if (!window.confirm("Thay đổi quyền (Admin <-> User) của người này?")) return;
        try {
            const res = await fetchWithAuth('put', `/admin/users/${id}/role`);
            setListData(listData.map(u => u._id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u));
            alert(res.message);
        } catch  { alert("Lỗi đổi quyền"); }
    };

    const pieData = [
        { name: 'Vé Hoàn Thành', value: stats?.totalBookings || 10, color: '#10b981' },
        { name: 'Vé Hủy', value: 2, color: '#ef4444' }
    ];
    const barData = [
        { name: 'T2', DoanhThu: 1200 }, { name: 'T3', DoanhThu: 1900 }, { name: 'T4', DoanhThu: 1500 },
        { name: 'T5', DoanhThu: 2200 }, { name: 'T6', DoanhThu: 3000 }, { name: 'T7', DoanhThu: 4500 }, { name: 'CN', DoanhThu: stats?.totalRevenue || 5000 }
    ];

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed': return <span className="badge bg-success">Confirmed</span>;
            case 'Pending': return <span className="badge bg-warning text-dark">Pending</span>;
            case 'Cancelled': return <span className="badge bg-danger">Cancelled</span>;
            case 'Completed': return <span className="badge bg-primary">Completed</span>;
            default: return <span className="badge bg-secondary">{status}</span>;
        }
    };

    const pageStyles = `
        body { background-color: #f1f5f9; }
        .admin-layout { display: flex; height: 100vh; overflow: hidden; }
        .admin-sidebar { width: 260px; background: #0b1a2d; color: #fff; display: flex; flex-direction: column; }
        .sidebar-brand { padding: 20px; font-size: 24px; font-weight: 900; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); letter-spacing: 2px;}
        .sidebar-brand span { color: #e11d48; }
        .sidebar-nav { padding: 20px 0; flex: 1; overflow-y: auto;}
        .nav-item { padding: 15px 25px; display: flex; align-items: center; gap: 15px; color: #cbd5e1; font-weight: 600; cursor: pointer; transition: 0.3s; border-left: 4px solid transparent; }
        .nav-item:hover, .nav-item.active { background: rgba(225, 29, 72, 0.1); color: #fff; border-left-color: #e11d48; }
        
        .admin-main { flex: 1; padding: 30px; overflow-y: auto; background: #f8fafc; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.02);}
        .admin-header h2 { margin: 0; font-weight: 800; color: #1e293b; text-transform: uppercase; font-size: 20px; letter-spacing: 1px;}
        
        .stat-card { background: #fff; border-radius: 12px; padding: 25px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #e2e8f0; border-left: 4px solid #10b981;}
        .stat-card:nth-child(2) { border-left-color: #0284c7; } .stat-card:nth-child(3) { border-left-color: #ca8a04; } .stat-card:nth-child(4) { border-left-color: #9333ea; }
        .stat-info h5 { color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
        .stat-info h3 { color: #0f172a; font-size: 28px; font-weight: 900; margin: 0; }
        .stat-icon { width: 50px; height: 50px; border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 22px; }
        .icon-revenue { background: #dcfce7; color: #16a34a; } .icon-bookings { background: #e0f2fe; color: #0284c7; }
        
        .data-card { background: #fff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #e2e8f0; margin-bottom: 30px;}
        .table th { color: #64748b; font-weight: 700; font-size: 13px; text-transform: uppercase; padding: 15px; background: #f8fafc; border-bottom: 2px solid #e2e8f0;}
        .table td { padding: 15px; vertical-align: middle; color: #334155; font-weight: 500; border-bottom: 1px solid #f1f5f9;}
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(11, 26, 45, 0.8); z-index: 9999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px);}
        .custom-modal { background: #fff; width: 100%; max-width: 600px; border-radius: 12px; padding: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto;}
    `;

    if (error) return <div className="text-center mt-5"><h3>{error}</h3></div>;

    return (
        <>
            <style>{pageStyles}</style>
            <div className="admin-layout">
               
                <div className="admin-sidebar">
                    <div className="sidebar-brand">ARISO<span>.ADMIN</span></div>
                    <div className="sidebar-nav">
                        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><i className="fa-solid fa-chart-pie"></i> Tổng quan</div>
                        <div className={`nav-item ${activeTab === 'flights' ? 'active' : ''}`} onClick={() => setActiveTab('flights')}><i className="fa-solid fa-plane"></i> Chuyến bay</div>
                        <div className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}><i className="fa-solid fa-ticket"></i> Đơn vé</div>
                        <div className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}><i className="fa-solid fa-users"></i> Khách hàng</div>
                    </div>
                    <div className="mt-auto p-3">
                        <Link to="/" className="btn btn-outline-light w-100"><i className="fa-solid fa-arrow-left me-2"></i> Trở về Website</Link>
                    </div>
                </div>

                <div className="admin-main">
                    <div className="admin-header">
                        <h2>{activeTab.toUpperCase()}</h2>
                        <span className="badge bg-danger px-3 py-2 fs-6">Quyền: Quản trị viên</span>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-5"><i className="fa-solid fa-circle-notch fa-spin fs-1 text-danger"></i></div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && stats && (
                                <>
                                    <div className="row g-4 mb-4">
                                        <div className="col-xl-3 col-md-6"><div className="stat-card"><div className="stat-info"><h5>Doanh Thu</h5><h3>${stats.totalRevenue?.toFixed(2)}</h3></div><div className="stat-icon icon-revenue"><i className="fa-solid fa-sack-dollar"></i></div></div></div>
                                        <div className="col-xl-3 col-md-6"><div className="stat-card"><div className="stat-info"><h5>Đã Đặt</h5><h3>{stats.totalBookings}</h3></div><div className="stat-icon icon-bookings"><i className="fa-solid fa-ticket"></i></div></div></div>
                                        <div className="col-xl-3 col-md-6"><div className="stat-card"><div className="stat-info"><h5>Chuyến Bay</h5><h3>{stats.totalFlights}</h3></div><div className="stat-icon" style={{background:'#fef08a', color:'#ca8a04'}}><i className="fa-solid fa-plane"></i></div></div></div>
                                        <div className="col-xl-3 col-md-6"><div className="stat-card"><div className="stat-info"><h5>Người dùng</h5><h3>{stats.totalUsers}</h3></div><div className="stat-icon" style={{background:'#f3e8ff', color:'#9333ea'}}><i className="fa-solid fa-users"></i></div></div></div>
                                    </div>

                                    <div className="row g-4 mb-4">
                                        <div className="col-lg-8">
                                            <div className="data-card h-100">
                                                <h5 className="fw-bold mb-4">Biểu đồ Doanh Thu Tuần Này</h5>
                                             
                                                <div style={{ height: '300px', width: '100%', minWidth: 0 }}>
                                                    <ResponsiveContainer width="99%" height="100%">
                                                        <BarChart data={barData}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <XAxis dataKey="name" />
                                                            <YAxis />
                                                            <RechartsTooltip cursor={{fill: 'rgba(225, 29, 72, 0.05)'}} />
                                                            <Bar dataKey="DoanhThu" fill="#e11d48" radius={[4, 4, 0, 0]} barSize={40} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="data-card h-100">
                                                <h5 className="fw-bold mb-4 text-center">Tỉ Lệ Đơn Vé</h5>
                                                <div style={{ height: '250px', width: '100%', minWidth: 0 }}>
                                                    <ResponsiveContainer width="99%" height="100%">
                                                        <PieChart>
                                                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                                            </Pie>
                                                            <RechartsTooltip />
                                                            <Legend verticalAlign="bottom" height={36}/>
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'flights' && (
                                <div className="data-card">
                                    <div className="d-flex justify-content-between mb-4">
                                        <h4 className="fw-bold m-0">Quản lý Lịch Bay</h4>
                                        <button className="btn btn-danger fw-bold shadow-sm" onClick={openAddModal}>
                                            <i className="fa-solid fa-plus me-2"></i>Thêm Chuyến Bay
                                        </button>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead><tr><th>Hãng / Mã</th><th>Hành trình</th><th>Giờ Bay</th><th>Giá Cơ Bản</th><th>Hành động</th></tr></thead>
                                            <tbody>
                                                {listData.map(f => (
                                                    <tr key={f._id}>
                                                        <td><span className="fw-bold text-dark">{f.name}</span><br/><small className="text-muted">{f.flightNumber || 'AS-102'}</small></td>
                                                        <td><span className="badge bg-light text-primary border">{f.dep}</span> ➔ <span className="badge bg-light text-primary border">{f.arr}</span></td>
                                                        <td><span className="fw-bold text-danger">{f.depTime}</span><br/><small className="text-muted">{f.depDate}</small></td>
                                                        <td className="fw-bold text-success">${f.price}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-light border text-primary me-2" onClick={() => openEditModal(f)}><i className="fa-solid fa-pen"></i></button>
                                                            <button className="btn btn-sm btn-light border text-danger" onClick={() => handleDeleteFlight(f._id)}><i className="fa-solid fa-trash"></i></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'bookings' && (
                                <div className="data-card">
                                    <h4 className="fw-bold mb-4">Danh sách Khách đặt vé</h4>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead><tr><th>PNR</th><th>Khách hàng</th><th>Chuyến bay</th><th>Tổng tiền</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
                                            <tbody>
                                                {listData.map(b => (
                                                    <tr key={b._id}>
                                                        <td><span className="fw-bold fs-5 text-dark">{b.pnr}</span></td>
                                                        <td><span className="fw-bold">{b.contact?.lastName} {b.contact?.firstName}</span><br/><small className="text-muted">{b.contact?.phone || b.contact?.email}</small></td>
                                                        <td><span className="fw-bold">{b.flightDetails?.dep} ➔ {b.flightDetails?.arr}</span><br/><small className="text-muted">{b.flightDetails?.depDate}</small></td>
                                                        <td className="text-danger fw-bold fs-5">${b.totalPrice?.toFixed(2)}</td>
                                                        <td>{getStatusBadge(b.status)}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-danger fw-bold" disabled={b.status === 'Cancelled'} onClick={() => handleForceCancel(b._id)}>
                                                                <i className="fa-solid fa-ban me-1"></i> Ép Hủy
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div className="data-card">
                                    <h4 className="fw-bold mb-4">Quản trị viên & Khách hàng</h4>
                                    <table className="table table-hover">
                                        <thead><tr><th>Họ Tên</th><th>Email</th><th>Ngày đăng ký</th><th>Quyền hạn</th><th>Cấp quyền</th></tr></thead>
                                        <tbody>
                                            {listData.map(u => (
                                                <tr key={u._id}>
                                                    <td className="fw-bold text-dark">{u.name}</td>
                                                    <td>{u.email}</td>
                                                    <td>{formatDate(u.createdAt)}</td>
                                                    <td>{u.role === 'admin' ? <span className="badge bg-danger">ADMIN</span> : <span className="badge bg-secondary">User</span>}</td>
                                                    <td>
                                                        <button className={`btn btn-sm fw-bold ${u.role === 'admin' ? 'btn-outline-secondary' : 'btn-outline-success'}`} onClick={() => handleToggleRole(u._id)}>
                                                            <i className={`fa-solid ${u.role === 'admin' ? 'fa-user-minus' : 'fa-user-shield'} me-1`}></i> 
                                                            {u.role === 'admin' ? 'Hạ cấp User' : 'Phong Admin'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {showFlightModal && (
                <div className="modal-overlay">
                    <div className="custom-modal">
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                            <h4 className="fw-bold text-dark m-0">{editingFlightId ? 'Chỉnh Sửa Chuyến Bay' : 'Tạo Chuyến Bay Mới'}</h4>
                            <button className="btn-close" onClick={() => setShowFlightModal(false)}></button>
                        </div>
                        <form onSubmit={handleSaveFlight}>
                            <div className="row g-3">
                                <div className="col-md-6"><label className="form-label small fw-bold">Hãng Bay</label><input required className="form-control" value={flightForm.name} onChange={e => setFlightForm({...flightForm, name: e.target.value})} placeholder="VD: Ariso Airways" /></div>
                                <div className="col-md-6"><label className="form-label small fw-bold">Mã chuyến bay</label><input required className="form-control" value={flightForm.flightNumber} onChange={e => setFlightForm({...flightForm, flightNumber: e.target.value})} placeholder="VD: AS-102" /></div>
                                <div className="col-md-6"><label className="form-label small fw-bold">Nơi đi (Mã sân bay)</label><input required className="form-control" value={flightForm.dep} onChange={e => setFlightForm({...flightForm, dep: e.target.value.toUpperCase()})} placeholder="VD: HAN" /></div>
                                <div className="col-md-6"><label className="form-label small fw-bold">Nơi đến (Mã sân bay)</label><input required className="form-control" value={flightForm.arr} onChange={e => setFlightForm({...flightForm, arr: e.target.value.toUpperCase()})} placeholder="VD: SGN" /></div>
                                <div className="col-md-4"><label className="form-label small fw-bold">Ngày Bay</label><input required type="date" className="form-control" value={flightForm.depDate} onChange={e => setFlightForm({...flightForm, depDate: e.target.value})} /></div>
                                <div className="col-md-4"><label className="form-label small fw-bold">Giờ cất cánh</label><input required type="time" className="form-control" value={flightForm.depTime} onChange={e => setFlightForm({...flightForm, depTime: e.target.value})} /></div>
                                <div className="col-md-4"><label className="form-label small fw-bold">Giờ hạ cánh</label><input required type="time" className="form-control" value={flightForm.arrTime} onChange={e => setFlightForm({...flightForm, arrTime: e.target.value})} /></div>
                                <div className="col-md-12"><label className="form-label small fw-bold">Giá vé cơ bản (USD)</label><input required type="number" className="form-control" value={flightForm.price} onChange={e => setFlightForm({...flightForm, price: Number(e.target.value)})} /></div>
                            </div>
                            <div className="mt-4 pt-3 border-top text-end">
                                <button type="button" className="btn btn-light border me-2" onClick={() => setShowFlightModal(false)}>Hủy</button>
                                <button type="submit" className="btn btn-danger fw-bold px-4">Lưu Chuyến Bay</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}