import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Booking() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [flights, setFlights] = useState([]);
    const [airports, setAirports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [bookingStep, setBookingStep] = useState(1); 
    const [outboundData, setOutboundData] = useState(null); 
  

    const [isRoundTrip, setIsRoundTrip] = useState(searchParams.get('trip') !== 'ONEWAY');
    const [fromCity, setFromCity] = useState(searchParams.get('from') || '');
    const [toCity, setToCity] = useState(searchParams.get('to') || '');
    const [depDate, setDepDate] = useState(searchParams.get('depDate') || '');
    const [retDate, setRetDate] = useState(searchParams.get('retDate') || '');
    const [adults, setAdults] = useState(parseInt(searchParams.get('adults')) || 1);
    const [children, setChildren] = useState(parseInt(searchParams.get('children')) || 0);
    const [infants, setInfants] = useState(parseInt(searchParams.get('infants')) || 0);

    const [maxPrice, setMaxPrice] = useState(9000);
    const [timeFilter, setTimeFilter] = useState(''); 
    const [stopFilter, setStopFilter] = useState('All'); 
    const [sortBy, setSortBy] = useState('Cheapest Price');
    
    const [showPassenger, setShowPassenger] = useState(false);
    const [expandedFlightIndex, setExpandedFlightIndex] = useState(null); 
    const [showDetailsIndex, setShowDetailsIndex] = useState(null); 

    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);

    const [today, setToday] = useState('');
    useEffect(() => {
        const offset = new Date().getTimezoneOffset() * 60000;
        const localDate = new Date(Date.now() - offset).toISOString().split('T')[0];
        setToday(localDate);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const extractCode = (str) => {
                    if (!str) return undefined;
                    const match = str.match(/\(([^)]+)\)/);
                    return match ? match[1] : str;
                };

                const searchFrom = searchParams.get('from');
                const searchTo = searchParams.get('to');
                const searchDepDate = searchParams.get('depDate');
                const searchRetDate = searchParams.get('retDate');

                const apiParams = {};
                
                if (bookingStep === 1) {
                    if (searchFrom) apiParams.dep = extractCode(searchFrom);
                    if (searchTo) apiParams.arr = extractCode(searchTo);
                    if (searchDepDate) apiParams.depDate = searchDepDate;
                } 
                else {
                    if (searchTo) apiParams.dep = extractCode(searchTo); 
                    if (searchFrom) apiParams.arr = extractCode(searchFrom); 
                    if (searchRetDate) apiParams.depDate = searchRetDate; 
                }

                const [flightsData, airportsData] = await Promise.all([
                    axiosClient.get('/flights', { params: apiParams }), 
                    axiosClient.get('/airports').catch(() => []) 
                ]);
                
                setFlights(flightsData);
                setAirports(airportsData);
                setExpandedFlightIndex(null); 
            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [searchParams, bookingStep]); 

    const handleSelectFlight = (flightId, seatType) => {
       
        if (isRoundTrip && bookingStep === 1) {
            setOutboundData({ id: flightId, type: seatType });
            setBookingStep(2);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        } 
        
        else {
            const outId = isRoundTrip ? outboundData.id : flightId;
            const retId = isRoundTrip ? flightId : '';
         
            const type = isRoundTrip ? outboundData.type : seatType; 
            
            navigate(`/booking-details?id=${outId}${retId ? `&returnId=${retId}` : ''}&type=${type}&adults=${adults}&children=${children}&infants=${infants}`);
        }
    };

    const handleUpdateSearch = (e) => {
        e.preventDefault();
        setBookingStep(1); 
        setSearchParams({
            trip: isRoundTrip ? 'ROUND' : 'ONEWAY',
            from: fromCity,
            to: toCity,
            depDate,
            retDate: isRoundTrip ? retDate : '',
            adults,
            children,
            infants
        });
        setShowPassenger(false);
    };

    let processedFlights = flights.filter(f => {
        if (parseFloat(f.price || 0) > maxPrice) return false;
        if (stopFilter !== 'All' && f.stops !== stopFilter) return false;

        if (timeFilter && f.depTime) {
            const hour = parseInt(f.depTime.split(':')[0], 10);
            if (timeFilter === '00-06' && (hour < 0 || hour >= 6)) return false;
            if (timeFilter === '06-12' && (hour < 6 || hour >= 12)) return false;
            if (timeFilter === '12-18' && (hour < 12 || hour >= 18)) return false;
            if (timeFilter === '18-24' && (hour < 18 || hour >= 24)) return false;
        }
        return true;
    });

    processedFlights.sort((a, b) => {
        if (sortBy === 'Cheapest Price') return parseFloat(a.price) - parseFloat(b.price);
        if (sortBy === 'Earliest Departure') return a.depTime.localeCompare(b.depTime);
        return 0;
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const parts = dateString.split('-');
        if(parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return dateString;
    };

    const pageStyles = `
        .tn-booking--list-page { overflow: visible !important; margin-bottom: 30px; }
        .tn-booking__content { display: flex; flex-wrap: wrap; gap: 15px; align-items: flex-end; padding: 20px; background: #fff; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
        .tn-booking__content .field { flex: 1 1 140px; min-width: 130px; position: relative; border-bottom: 1px solid #eee; padding-bottom: 5px;}
        .tn-booking__content .field label { font-size: 11px; color: #888; display: block; margin-top: 5px; }
        .tn-booking__content .divider { display: none; }
        .tn-booking__content .tn-btn { flex: 0 0 auto; height: 50px; padding: 0 35px !important; margin-bottom: 5px; cursor: pointer; border: none; }
        .custom-dropdown { position: absolute; top: 100%; left: 0; width: 100%; min-width: 250px; background: #fff; border: 1px solid #ebebeb; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 0; margin-top: 10px; list-style: none; z-index: 9999; max-height: 250px; overflow-y: auto; }
        .custom-dropdown li { padding: 12px 15px; cursor: pointer; border-bottom: 1px solid #eee; transition: 0.2s; font-size: 13px; line-height: 1.4; }
        .custom-dropdown li:hover { background: #f8fafc; color: #e11d48; }
        .custom-dropdown li:last-child { border-bottom: none; }
        .flight-card { border-radius: 12px; border: 1px solid #eaeaea; transition: 0.3s; position: relative; overflow: hidden; }
        .flight-card:hover { border-color: #e11d48; box-shadow: 0 10px 30px rgba(225, 29, 72, 0.05); }
        .flight-info-tag { font-size: 11px; font-weight: 700; color: #666; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-top: 4px; }
        .urgency-text { font-size: 12px; color: #e11d48; font-weight: 600; margin-bottom: 8px; }
        .details-btn { font-size: 13px; color: #0b1a2d; text-decoration: underline; font-weight: 600; cursor: pointer; border: none; background: none; padding: 0; }
        .itinerary-box { background: #f8fafc; border-top: 1px solid #eee; padding: 20px; font-size: 14px; }
        .timeline-item { position: relative; padding-left: 25px; margin-bottom: 15px; }
        .timeline-item::before { content: ''; position: absolute; left: 0; top: 5px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid #e11d48; background: #fff; }
        .timeline-item.end::before { background: #e11d48; }
        .timeline-item::after { content: ''; position: absolute; left: 4px; top: 15px; width: 2px; height: calc(100% - 5px); background: #ddd; }
        .timeline-item.end::after { display: none; }
        .sold-out { opacity: 0.6; pointer-events: none; filter: grayscale(1); }
        .passenger-popup { min-width: 250px; border-radius: 12px; border: 1px solid #ebebeb; background: #fff; box-shadow: 0 15px 35px rgba(0,0,0,0.1); padding: 20px !important; z-index: 9999 !important; margin-top: 10px;}
        .baggage-badge { font-size: 11px; font-weight: 700; color: #10b981; background: #ecfdf5; padding: 3px 10px; border-radius: 20px; display: inline-block; margin-bottom: 10px; }
    `;

    return (
        <>
            <style>{pageStyles}</style>

            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper text-center">
                        <h2 className="text-white mb-2">
                            {bookingStep === 1 ? 'Select Outbound Flight' : 'Select Return Flight'}
                        </h2>
                        {bookingStep === 2 && (
                            <button className="btn btn-light rounded-pill btn-sm fw-bold px-4" onClick={() => setBookingStep(1)}>
                                <i className="fa-solid fa-arrow-left me-2"></i> Back to Outbound
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <section className="z-index-common bg-color2 space-extra-bottom pt-5">
                <div className="container">
                    
                    <div className="tn-booking--list-page mb-5">
                        <div className="tn-booking__tabs">
                            <div className="tabs-left d-flex"><h4 className="text-white mb-0 mt-2 ms-3">Update Your Search</h4></div>
                            <div className="tn-booking__tabs-right">
                                <label className="radio"><input type="radio" checked={isRoundTrip} onChange={() => setIsRoundTrip(true)} /><span></span> ROUND TRIP</label>
                                <label className="radio"><input type="radio" checked={!isRoundTrip} onChange={() => setIsRoundTrip(false)} /><span></span> ONE WAY</label>
                            </div>
                        </div>
                        <div className="tab-content">
                            <div className="tab-pane fade active show">
                                <form className="tn-booking__content" onSubmit={handleUpdateSearch}>
                                    
                                    <div className="field">
                                        <i className="flaticon-location"></i>
                                        <input type="text" className="booking-select bg-transparent border-0 w-100" placeholder="From" value={fromCity} onChange={e => { setFromCity(e.target.value); setShowFromDropdown(true); }} onFocus={(e) => { e.target.select(); setShowFromDropdown(true); }} onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)} />
                                        <label>Departure City</label>
                                        {showFromDropdown && (
                                            <ul className="custom-dropdown">
                                                {airports.filter(a => `${a.city} ${a.code} ${a.name}`.toLowerCase().includes(fromCity.toLowerCase())).map(a => (
                                                    <li key={a._id} onMouseDown={() => { setFromCity(`${a.city} (${a.code}) - ${a.name}`); setShowFromDropdown(false); }}><strong>{a.city} ({a.code})</strong><br/><span className="text-muted">{a.name}</span></li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="field">
                                        <i className="flaticon-location"></i>
                                        <input type="text" className="booking-select bg-transparent border-0 w-100" placeholder="To" value={toCity} onChange={e => { setToCity(e.target.value); setShowToDropdown(true); }} onFocus={(e) => { e.target.select(); setShowToDropdown(true); }} onBlur={() => setTimeout(() => setShowToDropdown(false), 200)} />
                                        <label>Arrival City</label>
                                        {showToDropdown && (
                                            <ul className="custom-dropdown">
                                                {airports.filter(a => `${a.city} ${a.code} ${a.name}`.toLowerCase().includes(toCity.toLowerCase())).map(a => (
                                                    <li key={a._id} onMouseDown={() => { setToCity(`${a.city} (${a.code}) - ${a.name}`); setShowToDropdown(false); }}><strong>{a.city} ({a.code})</strong><br/><span className="text-muted">{a.name}</span></li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="field">
                                        <i className="flaticon-calendar-1"></i>
                                        <input type="date" className="tn-date booking-select bg-transparent border-0 w-100" value={depDate} min={today} onChange={e => { setDepDate(e.target.value); if (retDate && e.target.value > retDate) setRetDate(''); }} />
                                        <label>Departure Date</label>
                                    </div>

                                    {isRoundTrip && (
                                        <div className="field">
                                            <i className="flaticon-calendar-1"></i>
                                            <input type="date" className="tn-date booking-select bg-transparent border-0 w-100" value={retDate} min={depDate || today} onChange={e => setRetDate(e.target.value)} />
                                            <label>Return Date</label>
                                        </div>
                                    )}

                                    <div className="field position-relative" onClick={() => setShowPassenger(!showPassenger)}>
                                        <i className="flaticon-user"></i>
                                        <input type="text" className="booking-select no-caret bg-transparent border-0 w-100" value={`${adults} Ad, ${children} Ch, ${infants} Inf`} readOnly style={{ cursor: 'pointer' }} />
                                        <label>Passengers</label>
                                        {showPassenger && (
                                            <div className="dropdown-menu passenger-popup show" style={{ display: 'block', position: 'absolute', top: '100%', left: '0' }} onClick={e => e.stopPropagation()}>
                                                <div className="d-flex justify-content-between align-items-center mb-3"><div><h6>Adults</h6></div><input type="number" className="qty-input" value={adults} onChange={e => setAdults(parseInt(e.target.value)||1)} min="1" /></div>
                                                <div className="d-flex justify-content-between align-items-center mb-3"><div><h6>Children</h6></div><input type="number" className="qty-input" value={children} onChange={e => setChildren(parseInt(e.target.value)||0)} min="0" /></div>
                                                <div className="d-flex justify-content-between align-items-center mb-3"><div><h6>Infants</h6></div><input type="number" className="qty-input" value={infants} onChange={e => setInfants(parseInt(e.target.value)||0)} min="0" /></div>
                                                <button type="button" className="tn-btn tn-btn__red w-100 py-2 mt-2 border-0" onClick={() => setShowPassenger(false)}>Confirm</button>
                                            </div>
                                        )}
                                    </div>
                                    <button type="submit" className="tn-btn bg-danger text-white fw-bold border-0">Update Search</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="tn-flight">
                        <div className="row">
                        
                            <div className="col-xl-3 col-lg-4">
                                <div className="tn-flight__sidebar">
                                    <h3>Filters</h3>
                                    <div className="accordion" id="filterAcc">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header"><button className="accordion-button" data-bs-toggle="collapse" data-bs-target="#priceC">Price Range</button></h2>
                                            <div id="priceC" className="accordion-collapse collapse show">
                                                <div className="accordion-body">
                                                    <input type="range" min="100" max="9000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-100" />
                                                    <div className="d-flex justify-content-between mt-2"><span>$100</span><span className="text-danger fw-bold">Max: ${maxPrice}</span></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion-item">
                                            <h2 className="accordion-header"><button className="accordion-button" data-bs-toggle="collapse" data-bs-target="#stopC">Stops</button></h2>
                                            <div id="stopC" className="accordion-collapse collapse show">
                                                <div className="accordion-body">
                                                    <div className="form-check mb-2"><input className="form-check-input" type="radio" name="stops" checked={stopFilter === 'All'} onChange={() => setStopFilter('All')} /> <label>All Flights</label></div>
                                                    <div className="form-check mb-2"><input className="form-check-input" type="radio" name="stops" checked={stopFilter === 'Direct'} onChange={() => setStopFilter('Direct')} /> <label>Direct Only</label></div>
                                                    <div className="form-check"><input className="form-check-input" type="radio" name="stops" checked={stopFilter === '1 Stop'} onChange={() => setStopFilter('1 Stop')} /> <label>1 Stop</label></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion-item">
                                            <h2 className="accordion-header"><button className="accordion-button" data-bs-toggle="collapse" data-bs-target="#timeC">Departure Time</button></h2>
                                            <div id="timeC" className="accordion-collapse collapse show">
                                                <div className="accordion-body p-0">
                                                    <div className="time-filter">
                                                        <div className={`time-filter__item ${timeFilter === '00-06' ? 'active' : ''}`} onClick={() => setTimeFilter(timeFilter === '00-06' ? '' : '00-06')}><i className="flaticon-sun"></i><span className="time">00:00 - 05:59</span></div>
                                                        <div className={`time-filter__item ${timeFilter === '06-12' ? 'active' : ''}`} onClick={() => setTimeFilter(timeFilter === '06-12' ? '' : '06-12')}><i className="flaticon-sun-1"></i><span className="time">06:00 - 11:59</span></div>
                                                        <div className={`time-filter__item ${timeFilter === '12-18' ? 'active' : ''}`} onClick={() => setTimeFilter(timeFilter === '12-18' ? '' : '12-18')}><i className="flaticon-summer"></i><span className="time">12:00 - 17:59</span></div>
                                                        <div className={`time-filter__item ${timeFilter === '18-24' ? 'active' : ''}`} onClick={() => setTimeFilter(timeFilter === '18-24' ? '' : '18-24')}><i className="flaticon-night"></i><span className="time">18:00 - 24:00</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="tn-btn tn-btn__red mt-3 w-100 border-0" onClick={() => {setMaxPrice(9000); setTimeFilter(''); setStopFilter('All');}}>Reset All</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-9 col-lg-8">
                                {isLoading ? (
                                    <div className="text-center py-5"><i className="fa-solid fa-plane-departure fa-bounce fs-1 text-danger mb-3"></i><p>Searching for best flights...</p></div>
                                ) : processedFlights.length === 0 ? (
                                    <div className="text-center py-5"><h4 className="text-danger">No flights found</h4><p>Please adjust your route or dates.</p></div>
                                ) : (
                                    <div className="tn-flight__content">
                                        <div className="d-flex justify-content-between align-items-center bg-white p-3 mb-4 rounded border">
                                            <div>
                                                <span className="fw-bold d-block">
                                                    {processedFlights.length} Flights Found
                                                    {isRoundTrip && (
                                                        <span className="text-danger ms-2 badge bg-danger text-white rounded-pill">
                                                            {bookingStep === 1 ? 'Step 1: Outbound' : 'Step 2: Return'}
                                                        </span>
                                                    )}
                                                </span>
                                                <small className="text-muted d-block mt-1">
                                                    Date: {formatDate(bookingStep === 1 ? depDate : retDate)}
                                                </small>
                                            </div>
                                            <div className="d-flex gap-3 align-items-center">
                                                <span className="text-muted">Sort by:</span>
                                                <select className="form-select form-select-sm" style={{ width: '150px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                                    <option>Cheapest Price</option>
                                                    <option>Earliest Departure</option>
                                                </select>
                                            </div>
                                        </div>

                                        {processedFlights.map((f, index) => {
                                            const isFareExpanded = expandedFlightIndex === index;
                                            const isDetailExpanded = showDetailsIndex === index;
                                            const basePrice = parseFloat(f.price) || 0;

                                            const ecoLitePrice = basePrice + (f.seats?.economyLite?.priceAddOn || 0);
                                            const ecoStdPrice = basePrice + (f.seats?.economyStandard?.priceAddOn || 0);
                                            const bizPrice = basePrice + (f.seats?.business?.priceAddOn || 0);

                                            const ecoLiteLeft = (f.seats?.economyLite?.total || 0) - (f.seats?.economyLite?.booked || 0);
                                            const ecoStdLeft = (f.seats?.economyStandard?.total || 0) - (f.seats?.economyStandard?.booked || 0);
                                            const bizLeft = (f.seats?.business?.total || 0) - (f.seats?.business?.booked || 0);

                                            const totalSeatsLeft = ecoLiteLeft + ecoStdLeft + bizLeft;

                                            return (
                                                <div className="flight-card bg-white mb-4" key={f._id || index}>
                                                    <div className="p-4">
                                                        <div className="row align-items-center">
                                                            <div className="col-md-3">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <img src={`/assets/image/flags/${f.img}`} alt={f.name} style={{ width: '45px', borderRadius: '4px' }} />
                                                                    <div>
                                                                        <h6 className="m-0 fw-bold">{f.name}</h6>
                                                                        <span className="flight-info-tag">{f.flightNumber || 'AS-102'} | {f.aircraft || 'Airbus A321'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 text-center">
                                                                <div className="d-flex align-items-center justify-content-center">
                                                                    <div className="text-end">
                                                                        <h3>{f.depTime}</h3>
                                                                        <p className="fw-bold mb-0">{f.dep}</p>
                                                                        <small className="text-muted d-block mt-1">{formatDate(f.depDate)}</small>
                                                                    </div>
                                                                    <div className="route-line mx-4">
                                                                        <span className="duration">{f.duration}</span>
                                                                        <i className="fa-solid fa-plane" style={{color: bookingStep === 2 ? '#0dcaf0' : '#10b981'}}></i>
                                                                        <span className={`stops ${f.stops !== 'Direct' ? 'text-danger' : ''}`}>{f.stops}</span>
                                                                    </div>
                                                                    <div className="text-start">
                                                                        <h3>{f.arrTime}</h3>
                                                                        <p className="fw-bold mb-0">{f.arr}</p>
                                                                        <small className="text-muted d-block mt-1">{formatDate(f.arrDate)}</small>
                                                                    </div>
                                                                </div>
                                                                <button className="details-btn mt-3" onClick={() => setShowDetailsIndex(isDetailExpanded ? null : index)}>
                                                                    {isDetailExpanded ? 'Hide Details' : 'Flight Details'} <i className={`fa-solid fa-chevron-${isDetailExpanded ? 'up' : 'down'}`}></i>
                                                                </button>
                                                            </div>
                                                            <div className="col-md-3 text-end border-start">
                                                                <div className="urgency-text text-danger mb-2">
                                                                    <i className="fa-solid fa-fire me-1"></i> Total {totalSeatsLeft} seats left!
                                                                </div>
                                                                <p className="small text-muted mb-0">Starting from</p>
                                                                <h2 className="text-danger fw-extrabold m-0">${ecoLitePrice.toFixed(2)}</h2>
                                                                <button 
                                                                    className={`tn-btn py-2 w-100 border-0 mt-3 ${isFareExpanded ? 'bg-dark text-white' : ''} ${totalSeatsLeft <= 0 ? 'sold-out' : ''}`} 
                                                                    onClick={() => setExpandedFlightIndex(isFareExpanded ? null : index)}
                                                                    disabled={totalSeatsLeft <= 0}
                                                                >
                                                                    {isFareExpanded ? 'Close Options' : (totalSeatsLeft > 0 ? 'Select' : 'Sold Out')}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {isDetailExpanded && (
                                                        <div className="itinerary-box">
                                                            <div className="row">
                                                                <div className="col-md-7">
                                                                    <h6 className="fw-bold mb-3"><i className="fa-solid fa-circle-info me-2 text-danger"></i>Hành trình chi tiết</h6>
                                                                    <div className="timeline-item">
                                                                        <strong>{f.depTime}</strong> - {f.dep} (Terminal {f.terminalDep || '1'})
                                                                        <div className="text-muted small">{formatDate(f.depDate)}</div>
                                                                    </div>
                                                                    <div className="timeline-item end">
                                                                        <strong>{f.arrTime}</strong> - {f.arr} (Terminal {f.terminalArr || '2'})
                                                                        <div className="text-muted small">{formatDate(f.arrDate)}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-5 border-start">
                                                                    <h6 className="fw-bold mb-3"><i className="fa-solid fa-suitcase me-2 text-danger"></i>Dịch vụ cơ bản</h6>
                                                                    {(f.baggageRules || [{id: 1, text: 'Suất ăn nhẹ trên máy bay'}]).map(rule => (
                                                                        <p key={rule.id} className="small mb-1"><i className="fa-solid fa-check text-success me-2"></i>{rule.text}</p>
                                                                    ))}
                                                                    <p className="small text-muted italic">* Hành lý hiển thị ở hạng ghế bên dưới</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className={`collapse ${isFareExpanded ? 'show' : ''}`}>
                                                        <div className="fare-options p-4 bg-light">
                                                            <div className="row g-3">
                                                                <div className="col-md-4">
                                                                    <div className={`fare-card p-3 border rounded text-center bg-white ${ecoLiteLeft <= 0 ? 'sold-out' : ''}`}>
                                                                        <h4 className="fw-bold">Eco Lite</h4>
                                                                        <span className="baggage-badge"><i className="fa-solid fa-suitcase"></i> {f.seats?.economyLite?.baggage || '7kg Cabin Only'}</span>
                                                                        <p className="small text-danger fw-bold">{ecoLiteLeft} seats left</p>
                                                                        <h3 className="my-3">${ecoLitePrice.toFixed(2)}</h3>
                                                                        <button className="btn btn-outline-danger w-100" onClick={() => handleSelectFlight(f._id, 'economyLite')} disabled={ecoLiteLeft <= 0}>Choose</button>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className={`fare-card p-3 border rounded text-center bg-white ${ecoStdLeft <= 0 ? 'sold-out' : ''}`} style={{ borderColor: '#e11d48', position: 'relative' }}>
                                                                        <span className="badge bg-danger position-absolute top-0 start-50 translate-middle">Recommended</span>
                                                                        <h4 className="text-danger fw-bold">Standard</h4>
                                                                        <span className="baggage-badge"><i className="fa-solid fa-suitcase-rolling"></i> {f.seats?.economyStandard?.baggage || '20kg Checked'}</span>
                                                                        <p className="small text-danger fw-bold">{ecoStdLeft} seats left</p>
                                                                        <h3 className="my-3">${ecoStdPrice.toFixed(2)}</h3>
                                                                        <button className="tn-btn tn-btn__red w-100 border-0" onClick={() => handleSelectFlight(f._id, 'economyStandard')} disabled={ecoStdLeft <= 0}>Choose</button>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className={`fare-card p-3 border rounded text-center bg-white ${bizLeft <= 0 ? 'sold-out' : ''}`}>
                                                                        <h4 className="fw-bold">Business</h4>
                                                                        <span className="baggage-badge"><i className="fa-solid fa-briefcase"></i> {f.seats?.business?.baggage || '40kg Checked'}</span>
                                                                        <p className="small text-danger fw-bold">{bizLeft} seats left</p>
                                                                        <h3 className="my-3">${bizPrice.toFixed(2)}</h3>
                                                                        <button className="btn btn-outline-danger w-100" onClick={() => handleSelectFlight(f._id, 'business')} disabled={bizLeft <= 0}>Choose</button>
                                                                    </div>
                                                                </div>
                                                            </div>
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