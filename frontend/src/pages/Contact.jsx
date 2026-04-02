import { Link } from 'react-router-dom';

export default function Contact() {
    const infoCards = [
        { icon: 'fa-solid fa-location-dot', title: 'our address', lines: ['20 Cooper Square, New York, NY 10003'], isLink: false },
        { icon: 'fa-solid fa-phone', title: 'phone number', lines: ['+9 458 526 6589', '+3 458 526 6545'], isLink: false },
        { icon: 'fa-solid fa-envelope', title: 'email address', lines: ['info@company.com', 'support@company.com'], isLink: true }
    ];

    return (
        <>
          
            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper z-index-common text-center">
                        <h2 className="text-white mb-15">contact us</h2>
                        <nav>
                            <ol className="breadcrumb justify-content-center">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">contact us</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

       
            <section className="tn-contact space z-index-common">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="mb-40 title-anime animation-style3 text-center">
                                <div className="title-anime__split">
                                    <span className="tn-title__sub">Get In Touch</span>
                                    <h2 className="tn-title__main">Our Contact Information</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row">
                        {infoCards.map((card, idx) => (
                            <div className="col-lg-4 col-md-4" key={idx}>
                                <div className="tn-contact__item">
                                    <div className="con_icon"><i className={card.icon}></i></div>
                                    <div className="con_txt">
                                        <h3>{card.title}</h3>
                                        {card.lines.map((line, lIdx) => (
                                            <p key={lIdx}>
                                                {card.isLink ? <a href={`mailto:${line}`}>{line}</a> : line}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="tn-contact__form">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="mb-30 title-anime animation-style3 text-center">
                                    <div className="title-anime__split">
                                        <span className="tn-title__sub">Contact Us</span>
                                        <h2 className="tn-title__main">Feel Free To Write</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tn-contact__cForm">
                            <form action="#" method="post" className="TNajax">
                                <div className="d-md-flex justify-content-between gap-3">
                                    <input className="form-control mb-15 mb-md-0" name="name" type="text" placeholder="your name" />
                                    <input className="form-control" name="subject" type="text" placeholder="Enter subject" />
                                </div>
                                <div className="d-md-flex justify-content-between mt-3 gap-3">
                                    <input className="form-control mb-15 mb-md-0" name="email" type="text" placeholder="email address" />
                                    <input className="form-control" name="phone" type="text" placeholder="Enter phone" />
                                </div>
                                <textarea className="form-control mt-3" name="message" placeholder="your message here" rows="4"></textarea>
                                <div className="text-center mt-30">
                                    <button type="button" className="tn-btn tn-btn__red">send message</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <div className="map_part">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d136862.4393009356!2d-74.27638714902837!3d40.712265765344185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25b7a93b3db47%3A0xfb446e31ef0e660!2sNitehawk%20Cinema!5e0!3m2!1sen!2sbd!4v1768918430960!5m2!1sen!2sbd" loading="lazy" style={{ width: '100%', height: '450px', border: '0' }}></iframe>
            </div>
        </>
    );
}