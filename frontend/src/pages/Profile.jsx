import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Profile() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Other',
        address: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
          
                const res = await axiosClient.get('/users/profile');
                setFormData({
                    name: res.name || '',
                    email: res.email || '',
                    phone: res.phone || '',
                    dateOfBirth: res.dateOfBirth || '',
                    gender: res.gender || 'Other',
                    address: res.address || ''
                });
            } catch (err) {
                console.error("Lỗi tải profile:", err);
                if (err.response?.status === 401) {
                    navigate('/login'); 
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await axiosClient.put('/users/profile', formData);
            setMessage({ text: 'Cập nhật thông tin thành công!', type: 'success' });
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            const updatedUser = { ...currentUser, name: res.user?.name || formData.name };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('storage'));

        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Cập nhật thất bại!', type: 'danger' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const pageStyles = `
        .profile-wrapper { padding: 60px 0; background: #f8fafc; min-height: 100vh; }
        .sidebar-card { background: #fff; border-radius: 12px; border: 1px solid #eaeaea; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .sidebar-menu { list-style: none; padding: 0; margin: 0; }
        .sidebar-menu li a { display: block; padding: 15px 25px; color: #0b1a2d; font-weight: 600; transition: 0.3s; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; text-decoration: none;}
        .sidebar-menu li a:hover, .sidebar-menu li a.active { background: #fff1f2; color: #e11d48; border-left: 4px solid #e11d48; padding-left: 21px; }
        .sidebar-menu li a i { width: 20px; text-align: center; }
        
        .content-card { background: #fff; border-radius: 12px; border: 1px solid #eaeaea; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .content-header { border-bottom: 1px solid #eaeaea; padding-bottom: 20px; margin-bottom: 25px; }
        .content-header h3 { font-weight: 700; margin: 0; color: #0b1a2d; }
        .content-header p { margin: 5px 0 0 0; color: #666; font-size: 14px; }
        
        .custom-input { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; transition: 0.3s; background: #f8fafc; }
        .custom-input:focus { border-color: #e11d48; outline: none; box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1); background: #fff;}
        .custom-input:disabled { background: #e2e8f0; cursor: not-allowed; color: #666;}
        .form-label { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 8px; }
        
        .avatar-circle { width: 80px; height: 80px; border-radius: 50%; background: #e11d48; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: bold; margin: 0 auto;}
    `;

    if (isLoading) {
        return (
            <div className="text-center py-5 mt-5">
                <i className="fa-solid fa-spinner fa-spin fs-1 text-danger"></i>
                <p className="mt-3 text-muted">Loading profile...</p>
            </div>
        );
    }

    return (
        <>
            <style>{pageStyles}</style>

            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper text-center">
                        <h2 className="text-white mb-15">My Account</h2>
                        <nav>
                            <ol className="breadcrumb justify-content-center">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active">Profile</li>
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
                                    <div className="avatar-circle mb-3">
                                        {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <h6 className="fw-bold m-0">{formData.name}</h6>
                                    <small className="text-muted">{formData.email}</small>
                                </div>
                                <ul className="sidebar-menu">
                                    <li><Link to="/profile" className="active"><i className="fa-solid fa-id-badge"></i> Personal Info</Link></li>
                                    <li><Link to="/my-trips"><i className="fa-solid fa-plane-departure"></i> My Trips</Link></li>
                                    <li><Link to="/saved-passengers"><i className="fa-solid fa-users"></i> Saved Passengers</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-8 col-xl-9">
                            <div className="content-card">
                                <div className="content-header">
                                    <h3>Personal Information</h3>
                                    <p>Update your personal details here to speed up your future bookings.</p>
                                </div>

                                {message.text && (
                                    <div className={`alert alert-${message.type} py-3 d-flex align-items-center`} role="alert">
                                        <i className={`fa-solid ${message.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} me-2 fs-5`}></i>
                                        <div>{message.text}</div>
                                    </div>
                                )}

                                <form onSubmit={handleUpdate}>
                                    <div className="row g-4">
                                        <div className="col-md-12">
                                            <label className="form-label">Full Name *</label>
                                            <input type="text" name="name" className="custom-input" value={formData.name} onChange={handleChange} required placeholder="e.g. Nguyen Van A" />
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label className="form-label">Email Address</label>
                                            <input type="email" className="custom-input" value={formData.email} disabled />
                                            <small className="text-muted mt-1 d-block" style={{fontSize: '11px'}}>Email is used for login and cannot be changed.</small>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Mobile Number</label>
                                            <input type="tel" name="phone" className="custom-input" value={formData.phone} onChange={handleChange} placeholder="+84 987 654 321" />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Date of Birth</label>
                                            <input type="date" name="dateOfBirth" className="custom-input" value={formData.dateOfBirth} onChange={handleChange} />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Gender</label>
                                            <select name="gender" className="custom-input" value={formData.gender} onChange={handleChange}>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div className="col-md-12">
                                            <label className="form-label">Address</label>
                                            <textarea name="address" className="custom-input" rows="3" value={formData.address} onChange={handleChange} placeholder="e.g. 123 Main Street, City"></textarea>
                                        </div>

                                        <div className="col-12 mt-4 pt-3 border-top text-end">
                                            <button type="submit" className="tn-btn tn-btn__red border-0 px-5" disabled={isSaving}>
                                                {isSaving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}