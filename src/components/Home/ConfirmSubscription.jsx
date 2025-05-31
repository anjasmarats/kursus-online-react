import { Button, Card, Col, Image, Modal, Row } from "react-bootstrap";
import { FaBookOpen, FaCheckCircle, FaCrown, FaLightbulb, FaRocket, FaShoppingCart, FaStar,FaInfoCircle } from "react-icons/fa";
import { server_url } from "../../scripts/url";

export default function ConfirmSubscription({ showModal,setShowModal,course,formatToIDR }){
    // console.log("course",course)
    const accentColors = ["#f3e6ff", "#e0b3ff", "#e0b3ff", "#fff0f6"];
    return(
        <Modal show={showModal} onHide={()=>setShowModal(false)} size="lg" centered>
            <Modal.Header closeButton style={{ background: accentColors[1] }}>
                <Modal.Title>
                <FaInfoCircle color={`#cc00cc`} /> {course?.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Image
                src={`${server_url}/courses/thumbnails/${course?.image}`}
                alt={course?.title}
                fluid
                rounded
                style={{ height: 180, objectFit: "cover" }}
                className="mb-3"
                />
                <p style={{ fontSize: "1.1rem" }}>{course?.details}</p>
                <div>
                <h5 className="mb-4 text-center" style={{ color: `#cc00cc`, fontWeight: 700 }}>
                    Pilih Cara Belajar yang Paling Menguntungkan Untukmu!
                </h5>
                <Row className="g-4 justify-content-center">
                    {/* Paket Semua Kursus */}
                    <Col md={6}>
                    <Card
                        className="shadow-lg border-3 border-primary h-100"
                        style={{
                        borderColor: "#6f42c1",
                        background: "#f8f0fc",
                        position: "relative",
                        overflow: "visible",
                        }}
                    >
                        <div
                        style={{
                            position: "absolute",
                            top: -18,
                            right: 20,
                            background: "#cc00cc",
                            color: "#fff",
                            padding: "4px 18px",
                            borderRadius: 16,
                            fontWeight: 700,
                            fontSize: 14,
                            boxShadow: "0 2px 8px rgba(204,0,204,0.15)",
                            letterSpacing: 1,
                            zIndex: 2,
                        }}
                        >
                        <FaStar style={{ marginRight: 6 }} /> Paling Direkomendasikan
                        </div>
                        <Card.Body className="d-flex flex-column align-items-center">
                        <FaCrown size={40} color="#cc00cc" className="mb-2" />
                        <Card.Title className="mb-2" style={{ color: "#6f42c1", fontWeight: 700 }}>
                            <span style={{ fontSize: 22 }}>Akses Semua Kursus</span>
                        </Card.Title>
                        <Card.Text className="mb-3 text-center" style={{ fontSize: 16 }}>
                            <strong>Belajar tanpa batas!</strong> Dapatkan akses ke <span style={{ color: "#cc00cc" }}>semua kursus</span> selama <b>1 bulan</b> penuh.
                            <br />
                            <span style={{ color: "#28a745", fontWeight: 600 }}>Hemat 50% dari total harga semua kursus!</span>
                        </Card.Text>
                        <div className="mb-3">
                            <span style={{ textDecoration: "line-through", color: "#888", fontSize: 16, marginRight: 8 }}>
                            Rp {course&&course.price}
                            </span>
                            <span style={{ color: "#cc00cc", fontWeight: 700, fontSize: 24 }}>
                            Rp {course&&course.price}
                            </span>
                            <span style={{ color: "#888", fontSize: 14 }}> /bulan</span>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            style={{
                            background: "#cc00cc",
                            border: "none",
                            borderRadius: 24,
                            fontWeight: 700,
                            fontSize: 18,
                            padding: "10px 32px",
                            boxShadow: "0 2px 8px rgba(204,0,204,0.10)",
                            marginBottom: 8,
                            }}
                            onClick={() => {
                            // TODO: handle subscribe all
                            alert("Langganan semua kursus dengan diskon 50%!");
                            }}
                        >
                            <FaRocket className="me-2" /> Langganan Semua Kursus
                        </Button>
                        <div className="text-muted" style={{ fontSize: 13 }}>
                            <FaCheckCircle className="me-1" color="#28a745" />
                            Akses semua materi, update, dan fitur premium!
                        </div>
                        </Card.Body>
                    </Card>
                    </Col>
                    {/* Paket Satu Kursus */}
                    <Col md={6}>
                    <Card
                        className="shadow h-100"
                        style={{
                        borderColor: "#cc00cc",
                        background: "#fff",
                        }}
                    >
                        <Card.Body className="d-flex flex-column align-items-center">
                        <FaBookOpen size={36} color="#cc00cc" className="mb-2" />
                        <Card.Title className="mb-2" style={{ color: "#cc00cc", fontWeight: 700 }}>
                            <span style={{ fontSize: 20 }}>Langganan Kursus Ini Saja</span>
                        </Card.Title>
                        <Card.Text className="mb-3 text-center" style={{ fontSize: 16 }}>
                            <strong>Fokus pada satu kursus pilihanmu</strong> selama <b>1 bulan</b> penuh.
                            <br />
                            Dapatkan akses penuh ke seluruh materi kursus <span style={{ color: "#cc00cc" }}>{course?.title}</span>.
                        </Card.Text>
                        <div className="mb-3">
                            <span style={{ color: "#cc00cc", fontWeight: 700, fontSize: 22 }}>
                            Rp {course?.price}
                            </span>
                            <span style={{ color: "#888", fontSize: 14 }}> /bulan</span>
                        </div>
                        <Button
                            variant="outline-primary"
                            size="lg"
                            style={{
                            borderColor: "#cc00cc",
                            color: "#cc00cc",
                            borderRadius: 24,
                            fontWeight: 700,
                            fontSize: 18,
                            padding: "10px 32px",
                            marginBottom: 8,
                            background: "#f8f0fc",
                            }}
                            onClick={() => {
                            // TODO: handle subscribe single
                            alert(`Langganan kursus ${course?.title} dengan harga normal!`);
                            }}
                        >
                            <FaShoppingCart className="me-2" /> Langganan Kursus Ini
                        </Button>
                        <div className="text-muted" style={{ fontSize: 13 }}>
                            <FaCheckCircle className="me-1" color="#28a745" />
                            Akses penuh materi kursus pilihanmu!
                        </div>
                        </Card.Body>
                    </Card>
                    </Col>
                </Row>
                <div className="text-center mt-4">
                    <span style={{ color: "#888", fontSize: 15 }}>
                    <FaLightbulb className="me-2" color="#ffb300" />
                    <b>Tips:</b> Pilih paket <span style={{ color: "#cc00cc" }}>Semua Kursus</span> untuk pengalaman belajar maksimal dan hemat biaya!
                    </span>
                </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}