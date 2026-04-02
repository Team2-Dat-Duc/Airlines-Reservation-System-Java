import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const PrintTicketTemplate = ({ booking }) => {
    if (!booking || !booking.flight) return null;
    const { flight, pnr, passengers, contact, totalPrice, createdAt } = booking;
    
    return (
        <div className="print-only-ticket" style={{ padding: '40px', fontFamily: 'Arial, sans-serif', color: '#333', display: 'none' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e11d48', paddingBottom: '20px', marginBottom: '30px' }}>
                <div>
                    <img src="/assets/image/flags/ariso-big.png" alt="logo" style={{ height: '40px' }} />
                    <h3 style={{ margin: '5px 0 0 0', color: '#e11d48', fontWeight: 'bold' }}>ELECTRONIC TICKET</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: '#777' }}>Booking Reference (PNR)</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '3px', color: '#0b1a2d' }}>{pnr}</div>
                    <div style={{ fontSize: '12px', color: '#777', marginTop:'5px' }}>Issued: {new Date(createdAt).toLocaleDateString('vi-VN')}</div>
                </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #eaeaea', marginBottom: '30px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#0b1a2d', fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>FLIGHT DETAILS</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ textAlign: 'left', width: '30%' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e11d48' }}>{flight.depTime}</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{flight.dep}</div>
                        <div style={{ fontSize: '12px', color: '#777' }}>{new Date(flight.depDate).toLocaleDateString('vi-VN')}</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', borderBottom: '2px dashed #cbd5e1', position: 'relative', margin: '0 20px', paddingBottom: '10px' }}>
                        <i className="fa-solid fa-plane" style={{ color: '#10b981', position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' }}></i>
                        <span style={{ fontSize: '12px', color: '#777', background: '#f8fafc', padding: '0 10px' }}>Direct</span>
                    </div>
                    <div style={{ textAlign: 'right', width: '30%' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e11d48' }}>{flight.arrTime}</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{flight.arr}</div>
                    </div>
                </div>
                <div style={{ marginTop: '15px', fontSize: '14px', color: '#555' }}>
                    <strong>Airline:</strong> {flight.name} ({flight.aircraft || 'Airbus A321'}) | <strong>Status:</strong> Confirmed
                </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#0b1a2d', fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>PASSENGER(S)</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ background: '#eaeaea' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '10px', border: '1px solid #ddd' }}>No.</th>
                            <th style={{ textAlign: 'left', padding: '10px', border: '1px solid #ddd' }}>Name (Title)</th>
                            <th style={{ textAlign: 'left', padding: '10px', border: '1px solid #ddd' }}>Nationality</th>
                            <th style={{ textAlign: 'left', padding: '10px', border: '1px solid #ddd' }}>DOB</th>
                        </tr>
                    </thead>
                    <tbody>
                        {passengers && passengers.length > 0 ? passengers.map((p, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{idx + 1}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>{p.firstName} {p.lastName} ({p.title})</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.nationality}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.dateOfBirth}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>No passenger data</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ borderTop: '2px dashed #ddd', paddingTop: '20px', marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#777' }}>
                <p>This is an electronic ticket. Please present this document along with your valid photo ID at the check-in counter.</p>
                <p>Ariso Airway - Booked by {contact?.email || 'User'} | Total Paid: ${totalPrice?.toFixed(2)}</p>
                <p style={{ color: '#e11d48', fontWeight: 'bold' }}>Have a pleasant flight!</p>
            </div>
        </div>
    );
};

export default function MyTrips() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [printingTicket, setPrintingTicket] = useState(null); 
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    useEffect(() => {
        const fetchMyTrips = async () => {
            try {
                
                const res = await axiosClient.get('/bookings/my-trips');
                setBookings(res); 
            } catch (err) {
                console.error("Lỗi tải lịch sử đặt vé:", err);
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyTrips();
    }, [navigate]);

    const handlePrintTicket = (booking) => {
      
        setPrintingTicket(booking);
        
        setTimeout(() => {
            window.print();
          
            setPrintingTicket(null);
        }, 300);
    };

    const handleCancelBooking = async (id, pnr) => {
        if (!window.confirm(`Bạn có chắc chắn muốn hủy vé có mã đặt chỗ ${pnr} không? Thao tác này không thể hoàn tác.`)) {
            return;
        }
        try {
            await axiosClient.put(`/bookings/${id}/cancel`);
            alert(`Hủy vé ${pnr} thành công.`);

            setBookings(prev => prev.map(b => b._id === id ? {...b, status: 'Cancelled'} : b));
        } catch (err) {
            alert(err.response?.data?.message || 'Không thể hủy vé lúc này.');
        }
    };

    const isFlightInFuture = (depDate, depTime) => {
        try {
            if (!depDate || !depTime) return false;
         
            const flightDateTime = new Date(`${depDate}T${depTime}`);
            const now = new Date();
            
            return flightDateTime > now;
        } catch { return false; }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        if (dateString.includes('T')) {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN');
        }
        const parts = dateString.split('-');
        if(parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return dateString;
    };

    const pageStyles = `
        .profile-wrapper { padding: 60px 0; background: #f8fafc; min-height: 100vh; }
        
        /* SIDEBAR (Giữ nguyên) */
        .sidebar-card { background: #fff; border-radius: 12px; border: 1px solid #eaeaea; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .sidebar-menu { list-style: none; padding: 0; margin: 0; }
        .sidebar-menu li a { display: block; padding: 15px 25px; color: #0b1a2d; font-weight: 600; transition: 0.3s; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; text-decoration: none;}
        .sidebar-menu li a:hover, .sidebar-menu li a.active { background: #fff1f2; color: #e11d48; border-left: 4px solid #e11d48; padding-left: 21px; }
        .sidebar-menu li a i { width: 20px; text-align: center; }
        .avatar-circle { width: 80px; height: 80px; border-radius: 50%; background: #e11d48; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: bold; margin: 0 auto;}
        
        /* CONTENT & TICKET CARD */
        .content-card { background: #fff; border-radius: 12px; border: 1px solid #eaeaea; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .content-header { border-bottom: 1px solid #eaeaea; padding-bottom: 20px; margin-bottom: 25px; }
        .content-header h3 { font-weight: 700; margin: 0; color: #0b1a2d; }
        .content-header p { margin: 5px 0 0 0; color: #666; font-size: 14px; }
        
        .ticket-card { border: 1px solid #eaeaea; border-radius: 10px; margin-bottom: 20px; transition: 0.3s; background: #fff; display: flex; flex-direction: column; overflow: hidden;}
        .ticket-card:hover { border-color: #cbd5e1; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05); }
        
        /* Trải trí viền cho vé Pending */
        .ticket-card.pending { border-color: #fb923c; border-left-width: 4px; }
        .ticket-card.pending:hover { box-shadow: 0 5px 15px rgba(251, 146, 60, 0.1); }
        
        .ticket-header { background: #f8fafc; padding: 15px 20px; border-bottom: 1px dashed #ddd; display: flex; justify-content: space-between; align-items: center; }
        .ticket-body { padding: 20px; }
        .ticket-footer { background: #fff; padding: 15px 20px; border-top: 1px dashed #ddd; display: flex; justify-content: space-between; align-items: center; }
        
        .status-badge { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase;}
        
        /* MÀU SẮC TRẠNG THÁI VÉ */
        .status-confirmed { background: #ecfdf5; color: #10b981; } /* Xanh */
        .status-cancelled { background: #fef2f2; color: #e11d48; } /* Đỏ */
        .status-pending { background: #fff7ed; color: #f97316; } /* Cam */
        
        .flight-route { display: flex; align-items: center; justify-content: center; text-align: center; gap: 20px; }
        .flight-route h3 { margin: 0; font-size: 24px; font-weight: 800; color: #0b1a2d; }
        .flight-route p { margin: 0; font-weight: 600; color: #555; }
        .flight-line { flex-grow: 1; height: 2px; background: #ddd; position: relative; min-width: 50px; margin: 0 15px; }
        .flight-line i { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #10b981; background: #fff; padding: 0 5px; font-size: 18px;}
        
        .empty-state { text-align: center; padding: 50px 20px; }
        .empty-state i { font-size: 60px; color: #cbd5e1; margin-bottom: 20px; }
        .empty-state h5 { font-weight: bold; color: #0b1a2d; }

        /* CSS DÀNH RIÊNG CHO IN PDF */
        @media print {
            body * { visibility: hidden; } /* Ẩn toàn bộ trang */
            .profile-wrapper { background: #fff !important; padding: 0 !important; margin: 0 !important; }
            .print-only-ticket, .print-only-ticket * { visibility: visible; display: block !important; } /* Hiện mẫu vé */
            .print-only-ticket { position: absolute; left: 0; top: 0; width: 100%; z-index: 9999; }
        }
    `;

    return (
        <>
            <style>{pageStyles}</style>

            {printingTicket && <PrintTicketTemplate booking={printingTicket} />}

            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper text-center">
                        <h2 className="text-white mb-15">My Trips</h2>
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
                                    <li><Link to="/my-trips" className="active"><i className="fa-solid fa-plane-departure"></i> My Trips</Link></li>
                                    <li><Link to="/saved-passengers"><i className="fa-solid fa-users"></i> Saved Passengers</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-8 col-xl-9">
                            <div className="content-card">
                                <div className="content-header">
                                    <h3>My Booking History</h3>
                                    <p>Manage and view all your upcoming and past flight reservations.</p>
                                </div>

                                {isLoading ? (
                                    <div className="text-center py-5">
                                        <i className="fa-solid fa-spinner fa-spin fs-2 text-danger"></i>
                                    </div>
                                ) : bookings.length === 0 ? (
                                    <div className="empty-state">
                                        <i className="fa-solid fa-ticket"></i>
                                        <h5>No Bookings Found</h5>
                                        <p className="text-muted">You haven't booked any flights yet.</p>
                                        <Link to="/booking" className="tn-btn tn-btn__red mt-3">Book a Flight Now</Link>
                                    </div>
                                ) : (
                                    <div className="ticket-list">
                                        {bookings.map((booking) => {
                                            const statusLower = booking.status ? booking.status.toLowerCase() : '';
                                            const statusClass = `status-${statusLower}`;
                                            const cardPendingClass = statusLower === 'pending' ? 'pending' : '';

                                            const flightInfo = booking.flightDetails || booking.flight;

                                            const isFuture = flightInfo && isFlightInFuture(flightInfo.depDate, flightInfo.depTime);
                                            const canCancel = (booking.status === 'Confirmed' || booking.status === 'Pending') && isFuture;

                                            return (
                                                <div className={`ticket-card ${cardPendingClass}`} key={booking._id}>
                                                    <div className="ticket-header">
                                                        <div>
                                                            <span className="text-muted small">Booking Ref (PNR)</span>
                                                            <h5 className="m-0 fw-bold" style={{letterSpacing: '2px', color:'#0b1a2d'}}>{booking.pnr || 'N/A'}</h5>
                                                        </div>
                                                        <div>
                                                            <span className={`status-badge ${statusClass}`}>
                                                                {statusLower === 'pending' ? 'Waiting Payment' : booking.status || 'Unknown'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="ticket-body">
                                                       
                                                        {flightInfo ? (
                                                            <div className="row align-items-center">
                                                                <div className="col-md-3 text-center text-md-start mb-3 mb-md-0">
                                                                    <div className="badge bg-primary mb-2">Outbound</div>
                                                                    <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                                                                        <img src={`/assets/image/flags/${flightInfo.img || 'ariso.jpg'}`} style={{width: '30px', borderRadius: '4px'}} alt="airline" />
                                                                        <h6 className="m-0 fw-bold" style={{color:'#0b1a2d'}}>{flightInfo.name}</h6>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="flight-route">
                                                                        <div className="text-end">
                                                                            <h4 className="m-0 fw-bold">{flightInfo.depTime}</h4>
                                                                            <p className="m-0">{flightInfo.dep}</p>
                                                                        </div>
                                                                        <div className="flight-line">
                                                                            <i className="fa-solid fa-plane"></i>
                                                                        </div>
                                                                        <div className="text-start">
                                                                            <h4 className="m-0 fw-bold">{flightInfo.arrTime}</h4>
                                                                            <p className="m-0">{flightInfo.arr}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-center mt-2">
                                                                        <span className="small text-muted bg-light px-3 py-1 rounded border">
                                                                            <i className="fa-regular fa-calendar-days me-1"></i> {formatDate(flightInfo.depDate)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3 text-center text-md-end mt-3 mt-md-0 border-start-md">
                                                                    <span className="text-muted small d-block">Total Payable</span>
                                                                    <h4 className="text-danger fw-bold m-0">${booking.totalPrice?.toFixed(2)}</h4>
                                                                    <span className="small text-muted">{booking.passengers?.length || 1} Passenger(s)</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center text-muted py-3">Flight details unavailable</div>
                                                        )}

                                                        {(booking.returnFlightDetails || booking.returnFlight) && (
                                                            <>
                                                                <hr style={{ borderStyle: 'dashed', borderColor: '#cbd5e1', margin: '20px 0' }} />
                                                                
                                                                <div className="row align-items-center">
                                                                    <div className="col-md-3 text-center text-md-start mb-3 mb-md-0">
                                                                        <div className="badge bg-info text-dark mb-2">Return</div>
                                                                        <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                                                                            <img src={`/assets/image/flags/${(booking.returnFlightDetails || booking.returnFlight).img || 'ariso.jpg'}`} style={{width: '30px', borderRadius: '4px'}} alt="airline" />
                                                                            <h6 className="m-0 fw-bold" style={{color:'#0b1a2d'}}>{(booking.returnFlightDetails || booking.returnFlight).name}</h6>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="flight-route">
                                                                            <div className="text-end">
                                                                                <h4 className="m-0 fw-bold">{(booking.returnFlightDetails || booking.returnFlight).depTime}</h4>
                                                                                <p className="m-0">{(booking.returnFlightDetails || booking.returnFlight).dep}</p>
                                                                            </div>
                                                                            <div className="flight-line">
                                                                                <i className="fa-solid fa-plane" style={{color: '#0dcaf0'}}></i>
                                                                            </div>
                                                                            <div className="text-start">
                                                                                <h4 className="m-0 fw-bold">{(booking.returnFlightDetails || booking.returnFlight).arrTime}</h4>
                                                                                <p className="m-0">{(booking.returnFlightDetails || booking.returnFlight).arr}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-center mt-2">
                                                                            <span className="small text-muted bg-light px-3 py-1 rounded border">
                                                                                <i className="fa-regular fa-calendar-days me-1"></i> {formatDate((booking.returnFlightDetails || booking.returnFlight).depDate)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                     
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="ticket-footer">
                                                        <span className="small text-muted"><i className="fa-solid fa-clock me-1"></i> Booked: {formatDate(booking.createdAt)}</span>
                                                        <div className="d-flex gap-2">
                                                            
                                                            {statusLower === 'pending' && (
                                                                <button 
                                                                    className="btn btn-sm btn-warning fw-bold text-dark px-3"
                                                                    onClick={() => navigate(`/payment/${booking._id}`, {
                                                                        state: { expiresAt: booking.expiresAt, pnr: booking.pnr, totalPrice: booking.totalPrice }
                                                                    })}
                                                                >
                                                                    <i className="fa-solid fa-credit-card me-1"></i> Pay Now
                                                                </button>
                                                            )}

                                                            <button 
                                                                className="btn btn-sm btn-outline-dark fw-bold" 
                                                                onClick={() => handlePrintTicket(booking)}
                                                                disabled={statusLower !== 'confirmed'}
                                                            >
                                                                <i className="fa-solid fa-file-pdf me-1"></i> E-Ticket
                                                            </button>
                                                            
                                                            {canCancel && (
                                                                <button 
                                                                    className="btn btn-sm btn-outline-danger fw-bold"
                                                                    onClick={() => handleCancelBooking(booking._id, booking.pnr)}
                                                                >
                                                                    <i className="fa-regular fa-circle-xmark me-1"></i> Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
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