import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Modal,
  Navbar,
  Nav,
  Badge,
  Image,
  Alert,
  Form,
} from "react-bootstrap";
import { FaWhatsapp, FaEdit, FaTrash, FaInfoCircle, FaPlusCircle } from "react-icons/fa";

// Dummy data
const initialUser = {
  isLoggedIn: true,
  role: "admin", // "user" or "admin"
  name: "Budi",
  subscription: {
    months: 2,
    startDate: "2024-05-01",
  },
};

const initialCourses = [
  {
    id: 1,
    title: "Pemrograman Dasar JavaScript",
    poster: "https://source.unsplash.com/400x250/?javascript,code",
    description:
      "Pelajari JavaScript dari nol dengan cara yang menyenangkan, interaktif, dan mudah dipahami. Cocok untuk pemula!",
    details:
      "Kursus ini membahas dasar-dasar JavaScript secara lengkap dan detail, mulai dari variabel, tipe data, hingga membuat aplikasi sederhana. Tersedia grup WhatsApp untuk diskusi dan sharing bersama mentor dan peserta lain.",
  },
  {
    id: 2,
    title: "Belajar HTML & CSS Interaktif",
    poster: "https://source.unsplash.com/400x250/?html,css,web",
    description:
      "Bangun fondasi web development dengan HTML & CSS. Materi lengkap, latihan seru, dan komunitas suportif.",
    details:
      "Materi kursus disusun agar mudah diikuti, dengan penjelasan visual dan latihan langsung. Dapatkan akses ke grup WhatsApp untuk tanya jawab dan diskusi setiap saat.",
  },
  {
    id: 3,
    title: "Dasar-dasar Python untuk Pemula",
    poster: "https://source.unsplash.com/400x250/?python,programming",
    description:
      "Mulai perjalanan coding-mu dengan Python. Penjelasan santai, latihan praktis, dan komunitas aktif.",
    details:
      "Kursus ini membahas Python dari dasar, cocok untuk pemula. Penjelasan mudah, latihan interaktif, dan akses ke grup WhatsApp untuk diskusi dan sharing pengalaman.",
  },
];

// Diskon
const basePrice = 150000; // per bulan
const discounts = [
  { months: 1, discount: 10 },
  { months: 2, discount: 20 },
  { months: 3, discount: 30 },
];

const mainPurple = "#cc00cc";
const accentColors = ["#f3e6ff", "#e0b3ff", "#a366cc", "#fff0f6"];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function CourseModal({ show, onHide, course }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton style={{ background: accentColors[1] }}>
        <Modal.Title>
          <FaInfoCircle color={mainPurple} /> {course?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Image
          src={course?.poster}
          alt={course?.title}
          fluid
          rounded
          className="mb-3"
        />
        <p style={{ fontSize: "1.1rem" }}>{course?.details}</p>
      </Modal.Body>
    </Modal>
  );
}

