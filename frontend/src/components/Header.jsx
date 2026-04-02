import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const headerStyles = `
        .user-dropdown-container { position: relative; padding: 10px 0; cursor: pointer; }
        .custom-user-dropdown { position: absolute; top: 100%; right: 0; min-width: 220px; background: #fff; border: 1px solid #ebebeb; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); list-style: none; padding: 10px 0; margin: 0; z-index: 9999; animation: dropFadeIn 0.2s ease-in-out; }
        .custom-user-dropdown li a, .custom-user-dropdown li button { display: flex; align-items: center; width: 100%; text-align: left; background: none; border: none; padding: 10px 20px; color: #0b1a2d; font-weight: 600; text-decoration: none; transition: 0.3s; font-size: 15px; }
        .custom-user-dropdown li a:hover, .custom-user-dropdown li button:hover { background: #f8fafc; color: #e11d48; }
        .custom-user-dropdown li i { width: 25px; color: #666; transition: 0.3s; }
        .custom-user-dropdown li:hover i { color: #e11d48; }
        .user-avatar-circle { width: 40px; height: 40px; border-radius: 50%; background-color: #e11d48; color: #fff; display: flex; justify-content: center; align-items: center; font-size: 18px; font-weight: bold; text-transform: uppercase; }
        @keyframes dropFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;

    return (
        <>
            <style>{headerStyles}</style>

            
            <div className="tn-menu-wrapper">
                <div className="tn-menu-area">
                    <button className="tn-menu-toggle"><i className="fa-solid fa-xmark"></i></button>
                    <div className="tn-mobile-menu">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About us</Link></li>
                            <li><Link to="/service">Services</Link></li>
                            <li><Link to="/booking">Tickets</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            {currentUser && (
                                <>
                                    <li className="border-top mt-3 pt-3"><Link to="/my-trips">My Trips</Link></li>
                                    <li><Link to="/profile">My Profile</Link></li>
                                    <li><a href="#" onClick={handleLogout} className="text-danger">Logout</a></li>
                                </>
                            )}
                        </ul>
                    </div>
                
                </div>
            </div>

            <header className="tn-header">
                <div className="sticky-wrapper">
                    <div className="sticky-active">
                        <div className="container container--custom">
                            <div className="row justify-content-between align-items-center">
                                <div className="col">
                                    <div className="tn-header__logo">
                                        <Link to="/"><img src="/assets/image/logo.svg" alt="clicko" className="logo" /></Link>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <nav className="main-menu d-none d-lg-block">
                                        <ul>
                                            <li><Link to="/">Home</Link></li>
                                            <li><Link to="/about">About us</Link></li>
                                            <li><Link to="/contact">Contact</Link></li>
                                            <li><Link to="/service">Services</Link></li>
                                            <li><Link to="/booking">Tickets</Link></li>
                                            <li><Link to="/blog">Blog</Link></li>
                                        </ul>
                                    </nav>
                                </div>
                                <div className="col-auto">
                                    <div className="tn-header__action">
                                               
                                        {currentUser ? (
                                            <div 
                                                className="user-dropdown-container d-none d-xxl-inline-flex align-items-center ms-4"
                                                onMouseEnter={() => setShowUserMenu(true)}
                                                onMouseLeave={() => setShowUserMenu(false)}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="user-avatar-circle">
                                                        {currentUser.name ? currentUser.name.charAt(0) : (currentUser.firstName ? currentUser.firstName.charAt(0) : 'U')}
                                                    </div>
                                                    <span className="fw-bold" style={{ color: '#0b1a2d' }}>
                                                        Hi, {currentUser.name || currentUser.firstName} <i className="fa-solid fa-angle-down ms-1" style={{fontSize: '12px'}}></i>
                                                    </span>
                                                </div>

                                                {showUserMenu && (
                                                    <ul className="custom-user-dropdown">
                                                        <li><Link to="/profile"><i className="fa-solid fa-id-badge"></i> My Profile</Link></li>
                                                        <li><Link to="/my-trips"><i className="fa-solid fa-plane-departure"></i> My Trips</Link></li>
                                                        <li><Link to="/saved-passengers"><i className="fa-solid fa-users"></i> Saved Passengers</Link></li>
                                        
                                                        <li className="border-top mt-2 pt-2">
                                                            <button onClick={handleLogout} className="text-danger w-100 text-start">
                                                                <i className="fa-solid fa-right-from-bracket text-danger"></i> Logout
                                                            </button>
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="d-none d-xxl-inline-flex align-items-center gap-2 ms-3">
                                                <Link to="/login" className="tn-btn tn-btn__red px-4 py-2">Sign in</Link>
                                                <Link to="/register" className="tn-btn px-4 py-2">Register</Link>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}