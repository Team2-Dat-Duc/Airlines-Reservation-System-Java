import { Link } from 'react-router-dom';

export default function Footer() {

    const instagramImages = [1, 2, 3, 4, 5, 6];

    return (
        <>
            <div className="tn-footer overflow-hidden">
    
                <div className="tn-footer--top z-index-common space-extra-top space-extra-bottom" style={{ backgroundImage: "url('/assets/image/footer/footer-bg.png')" }}>
                    <div className="container">
                        <div className="row">
                            
                            <div className="col-lg-4 col-md-6">
                                <div className="tn-footer__widget">
                                    <div className="tn-footer__logo mb-20">
                                        <Link to="/"><img src="/assets/image/logo2.svg" alt="clicko Logo" /></Link>
                                    </div>
                                    <p className="pe-lg-5">There are many variations of passag Lorem available, but the majority.</p>
                                    <div className="tn-footer__icon-txt">
                                        <i className="flaticon-phone-call"></i>
                                        <span>call support <a href="tel:+1344688955">+1344 688 955</a></span>
                                    </div>
                                    <div className="social-style--footer">
                                        <span>follow us :</span>
                                        <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                                        <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                                        <a href="#"><i className="fa-brands fa-youtube"></i></a>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-2 col-md-6 ps-lg-0">
                                <div className="tn-footer__widget mt-15">
                                    <h2 className="text-white">Useful Links</h2>
                                    <ul className="tn-footer__menu">
                                        <li><Link to="/about">Company Profile</Link></li>
                                        <li><Link to="/contact">Help center</Link></li>
                                        <li><Link to="/contact">Contact Us</Link></li>
                                        <li><Link to="/about">Social Marketing</Link></li>
                                        <li><Link to="/blog">Blog</Link></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6">
                                <div className="tn-footer__widget mt-15">
                                    <h2 className="text-white">Our Services</h2>
                                    <ul className="tn-footer__menu">
                                        <li><Link to="/about">Application Assistance</Link></li>
                                        <li><Link to="/about">ticket Guidance</Link></li>
                                        <li><Link to="/about">Documentation Support</Link></li>
                                        <li><Link to="/about">Social Marketing</Link></li>
                                        <li><Link to="/about">License</Link></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-6 ps-lg-0">
                                <div className="tn-footer__widget mt-15">
                                    <h2 className="text-white">Instagram</h2>
                                    <div className="tn-footer__gallery">
                                        {instagramImages.map(i => (
                                            <div className="gallery-thumb" key={i}>
                                                <Link to="#">
                                                    <img src={`/assets/image/footer/insta${i}.jpg`} alt="Gallery" />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tn-footer--bottom">
                    <div className="container">
                        <div className="row align-items-center justify-content-center justify-content-lg-between flex-column-reverse flex-lg-row">
                            <div className="col-md-auto">
                                <p className="tn-footer__copyright mb-0">
                                    Copyright © <span id="currentYear">2026</span> <a>clicko</a>. All rights reserved By <a>TN_Theme</a>.
                                </p>
                            </div>
                            <div className="col-md-auto">
                                <ul className="tn-footer__menu">
                                    <li><Link to="/about">Privacy Policy</Link></li>
                                    <li><Link to="/about">FAQ</Link></li>
                                    <li><Link to="/about">Feedback</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="progress-wrap">
                <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                    <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
                </svg>
            </div>
        </>
    );
}