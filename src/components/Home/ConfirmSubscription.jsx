import { Button, Card, Col, Image, Modal, Row } from "react-bootstrap";
import { FaBookOpen, FaCheckCircle, FaCrown, FaLightbulb, FaRocket, FaShoppingCart, FaStar,FaInfoCircle } from "react-icons/fa";
import { server_url } from "../../scripts/url";

export default function ConfirmSubscription({ showModal,setShowModal,course,courses }){
    console.log("course",course)
    const accentColors = ["#f3e6ff", "#e0b3ff", "#e0b3ff", "#fff0f6"];
    // Helper to convert formatted IDR string to number
    function parseIDR(str) {
        if (!str) return 0;
        // Remove "Rp", spaces, dots, and ",00" or ",xx"
        return Number(
            str
                .replace(/[^0-9,]/g, "") // keep digits and comma
                .replace(/,.*$/, "")     // remove comma and everything after
        );
    }

    return(
        <Modal show={showModal} onHide={()=>setShowModal(false)} size="lg" centered>
            <Modal.Header closeButton style={{ background: accentColors[1] }}>
                <Modal.Title>
                <FaInfoCircle color={`#cc00cc`} /> {course?.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-4">
                    <Col md={12} className="text-center">
                        <FaCrown size={40} color="#cc00cc" />
                        <h3 className="mt-2 fw-bold">Paket Spesial Berlangganan Kursus</h3>
                        <p className="text-muted">
                            Dapatkan akses ke semua kursus premium dengan harga super hemat! Pilih paket terbaik untuk pengalaman belajar maksimal.
                        </p>
                    </Col>
                </Row>

                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <h5 className="fw-bold mb-3"><FaBookOpen color="#cc00cc" /> Daftar Kursus yang Tersedia:</h5>
                        <ul className="list-group mb-3">
                            {courses&&courses.map((c, idx) => (
                                <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>
                                        <FaStar color="#ffcc00" className="me-2" />
                                        {c.title}
                                    </span>
                                    <span className="fw-semibold">{c.price}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="d-flex justify-content-between align-items-center border-top pt-3">
                            <span className="fw-bold">Total Harga Semua Kursus</span>
                            <span className="fw-bold fs-5">
                                {formatToIDR(
                                    course?.allCourses?.reduce((acc, c) => acc + parseIDR(c.price), 0)
                                )}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center border-top pt-3">
                            <span className="fw-bold text-success">
                                <FaRocket className="me-1" />
                                Diskon Spesial 50%
                            </span>
                            <span className="fw-bold fs-4 text-success">
                                {formatToIDR(
                                    (course?.allCourses?.reduce((acc, c) => acc + parseIDR(c.price), 0) / 2)
                                )}
                            </span>
                        </div>
                    </Card.Body>
                </Card>

                <Row>
                    <Col md={6}>
                        <Card className="mb-3 border-primary shadow-sm">
                            <Card.Body>
                                <h5 className="fw-bold text-primary mb-2">
                                    <FaCheckCircle className="me-2" />
                                    Paket Paling Direkomendasikan!
                                </h5>
                                <p>
                                    <strong>Akses SEMUA kursus</strong> selama <strong>1 bulan</strong> hanya dengan <span className="text-success fw-bold">
                                        {formatToIDR(
                                            (course?.allCourses?.reduce((acc, c) => acc + parseIDR(c.price), 0) / 2)
                                        )}
                                    </span>! 
                                </p>
                                <Button variant="success" className="w-100 mb-2">
                                    <FaCrown className="me-2" />
                                    Langganan Semua Kursus (Diskon 50%)
                                </Button>
                                <small className="text-muted">
                                    Hemat biaya, akses materi lengkap, dan tingkatkan skill Anda tanpa batas!
                                </small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="mb-3 border-secondary shadow-sm">
                            <Card.Body>
                                <h5 className="fw-bold text-secondary mb-2">
                                    <FaLightbulb className="me-2" />
                                    Coba Satu Kursus Dulu
                                </h5>
                                <p>
                                    Ingin mencoba dulu? Dapatkan akses <strong>1 kursus</strong> selama <strong>1 bulan</strong> dengan harga normal <span className="fw-bold">{course?.price}</span>.
                                </p>
                                <Button variant="outline-primary" className="w-100 mb-2">
                                    <FaShoppingCart className="me-2" />
                                    Langganan Kursus Ini Saja
                                </Button>
                                <small className="text-muted">
                                    Cocok untuk percobaan pertama kali. Jika puas, Anda bisa memperpanjang atau upgrade ke paket semua kursus!
                                </small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={12} className="text-center">
                        <p className="fw-semibold text-success">
                            <FaCheckCircle className="me-1" />
                            Nikmati pengalaman belajar terbaik, materi terlengkap, dan harga paling hemat hanya di sini!
                        </p>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}