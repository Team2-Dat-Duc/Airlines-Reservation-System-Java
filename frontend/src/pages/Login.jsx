import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setErrorMsg('');
        setIsLoading(true);

        try {
            const data = await axiosClient.post('/login', { email, password });
            
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            if (data.user && data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/'); 
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Sai email hoặc mật khẩu. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper text-center">
                        <h2 className="text-white mb-15">Sign In</h2>
                    </div>
                </div>
            </section>

            <section className="tn-contact space z-index-common">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="tn-contact__form p-5" style={{ borderRadius: '10px', background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                                <div className="mb-40 text-center">
                                    <h2 className="tn-title__main">Welcome Back!</h2>
                                    <p>Vui lòng đăng nhập để quản lý vé chuyến bay của bạn.</p>
                                </div>
                                
                                <div className="tn-contact__cForm">
                                    <form onSubmit={handleLogin}>
                                        <input 
                                            type="email" 
                                            className="form-control mb-3" 
                                            placeholder="Email Address" 
                                            required 
                                            style={{ textTransform: 'none' }}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)} 
                                        />
                                        <input 
                                            type="password" 
                                            className="form-control mb-3" 
                                            placeholder="Password" 
                                            required 
                                            style={{ textTransform: 'none' }}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        
                                        {errorMsg && <p className="text-danger fw-bold mb-3">{errorMsg}</p>}
                                        
                                        <button type="submit" className="tn-btn tn-btn__red w-100 mb-3" disabled={isLoading}>
                                            {isLoading ? 'Đang xử lý...' : 'Login'}
                                        </button>
                                        
                                        <p className="text-center mt-3">
                                            Chưa có tài khoản? <Link to="/register" className="text-primary fw-bold">Đăng ký ngay</Link>
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}