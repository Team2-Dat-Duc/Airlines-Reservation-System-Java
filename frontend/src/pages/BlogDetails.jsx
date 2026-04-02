import { Link } from 'react-router-dom';

export default function BlogDetails() {
    const slides = [1, 2];
    
    const categories = [
        { title: 'Charter flight', count: '03', active: true, noMargin: false },
        { title: 'Business class', count: '06', active: false, noMargin: false },
        { title: 'Stock Investment', count: '03', active: false, noMargin: false },
        { title: 'ease & transparency', count: '02', active: false, noMargin: true }
    ];
    const recentPosts = [
        { img: '1', title: 'airline industry start business class', mb: false },
        { img: '2', title: 'General history of by country', mb: false },
        { img: '3', title: 'give clear timeline and overview', mb: true }
    ];
    const tags = ['business', 'power', 'service', 'visiting', 'private jet'];

    return (
        <>
            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper z-index-common text-center">
                        <h2 className="text-white mb-15">Blog Details</h2>
                        <nav>
                            <ol className="breadcrumb justify-content-center">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Blog Details</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

            <section className="tn-blogP space z-index-common">
                <div className="container">
                    <div className="row">
                       
                        <div className="col-xl-8 col-lg-7 col-md-12">
                            <div className="tn-blogP--left">
                                <div className="swiper" data-swiper="" data-xl="1" data-lg="1" data-md="1" data-autoplay="false">
                                    <div className="swiper-wrapper">
                                        {slides.map((_, idx) => (
                                            <div className="swiper-slide" key={idx}>
                                                <div className="tn-blogP-item">
                                                    <div className="tn-blogP-item__img">
                                                        <img src="/assets/image/blog/blogP-img1.jpg" alt="Image" />
                                                    </div>
                                                    <div className="tn-blogP-item__txt">
                                                        <ul className="d-flex">
                                                            <li><i className="flaticon-avatar"></i> by admin</li>
                                                            <li><i className="flaticon-calendar-2"></i> April 27, 2026</li>
                                                            <li><i className="fa-regular fa-comments"></i> 0 comments</li>
                                                        </ul>
                                                        <h2>airline industry started visiting New York</h2>
                                                        <p className="mb-4">air business From installing new wells to repairing plumbing systems, our team offers fast, rel scently maintain wireless scenarios after intermandated applications. coordinate multifunctional functio nalities reliable potealitie the Objectively envisioneer plumbing systems, fixed repayment schedules and interest rates. Airline proudly raises the bar and exceeds the standard for luxury and corporate private jet charter services.</p>
                                                        <p>The first small jet-powered civil aircraft was the Morane-Saulnier MS.760 Paris, developed privately in the early 195 from the MS.755 Fleuret two-seat jet trainer. First flown in 1954, the MS.760 Paris differs from subuent business jets having only four seats arranged in two rows without a center aisle, similar to a light aircraft, under a large sliding canopy similar to that of a fighter. A U.S. type certificate was awarded.</p>
                                                    </div>
                                                    
                                                    <div className="tn-blogP-item__qoute bg-contain" style={{ backgroundImage: "url('/assets/image/blog/blogP-qoute-img.jpg')" }}>
                                                        <img src="/assets/image/blog/qoute.png" alt="qoute Icon" />
                                                        <h3>Charter flight of the Death Penalty in America</h3>
                                                        <p>by - jason holder </p>
                                                    </div>
                                                    
                                                    <div className="blogD">
                                                        <h4>first small jet-powered civil aircraft</h4>
                                                        <p>jet business From installing new wells to repairing plumbing systems, our team offers fast, rel scently maintain wireless scenarios after intermandated applications. coordinate multifunctional functio nalities reliable potealitie the Objectively envisioneer plumbing systems, fixed repayment schedules and interest rates. Airline proudly raises the bar and exceeds the standard for luxury and corporate private jet charter services.</p>
                                                        
                                                        <div className="blogD__img">
                                                            <img src="/assets/image/blog/blogD-img.jpg" alt="Image" />
                                                            <img src="/assets/image/blog/blogD-img1.jpg" alt="Image" />
                                                        </div>
                                                        
                                                        <p>jet business From installing new wells to repairing plumbing systems, our team offers fast, rel scently maintain wireless scenarios after intermandated applications. coordinate multifunctional functio nalities reliable potealitie the Objectively envisioneer plumbing systems, fixed repayment schedules and interest rates. Airline proudly raises the bar and exceeds the standard for luxury and corporate private jet charter services.</p>
                                                        
                                                        <div className="blogD__btn">
                                                            <div className="blogD__txt d-flex align-items-center">
                                                                <span>tags :</span> 
                                                                <Link to="#">airline </Link> 
                                                                <Link to="#">private jet</Link>
                                                            </div>
                                                            <div className="blogD__txt d-flex align-items-center">
                                                                <span>share</span>
                                                                <ul className="d-flex align-items-center m-0 p-0">
                                                                    <li><Link to="#"><i className="fa-brands fa-facebook-f"></i></Link></li>
                                                                    <li><Link to="#"><i className="fa-brands fa-linkedin-in"></i></Link></li>
                                                                    <li><Link to="#"><i className="fa-brands fa-youtube"></i></Link></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="blogD__admin">
                                                            <div className="comm-item">
                                                                <div className="comm-item__img">
                                                                    <img src="/assets/image/blog/comments-img1.png" alt="Image" />
                                                                </div>
                                                                <div className="comm-item__txt">
                                                                    <h5>meagan martin</h5>
                                                                    <p>repairing plumbing systems, our team offers fast, rel scantly maintain wireless scenarios after intermediated applications.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="swiper-button-prev"><i className="fa-solid fa-arrow-left"></i> previous post</div>
                                    <div className="swiper-button-next">next post <i className="fa-solid fa-arrow-right"></i></div>
                                </div>
                                
                                <div className="blogD_comments">
                                    <h4>03 comments</h4>
                                    <ul className="tn-comments">
                                        <li>
                                            <div className="comm-item">
                                                <div className="comm-item__img"><img src="/assets/image/blog/comments-img2.png" alt="Image" /></div>
                                                <div className="comm-item__txt">
                                                    <h5>erecah martin <span><i className="flaticon-calendar-2"></i> april 27, 2026</span></h5>
                                                    <p>repairing plumbing systems, our team offers fast, rel scantly maintain wireless scenarios after intermediated applications.</p>
                                                    <button>replay <i className="fa-solid fa-reply"></i></button>
                                                </div>
                                            </div>
                                            <ul className="comments">
                                                <li className="comm-item">
                                                    <div className="comm-item__img"><img src="/assets/image/blog/comments-img3.png" alt="Image" /></div>
                                                    <div className="comm-item__txt">
                                                        <h5>elhan brosn <span><i className="flaticon-calendar-2"></i> april 27, 2026</span></h5>
                                                        <p>systems, our team offers fast, rel scently maintain wireless scenarios after inter mandated applications. coordinate multifunctional. </p>
                                                        <button>replay <i className="fa-solid fa-reply"></i></button>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className="comm-item">
                                                <div class="comm-item__img"><img src="/assets/image/blog/comments-img4.png" alt="Image" /></div>
                                                <div className="comm-item__txt">
                                                    <h5>dickel jons <span><i class="flaticon-calendar-2"></i> april 27, 2026</span></h5>
                                                    <p>repairing plumbing systems, our team offers fast, rel scantly maintain wireless scenarios after intermediated applications.</p>
                                                    <button>replay <i className="fa-solid fa-reply"></i></button>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                    
                                    <div className="tn-blog_reply">
                                        <h3>leave a reply</h3>
                                        <p>Your email address will not be published. Required fields are marked *</p>
                                        <form action="#">
                                            <textarea name="text" className="form-control mb-3" rows="3" placeholder="your comment *"></textarea>
                                            <div className="name_email">
                                                <input name="name" type="text" placeholder="your Name *" />
                                                <input name="email" type="email" placeholder="your Email *" />
                                            </div>
                                            <div className="d-flex mt-3">
                                                <input name="save" type="checkbox" className="save" />
                                                <label> Save my name, email, and website next time I comment.*</label>
                                            </div>
                                            <div className="mt-30">
                                                <Link to="#" className="tn-btn tn-btn__red">post comment</Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-4 col-lg-5 col-md-12">
                            <div className="tn-blogP--right">
                                <div className="tn-widget">
                                    <h3 className="tn-widget__title">search</h3>
                                    <div className="tn-widget__search">
                                        <input name="Search" type="text" placeholder="Search" />
                                        <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                                    </div>
                                </div>

                                <div className="tn-widget">
                                    <h3 className="tn-widget__title">Category</h3>
                                    <ul className="tn-widget__cate">
                                        {categories.map((cat, idx) => (
                                            <li key={idx}>
                                                <Link to="#" className={`${cat.active ? 'active' : ''} ${cat.noMargin ? 'mb-0' : ''}`}>
                                                    <i className="fa-solid fa-angles-right"></i> {cat.title} <span>{cat.count}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="tn-widget">
                                    <h3 className="tn-widget__title">recent post</h3>
                                    {recentPosts.map((post, idx) => (
                                        <div className={`tn-widget__recent_post ${post.mb ? 'mb-0' : ''}`} key={idx}>
                                            <img src={`/assets/image/blog/recent-post-img${post.img}.jpg`} alt="Image" />
                                            <div className="recent_txt">
                                                <p><i className="flaticon-calendar-2"></i> march 10, 2026</p>
                                                <Link to="/blog-details"><h4>{post.title}</h4></Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="tn-widget">
                                    <h3 className="tn-widget__title">tags</h3>
                                    <div className="tn-widget__tags">
                                        {tags.map((tag, idx) => <Link key={idx} to="#">{tag}</Link>)}
                                    </div>
                                </div>

                                <div className="sidebar-banner" style={{ backgroundImage: "url('/assets/image/blog/blogP-img-right.png')" }}>
                                    <p className="sidebar-banner__icon"><i className="flaticon-letter"></i></p>
                                    <span>Subscribe</span>
                                    <h4>our newsletter</h4>
                                    <input autoComplete="off" id="email" type="text" placeholder="Enter your email" />
                                    <div className="d-flex">
                                        <Link to="/contact" className="tn-btn tn-btn__red"> Subscribe </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}