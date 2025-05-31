import { Col, Image, Row } from "react-bootstrap";

export default function BrandHeader({ isAdmin,authorized,profileData }) {
  const mainPurple = "#cc00cc";
  const accentColors = ["#f3e6ff", "#e0b3ff", "#e0b3ff", "#fff0f6"];
  return (
    <Row className="align-items-center my-4">
      <Col md={8}>
        {!authorized ? (
          <h1 style={{ color: mainPurple, fontWeight: 700 }}>
            Belajar Membuat Program Software dengan Mudah dan Nyaman
          </h1>
        ) : isAdmin ? (
          <h2 style={{ color: mainPurple, fontWeight: 700 }}>
            Kelola kursus dengan sangat mudah, sangat nyaman, dan sangat interaktif.
          </h2>
        ) : (
          <>
            <h2 style={{ color: mainPurple, fontWeight: 700 }}>
              Selamat datang, {user.name}! Selamat belajar programming bersama kami.
            </h2>
            <p>
              Masa langganan: <Badge bg="light" text="dark" style={{ color: mainPurple }}>
                {profileData.duration!==""?`${profileData.duration} bulan`:""}
              </Badge>{" "}
              <span style={{ fontSize: "0.95rem" }}>
                {profileData.duration!==""?`(Mulai: ${profileData.start_time})`:""}
              </span>
            </p>
          </>
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