import { Link } from 'react-router-dom';

export default function Service() {
    const serviceItems = [
        { col: 'col-lg-3 col-md-5', icon: 'flaticon-airplane-2', num: '01', title: 'Experience jet Private' },
        { col: 'col-lg-3 col-md-6', icon: 'flaticon-secure-document', num: '02', title: 'air ticket reissue policy' },
        { col: 'col-lg-3 col-md-6', icon: 'flaticon-luggage-1', num: '03', title: 'Checked baggage included' },
        { col: 'col-lg-3 col-md-5', icon: 'flaticon-ticket', num: '04', title: 'Upgrade at check Airport' }
    ];

    const counters = [
        { num: '35', label: 'happy customers', icon: 'flaticon-customer-review', suffix: 'K+' },
        { num: '100', label: 'Client Satisfied', icon: 'flaticon-global', suffix: '%' }
    ];

    const steps = [
        { icon: 'flaticon-tickets', title: 'Online Booking' },
        { icon: 'flaticon-flight-mode', title: 'Flight Ticket' },
        { icon: 'flaticon-world', title: 'Confirm Travel' },
        { icon: 'flaticon-credit-card', title: 'Easy Payments' }
    ];

    return (
        <>
            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper z-index-common text-center">
                        <h2 className="text-white mb-15">Services Page</h2>
                        <nav>
                            <ol className="breadcrumb justify-content-center">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Services Page</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

            <section className="tn-service--style2 z-index-common space parallax-wrap" style={{ backgroundImage: "url('/assets/image/bg/overlay.png')" }}>
                <img src="/assets/image/feature/ele1.png" alt="ele1" className="tn-service-treeEle parallax-element" loading="lazy" data-move-y="0.1" data-move-x="1.9" data-move="10" />
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-7">
                            <div className="mb-20 title-anime animation-style3">
                                <div className="title-anime__split">
                                    <span className="tn-title__sub">Why Choose Us</span>
                                    <h2 className="tn-title__main">Experience Browse By Topic & Service</h2>
                                </div>
                            </div>
                            <p className="description">frequently asked questions just one click away.</p>
                            <Link to="/service" className="tn-btn tn-btn__red mt-30">more service</Link>
                        </div>
                        
                        {serviceItems.map((s, idx) => (
                            <div className={s.col} key={idx}>
                                <div className="tn-service__box">
                                    <div className="d-flex justify-content-between align-items-center mb-25">
                                        <i className={s.icon}></i>
                                        <p className="number">{s.num}</p>
                                    </div>
                                    <Link to="/service-details"><h2>{s.title}</h2></Link>
                                    <p className="stxt">right private jet is essential for comfoable efficien. </p>
                                </div>
                            </div>
                        ))}
                        
                        <div className="col-lg-6 col-md-7">
                            <div className="tn-service__box ps-5">
                                <p className="description py-15">Get Your air ticket booking </p>
                                <h3>Don't Waste a Second! Call Us Solve Your Any problem</h3>
                                <Link to="/contact" className="tn-btn tn-btn__red my-20">find solution</Link>
                                <img src="/assets/image/icons/plane-red.png" alt="ele" className="plane-ele" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="tn-video--style2 z-index-common bg-title overflow-hidden space parallax-wrap" style={{ backgroundImage: "url('/assets/image/bg/video-banner-img-h2.png')" }}>
                <img src="/assets/image/icons/plane-white.png" alt="ele" className="tn-video__ele1 parallax-element" data-move-y="1.5" loading="lazy" data-move-x="0.1" data-move="10" />
                <div className="container">
                    <div className="row p-0 justify-content-between align-items-center">
                        <div className="col-lg-7 pe-xxl-5">
                            <div className="title-anime animation-style3 z-index-common me-xl-5 pe-xl-5">
                                <div className="title-anime__split ">
                                    <span className="tn-title__sub text-white">Best Deals Offer</span>
                                    <h2 className="tn-title__main text-white">Experience The Luxury Private Jet</h2>
                                </div>
                            </div>
                            <div className="tn-video--counter me-xxl-5">
                                {counters.map((c, idx) => (
                                    <div className="counter-body" key={idx}>
                                        <div className="counter-txt">
                                            <h3><span className="counter-number" data-counter={c.num}>{c.num}</span>{c.suffix}</h3>
                                            <p>{c.label}</p>
                                        </div>
                                        <div className="counter-icon"><i className={c.icon}></i></div>
                                    </div>
                                ))}
                            </div>
                            <div className="cTxt">
                                <p>Choosing the right private jet is essential</p>
                                <Link to="/contact" className="tn-btn tn-btn__red">contact us</Link>
                            </div>
                        </div>
                        <div className="col-auto me-lg-5 vTxt-right">
                            <p className="vTxt"><img src="/assets/image/icons/arrow-h2.png" alt="arrow" /> watch video</p>
                            <a href="https://www.youtube.com/shorts/NMtMuFQYPZM" className="play-btn popup-video"><i className="fa-solid fa-play"></i></a>
                        </div>
                    </div>
                    <div className="tn-video__rightImg">
                        <img src="/assets/image/bg/video-img-h2.jpg" alt="Image" />
                        <div className="tn-video__shape"></div>
                    </div>
                </div>
            </section>

            <section className="tn-process space-extra-top space-extra-bottom z-index-common">
                <div className="container">
                    <div className="tn-process__bgImg"><img src="/assets/image/bg/roadMap-bg-h1.png" alt="RoadMap-bg" /></div>
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
                        {steps.map((step, idx) => (
                            <div className="col-lg-3 col-md-6 col-sm-6" key={idx}>
                                <div className="tn-process__item">
                                    <div className="tn-process__icon"><i className={step.icon}></i></div>
                                    <Link to="/booking"><h3>{step.title}</h3></Link>
                                    <p>Mixture Of Metal And Other Elents Hey Generay Provide Dreter.</p>
                                    <Link to="/booking" className="tn-process__arrow"><i className="fa-solid fa-angles-right"></i></Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}