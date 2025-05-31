import { Alert, Col, Image, Row } from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa";

export default function InfoSection({loading}) {
  const mainPurple = "#cc00cc";
  const accentColors = ["#f3e6ff", "#e0b3ff", "#e0b3ff", "#fff0f6"];
  console.log("loading",loading)
  return (
    <Row className="my-5 align-items-center">
      <Col md={6}>
        {loading ? (
          <div className="bg-secondary p-3 rounded-3 loading"></div>
        ) : (
          <h2 style={{ color: mainPurple, fontWeight: 700 }}>
            Kursus Programming yang Santai, Menyenangkan, dan Lengkap
          </h2>
        )}
        {loading ? (
          <>
            <div className="bg-secondary loading m-3 rounded-3">&nbsp;</div>
            <div className="bg-secondary loading m-3 rounded-3">&nbsp;</div>
            <div className="bg-secondary loading m-3 rounded-3">&nbsp;</div>
          </>
        ) : (
          <ul style={{ fontSize: "1.1rem", marginTop: 20 }}>
            <li>
              <strong>Pembelajaran santai & menyenangkan</strong> – Materi disampaikan dengan penuh semangat dan mudah dipahami.
            </li>
            <li>
              <strong>Materi lengkap & detail</strong> – Semua topik dibahas mulai dari dasar hingga praktik nyata.
            </li>
            <li>
              <strong>Grup WhatsApp eksklusif</strong> – Dapatkan akses ke grup kursus untuk sharing, diskusi, dan tanya jawab kapan saja.
            </li>
          </ul>
        )}
        <Alert
          variant={loading?"secondary loading":"light"}
          style={{
            borderLeft: `6px solid ${mainPurple}`,
            background: loading?`${accentColors[0]}`:"none",
            marginTop: 20,
          }}
        >
          {loading ? (
            <>&nbsp;</>
          ) : (
            <>
              <FaWhatsapp color="#25D366" /> Gabung grup WhatsApp setelah berlangganan untuk pengalaman belajar yang lebih seru!
            </>
          )}
        </Alert>
      </Col>
      <Col md={6} className="text-center">
        {loading ? (
          <div className="bg-secondary p-3 rounded-3 loading">&nbsp;</div>
        ) : (
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
        )}
      </Col>
    </Row>
  );
}