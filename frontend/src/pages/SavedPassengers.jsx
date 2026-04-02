import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function SavedPassengers() {
    const navigate = useNavigate();
    const [passengers, setPassengers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: 'Adult',
        title: 'Mr',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nationality: 'Vietnam'
    });

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    useEffect(() => {
        const fetchPassengers = async () => {
            try {
                const res = await axiosClient.get('/users/passengers');
                setPassengers(res);
            } catch (err) {
                console.error("Lỗi tải danh sách hành khách:", err);
                if (err.response?.status === 401) navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPassengers();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await axiosClient.post('/users/passengers', formData);
            setPassengers(res.savedPassengers);
            setShowForm(false); 
        
            setFormData({ type: 'Adult', title: 'Mr', firstName: '', lastName: '', dateOfBirth: '', nationality: 'Vietnam' });
            alert("Thêm hành khách thành công!");
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi thêm hành khách');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa hành khách này?")) return;
        try {
            const res = await axiosClient.delete(`/users/passengers/${id}`);
            setPassengers(res.savedPassengers);
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi xóa hành khách');
        }
    };

    const pageStyles = `
        .profile-wrapper { padding: 60px 0; background: #f8fafc; min-height: 100vh; }
        
        .sidebar-card { background: #fff; border-radius: 12px; border: 1px solid #eaeaea; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .sidebar-menu { list-style: none; padding: 0; margin: 0; }
        .sidebar-menu li a { display: block; padding: 15px 25px; color: #0b1a2d; font-weight: 600; transition: 0.3s; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; text-decoration: none;}
        .sidebar-menu li a:hover, .sidebar-menu li a.active { background: #fff1f2; color: #e11d48; border-left: 4px solid #e11d48; padding-left: 21px; }
        .sidebar-menu li a i { width: 20px; text-align: center; }
        .avatar-circle { width: 80px; height: 80px; border-radius: 50%; background: #e11d48; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: bold; margin: 0 auto;}
        
        .content-card { background: #fff; border-radius: 12px; border: 1px solid #eaeaea; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .content-header { border-bottom: 1px solid #eaeaea; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;}
        .content-header h3 { font-weight: 700; margin: 0; color: #0b1a2d; }
        .content-header p { margin: 5px 0 0 0; color: #666; font-size: 14px; }
        
        .passenger-list { display: grid; gap: 15px; }
        .passenger-item { background: #f8fafc; border: 1px solid #eaeaea; border-radius: 10px; padding: 20px; display: flex; justify-content: space-between; align-items: center; transition: 0.3s; }
        .passenger-item:hover { border-color: #10b981; box-shadow: 0 5px 15px rgba(16, 185, 129, 0.05); }
        .passenger-info h5 { margin: 0 0 5px 0; font-weight: 700; color: #0b1a2d; }
        .passenger-info p { margin: 0; font-size: 13px; color: #666; }
        .passenger-badge { background: #e2e8f0; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; color: #334155; margin-left: 10px; }
        
        .custom-input { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; transition: 0.3s; background: #fff; }
        .custom-input:focus { border-color: #e11d48; outline: none; box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1); }
        .form-label { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 8px; }
    `;

    return (
        <>
            <style>{pageStyles}</style>

            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper text-center">
                        <h2 className="text-white mb-15">Saved Passengers</h2>
                        <nav>
                            <ol className="breadcrumb justify-content-center">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active">Saved Passengers</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

            <section className="profile-wrapper">
                <div className="container">
                    <div className="row">
                        
                        <div className="col-lg-4 col-xl-3 mb-4">
                            <div className="sidebar-card">
                                <div className="p-4 text-center border-bottom bg-light">
                                    <div className="avatar-circle mb-3" style={{width:'60px', height:'60px', fontSize:'24px'}}>
                                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <h6 className="fw-bold m-0">{currentUser.name}</h6>
                                    <small className="text-muted">{currentUser.email}</small>
                                </div>
                                <ul className="sidebar-menu">
                                    <li><Link to="/profile"><i className="fa-solid fa-id-badge"></i> Personal Info</Link></li>
                                    <li><Link to="/my-trips"><i className="fa-solid fa-plane-departure"></i> My Trips</Link></li>
                                    <li><Link to="/saved-passengers" className="active"><i className="fa-solid fa-users"></i> Saved Passengers</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-8 col-xl-9">
                            <div className="content-card">
                                <div className="content-header">
                                    <div>
                                        <h3>Saved Passengers</h3>
                                        <p>Save details of your travel companions to book faster next time.</p>
                                    </div>
                                    <button className="tn-btn tn-btn__red px-4 py-2" onClick={() => setShowForm(!showForm)}>
                                        {showForm ? 'Cancel' : '+ Add New'}
                                    </button>
                                </div>

                                {showForm && (
                                    <div className="mb-4 p-4 border rounded" style={{ background: '#f8fafc' }}>
                                        <h5 className="fw-bold mb-3">Add New Passenger</h5>
                                        <form onSubmit={handleSubmit}>
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <label className="form-label">Passenger Type *</label>
                                                    <select name="type" className="custom-input" value={formData.type} onChange={handleChange} required>
                                                        <option value="Adult">Adult (12+ yrs)</option>
                                                        <option value="Child">Child (2-11 yrs)</option>
                                                        <option value="Infant">Infant (0-2 yrs)</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="form-label">Title *</label>
                                                    <select name="title" className="custom-input" value={formData.title} onChange={handleChange} required>
                                                        {formData.type === 'Adult' ? (
                                                            <><option>Mr</option><option>Mrs</option><option>Ms</option></>
                                                        ) : (
                                                            <><option>Mstr</option><option>Miss</option></>
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Nationality *</label>
                                                    <select name="nationality" className="custom-input" value={formData.nationality} onChange={handleChange} required>
                                                        <option value="Vietnam">Vietnam</option>
                                                        <option value="United States">United States</option>
                                                        <option value="Singapore">Singapore</option>
                                                        <option value="Japan">Japan</option>
                                                    </select>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">First & Middle Name *</label>
                                                    <input type="text" name="firstName" className="custom-input" placeholder="As on ID/Passport" value={formData.firstName} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Last Name *</label>
                                                    <input type="text" name="lastName" className="custom-input" placeholder="As on ID/Passport" value={formData.lastName} onChange={handleChange} required />
                                                </div>
                                                
                                                <div className="col-md-6">
                                                    <label className="form-label">Date of Birth *</label>
                                                    <input type="date" name="dateOfBirth" className="custom-input" value={formData.dateOfBirth} onChange={handleChange} required />
                                                </div>

                                                <div className="col-12 mt-3 text-end">
                                                    <button type="submit" className="tn-btn tn-btn__red border-0 px-4 py-2" disabled={isSaving}>
                                                        {isSaving ? 'Saving...' : 'Save Passenger'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {isLoading ? (
                                    <div className="text-center py-4"><i className="fa-solid fa-spinner fa-spin fs-2 text-danger"></i></div>
                                ) : passengers.length === 0 && !showForm ? (
                                    <div className="text-center py-5">
                                        <i className="fa-solid fa-users fs-1 text-muted mb-3"></i>
                                        <p className="text-muted">No saved passengers yet.</p>
                                    </div>
                                ) : (
                                    <div className="passenger-list">
                                        {passengers.map((p) => (
                                            <div className="passenger-item" key={p._id}>
                                                <div className="passenger-info">
                                                    <h5>{p.title}. {p.firstName} {p.lastName} <span className="passenger-badge">{p.type}</span></h5>
                                                    <p><i className="fa-regular fa-calendar-days me-1"></i> DOB: {p.dateOfBirth} <span className="mx-2">|</span> <i className="fa-solid fa-earth-americas me-1"></i> {p.nationality}</p>
                                                </div>
                                                <div>
                                                    <button className="btn btn-outline-danger btn-sm px-3" onClick={() => handleDelete(p._id)}>
                                                        <i className="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}