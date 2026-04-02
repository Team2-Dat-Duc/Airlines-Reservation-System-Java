import { Link } from 'react-router-dom';

export default function ServiceDetails() {
    const tabData = [
        { paneId: 'nav_one', active: true, accId: 'accordionExample', collapses: ['collapseOne', 'collapseTwo', 'collapseThree', 'collapseFour'] },
        { paneId: 'nav_two', active: false, accId: 'accordionExample2', collapses: ['collapse11', 'collapse22', 'collapse33', 'collapse44'] },
        { paneId: 'nav_three', active: false, accId: 'accordionExample3', collapses: ['collapse1', 'collapse2', 'collapse3', 'collapse4'] },
        { paneId: 'nav_four', active: false, accId: 'accordionExample4', collapses: ['collapseOn', 'collapseTw', 'collapseThre', 'collapseFou'] },
        { paneId: 'nav_five', active: false, accId: 'accordionExample5', collapses: ['collapseOne1', 'collapseTwo2', 'collapseThree3', 'collapseFour4'] }
    ];

    const navLinks = [
        { id: 'tab_one', target: '#nav_one', text: 'Experience jet Private', active: true },
        { id: 'tab_two', target: '#nav_two', text: 'Upgrade check Airport', active: false },
        { id: 'tab_three', target: '#nav_three', text: 'Checked included', active: false },
        { id: 'tab_four', target: '#nav_four', text: 'ticket reissue policy', active: false },
        { id: 'tab_five', target: '#nav_five', text: 'ticket reissue Private', active: false }
    ];

    const faqsList = [
        { title: 'Your Great Destination' },
        { title: 'Desktop publishing packages and web' },
        { title: 'capitalize business opportunities' },
        { title: 'Increase revenue stream' }
    ];

    return (
        <>
            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper z-index-common text-center">
                        <h2 className="text-white mb-15">Service Details</h2>
                        <nav>
                            <ol className="breadcrumb justify-content-center">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Service Details</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

            <section className="tn-serviceD space z-index-common">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-12">
                            <div className="tn-serviceD__left">
                                <div className="tab-content" id="nav-tabContent">
                                    {tabData.map((t, index) => (
                                        <div key={index} className={`tab-pane fade ${t.active ? 'active show' : ''}`} id={t.paneId}>
                                            <div className="serviceD_img">
                                                <img src="/assets/image/service/SDimg.jpg" alt="Image" />
                                            </div>
                                            <div className="tn-serviceD__txt">
                                                <h2>departure & arrival airports</h2>
                                                <p>looking for flight status information for flights in the USA, here are some helpful links and tips to distinguish. In thes free hour, when our power of choice is untraelled data structures manages and dislike men who are begued demoralized by the charms of pleasure We focus on optimi zinyg efficncy managing risk deliveri when our power of choice is untraelled datsolution manages and dislike men.</p>
                                                
                                                <h3>Included Services</h3>
                                                <p>blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue cannot fors These hte case perfectly simple and easy to distinguish. In a free hour, when our power of choice is untraelled datad structures manages and dislike men who are so begued & demoralized by the charms</p>
                                                
                                                <div className="info-list">
                                                    <ul>
                                                        <li><p>give me the airline</p></li>
                                                        <li><p>flight number, departure and arrival</p></li>
                                                        <li><p>departure and arrival airports</p></li>
                                                    </ul>
                                                    <ul>
                                                        <li><p>For airspace and national system updates</p></li>
                                                        <li><p>route or flight-number search tool.</p></li>
                                                        <li><p>national system updates in the US, you can Federal Aviation</p></li>
                                                    </ul>
                                                </div>
                                                
                                                <div className="SDtxt">
                                                    <img src="/assets/image/service/SDimg1.jpg" alt="Image" />
                                                    <img src="/assets/image/service/SDimg2.jpg" alt="Image" />
                                                </div>
                                                <p>blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue cannot fors These case perfectly simple and easy to distinguish. In a free hour, when our power of choice is untraelled data structures manages and dislike men who are so begued & demoralized by the charms</p>
                                            </div>
                                            
                                            <div className="FAQ mt-30">
                                                <h3>FAQs: your questions answered</h3>
                                                <div className="accordion" id={t.accId}>
                                                    {faqsList.map((faq, idx) => (
                                                        <div className="accordion-item" key={idx}>
                                                            <h2 className="accordion-header" id={`heading_${t.collapses[idx]}`}>
                                                                <button className={`accordion-button ${idx === 0 ? '' : 'collapsed'}`} data-bs-toggle="collapse" data-bs-target={`#${t.collapses[idx]}`} aria-expanded={idx === 0 ? 'true' : 'false'} aria-controls={t.collapses[idx]}>
                                                                    <span>0{idx + 1}</span> {faq.title}
                                                                </button>
                                                            </h2>
                                                            <div id={t.collapses[idx]} className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`} data-bs-parent={`#${t.accId}`}>
                                                                <div className="accordion-body">
                                                                    blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue cannot fors These case perfectly simple and easy to distinguish. In a free hour, when our power of choice is untraelled data structures manages and dislike men who are so begued & demoralized by the charms
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                            <div className="tn-serviceD__right">
                                <div className="Stitle d-flex justify-content-between align-items-center">
                                    <h2 className="text-white m-0">All Services </h2>
                                    <i className="fa-solid fa-eject"></i>
                                </div>
                                <nav>
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        {navLinks.map((n, idx) => (
                                            <div className={`nav-link ${n.active ? 'active' : ''}`} id={n.id} data-bs-toggle="tab" data-bs-target={n.target} role="tabpanel" key={idx} style={{ cursor: 'pointer' }}>
                                                <span>{n.text}</span> <i className="fa-solid fa-arrow-right-long"></i>
                                            </div>
                                        ))}
                                    </div>
                                </nav>
                                <div className="support bg-title" style={{ backgroundImage: "url('/assets/image/service/simg.png')" }}>
                                    <p>Get support</p>
                                    <h2>get a free quick solution</h2>
                                    <div className="Button">
                                        <Link to="/contact" className="tn-btn tn-btn__red">contact us</Link>
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