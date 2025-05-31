import { Button, Card, Col, Modal, Row } from "react-bootstrap";
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
                <Card className="mb-4 shadow border-0" style={{ background: accentColors[0] }}>
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col className="text-center mb-3 mb-md-0">
                                <img style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit:"fill",
                                        background: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto",
                                        boxShadow: "0 2px 12px rgba(204,0,204,0.08)",
                                        border: "2px solid #cc00cc",
                                    }} src={`${server_url}/courses/thumbnails/${course.image}`} alt="" />
                            </Col>
                            <Col xs={12} md={9}>
                                <h4 className="fw-bold mb-1 text-primary">{course?.title}</h4>
                                <div className="mb-2 text-muted" style={{ fontSize: "1.05em" }}>
                                    {course?.description?.length > 120
                                        ? course.description.slice(0, 120) + "..."
                                        : course?.description || "Deskripsi kursus belum tersedia."}
                                </div>
                                <div className="d-flex flex-wrap align-items-center gap-3 mt-2">
                                    <span className="fw-bold text-success" style={{ fontSize: "1.2em" }}>
                                        <FaShoppingCart className="me-1" />
                                        {course?.price}
                                    </span>
                                    <span className="text-secondary" style={{ fontSize: "0.98em" }}>
                                        <FaRocket className="me-1" color="#cc00cc" />
                                        {course?.duration || "1 Bulan"}
                                    </span>
                                    {/* <span className="text-secondary" style={{ fontSize: "0.98em" }}>
                                        <FaLightbulb className="me-1" color="#ffb400" />
                                        {course?.lessons ? `${course.lessons} Materi` : "Materi variatif"}
                                    </span> */}
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <div>
                    <h5 className="mb-4 text-center">
                        <FaStar color="#ffb400" /> Penawaran Spesial untuk Anda!
                    </h5>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <h6 className="mb-3"><FaBookOpen /> Daftar Kursus Premium:</h6>
                            <ul className="list-group mb-3">
                                {courses.map((c, idx) => (
                                    <li
                                        key={idx}
                                        className={`list-group-item d-flex justify-content-between align-items-center ${c.id === course?.id ? "bg-light" : ""}`}
                                    >
                                        <span>
                                            <FaLightbulb className="me-2" color={c.id === course?.id ? "#cc00cc" : "#888"} />
                                            {c.title}
                                        </span>
                                        <span className="fw-bold text-primary">{c.price}</span>
                                    </li>
                                ))}
                            </ul>
                            <Row className="mb-2">
                                <Col xs={7} className="text-end fw-bold">Total Harga Semua Kursus:</Col>
                                <Col xs={5} className="fw-bold text-danger">
                                    {(() => {
                                        const total = courses.reduce((sum, c) => sum + parseIDR(c.price), 0);
                                        return `Rp${total.toLocaleString("id-ID")},00`;
                                    })()}
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col xs={7} className="text-end fw-bold">
                                    <FaCrown color="#cc00cc" /> Diskon Spesial 50%:
                                </Col>
                                <Col xs={5} className="fw-bold text-success">
                                    {(() => {
                                        const total = courses.reduce((sum, c) => sum + parseIDR(c.price), 0);
                                        const diskon = total / 2;
                                        return `Rp${diskon.toLocaleString("id-ID")},00`;
                                    })()}
                                </Col>
                            </Row>
                            <hr />
                            <div className="mb-3">
                                <div className="alert alert-info d-flex align-items-center" role="alert">
                                    <FaRocket className="me-2" color="#cc00cc" />
                                    <div>
                                        <b>Paling Direkomendasikan!</b> Dapatkan akses <u>semua kursus</u> hanya dengan <b>50% dari total harga</b> untuk 1 bulan penuh. Maksimalkan pembelajaran Anda dengan harga super hemat!
                                    </div>
                                </div>
                                <div className="alert alert-secondary d-flex align-items-center" role="alert">
                                    <FaCheckCircle className="me-2" color="#00b894" />
                                    <div>
                                        Atau, Anda bisa mencoba <b>berlangganan satu kursus</b> (<span className="text-primary">{course?.title}</span>) dengan harga normal <b>{course?.price}</b> untuk 1 bulan. Cocok untuk percobaan pertama!
                                    </div>
                                </div>
                            </div>
                            <Row className="g-2">
                                <Col xs={12} md={6}>
                                    <Button
                                        variant="success"
                                        className="w-100 fw-bold"
                                        size="lg"
                                        onClick={() => alert("Langganan semua kursus dengan diskon 50%!")}
                                    >
                                        <FaCrown className="me-2" /> Langganan Semua Kursus (Diskon 50%)
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button
                                        variant="outline-primary"
                                        className="w-100 fw-bold"
                                        size="lg"
                                        onClick={() => alert("Langganan satu kursus saja")}
                                    >
                                        <FaBookOpen className="me-2" /> Langganan Kursus Ini Saja
                                    </Button>
                                </Col>
                            </Row>
                            <div className="mt-4 text-center text-muted" style={{ fontSize: "0.95em" }}>
                                <FaInfoCircle className="me-1" /> Anda dapat memperpanjang langganan kapan saja jika merasa puas dan ingin terus belajar!
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Modal.Body>
        </Modal>
    )
}