function AddEditCourseModal({ show, onHide, onSave, course }) {
  const [form, setForm] = useState(
    course || {
      title: "",
      poster: "",
      description: "",
      details: "",
    }
  );

  React.useEffect(() => {
    setForm(
      course || {
        title: "",
        poster: "",
        description: "",
        details: "",
      }
    );
  }, [course, show]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ background: accentColors[2] }}>
        <Modal.Title>
          <FaPlusCircle color={mainPurple} /> {course ? "Edit Kursus" : "Tambah Kursus"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Judul Kursus</Form.Label>
            <Form.Control
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Masukkan judul kursus"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL Poster</Form.Label>
            <Form.Control
              name="poster"
              value={form.poster}
              onChange={handleChange}
              required
              placeholder="Link gambar kursus"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Deskripsi Singkat</Form.Label>
            <Form.Control
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              as="textarea"
              rows={2}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Detail Kursus</Form.Label>
            <Form.Control
              name="details"
              value={form.details}
              onChange={handleChange}
              required
              as="textarea"
              rows={3}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={onHide}
              className="me-2"
            >
              Batal
            </Button>
            <Button
              type="submit"
              style={{
                background: mainPurple,
                border: "none",
                fontWeight: "bold",
              }}
            >
              Simpan
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function SubscriptionOffer() {
  return (
    <Row className="my-5 justify-content-center">
      <Col md={12}>
        <h3 className="text-center mb-4" style={{ color: mainPurple }}>
          Pilihan Berlangganan Kursus
        </h3>
      </Col>
      {discounts.map((d, idx) => (
        <Col md={4} key={d.months} className="mb-4">
          <Card
            style={{
              borderColor: mainPurple,
              background: accentColors[idx % accentColors.length],
              boxShadow: "0 4px 16px rgba(204,0,204,0.08)",
            }}
            className="h-100"
          >
            <Card.Body className="d-flex flex-column align-items-center">
              <Badge
                bg="light"
                text="dark"
                style={{
                  color: mainPurple,
                  border: `1px solid ${mainPurple}`,
                  fontSize: "1rem",
                  marginBottom: "1rem",
                }}
              >
                {d.months} Bulan
              </Badge>
              <h4 style={{ color: mainPurple }}>
                Rp{(basePrice * d.months * (1 - d.discount / 100)).toLocaleString("id-ID")}
                <small className="text-muted" style={{ fontSize: "0.9rem" }}>
                  {" "}
                  <del>Rp{(basePrice * d.months).toLocaleString("id-ID")}</del>
                </small>
              </h4>
              <p className="text-center mt-2 mb-4" style={{ fontSize: "1.05rem" }}>
                Diskon {d.discount}% untuk langganan {d.months} bulan penuh semua kursus!
              </p>
              <Button
                variant="outline-light"
                style={{
                  background: mainPurple,
                  color: "#fff",
                  border: "none",
                  fontWeight: "bold",
                  width: "100%",
                }}
              >
                Langganan Sekarang
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

function CourseList({ isAdmin, onShowModal, onEdit, onDelete, courses }) {
  return (
    <Row className="g-4">
      {courses.map((course) => (
        <Col md={4} key={course.id}>
          <Card
            style={{
              borderColor: mainPurple,
              background: accentColors[course.id % accentColors.length],
              boxShadow: "0 2px 12px rgba(204,0,204,0.07)",
              transition: "transform 0.15s",
            }}
            className="h-100 shadow-sm course-card"
          >
            <Card.Img
              variant="top"
              src={course.poster}
              alt={course.title}
              style={{ height: 180, objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title style={{ color: mainPurple }}>{course.title}</Card.Title>
              <Card.Text>{course.description}</Card.Text>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                  variant="outline-primary"
                  style={{
                    borderColor: mainPurple,
                    color: mainPurple,
                    fontWeight: "bold",
                    borderRadius: 20,
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onClick={() => onShowModal(course)}
                >
                  <FaInfoCircle className="me-1" /> Info Selengkapnya
                </Button>
                {isAdmin && (
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-success"
                      size="sm"
                      style={{
                        borderRadius: 20,
                        fontWeight: "bold",
                        borderWidth: 2,
                        borderColor: "#28a745",
                        color: "#28a745",
                        background: "#eaffea",
                        transition: "background 0.2s, color 0.2s",
                      }}
                      onClick={() => onEdit(course)}
                    >
                      <FaEdit className="me-1" /> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      style={{
                        borderRadius: 20,
                        fontWeight: "bold",
                        borderWidth: 2,
                        borderColor: "#dc3545",
                        color: "#dc3545",
                        background: "#fff0f3",
                        transition: "background 0.2s, color 0.2s",
                      }}
                      onClick={() => onDelete(course)}
                    >
                      <FaTrash className="me-1" /> Hapus
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

function InfoSection() {
  return (
    <Row className="my-5 align-items-center">
      <Col md={6}>
        <h2 style={{ color: mainPurple, fontWeight: 700 }}>
          Kursus Programming yang Santai, Menyenangkan, dan Lengkap!
        </h2>
        <ul style={{ fontSize: "1.1rem", marginTop: 20 }}>
          <li>
            <strong>Pembelajaran santai & menyenangkan</strong> – Materi disampaikan dengan gaya interaktif, mudah dipahami, dan penuh semangat.
          </li>
          <li>
            <strong>Materi lengkap & detail</strong> – Semua topik dibahas tuntas, mulai dari dasar hingga praktik nyata.
          </li>
          <li>
            <strong>Grup WhatsApp eksklusif</strong> – Dapatkan akses ke komunitas aktif untuk sharing, diskusi, dan tanya jawab kapan saja.
          </li>
        </ul>
        <Alert
          variant="light"
          style={{
            borderLeft: `6px solid ${mainPurple}`,
            background: accentColors[0],
            marginTop: 20,
          }}
        >
          <FaWhatsapp color="#25D366" /> Gabung grup WhatsApp setelah berlangganan untuk pengalaman belajar yang lebih seru!
        </Alert>
      </Col>
      <Col md={6} className="text-center">
        <Image
          src="https://source.unsplash.com/400x300/?programming,team,learning"
          alt="Belajar Programming"
          fluid
          rounded
          style={{
            border: `4px solid ${mainPurple}`,
            boxShadow: "0 4px 24px rgba(204,0,204,0.13)",
          }}
        />
      </Col>
    </Row>
  );
}

function BrandHeader({ user }) {
  return (
    <Row className="align-items-center my-4">
      <Col md={8}>
        {!user.isLoggedIn ? (
          <h1 style={{ color: mainPurple, fontWeight: 700 }}>
            Belajar Membuat Program Software dengan Mudah dan Nyaman
          </h1>
        ) : user.role === "user" ? (
          <>
            <h2 style={{ color: mainPurple, fontWeight: 700 }}>
              Selamat datang, {user.name}! Selamat belajar programming bersama kami.
            </h2>
            <p>
              Masa langganan: <Badge bg="light" text="dark" style={{ color: mainPurple }}>
                {user.subscription.months} bulan
              </Badge>{" "}
              <span style={{ fontSize: "0.95rem" }}>
                (Mulai: {formatDate(user.subscription.startDate)})
              </span>
            </p>
          </>
        ) : (
          <h2 style={{ color: mainPurple, fontWeight: 700 }}>
            Selamat datang, Admin! Kelola kursus dengan sangat mudah, sangat nyaman, dan sangat interaktif.
          </h2>
        )}
      </Col>
      <Col md={4} className="text-end">
        <Image
          src="https://source.unsplash.com/200x200/?coding,student,learning"
          alt="Brand"
          roundedCircle
          style={{
            border: `4px solid ${mainPurple}`,
            background: accentColors[1],
            width: 120,
            height: 120,
            objectFit: "cover",
          }}
        />
      </Col>
    </Row>
  );
}

export default function HomePage() {
  const [user, setUser] = useState(initialUser);
  const [courses, setCourses] = useState(initialCourses);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Add/Edit Modal
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [editCourse, setEditCourse] = useState(null);

  // Admin actions
  const handleEdit = (course) => {
    setEditCourse(course);
    setShowAddEdit(true);
  };

  const handleDelete = (course) => {
    if (window.confirm(`Yakin ingin menghapus kursus "${course.title}"?`)) {
      setCourses(courses.filter((c) => c.id !== course.id));
    }
  };

  const handleShowModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditCourse(null);
    setShowAddEdit(true);
  };

  const handleSaveCourse = (data) => {
    if (editCourse) {
      setCourses(
        courses.map((c) =>
          c.id === editCourse.id ? { ...c, ...data } : c
        )
      );
    } else {
      setCourses([
        ...courses,
        {
          ...data,
          id: Date.now(),
        },
      ]);
    }
    setShowAddEdit(false);
  };

  return (
    <div style={{ background: accentColors[0], minHeight: "100vh" }}>
      <Navbar
        expand="lg"
        style={{
          background: mainPurple,
          boxShadow: "0 2px 12px rgba(204,0,204,0.09)",
        }}
        variant="dark"
      >
        <Container>
          <Navbar.Brand style={{ fontWeight: 700, fontSize: "1.5rem" }}>
            <span style={{ color: "#fff" }}>CodeBeginner</span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <Nav.Link href="#" style={{ color: "#fff" }}>
                Beranda
              </Nav.Link>
              <Nav.Link href="#" style={{ color: "#fff" }}>
                Kursus
              </Nav.Link>
              <Nav.Link href="#" style={{ color: "#fff" }}>
                {user.isLoggedIn ? "Profil" : "Login/Register"}
              </Nav.Link>
              <Nav.Link
                href="#"
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  marginLeft: 16,
                }}
                onClick={() =>
                  setUser((u) =>
                    u.role === "admin"
                      ? { ...u, role: "user" }
                      : { ...u, role: "admin" }
                  )
                }
              >
                {user.role === "admin" ? "Mode User" : "Mode Admin"}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ maxWidth: 1200, marginTop: 30 }}>
        <BrandHeader user={user} />
        <InfoSection />
        <SubscriptionOffer />
        <hr style={{ borderColor: mainPurple, margin: "40px 0" }} />
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0" style={{ color: mainPurple }}>
            Daftar Kursus Online
          </h3>
          {user.role === "admin" && (
            <Button
              style={{
                background: mainPurple,
                border: "none",
                fontWeight: "bold",
                borderRadius: 24,
                boxShadow: "0 2px 8px rgba(204,0,204,0.10)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 18,
                padding: "8px 20px",
              }}
              onClick={handleAdd}
            >
              <FaPlusCircle className="me-2" /> Tambah Kursus Baru
            </Button>
          )}
        </div>
        <CourseList
          isAdmin={user.role === "admin"}
          onShowModal={handleShowModal}
          onEdit={handleEdit}
          onDelete={handleDelete}
          courses={courses}
        />
        <CourseModal
          show={showModal}
          onHide={() => setShowModal(false)}
          course={selectedCourse}
        />
        <AddEditCourseModal
          show={showAddEdit}
          onHide={() => setShowAddEdit(false)}
          onSave={handleSaveCourse}
          course={editCourse}
        />
      </Container>
      <footer
        className="text-center py-4 mt-5"
        style={{
          background: mainPurple,
          color: "#fff",
          letterSpacing: 1,
          fontWeight: 500,
        }}
      >
        &copy; {new Date().getFullYear()} CodeBeginner. Belajar Programming dengan Mudah dan Nyaman.
      </footer>
    </div>
  );
}