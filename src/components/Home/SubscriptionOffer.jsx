import { Badge, Button, Card, Col, Row } from "react-bootstrap";

export default function SubscriptionOffer({ loading }) {
  // Diskon
  const basePrice = 150000; // per bulan
  const discounts = [
    { months: 1, discount: 10 },
    { months: 2, discount: 20 },
    { months: 3, discount: 30 },
  ];
  const mainPurple = "#cc00cc";
  const accentColors = ["#f3e6ff", "#e0b3ff", "#e0b3ff", "#fff0f6"];
  return (
    <Row className="my-5 justify-content-center">
      <Col md={12}>
      {loading ? (
        <div className="bg-secondary loading rounded-3 p-2 w-25 m-auto mb-5">&nbsp;</div>
      ) : (
        <h3 className="text-center mb-4" style={{ color: mainPurple }}>
          Pilihan Berlangganan Kursus
        </h3>
      )}
      </Col>
      {discounts.map((d, idx) => (
        <Col md={4} key={d.months} className="mb-4">
          {loading ? (
            <div className="bg-secondary loading mx-2 rounded-3 p-5">&nbsp;</div>
          ) : (
            <Card
              style={{
                border:idx===discounts.length-1?"4px solid "+mainPurple:"1.5px solid "+mainPurple,
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
          )}
        </Col>
      ))}
    </Row>
  );
}