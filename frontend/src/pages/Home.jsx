import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Home() {
    const navigate = useNavigate();

    const [airports, setAirports] = useState([]);
    const [activeTab, setActiveTab] = useState('nav_one');
    const [isRoundTrip, setIsRoundTrip] = useState(true);

    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [depDate, setDepDate] = useState('');
    const [retDate, setRetDate] = useState('');

    const [showPassenger, setShowPassenger] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);

    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);

    const [searchPnr, setSearchPnr] = useState('');
    const [searchLastName, setSearchLastName] = useState('');

    const [flightNo, setFlightNo] = useState('');
    const [statusDate, setStatusDate] = useState('');

    const handleManageBooking = (e) => {
        e.preventDefault();
        if (!searchPnr || !searchLastName) return alert("Vui lòng nhập PNR và Họ (Last Name)");
    
        navigate(`/manage-booking?pnr=${searchPnr}&lastName=${searchLastName}`);
    };

    const handleFlightStatus = (e) => {
        e.preventDefault();
        if (!flightNo || !statusDate) return alert("Vui lòng nhập Mã chuyến bay và Ngày");
       
        navigate(`/flight-status?flightNo=${flightNo}&date=${statusDate}`);
    };

    const today = useMemo(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localDate = new Date(now.getTime() - offset).toISOString().split('T')[0];
        return localDate;
    }, []);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const data = await axiosClient.get('/airports');
                setAirports(data);
            } catch (err) {
                console.error("Lỗi lấy danh sách sân bay:", err);
            }
        };
        fetchAirports();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        const params = new URLSearchParams({
            trip: isRoundTrip ? 'ROUND' : 'ONEWAY',
            from: fromCity,
            to: toCity,
            depDate,
            retDate: isRoundTrip ? retDate : '',
            adults,
            children,
            infants
        });

        navigate(`/booking?${params.toString()}`);
    };

    const steps = [
        { icon: 'flaticon-tickets', title: 'Online Booking' }, 
        { icon: 'flaticon-flight-mode', title: 'Flight Ticket' },
        { icon: 'flaticon-world', title: 'Confirm Travel' }, 
        { icon: 'flaticon-credit-card', title: 'Easy Payments' }
    ];

    const faqs = [
        { id: 'One', title: 'Why Do I Need A Professional Email?', desc: 'Our goal each day is to ensure that our residents’ needs are not only met but exceeded.', show: true },
        { id: 'Two', title: 'Compassion New Beginning?', desc: 'Our goal each day is to ensure that our residents’ needs are not only met but exceeded.', show: false },
        { id: 'Three', title: 'Need A Website For My Business?', desc: 'Our goal each day is to ensure that our residents’ needs are not only met but exceeded.', show: false }
    ];

    // const clients = [
    //     { img: '1', name: 'alex aster', role: 'Google CEO' }, { img: '2', name: 'paul walker', role: 'Google CEO' }, { img: '1', name: 'alex aster', role: 'Google CEO' }
    // ];

    // const blogs = [
    //     { img: '1', title: 'Travel The Most Beautiful' }, { img: '2', title: 'Sustainable Travel Initiatives' }, { img: '3', title: 'Customized Travel Packages' }
    // ];

    useEffect(() => {
        const loadScript = (src) => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = false; 
                script.onload = () => resolve(script);
                document.body.appendChild(script);
            });
        };

        const loadAllScripts = async () => {
            try {
                await loadScript('/assets/js/jquery.min.js'); 
                await loadScript('/assets/js/swiper-bundle.min.js');
                await loadScript('/assets/js/magnific-popup.min.js');
                await loadScript('/assets/js/main.js'); 
            } catch (error) { console.log(error); }
        };
        loadAllScripts();
    }, []);

    return (
        <>
            <style>
                {`
                .tn-booking, .tn-booking .tab-content, .tn-booking .tab-pane, .tn-booking__content { overflow: visible !important; }
                /* Chỉnh layout form về flex-wrap để không bị tràn */
                #nav_one .tn-booking__content { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; }
                #nav_one .tn-booking__content .field { padding: 0 10px !important; flex: 1 1 140px !important; min-width: 130px !important; position: relative; border-bottom: none; }
                #nav_one .tn-booking__content .divider { display: none; }
                #nav_one .tn-booking__content .tn-btn { padding: 22px 35px !important; white-space: nowrap !important; flex: 0 0 auto !important; height: auto; }
                #nav_one .tn-booking__content input { font-size: 14px !important; text-overflow: ellipsis; padding-right: 5px !important; }
                .booking-select:focus { outline: none; box-shadow: none; }
                .no-caret::after { display: none !important; }
                
                /* CUSTOM DROPDOWN SÂN BAY */
                .custom-dropdown { position: absolute; top: 100%; left: 0; width: 100%; min-width: 250px; background: #fff; border: 1px solid #ebebeb; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 0; margin-top: 10px; list-style: none; z-index: 9999; max-height: 250px; overflow-y: auto; text-align: left; }
                .custom-dropdown li { padding: 12px 15px; cursor: pointer; border-bottom: 1px solid #eee; transition: 0.2s; font-size: 13px; line-height: 1.4; }
                .custom-dropdown li:hover { background: #f8fafc; color: #e11d48; }
                .custom-dropdown li:last-child { border-bottom: none; }

                .passenger-popup { min-width: 250px; border-radius: 12px; border: 1px solid #ebebeb; box-shadow: 0 15px 35px rgba(0,0,0,0.1); padding: 20px !important; margin-top: 15px !important; z-index: 9999 !important; background: #fff; }
                .passenger-popup h6 { font-size: 15px; margin-bottom: 2px; }
                .passenger-popup small { font-size: 12px; }
                .passenger-popup .qty-input { width: 60px !important; text-align: center; border: 1px solid #ddd; border-radius: 6px; padding: 4px 8px !important; font-weight: bold; flex: none !important; }
                `}
            </style>

            <section className="tn-hero">
                <div className="tn-hero__ele"><img className="tn-xx-anim" src="/assets/image/hero/hero-ele-h1.png" alt="ele" /></div>
                <div className="swiper heroSwiper">
                    <div className="swiper-wrapper">
                        <div className="swiper-slide">
                            <div className="tn-hero__bg" style={{ backgroundImage: "url('/assets/image/hero/hero-banner-img-h1.jpg')" }}></div>
                            <div className="container">
                                <div className="tn-hero__content">
                                    <div className="tn-hero__shape">
                                        <span className="tn-hero__title--sub tn-hero__anim">Explore World</span>
                                        <h1 className="tn-hero__title--main tn-hero__anim text-white">discover <span>world</span> private jet</h1>
                                        <p className="tn-hero__desc tn-hero__anim">Hey Buddy! Safe, secure, reliable your ticketing.</p>
                                        <Link to="/contact" className="tn-btn tn-btn__red tn-hero__anim">Contact us</Link>
                                    </div>
                                </div>
                                <div className="tn-hero__img"><img src="/assets/image/hero/hero-img-h1.jpg" alt="Image" loading="lazy" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="z-index-common bg-color2 space-extra-bottom parallax-wrap" style={{ backgroundImage: "url('/assets/image/about/about-overlay-h1.png')" }}>
                <img src="/assets/image/about/about-ele1-h1.png" alt="ele" className="tn-about__ele1 parallax-element" loading="lazy" />
                <div className="about__shape"><img src="/assets/image/about/about-spape-h1.svg" alt="About Shape" loading="lazy" /></div>
                
                <div className="container">
                    <div className="tn-booking">
                        <div className="tn-booking__tabs">
                            <div className="tabs-left d-flex" id="nav-tab" role="tablist">
                                <button className={`tab ${activeTab === 'nav_one' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('nav_one')}>AIR BOOKING</button>
                                <button className={`tab ${activeTab === 'nav_two' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('nav_two')}>MANAGE BOOKING</button>
                               
                                <button className={`tab ${activeTab === 'nav_five' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('nav_five')}>FLIGHT STATUS</button>
                            </div>
                            <div className="tn-booking__tabs-right" style={{ display: activeTab === 'nav_one' ? 'block' : 'none' }}>
                                <label className="radio"><input type="radio" name="trip" checked={isRoundTrip} onChange={() => setIsRoundTrip(true)} /><span></span> ROUND TRIP</label>
                                <label className="radio"><input type="radio" name="trip" checked={!isRoundTrip} onChange={() => setIsRoundTrip(false)} /><span></span> ONE WAY</label>
                            </div>
                        </div>
                        
                        <div className="tab-content" id="nav-tabContent">
                            <div className={`tab-pane fade ${activeTab === 'nav_one' ? 'active show' : ''}`} id="nav_one" role="tabpanel">
                                <form className="tn-booking__content" onSubmit={handleSearch}>
                                    
                                    <div className="field">
                                        <i className="flaticon-location"></i>
                                        <input 
                                            type="text" 
                                            className="booking-select bg-transparent border-0 w-100" 
                                            placeholder="From City/Airport" 
                                            value={fromCity} 
                                            onChange={e => { setFromCity(e.target.value); setShowFromDropdown(true); }} 
                                            onFocus={(e) => { e.target.select(); setShowFromDropdown(true); }}
                                            onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                                        />
                                        <label>Departure</label>
                                        {showFromDropdown && (
                                            <ul className="custom-dropdown">
                                                {airports.filter(a => `${a.city} ${a.code} ${a.name}`.toLowerCase().includes(fromCity.toLowerCase())).map(a => (
                                                    <li key={a._id} onMouseDown={() => { setFromCity(`${a.city} (${a.code}) - ${a.name}`); setShowFromDropdown(false); }}>
                                                        <strong>{a.city} ({a.code})</strong><br/><span className="text-muted">{a.name}</span>
                                                    </li>
                                                ))}
                                                {airports.filter(a => `${a.city} ${a.code} ${a.name}`.toLowerCase().includes(fromCity.toLowerCase())).length === 0 && (
                                                    <li className="text-muted text-center py-2">Không tìm thấy sân bay</li>
                                                )}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="field">
                                        <i className="flaticon-location"></i>
                                        <input 
                                            type="text" 
                                            className="booking-select bg-transparent border-0 w-100" 
                                            placeholder="To City/Airport" 
                                            value={toCity} 
                                            onChange={e => { setToCity(e.target.value); setShowToDropdown(true); }} 
                                            onFocus={(e) => { e.target.select(); setShowToDropdown(true); }}
                                            onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                                        />
                                        <label>Arrival</label>
                                        {showToDropdown && (
                                            <ul className="custom-dropdown">
                                                {airports.filter(a => `${a.city} ${a.code} ${a.name}`.toLowerCase().includes(toCity.toLowerCase())).map(a => (
                                                    <li key={a._id} onMouseDown={() => { setToCity(`${a.city} (${a.code}) - ${a.name}`); setShowToDropdown(false); }}>
                                                        <strong>{a.city} ({a.code})</strong><br/><span className="text-muted">{a.name}</span>
                                                    </li>
                                                ))}
                                                {airports.filter(a => `${a.city} ${a.code} ${a.name}`.toLowerCase().includes(toCity.toLowerCase())).length === 0 && (
                                                    <li className="text-muted text-center py-2">Không tìm thấy sân bay</li>
                                                )}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="field">
                                        <i className="flaticon-calendar-1"></i>
                                        <input 
                                            type="date" 
                                            className="tn-date booking-select bg-transparent border-0 w-100" 
                                            value={depDate} 
                                            min={today}
                                            onChange={e => {
                                                setDepDate(e.target.value);
                                                if (retDate && e.target.value > retDate) setRetDate('');
                                            }} 
                                        />
                                        <label>Departure Date</label>
                                    </div>
                                    
                                    {isRoundTrip && (
                                        <div className="field">
                                            <i className="flaticon-calendar-1"></i>
                                            <input 
                                                type="date" 
                                                className="tn-date booking-select bg-transparent border-0 w-100" 
                                                value={retDate} 
                                                min={depDate || today} 
                                                onChange={e => setRetDate(e.target.value)} 
                                            />
                                            <label>Return Date</label>
                                        </div>
                                    )}
                                    
                                    <div className="field position-relative">
                                        <i className="flaticon-user"></i>
                                        <div className="dropdown w-100">
                                            <input type="text" className="booking-select no-caret bg-transparent border-0 w-100" onClick={() => setShowPassenger(!showPassenger)} value={`${adults} Ad, ${children} Ch, ${infants} Inf`} readOnly style={{ cursor: 'pointer' }} />
                                            {showPassenger && (
                                                <div className="dropdown-menu passenger-popup show" style={{ display: 'block', position: 'absolute', top: '100%', left: '0' }} onClick={e => e.stopPropagation()}>
                                                    <div className="d-flex justify-content-between align-items-center mb-3"><div><h6>Adults</h6><small className="text-muted">{`> 12 years`}</small></div><input type="number" className="qty-input form-control" value={adults} onChange={e => setAdults(Math.max(1, parseInt(e.target.value) || 1))} min="1" max="9" /></div>
                                                    <div className="d-flex justify-content-between align-items-center mb-3"><div><h6>Children</h6><small className="text-muted">2 - 12 years</small></div><input type="number" className="qty-input form-control" value={children} onChange={e => setChildren(Math.max(0, parseInt(e.target.value) || 0))} min="0" max="9" /></div>
                                                    <div className="d-flex justify-content-between align-items-center"><div><h6>Infants</h6><small className="text-muted">Under 2</small></div><input type="number" className="qty-input form-control" value={infants} onChange={e => setInfants(Math.max(0, parseInt(e.target.value) || 0))} min="0" max="9" /></div>
                                                    <button type="button" className="tn-btn tn-btn__red w-100 py-2 mt-3 border-0" onClick={() => setShowPassenger(false)}>Confirm</button>
                                                </div>
                                            )}
                                        </div>
                                        <label>Passenger</label>
                                    </div>
                                    <button type="submit" className="tn-btn bg-danger text-white border-0 fw-bold">Search</button>
                                </form>
                            </div>

                            <div className={`tab-pane fade ${activeTab === 'nav_two' ? 'active show' : ''}`} id="nav_two" role="tabpanel">
                                <form className="tn-booking__content" onSubmit={handleManageBooking}>
                                    <div className="field w-50">
                                        <i className="fa-solid fa-ticket"></i>
                                        <input required type="text" className="booking-select bg-transparent border-0" placeholder="e.g. ABCDEF" value={searchPnr} onChange={e => setSearchPnr(e.target.value.toUpperCase())} />
                                        <label>Booking Reference (PNR)</label>
                                    </div>
                                    <div className="divider"></div>
                                    <div className="field w-50">
                                        <i className="fa-solid fa-user"></i>
                                        <input required type="text" className="booking-select bg-transparent border-0" placeholder="Last Name" value={searchLastName} onChange={e => setSearchLastName(e.target.value)} />
                                        <label>Passenger Last Name</label>
                                    </div>
                                    <div className="divider"></div>
                                    <button type="submit" className="tn-btn bg-danger text-white border-0 fw-bold">Find Booking</button>
                                </form>
                            </div>

                            <div className={`tab-pane fade ${activeTab === 'nav_five' ? 'active show' : ''}`} id="nav_five" role="tabpanel">
                                <form className="tn-booking__content" onSubmit={handleFlightStatus}>
                                    <div className="field w-50">
                                        <i className="fa-solid fa-plane-departure"></i>
                                        <input required type="text" className="booking-select bg-transparent border-0" placeholder="e.g. AS-102" value={flightNo} onChange={e => setFlightNo(e.target.value)} />
                                        <label>Flight Number</label>
                                    </div>
                                    <div className="divider"></div>
                                    <div className="field w-50">
                                        <i className="fa-regular fa-calendar-days"></i>
                                        <input required type="date" className="tn-date booking-select bg-transparent border-0 w-100" value={statusDate} onChange={e => setStatusDate(e.target.value)} />
                                        <label>Date</label>
                                    </div>
                                    <div className="divider"></div>
                                    <button type="submit" className="tn-btn bg-danger text-white border-0 fw-bold">Check Status</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="tn-service position-relative">
                        <div className="tn-service__card"><div className="icon"><i className="flaticon-airplane"></i></div><div className="tn-service__content"><Link to="/service-details"><h2>International Flight</h2></Link><p>Call +959 568 265 For Booking Assistance</p></div><div className="tn-service__arrow"><img src="/assets/image/icons/arrow-bg.png" alt="Icon Arrow" /><i className="fa-solid fa-arrow-right"></i></div></div>
                        <div className="tn-service__card"><div className="icon"><i className="flaticon-helicopter"></i></div><div className="tn-service__content"><Link to="/service-details"><h2>Personal Schedule</h2></Link><p>Trade Crowded Airports Wasted Dhe Ease Booking</p></div><div className="tn-service__arrow"><img src="/assets/image/icons/arrow-bg.png" alt="Icon Arrow" /><i className="fa-solid fa-arrow-right"></i></div></div>
                        <div className="tn-service__card"><div className="icon"><i className="flaticon-lock"></i></div><div className="tn-service__content"><Link to="/service-details"><h2>Online Payment</h2></Link><p>Trade Crowded Airports Wasted Dhe Ease Booking</p></div></div>
                    </div>

                    <div className="tn-about position-relative space-extra-top parallax-wrap">
                        <div className="row">
                            <div className="col-lg-5 col-md-12">
                                <div className="tn-about--left">
                                    <img src="/assets/image/about/about-imgBg-h1.png" className="bg-img" loading="lazy" />
                                    <img src="/assets/image/about/about-img-h1.jpg" className="main-img" loading="lazy" />
                                    <img src="/assets/image/icons/dot-icon.png" className="dotIcon parallax-element" loading="lazy" />
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-9 ps-0">
                                <div className="tn-about--middle pt-30">
                                    <div className="title-anime animation-style3 mb-30">
                                        <div className="title-anime__split">
                                            <span className="tn-title__sub">About Discover</span>
                                            <h2 className="tn-title__main">Your Trusted Source Incredible Journey</h2>
                                        </div>
                                    </div>
                                    <div className="tn-about--content">
                                        <p>mixtures of a metal and other elents.They generally provide greater over pure metal, which usually much softer.</p>
                                        <ul className="tn-list pt-10 mb-30">
                                            <li><img src="/assets/image/icons/check-icon.png" /> First Class Cabin </li>
                                            <li><img src="/assets/image/icons/check-icon.png" /> Business Travel </li>
                                            <li><img src="/assets/image/icons/check-icon.png" /> Premium Economy </li>
                                        </ul>
                                        <Link to="/about" className="tn-btn bg-title">about us</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-3">
                                <div className="tn-about--right pt-30">
                                    <img src="/assets/image/about/about-imgbg2-h1.jpg" className="bgImg" loading="lazy" />
                                    <div className="txt">
                                        <span>destinations</span>
                                        <img src="/assets/image/about/about-img2-h1.jpg" loading="lazy" />
                                        <div className="yoe"><h3 className="text-white">39+</h3><p className="text-white">Year Experience</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="tn-process space-extra-top space-extra-bottom z-index-common">
                <div className="container">
                    <div className="tn-process__bgImg"><img src="/assets/image/bg/roadMap-bg-h1.png" /></div>
                    <div className="row">
                        <div className="col-lg-7 mx-auto">
                            <div className="tn-title title-anime animation-style3">
                                <div className="title-anime__split text-center">
                                    <span className="tn-title__sub">Booking Roadmap</span>
                                    <h2 className="tn-title__main"><span className="d-block text-title">4 Easy Steps</span> Source Incredible Journey</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row p-0">
                        {steps.map((s, idx) => (
                            <div className="col-lg-3 col-md-6 col-sm-6" key={idx}>
                                <div className="tn-process__item">
                                    <div className="tn-process__icon"><i className={s.icon}></i></div>
                                    <Link to="/booking"><h3>{s.title}</h3></Link>
                                    <p>Mixture Of Metal And Other Elents Hey Generay Provide Dreter.</p>
                                    <Link to="/booking" className="tn-process__arrow"><i className="fa-solid fa-angles-right"></i></Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="tn-video z-index-common overflow-hidden space parallax-wrap bg-fixed" style={{ backgroundImage: "url('/assets/image/bg/video-banner-img-h1.jpg')" }}>
                <img src="/assets/image/icons/tree-icon.png" className="tree-ele parallax-element" loading="lazy" />
                <div className="container">
                    <div className="tn-video__btnBg"><img src="/assets/image/bg/video-bg-h1.png" /></div>
                    <div className="row p-0 justify-content-between align-items-center">
                        <div className="col-lg-6 col-md-8 col-sm-9 mt-xl-5">
                            <div className="title-anime animation-style3 position-relative">
                                <div className="title-anime__split ">
                                    <span className="tn-title__sub text-white">Get Free Offer</span>
                                    <h2 className="tn-title__main text-white"><span className="d-block text-white">Start Your Discover</span> Destinations World Airline Expert</h2>
                                </div>
                                <img src="/assets/image/icons/plane-ele-white.svg" className="plane-ele parallax-element" loading="lazy" />
                            </div>
                            <Link to="/booking" className="tn-btn tn-btn__red mt-40">Booking Now</Link>
                        </div>
                        <div className="col-auto me-lg-5 pe-lg-5">
                            <a href="https://www.youtube.com/watch?v=vEVtnS3sqe4" className="play-btn popup-video"><i className="fa-solid fa-play"></i></a>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="z-index-common tn-faq space parallax-wrap" style={{ backgroundImage: "url('/assets/image/bg/faq-bg-h1.png')" }}>
                <div className="tn-faq__ele"><img className="tn-xx-anim" src="/assets/image/hero/hero-ele-h1.png" alt="ele" /></div>
                <div className="container">
                    <div className="tn-faq__wrap">
                        <div className="tn-faq__media">
                            <img src="/assets/image/about/faq-img-h1.jpg" alt="FAQ" loading="lazy" />
                            <div className="tn-faq__badge">
                                <img src="/assets/image/about/faq-img2-h1.png" alt="FAQ" loading="lazy" />
                                <div className="roundtxt">
                                    <svg className="circleText" viewBox="0 0 500 500" data-duration="1">
                                        <path id="textcircle" strokeWidth="10" data-duration="1" d="M50,250c0-110.5,89.5-200,200-200s200,89.5,200,200s-89.5,200-200,200S50,360.5,50,250"></path>
                                        <text className="r-txt" dy="-35"><textPath href="#textcircle">Navigate to Every Crner of the Planet</textPath></text>
                                    </svg>
                                    <i className="fa-solid fa-plane-up"></i>
                                </div>
                            </div>
                            <div className="tn-faq__ele2"><img className="parallax-element" src="/assets/image/about/faq-ele1-h1.png" alt="ele" /></div>
                        </div>
                        <div className="tn-faq__content">
                            <div className="row"><div className="col-lg-12"><div className="mb-20 title-anime animation-style3"><div className="title-anime__split"><span className="tn-title__sub">Faq Questions</span><h2 className="tn-title__main">Frequently Ask Questions Of Customer</h2></div></div><p className="pe-lg-5 mb-30">Our Goal Each Day Is To Ensure That Our Residents' Needs Are Not Only Met But Exceeded.</p></div></div>
                            <div className="tn-faq__tab">
                                <div className="accordion" id="accordionExample">
                                    {faqs.map(faq => (
                                        <div className="accordion-item" key={faq.id}>
                                            <h2 className="accordion-header" id={`heading${faq.id}`}>
                                                <button className={`accordion-button ${faq.show ? '' : 'collapsed'}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${faq.id}`} aria-expanded={faq.show ? 'true' : 'false'} aria-controls={`collapse${faq.id}`}>{faq.title}</button>
                                            </h2>
                                            <div id={`collapse${faq.id}`} className={`accordion-collapse collapse ${faq.show ? 'show' : ''}`} data-bs-parent="#accordionExample">
                                                <div className="accordion-body"><p>{faq.desc}</p></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section className="tn-client space bg-title z-index-common bg-fixed" style={{ backgroundImage: "url('/assets/image/client/client-bg.png')" }}>
                <div className="container">
                    <div className="row"><div className="col-lg-7 mx-auto"><div className="tn-title text-center title-anime animation-style3"><div className="title-anime__split"><span className="tn-title__sub text-white">Testimonial</span><h2 className="tn-title__main text-white">Our Happy Customers</h2></div></div></div></div>
                    <div className="swiper testiSlider" data-swiper="" data-pagination="global" data-split="2" data-xl="2" data-lg="2" data-md="1">
                        <div className="swiper-wrapper">
                            {clients.map((client, idx) => (
                                <div className="swiper-slide" key={idx}>
                                    <div className="tn-client__content">
                                        <div className="tn-client__image">
                                            <img src={`/assets/image/client/client-img${client.img}.png`} alt="client-img" />
                                            <img src="/assets/image/icons/round-icon.png" alt="round-icon" className="round-icon" />
                                        </div>
                                        <div className="tn-client__txt">
                                            <p>“Express Travel, we believe in the transmative power of travel. As avid explorers ourselves, that understand omneque modo alterum”</p>
                                            <h2>{client.name}</h2><span>{client.role}</span>
                                            <div className="tn-client__txt--quote"><i className="fa-solid fa-quote-left"></i></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="custom-pagination"><span className="pg pg-1 active"></span><span className="pg pg-2"></span></div>
                    </div>
                </div>
            </section> */}

            {/* <section className="space space-extra-bottom z-index-common overflow-hidden" style={{ backgroundImage: "url('/assets/image/blog/blog-bg.png')" }}>
                <div className="container">
                    <div className="row align-items-center justify-content-lg-between"><div className="col-lg-9 col-md-8"><div className="tn-title title-anime animation-style3"><div className="title-anime__split"><span className="tn-title__sub">News And Blog</span><h2 className="tn-title__main">Recent Story & Articles</h2></div></div></div><div className="col-lg-3 col-md-4 text-lg-end"><Link to="/blog" className="tn-btn mb-40">View all blogs</Link></div></div>
                    <div className="swiper blogSlider" data-swiper="" data-xl="3" data-md="2" data-sm="1">
                        <div className="swiper-wrapper">
                            {blogs.map((b, idx) => (
                                <div className="swiper-slide" key={idx}>
                                    <div className="tn-blog__inner">
                                        <div className="tn-blog__img"><Link to="/blog"><img src={`/assets/image/blog/blog-h1-img${b.img}.jpg`} loading="lazy" /></Link></div>
                                        <div className="tn-blog__content">
                                            <div className="tn-blog__meta"><Link to="/blog"><i className="fa-regular fa-calendar-days"></i> 26, January 2026</Link></div>
                                            <Link to="/blog"><h2 className="tn-blog__title">{b.title}</h2></Link>
                                            <p className="tn-blog__desc">Lorem Ipsum available, but id majority have alteration in some form.</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <Link to="/blog" className="tn-blog__btn">Read more<i className="fa-solid fa-arrow-right"></i></Link>
                                                <Link to="/blog" className="tn-blog__share"><i className="fa-solid fa-share-nodes"></i></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section> */}
        </>
    );
}