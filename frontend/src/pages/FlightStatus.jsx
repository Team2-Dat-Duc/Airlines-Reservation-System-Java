import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function FlightStatus() {
    const [searchParams] = useSearchParams();
    const flightNo = searchParams.get('flightNo');
    const date = searchParams.get('date');

    const [flights, setFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFlights = async () => {
            if (!flightNo || !date) {
                setIsLoading(false);
                return;
            }
            try {
                
                const res = await axiosClient.get('/flights');
                
                const searchStr = flightNo.toLowerCase().trim();

                const matchedFlights = res.filter(f => {
                  
                    const matchDate = f.depDate === date;
                    
                    const matchName = f.name?.toLowerCase().includes(searchStr);
                    const matchAircraft = f.aircraft?.toLowerCase().includes(searchStr);
                    const matchMockFlightNo = 'as-102'.includes(searchStr) || searchStr.includes('as');

                    return matchDate && (matchName || matchAircraft || matchMockFlightNo);
                });
                
                setFlights(matchedFlights);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFlights();
    }, [flightNo, date]);

    const pageStyles = `
        .status-wrapper { padding: 60px 0; background: #f8fafc; min-height: 80vh; }
        .timeline-box { background: #fff; border: 1px solid #eaeaea; border-radius: 12px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); position: relative; }
        .status-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px dashed #cbd5e1; }
        .live-status { background: #ecfdf5; color: #10b981; padding: 8px 20px; border-radius: 30px; font-weight: bold; display: inline-flex; align-items: center; gap: 8px; border: 1px solid #a7f3d0; }
        .live-status.delayed { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
        .timeline-tracker { display: flex; justify-content: space-between; position: relative; margin-top: 30px; }
        .tracker-line { position: absolute; top: 20px; left: 10%; right: 10%; height: 4px; background: #e2e8f0; z-index: 1; }
        .tracker-progress { position: absolute; top: 20px; left: 10%; width: 50%; height: 4px; background: #10b981; z-index: 2; }
        .tracker-step { position: relative; z-index: 3; text-align: center; width: 33%; }
        .tracker-icon { width: 44px; height: 44px; background: #fff; border: 4px solid #10b981; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: #10b981; font-size: 18px; }
        .tracker-step.pending .tracker-icon { border-color: #cbd5e1; color: #cbd5e1; }
    `;

    return (
        <>
            <style>{pageStyles}</style>

            <section className="tn-breadcrumb z-index-common" style={{ backgroundImage: "url('/assets/image/bg/breadcrumb-bg.jpg')" }}>
                <div className="container">
                    <div className="tn-breadcrumb__wrapper text-center">
                        <h2 className="text-white mb-15">Live Flight Status</h2>
                    </div>
                </div>
            </section>

            <section className="status-wrapper">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            
                            <div className="text-center mb-5">
                                <h4 className="fw-bold text-dark">Tra cứu chuyến bay: <span className="text-danger">{flightNo?.toUpperCase() || 'N/A'}</span></h4>
                                <p className="text-muted">Ngày cất cánh: {date}</p>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-5"><i className="fa-solid fa-spinner fa-spin fs-1 text-danger"></i></div>
                            ) : flights.length === 0 ? (
                                <div className="text-center py-5 bg-white rounded border">
                                    <i className="fa-solid fa-plane-slash fs-1 text-muted mb-3"></i>
                                    <h5>Không tìm thấy thông tin chuyến bay này.</h5>
                                    <p className="text-muted">Chuyến bay có thể chưa được cập nhật hoặc mã chuyến bay không đúng.</p>
                                </div>
                            ) : (
                                flights.map((flight, idx) => (
                                    <div className="timeline-box mb-4" key={idx}>
                                        <div className="status-header">
                                            <div>
                                                <h3 className="fw-bold m-0">{flight.name}</h3>
                                                <span className="text-muted">{flight.aircraft}</span>
                                            </div>
                                            <div className="live-status">
                                                <span className="spinner-grow spinner-grow-sm" role="status"></span> ON TIME
                                            </div>
                                        </div>

                                        <div className="row text-center mb-4">
                                            <div className="col-5">
                                                <h1 className="fw-bold text-dark m-0">{flight.depTime}</h1>
                                                <h4 className="text-muted">{flight.dep}</h4>
                                                <p className="small text-muted m-0">Terminal {flight.terminalDep || '1'}</p>
                                            </div>
                                            <div className="col-2 d-flex align-items-center justify-content-center">
                                                <i className="fa-solid fa-plane text-danger fs-3"></i>
                                            </div>
                                            <div className="col-5">
                                                <h1 className="fw-bold text-dark m-0">{flight.arrTime}</h1>
                                                <h4 className="text-muted">{flight.arr}</h4>
                                                <p className="small text-muted m-0">Terminal {flight.terminalArr || '2'}</p>
                                            </div>
                                        </div>

                                        <div className="timeline-tracker">
                                            <div className="tracker-line"></div>
                                            <div className="tracker-progress" style={{ width: '0%' }}></div> 
                                            
                                            <div className="tracker-step">
                                                <div className="tracker-icon"><i className="fa-solid fa-plane-departure"></i></div>
                                                <h6 className="fw-bold">Khởi hành</h6>
                                                <span className="small text-muted">Dự kiến: {flight.depTime}</span>
                                            </div>
                                            <div className="tracker-step pending">
                                                <div className="tracker-icon"><i className="fa-solid fa-location-crosshairs"></i></div>
                                                <h6 className="fw-bold">Đang bay</h6>
                                                <span className="small text-muted">Độ cao: --</span>
                                            </div>
                                            <div className="tracker-step pending">
                                                <div className="tracker-icon"><i className="fa-solid fa-plane-arrival"></i></div>
                                                <h6 className="fw-bold">Hạ cánh</h6>
                                                <span className="small text-muted">Dự kiến: {flight.arrTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}