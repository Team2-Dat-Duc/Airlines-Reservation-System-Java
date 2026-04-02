import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Payment() {
    const navigate = useNavigate();
    const { bookingId } = useParams();
    const location = useLocation();
    
    const expiresAt = location.state?.expiresAt;
    const pnr = location.state?.pnr || 'VN123';
    const totalPrice = location.state?.totalPrice || 0;

    const [step, setStep] = useState(2); 
    const [timeLeft, setTimeLeft] = useState('15:00');
    const [isExpired, setIsExpired] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!expiresAt) return;
        const targetTime = new Date(expiresAt).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetTime - now;

            if (distance <= 0) {
                clearInterval(interval);
                setTimeLeft('00:00');
                setIsExpired(true);
            } else {
                const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    const handlePayment = async (e) => {
        e.preventDefault();
        if (isExpired) {
            alert('Thời gian giữ chỗ đã hết, vé của bạn đã bị hủy tự động.');
            return navigate('/');
        }
        
        setIsLoading(true);
        try {
            await axiosClient.post(`/bookings/${bookingId}/pay`);
            setStep(3); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            alert(err.response?.data?.message || 'Thanh toán thất bại.');
        } finally {
            setIsLoading(false);
        }
    };

    const pageStyles = `
        .booking-steps { display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; margin-bottom: 40px; }
        .booking-steps__logo img { width: 150px; margin-bottom: 20px; }
        .booking-steps__content { width: 100%; max-width: 800px; }
        .booking-steps__content h3 { font-size: 24px; margin-bottom: 30px; font-weight: 700; color: #0b1a2d; }
        .steps { display: flex; justify-content: space-between; position: relative; width: 100%; margin: 0 auto; z-index: 1; }
        .steps__line { position: absolute; top: 20px; left: 0; right: 0; height: 3px; background: #eaeaea; z-index: -1; }
        .steps__line--active { position: absolute; top: 20px; left: 0; height: 3px; background: #10b981; z-index: -1; }
        .step { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 33.33%; }
        .step__circle { width: 45px; height: 45px; border-radius: 50%; background: #fff; border: 3px solid #eaeaea; display: flex; justify-content: center; align-items: center; font-weight: bold; color: #666; transition: 0.3s; background-color: #fff;}
        .step.active .step__circle { border-color: #10b981; background: #10b981; color: #fff; }
        .step__label { font-size: 14px; font-weight: 600; color: #666; }
        .step.active .step__label { color: #0b1a2d; }

        .booking-detail .header { margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .booking-detail .header h4 { margin: 0; font-weight: 700; }
        .pay-option { border: 2px solid #eaeaea; border-radius: 8px; padding: 15px; margin-bottom: 15px; cursor: pointer; transition: 0.3s; background: #f8fafc; }
        .pay-option.active { border-color: #e11d48; background: #fff1f2; }
        .pay-input { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; margin-top: 5px; }
        
        .timer-box { background: #fff1f2; color: #e11d48; padding: 15px; border-radius: 8px; font-weight: bold; text-align: center; font-size: 16px; border: 1px dashed #e11d48; margin-bottom: 20px;}
        .expired-box { background: #f1f5f9; color: #64748b; padding: 15px; border-radius: 8px; font-weight: bold; text-align: center; font-size: 16px; border: 1px dashed #94a3b8; margin-bottom: 20px;}
    `;

    return (
        <>
            <style>{pageStyles}</style>

            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper text-center">
                        <h2 className="text-white mb-15">Secure Payment</h2>
                    </div>
                </div>
            </section>

            <section className="z-index-common bg-color2 space-bottom">
                <div className="container">
                    <div className="booking-steps mt-4">
                        <div className="booking-steps__logo"><img src="/assets/image/flags/ariso-big.png" alt="ariso" /></div>
                        <div className="booking-steps__content">
                            <h3>{step === 3 ? 'Booking Confirmed!' : 'Complete Your Payment'}</h3>
                            <div className="steps">
                                <div className="step active"><span className="step__circle">1</span><span className="step__label">Guest Information</span></div>
                                <div className="step active"><span className="step__circle mx-auto">2</span><span className="step__label">Payment</span></div>
                                <div className={`step ${step === 3 ? 'active' : ''}`}><span className="step__circle ms-auto">3</span><span className="step__label">Confirmation</span></div>
                                <span className="steps__line"></span>
                                <span className="steps__line--active" style={{ width: step === 3 ? '100%' : '50%', transition: '0.4s ease' }}></span>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className={step === 3 ? "col-xl-10 mt-4" : "col-xl-8 col-lg-8 mt-4"}>
                            
                            {step === 2 && (
                                <form className="booking-detail mt-20" onSubmit={handlePayment}>
                                    
                                    {isExpired ? (
                                        <div className="expired-box text-center p-4">
                                            <i className="fa-regular fa-clock fs-1 text-secondary mb-3"></i>
                                            <h5 className="text-dark fw-bold mb-2">Phiên giữ chỗ đã hết hạn</h5>
                                            <p className="text-muted mb-4">Rất tiếc, thời gian giữ chỗ của bạn đã kết thúc và vé đã tự động bị hủy. Vui lòng tiến hành đặt lại chuyến bay mới.</p>
                                            <Link to="/my-trips" className="btn btn-outline-secondary fw-bold px-4 py-2 rounded-pill">
                                                Quay về My Trips <i className="fa-solid fa-arrow-right ms-2"></i>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="timer-box">
                                            <i className="fa-solid fa-stopwatch me-2 fa-shake"></i> Vui lòng thanh toán trong: {timeLeft} phút
                                        </div>
                                    )}

                                    <div className="header"><i className="fa-regular fa-credit-card"></i><h4>Payment Method</h4></div>
                                    <div className="p-4" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                                        <div className="pay-option active">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div className="form-check m-0">
                                                    <input className="form-check-input" type="radio" checked readOnly />
                                                    <label className="form-check-label fw-bold ms-2">Credit / Debit Card</label>
                                                </div>
                                                <div><img src="/assets/image/icons/visa.png" style={{ height: '20px' }} alt="visa" /><img src="/assets/image/icons/master.png" style={{ height: '20px', marginLeft: '10px' }} alt="master" /></div>
                                            </div>
                                            <div className="row g-3 pt-3 border-top">
                                                <div className="col-12"><label className="fw-bold" style={{ fontSize: '13px' }}>Card Number *</label><input required className="pay-input" placeholder="0000 0000 0000 0000" disabled={isExpired} /></div>
                                                <div className="col-12"><label className="fw-bold" style={{ fontSize: '13px' }}>Cardholder Name *</label><input required className="pay-input" placeholder="Full Name" disabled={isExpired} /></div>
                                                <div className="col-6"><label className="fw-bold" style={{ fontSize: '13px' }}>Expiry Date *</label><input required className="pay-input" placeholder="MM/YY" disabled={isExpired} /></div>
                                                <div className="col-6"><label className="fw-bold" style={{ fontSize: '13px' }}>CVV *</label><input required className="pay-input" type="password" placeholder="123" disabled={isExpired} /></div>
                                            </div>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                            <h4 className="m-0 text-dark">Total: <span className="text-danger fw-bold">${totalPrice.toFixed(2)}</span></h4>
                                            <button type="submit" className="tn-btn tn-btn__red px-5 py-3" disabled={isLoading || isExpired}>
                                                {isLoading ? 'Processing...' : 'Pay & Confirm'} <i className="fa-solid fa-lock ms-2"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {step === 3 && (
                                <div className="booking-detail mt-20 text-center py-5" style={{ borderTop: '5px solid #10b981', background: '#fff', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                                    <i className="fa-solid fa-circle-check" style={{ fontSize: '80px', color: '#10b981', marginBottom: '20px' }}></i>
                                    <h2 className="fw-bold mb-3">Payment Successful!</h2>
                                    <p className="text-muted mb-4 fs-5">Your e-ticket has been confirmed and sent to your email.</p>
                                    
                                    <div className="mx-auto mb-4" style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', padding: '25px', borderRadius: '10px', maxWidth: '400px' }}>
                                        <p className="mb-2 text-muted fw-bold">Booking Reference (PNR)</p>
                                        <h1 className="m-0 text-dark fw-bold" style={{ letterSpacing: '5px', fontSize: '40px' }}>{pnr}</h1>
                                    </div>

                                    <div className="d-flex gap-3 justify-content-center">
                                        <Link to="/my-trips" className="tn-btn bg-dark text-white px-4 py-3">View My Trips</Link>
                                        <Link to="/" className="tn-btn tn-btn__red px-4 py-3">Back to Home</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}