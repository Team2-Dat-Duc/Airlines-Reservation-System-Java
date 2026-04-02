import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await axiosClient.get('/blog-posts');
                setPosts(data);
            } catch (err) {
                console.error('Lỗi tải blog:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

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
                        <h2 className="text-white mb-15">latest news</h2>
                        <nav>
                            <ol className="breadcrumb justify-content-center">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">our blog</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

            <section className="tn-blogP space z-index-common">
                <div className="container">
                    <div className="row">
                       
                        <div className="col-xl-8 col-lg-7 col-md-12">
                            <div className="tn-blogP--left" id="blogPostsContainer">
                                {isLoading ? (
                                    <div className="text-center py-5 text-muted">
                                        <i className="fa-solid fa-spinner fa-spin fs-2 mb-3"></i>
                                        <p>Đang tải bài viết...</p>
                                    </div>
                                ) : posts.length === 0 ? (
                                    <p className="text-muted fs-5">Chưa có bài viết nào.</p>
                                ) : (
                                    posts.map((p, index) => {
                                        const mbClass = index < posts.length - 1 ? 'mb-50' : '';
                                        const hasQuote = p.quoteTitle && p.quoteAuthor;
                                        return (
                                            <div className={`tn-blogP-item ${mbClass}`} key={p._id || index}>
                                                {hasQuote && (
                                                    <div className="tn-blogP-item__qoute bg-contain" style={{ backgroundImage: "url('/assets/image/blog/blogP-qoute-img.jpg')" }}>
                                                        <img src="/assets/image/blog/qoute.png" alt="qoute Icon" />
                                                        <h3>{p.quoteTitle}</h3>
                                                        <p>{p.quoteAuthor}</p>
                                                    </div>
                                                )}
                                                <div className="tn-blogP-item__img">
                                                    <Link to="/blog-details">
                                                        <img src={p.image || `/assets/image/blog/blog-h1-img${(index % 3) + 1}.jpg`} alt="Image" />
                                                    </Link>
                                                </div>
                                                <div className="tn-blogP-item__txt">
                                                    <ul className="d-flex">
                                                        <li><i className="flaticon-avatar"></i> by {p.author || 'admin'}</li>
                                                        <li><i className="flaticon-calendar-2"></i> {new Date(p.publishedAt || p.createdAt || Date.now()).toLocaleDateString()}</li>
                                                        <li><i className="fa-regular fa-comments"></i> 0 comments</li>
                                                    </ul>
                                                    <Link to="/blog-details"><h2>{p.title}</h2></Link>
                                                    <p>{p.content}</p>
                                                </div>
                                                <div className="tn-blogP-item__btn">
                                                    <Link to="/blog-details" className="RM">read more <i className="fa-solid fa-angles-right"></i></Link>
                                                    <div className="blog_share">
                                                        <p className="shareBtn">share <i className="fa-solid fa-share-nodes"></i></p>
                                                        <ul className="hoverIcon">
                                                            <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                                                            <li><a href="#"><i className="fa-brands fa-twitter"></i></a></li>
                                                            <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                                                            <li><a href="#"><i className="fa-brands fa-youtube"></i></a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
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