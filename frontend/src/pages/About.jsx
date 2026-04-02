import { Link } from 'react-router-dom';

export default function About() {
    const listItems = ['private jet is essential for a comfortable ', 'essential for a comfortable '];
    
    const counters = [
        { num: '35', label: 'happy customers', icon: 'flaticon-customer-review', suffix: 'K+' },
        { num: '100', label: 'Client Satisfied', icon: 'flaticon-global', suffix: '%' }
    ];

    const faqs = [
        { id: 'One', title: 'Why Do I Need A Professional Email?', desc: 'Our goal each day is to ensure that our residents’ needs are not only met but exceeded.', show: true },
        { id: 'Two', title: 'Compassion New Beginning?', desc: 'Our goal each day is to ensure that our residents’ needs are not only met but exceeded.', show: false },
        { id: 'Three', title: 'Need A Website For My Business?', desc: 'Our goal each day is to ensure that our residents’ needs are not only met but exceeded.', show: false }
    ];

    return (
        <>
            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper z-index-common text-center">
                        <h2 className="text-white mb-15">About Company</h2>
                        <nav>
                            <ol className="breadcrumb justify-content-center">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">About Company</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

            <section className="z-index-common tn-faq space space-extra-bottom parallax-wrap" style={{ backgroundImage: "url('/assets/image/bg/faq-bg-h1.png')" }}>
                <div className="tn-faq__ele">
                    <img className="tn-xx-anim" src="/assets/image/hero/hero-ele-h1.png" alt="ele" />
                </div>
                <div className="container">
                    <div className="tn-about2">
                        <div className="tn-about2__media mb-30">
                            <img src="/assets/image/about/about-img-h2.jpg" alt="about" loading="lazy" />
                            <img src="/assets/image/about/about-img2-h2.jpg" alt="about" loading="lazy" className="about-img2" />
                        </div>
                        <div className="tn-about2--content">
                            <div className="row">
                                <div className="col-lg-12 pe-lg-0">
                                    <div className="mb-20 title-anime animation-style3">
                                        <div className="title-anime__split">
                                            <span className="tn-title__sub">Know About Flight</span>
                                            <h2 className="tn-title__main">Experience The Luxury Private Jet</h2>
                                        </div>
                                    </div>
                                    <p className="pe-xl-4 mb-30">Choosing the right private jet is essential for a comfortable, efficient that and travel experience. Whether you're flying for business.</p>
                                    
                                    <div className="d-flex align-items-center mb-30">
                                        <div className="tn-about2__icon"><i className="flaticon-airplane-3"></i></div>
                                        <div className="tn-about2__txt pe-xl-5">
                                            <h3 className="mb-1">Easy & Quick Booking</h3>
                                            <p className="m-0">right private jet is essential for a comfortable, efficient that and travel experience.</p>
                                        </div>
                                    </div>
                                    
                                    <ul className="tn-about2__list p-0 mb-30">
                                        {listItems.map((text, idx) => (
                                            <li key={idx}><img src="/assets/image/icons/check-icon.png" alt="Icon" /> {text}</li>
                                        ))}
                                    </ul>
                                    
                                    <div className="d-flex align-items-center">
                                        <Link to="/about" className="tn-btn">discover more</Link>
                                        <div className="tn-about2__icon-txt">
                                            <i className="flaticon-phone"></i>
                                            <h4><span>Call us free</span> +1 568 562 889</h4>
                                        </div>
                                    </div>
                                </div>
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

            <section className="z-index-common tn-faq space parallax-wrap" style={{ backgroundImage: "url('/assets/image/blog/blog-bg.png')" }}>
                <div className="container">
                    <div className="tn-faq__wrap">
                        <div className="tn-faq__media">
                            <img src="/assets/image/about/faq-img-h1.jpg" alt="FAQ" loading="lazy" />
                            <div className="tn-faq__badge">
                                <img src="/assets/image/about/faq-img2-h1.png" alt="FAQ" loading="lazy" />
                                <div className="roundtxt">
                                    <svg className="circleText" viewBox="0 0 500 500" data-duration="1">
                                        <path id="textcircle" strokeWidth="10" data-duration="1" d="M50,250c0-110.5,89.5-200,200-200s200,89.5,200,200s-89.5,200-200,200S50,360.5,50,250"></path>
                                        <text className="r-txt" dy="-35">
                                            <textPath href="#textcircle">Navigate to Every Crner of the Planet</textPath>
                                        </text>
                                    </svg>
                                    <i className="fa-solid fa-plane-up"></i>
                                </div>
                            </div>
                            <div className="tn-faq__ele2">
                                <img className="parallax-element" src="/assets/image/about/faq-ele1-h1.png" alt="ele" />
                            </div>
                        </div>
                        <div className="tn-faq__content">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="mb-20 title-anime animation-style3">
                                        <div className="title-anime__split">
                                            <span className="tn-title__sub">Faq Questions</span>
                                            <h2 className="tn-title__main">Frequently Ask Questions Of Customer</h2>
                                        </div>
                                    </div>
                                    <p className="pe-lg-5 mb-30">Our Goal Each Day Is To Ensure That Our Residents' Needs Are Not Only Met But Exceeded. To Make That Happen.</p>
                                </div>
                            </div>
                            <div className="tn-faq__tab">
                                <div className="accordion" id="accordionExample">
                                    {faqs.map((faq) => (
                                        <div className="accordion-item" key={faq.id}>
                                            <h2 className="accordion-header" id={`heading${faq.id}`}>
                                                <button className={`accordion-button ${faq.show ? '' : 'collapsed'}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${faq.id}`} aria-expanded={faq.show ? 'true' : 'false'} aria-controls={`collapse${faq.id}`}>
                                                    {faq.title}
                                                </button>
                                            </h2>
                                            <div id={`collapse${faq.id}`} className={`accordion-collapse collapse ${faq.show ? 'show' : ''}`} data-bs-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    <p>{faq.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}