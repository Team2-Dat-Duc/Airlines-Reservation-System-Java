import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function BookingDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const flightId = searchParams.get('id');
    const returnFlightId = searchParams.get('returnId'); 
    const seatType = searchParams.get('type') || 'economyLite';
    const adults = parseInt(searchParams.get('adults')) || 1;
    const children = parseInt(searchParams.get('children')) || 0;
    const infants = parseInt(searchParams.get('infants')) || 0;

    const getInitialPassengers = () => {
        const arr = [];
        for (let i = 0; i < adults; i++) arr.push({ type: 'Adult', typeIndex: i + 1, title: 'Mr', firstName: '', lastName: '', dateOfBirth: '', nationality: 'Vietnam', baggageOption: 'No Checked Baggage (+$0.00)', seatPreference: 'Any' });
        for (let i = 0; i < children; i++) arr.push({ type: 'Child', typeIndex: i + 1, title: 'Mstr', firstName: '', lastName: '', dateOfBirth: '', nationality: 'Vietnam', baggageOption: 'No Checked Baggage (+$0.00)', seatPreference: 'Any' });
        for (let i = 0; i < infants; i++) arr.push({ type: 'Infant', typeIndex: i + 1, title: 'Mstr', firstName: '', lastName: '', dateOfBirth: '', nationality: 'Vietnam', baggageOption: 'No Checked Baggage (+$0.00)', seatPreference: 'Any' });
        return arr;
    };

    const [isLoading, setIsLoading] = useState(false);
    const [flight, setFlight] = useState(null);
    const [returnFlight, setReturnFlight] = useState(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [savedPassengers, setSavedPassengers] = useState([]);

    const [formData, setFormData] = useState({
        contact: { firstName: '', lastName: '', email: '', phone: '' },
        passengers: getInitialPassengers()
    });

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('currentUser');
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                setIsLoggedIn(true);
                setCurrentUser(user);
                setFormData(prev => ({
                    ...prev, contact: { firstName: user.name || user.firstName || '', lastName: user.lastName || '', email: user.email || '', phone: user.phone || '' }
                }));
                axiosClient.get('/users/passengers').then(res => setSavedPassengers(res)).catch(e => console.log(e));
            } catch (e) { console.error(e); }
        }
    }, []);

    useEffect(() => {
        if (flightId) {
            axiosClient.get('/flights').then(res => {
                setFlight(res.find(f => f._id === flightId));
                if (returnFlightId) {
                    setReturnFlight(res.find(f => f._id === returnFlightId));
                }
            }).catch(e => console.error(e));
        }
    }, [flightId, returnFlightId]);

    let ticketPrice = 0;
    let totalAdultsPrice = 0;
    let totalChildrenPrice = 0;
    let totalInfantsPrice = 0;
    let taxes = 50 * (adults + children); 
 
    if (returnFlightId) taxes *= 2; 

    let baggagePrice = 0;
    formData.passengers.forEach(p => {
        const match = p.baggageOption.match(/\+\$(\d+\.\d+)/);
        if(match) baggagePrice += parseFloat(match[1]);
    });

    if (returnFlightId) baggagePrice *= 2; 

    if (flight) {
        const outboundPrice = parseFloat(flight.price || 0) + parseFloat(flight.seats?.[seatType]?.priceAddOn || 0);
        const returnPrice = returnFlight ? (parseFloat(returnFlight.price || 0) + parseFloat(returnFlight.seats?.[seatType]?.priceAddOn || 0)) : 0;
        
        ticketPrice = outboundPrice + returnPrice;
        totalAdultsPrice = ticketPrice * adults;
        totalChildrenPrice = ticketPrice * children * 0.8; 
        totalInfantsPrice = ticketPrice * infants * 0.2; 
    }
    const totalPayable = totalAdultsPrice + totalChildrenPrice + totalInfantsPrice + taxes + baggagePrice;

    const handlePassengerChange = (index, field, value) => {
        const updated = [...formData.passengers];
        updated[index][field] = value;
        setFormData({ ...formData, passengers: updated });
    };

    const handleAutoFillPassenger = (index, savedPassengerId) => {
        if (!savedPassengerId) return;
        const selectedSP = savedPassengers.find(sp => sp._id === savedPassengerId);
        if (selectedSP) {
            const updated = [...formData.passengers];
            updated[index] = { ...updated[index], title: selectedSP.title, firstName: selectedSP.firstName, lastName: selectedSP.lastName, dateOfBirth: selectedSP.dateOfBirth, nationality: selectedSP.nationality };
            setFormData({ ...formData, passengers: updated });
        }
    };

    const submitBooking = async (e) => {
        e.preventDefault(); 
        if (!isLoggedIn) {
            alert('Bạn cần đăng nhập để đặt vé.');
            navigate('/login');
            return;
        }
        setIsLoading(true);
        try {
            const payload = {
                flightId: flight?._id || null,
                returnFlightId: returnFlight?._id || null, 
                seatType,
                contact: formData.contact,
                passengers: formData.passengers, 
                totalPrice: totalPayable
            };

            const res = await axiosClient.post('/bookings', payload);
            navigate(`/payment/${res.bookingId}`, { 
                state: { expiresAt: res.expiresAt, pnr: res.pnr, totalPrice: totalPayable } 
            });
        } catch (err) {
            alert(err.response?.data?.message || 'Không thể giữ chỗ, vui lòng thử lại.');
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

        .booking-card { background: #fff; border-radius: 12px; border: 1px solid #eaeaea; margin-bottom: 25px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .booking-card-header { background: #f8fafc; padding: 15px 20px; border-bottom: 1px solid #eaeaea; display: flex; align-items: center; gap: 10px; font-weight: 700; color: #0b1a2d; font-size: 16px;}
        .booking-card-header i { color: #e11d48; font-size: 18px; }
        .booking-card-body { padding: 25px; }
        .form-label { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 8px; }
        .custom-input { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; transition: 0.3s; background: #fff; }
        .custom-input:focus { border-color: #e11d48; outline: none; box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1); }
        .login-banner { background: #ecfdf5; border: 1px solid #10b981; padding: 15px 20px; border-radius: 10px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
        .login-banner p { margin: 0; color: #065f46; font-size: 14px; font-weight: 500; }
        .login-banner a { font-weight: 800; color: #10b981; text-decoration: underline; cursor: pointer;}
        .btn-continue { background: #e11d48; color: #fff; padding: 18px; border-radius: 10px; font-size: 16px; font-weight: bold; width: 100%; border: none; cursor: pointer; transition: 0.3s; display: block; text-align: center; margin-top: 10px; text-decoration: none;}
        .btn-continue:hover { background: #be123c; color: #fff; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(225, 29, 72, 0.2);}
        .autofill-box { background: #f0fdf4; border: 1px dashed #10b981; padding: 10px 15px; border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
        .autofill-select { border: none; background: transparent; font-weight: 600; color: #047857; width: 100%; outline: none; cursor: pointer; }

        /* SIDEBAR CSS */
        .custom-sidebar { border: 1px solid #eaeaea; border-radius: 12px; background: #fff; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .custom-sidebar-header { background: #2d2b38; padding: 25px 20px; text-align: center; color: #fff; }
        .custom-sidebar-header h4 { margin: 0; font-weight: 800; font-size: 22px; color: #fff; }
        .custom-sidebar-body { padding: 30px; }
        .route-box { background: #fff; border: 1px solid #eaeaea; border-radius: 12px; padding: 25px 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .time-block { text-align: center; }
        .route-time { font-size: 26px; font-weight: 900; color: #0b1a2d; line-height: 1.2; margin-bottom: 5px; }
        .route-code { font-size: 14px; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .route-duration { color: #10b981; font-weight: 700; font-size: 13px; text-align: center; flex: 1; padding: 0 15px; }
        .route-duration i { font-size: 18px; margin-bottom: 4px; display: block; }
        .route-date-col { border-left: 1px dashed #cbd5e1; padding-left: 15px; margin-left: 10px; text-align: center; color: #e11d48; font-weight: 800; font-size: 13px; line-height: 1.5; }
        .price-item-box { background: #f8fafc; padding: 18px 20px; border-radius: 10px; font-weight: 600; color: #334155; display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 15px; border: 1px solid #f1f5f9; }
    `;

    return (
        <>
            <style>{pageStyles}</style>

            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper text-center">
                        <h2 className="text-white mb-15">Booking Details</h2>
                    </div>
                </div>
            </section>

            <section className="z-index-common bg-color2 space-bottom">
                <div className="container">
                    <div className="booking-steps mt-4">
                        <div className="booking-steps__logo"><img src="/assets/image/flags/ariso-big.png" alt="ariso" /></div>
                        <div className="booking-steps__content">
                            <h3>Please Fill In With Valid Information</h3>
                            <div className="steps">
                                <div className="step active"><span className="step__circle">1</span><span className="step__label">Guest Information</span></div>
                                <div className="step"><span className="step__circle mx-auto">2</span><span className="step__label">Payment</span></div>
                                <div className="step"><span className="step__circle ms-auto">3</span><span className="step__label">Confirmation</span></div>
                                <span className="steps__line"></span>
                                <span className="steps__line--active" style={{ width: '0%', transition: '0.4s ease' }}></span>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-between">
                       
                        <div className="col-xl-8 col-lg-8 mt-4">
                            <form className="w-100" onSubmit={submitBooking}>
                                
                                <div className="login-banner">
                                    <div className="d-flex align-items-center gap-3">
                                        <i className="fa-solid fa-circle-user fs-4 text-success"></i>
                                        {isLoggedIn ? (
                                            <p>Xin chào <strong>{currentUser?.name || 'bạn'}</strong>! Hệ thống đã tải danh bạ hành khách.</p>
                                        ) : (
                                            <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link> để hệ thống tự động điền thông tin!</p>
                                        )}
                                    </div>
                                </div>

                                <div className="booking-card">
                                    <div className="booking-card-header"><i className="fa-solid fa-address-book"></i>1. Contact Details</div>
                                    <div className="booking-card-body">
                                        <div className="row g-3">
                                            <div className="col-md-6"><label className="form-label">First Name *</label><input required className="custom-input" value={formData.contact.firstName} onChange={e => setFormData({...formData, contact: {...formData.contact, firstName: e.target.value}})} /></div>
                                            <div className="col-md-6"><label className="form-label">Last Name *</label><input required className="custom-input" value={formData.contact.lastName} onChange={e => setFormData({...formData, contact: {...formData.contact, lastName: e.target.value}})} /></div>
                                            <div className="col-md-6"><label className="form-label">Email *</label><input required type="email" className="custom-input" value={formData.contact.email} onChange={e => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})} /></div>
                                            <div className="col-md-6"><label className="form-label">Mobile *</label><input required type="tel" className="custom-input" value={formData.contact.phone} onChange={e => setFormData({...formData, contact: {...formData.contact, phone: e.target.value}})} /></div>
                                        </div>
                                    </div>
                                </div>

                                {formData.passengers.map((p, index) => (
                                    <div className="booking-card" key={index}>
                                        <div className="booking-card-header">
                                            <i className="fa-solid fa-user"></i>
                                            {index + 2}. Passenger Details ({p.type} {p.typeIndex})
                                        </div>
                                        <div className="booking-card-body">
                                            {isLoggedIn && savedPassengers.length > 0 && (
                                                <div className="autofill-box">
                                                    <i className="fa-solid fa-bolt text-success"></i>
                                                    <select className="autofill-select" onChange={(e) => handleAutoFillPassenger(index, e.target.value)}>
                                                        <option value="">-- Điền nhanh từ Danh bạ hành khách --</option>
                                                        {savedPassengers.filter(sp => sp.type === p.type).map(sp => (
                                                            <option key={sp._id} value={sp._id}>{sp.title}. {sp.firstName} {sp.lastName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            <div className="row g-3">
                                                <div className="col-md-2"><label className="form-label">Title *</label><select required className="custom-input" value={p.title} onChange={e => handlePassengerChange(index, 'title', e.target.value)}>{p.type === 'Adult' ? <><option>Mr</option><option>Mrs</option><option>Ms</option></> : <><option>Mstr</option><option>Miss</option></>}</select></div>
                                                <div className="col-md-5"><label className="form-label">First Name *</label><input required className="custom-input" value={p.firstName} onChange={e => handlePassengerChange(index, 'firstName', e.target.value)} /></div>
                                                <div className="col-md-5"><label className="form-label">Last Name *</label><input required className="custom-input" value={p.lastName} onChange={e => handlePassengerChange(index, 'lastName', e.target.value)} /></div>
                                                <div className="col-md-6"><label className="form-label">DOB *</label><input required type="date" className="custom-input" value={p.dateOfBirth} onChange={e => handlePassengerChange(index, 'dateOfBirth', e.target.value)} /></div>
                                                <div className="col-md-6"><label className="form-label">Nationality *</label><select required className="custom-input" value={p.nationality} onChange={e => handlePassengerChange(index, 'nationality', e.target.value)}><option>Vietnam</option><option>US</option></select></div>
                                                
                                                <div className="col-md-6 mt-4">
                                                    <label className="form-label"><i className="fa-solid fa-suitcase text-danger me-1"></i> Baggage Add-on {returnFlightId ? '(Both Ways)' : ''}</label>
                                                    <select className="custom-input" value={p.baggageOption} onChange={e => handlePassengerChange(index, 'baggageOption', e.target.value)}>
                                                        <option>No Checked Baggage (+$0.00)</option>
                                                        <option>20kg Checked Baggage (+$25.00)</option>
                                                        <option>30kg Checked Baggage (+$40.00)</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 mt-4">
                                                    <label className="form-label"><i className="fa-solid fa-chair text-danger me-1"></i> Seat Preference</label>
                                                    <select className="custom-input" value={p.seatPreference} onChange={e => handlePassengerChange(index, 'seatPreference', e.target.value)}>
                                                        <option value="Any">Any Seat (No preference)</option>
                                                        <option value="Window">Window Seat</option>
                                                        <option value="Aisle">Aisle Seat</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button type="submit" className="btn-continue" disabled={isLoading}>
                                    {isLoading ? 'Processing...' : 'Continue to Payment'} <i className="fa-solid fa-arrow-right ms-2"></i>
                                </button>
                            </form>
                        </div>

                        <div className="col-xl-4 col-lg-4 mt-4">
                            <div className="custom-sidebar">
                                <div className="custom-sidebar-header">
                                    <h4>Booking Info</h4>
                                </div>
                                
                                <div className="custom-sidebar-body">
                                
                                    <div className="badge bg-primary mb-3 py-2 px-3 fw-bold rounded-pill"><i className="fa-solid fa-plane-departure me-2"></i> Outbound Flight</div>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <img src={`/assets/image/flags/${flight?.img || 'ariso-flag.jpg'}`} alt="Airline" style={{ width: '45px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
                                        <div>
                                            <h5 className="m-0 fw-bold text-dark">{flight?.name || 'Loading...'}</h5>
                                        </div>
                                    </div>
                                    <div className="route-box">
                                        <div className="time-block">
                                            <div className="route-time">{flight?.depTime || '--:--'}</div>
                                            <div className="route-code">{flight?.dep || '---'}</div>
                                        </div>
                                        <div className="route-duration">
                                            <i className="fa-solid fa-plane"></i>
                                            <div>{flight?.duration || '---'}</div>
                                        </div>
                                        <div className="time-block">
                                            <div className="route-time">{flight?.arrTime || '--:--'}</div>
                                            <div className="route-code">{flight?.arr || '---'}</div>
                                        </div>
                                        <div className="route-date-col">
                                            <div>{flight?.depDate ? flight.depDate.substring(0, 5) : ''}<br/>{flight?.depDate ? flight.depDate.substring(5) : ''}</div>
                                        </div>
                                    </div>

                                    {returnFlight && (
                                        <>
                                            <div className="badge bg-info mt-4 mb-3 py-2 px-3 fw-bold rounded-pill text-dark"><i className="fa-solid fa-plane-arrival me-2"></i> Return Flight</div>
                                            <div className="d-flex align-items-center gap-3 mb-3">
                                                <img src={`/assets/image/flags/${returnFlight?.img || 'ariso-flag.jpg'}`} alt="Airline" style={{ width: '45px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
                                                <div>
                                                    <h5 className="m-0 fw-bold text-dark">{returnFlight?.name || 'Loading...'}</h5>
                                                </div>
                                            </div>
                                            <div className="route-box border-info">
                                                <div className="time-block">
                                                    <div className="route-time text-info">{returnFlight?.depTime || '--:--'}</div>
                                                    <div className="route-code">{returnFlight?.dep || '---'}</div>
                                                </div>
                                                <div className="route-duration text-info">
                                                    <i className="fa-solid fa-plane" style={{color: '#0dcaf0'}}></i>
                                                    <div style={{color: '#0dcaf0'}}>{returnFlight?.duration || '---'}</div>
                                                </div>
                                                <div className="time-block">
                                                    <div className="route-time text-info">{returnFlight?.arrTime || '--:--'}</div>
                                                    <div className="route-code">{returnFlight?.arr || '---'}</div>
                                                </div>
                                                <div className="route-date-col" style={{color: '#0dcaf0', borderLeftColor: '#0dcaf0'}}>
                                                    <div>{returnFlight?.depDate ? returnFlight.depDate.substring(0, 5) : ''}<br/>{returnFlight?.depDate ? returnFlight.depDate.substring(5) : ''}</div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '25px 0' }}></div>

                                    <h4 className="fw-bold mb-4" style={{ color: '#0b1a2d' }}>Price Summary</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        <li className="price-item-box"><span>Adult X {adults}</span><span>${totalAdultsPrice.toFixed(2)}</span></li>
                                        {children > 0 && <li className="price-item-box"><span>Child X {children}</span><span>${totalChildrenPrice.toFixed(2)}</span></li>}
                                        {infants > 0 && <li className="price-item-box"><span>Infant X {infants}</span><span>${totalInfantsPrice.toFixed(2)}</span></li>}
                                        {baggagePrice > 0 && <li className="price-item-box"><span>Baggage Add-ons</span><span>+${baggagePrice.toFixed(2)}</span></li>}
                                        
                                        <li className="d-flex justify-content-between px-2 mb-4 mt-2" style={{ fontWeight: '700', color: '#64748b', fontSize: '15px' }}>
                                            <span>Taxes & Fees {returnFlight ? '(x2)' : ''}</span>
                                            <span>${taxes.toFixed(2)}</span>
                                        </li>
                                        
                                        <div style={{ borderBottom: '1px solid #e2e8f0', margin: '20px 0' }}></div>
                                        
                                        <li className="d-flex justify-content-between align-items-center px-2">
                                            <span className="fw-bold text-dark" style={{ fontSize: '20px' }}>Total Payable:</span>
                                            <span className="fw-bold text-danger" style={{ fontSize: '30px' }}>${totalPayable.toFixed(2)}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}