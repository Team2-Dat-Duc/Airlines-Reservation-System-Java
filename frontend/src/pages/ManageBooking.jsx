import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function ManageBooking() {
    const [searchParams] = useSearchParams();
    const pnr = searchParams.get('pnr');
    const lastName = searchParams.get('lastName');

    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!pnr || !lastName) {
                setError("Vui lòng cung cấp mã PNR và Họ (Last Name) để tra cứu.");
                setIsLoading(false);
                return;
            }
            try {
              
                const res = await axiosClient.get(`/bookings/search?pnr=${pnr}&lastName=${lastName}`);
                setBooking(res);
            } catch (err) {
                setError(err.response?.data?.message || "Không tìm thấy vé. Vui lòng kiểm tra lại mã PNR hoặc Họ hành khách.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooking();
    }, [pnr, lastName]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const handleCheckIn = () => {
        alert(`Tính năng Check-in trực tuyến cho PNR ${booking.pnr} đang được kết nối với hệ thống sân bay. Vui lòng thử lại sau!`);
    };

    const pageStyles = `
        .manage-wrapper { padding: 60px 0; background: #f8fafc; min-height: 80vh; }
        .error-box { background: #fef2f2; border: 1px dashed #ef4444; color: #b91c1c; padding: 30px; border-radius: 12px; text-align: center; }
        .ticket-card { background: #fff; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .ticket-header { background: #0b1a2d; color: #fff; padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; }
        .ticket-body { padding: 30px; }
        .flight-route { display: flex; align-items: center; justify-content: center; text-align: center; gap: 20px; margin: 20px 0; }
        .flight-route h2 { margin: 0; font-size: 32px; font-weight: 900; color: #0b1a2d; }
        .flight-line { flex-grow: 1; height: 2px; background: #cbd5e1; position: relative; min-width: 80px; margin: 0 20px; }
        .flight-line i { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #10b981; background: #fff; padding: 0 10px; font-size: 20px;}
        .passenger-list { background: #f8fafc; border-radius: 8px; padding: 20px; margin-top: 20px; border: 1px solid #f1f5f9; }
        .status-badge { padding: 6px 15px; border-radius: 30px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;}
        .status-confirmed { background: #10b981; color: #fff; }
        .status-pending { background: #f59e0b; color: #fff; }
        .status-cancelled { background: #ef4444; color: #fff; }
    `;

    return (
        <>
            <style>{pageStyles}</style>

            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper text-center">
                        <h2 className="text-white mb-15">Manage Booking</h2>
                    </div>
                </div>
            </section>

            <section className="manage-wrapper">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            
                            {isLoading ? (
                                <div className="text-center py-5"><i className="fa-solid fa-spinner fa-spin fs-1 text-danger"></i><p className="mt-3">Đang tra cứu hệ thống...</p></div>
                            ) : error ? (
                                <div className="error-box">
                                    <i className="fa-solid fa-triangle-exclamation fs-1 mb-3"></i>
                                    <h4>Tra cứu thất bại</h4>
                                    <p>{error}</p>
                                    <Link to="/" className="btn btn-outline-danger mt-3">Quay lại trang chủ</Link>
                                </div>
                            ) : booking ? (
                                <div className="ticket-card">
                                    <div className="ticket-header">
                                        <div>
                                            <span className="small text-light d-block opacity-75">Booking Reference (PNR)</span>
                                            <h3 className="m-0 fw-bold" style={{ letterSpacing: '3px' }}>{booking.pnr}</h3>
                                        </div>
                                        <div>
                                            <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="ticket-body">
                                        <div className="d-flex align-items-center gap-3 mb-4">
                                            <img src={`/assets/image/flags/${booking.flightDetails?.img || 'ariso.jpg'}`} style={{width: '60px', borderRadius: '8px', border: '1px solid #eee'}} alt="airline" />
                                            <div>
                                                <h5 className="m-0 fw-bold">{booking.flightDetails?.name || 'Airline'}</h5>
                                                <span className="text-muted">{booking.flightDetails?.aircraft || 'Aircraft'} | Class: {booking.seatType.toUpperCase()}</span>
                                            </div>
                                        </div>

                                        <div className="flight-route">
                                            <div className="text-end">
                                                <h2>{booking.flightDetails?.depTime}</h2>
                                                <h5 className="fw-bold">{booking.flightDetails?.dep}</h5>
                                            </div>
                                            <div className="flight-line"><i className="fa-solid fa-plane"></i></div>
                                            <div className="text-start">
                                                <h2>{booking.flightDetails?.arrTime}</h2>
                                                <h5 className="fw-bold">{booking.flightDetails?.arr}</h5>
                                            </div>
                                        </div>
                                        <div className="text-center mb-4">
                                            <span className="badge bg-light text-dark border px-3 py-2 fs-6">
                                                <i className="fa-regular fa-calendar-days text-danger me-2"></i> 
                                                Ngày khởi hành: {formatDate(booking.flightDetails?.depDate)}
                                            </span>
                                        </div>

                                        <div className="passenger-list">
                                            <h5 className="fw-bold mb-3"><i className="fa-solid fa-users text-danger me-2"></i> Danh sách hành khách</h5>
                                            <div className="table-responsive">
                                                <table className="table table-borderless m-0">
                                                    <thead className="border-bottom">
                                                        <tr>
                                                            <th>Họ Tên</th>
                                                            <th>Loại khách</th>
                                                            <th>Hành lý & Chỗ ngồi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {booking.passengers.map((p, idx) => (
                                                            <tr key={idx} className="border-bottom">
                                                                <td className="fw-bold">{p.lastName}, {p.firstName}</td>
                                                                <td>{p.type}</td>
                                                                <td>
                                                                    <div className="small"><i className="fa-solid fa-suitcase me-1 text-muted"></i> {p.baggageOption}</div>
                                                                    <div className="small"><i className="fa-solid fa-chair me-1 text-muted"></i> Seat: {p.seatPreference}</div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {booking.status === 'Confirmed' && (
                                            <div className="text-center mt-5">
                                                <button onClick={handleCheckIn} className="tn-btn tn-btn__red px-5 py-3 w-100 fs-5">
                                                    <i className="fa-solid fa-passport me-2"></i> Bắt đầu Check-in Trực tuyến
                                                </button>
                                                <p className="text-muted small mt-3">* Check-in trực tuyến mở trước 24 giờ so với giờ khởi hành.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}