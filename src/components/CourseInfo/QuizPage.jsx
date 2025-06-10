import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import {

/**
 * QuizPage.jsx
 * 
 * Halaman kuis online course IT/programming dengan React, Vite, react-bootstrap, bootstrap, dan react-icons.
 * - Soal dan opsi acak setiap kali kuis dimulai.
 * - Skor dihitung langsung.
 * - Setelah submit, hasil dan evaluasi ditampilkan.
 * - Warna utama: #cc00cc (ungu).
 * 
 * Penjelasan lengkap di setiap bagian kode.
 */

    Container,
    Card,
    Button,
    ProgressBar,
    ListGroup,
    Alert,
    Spinner,
} from "react-bootstrap";

// Warna utama
const PRIMARY_COLOR = "#cc00cc";

// Contoh data soal kuis (10 soal, 4 opsi, 1 jawaban benar per soal)
const QUIZ_QUESTIONS = [
    {
        question: "Apa itu React?",
        correct: "Library JavaScript untuk membangun UI",
        options: [
            "Framework CSS",
            "Bahasa pemrograman",
            "Library JavaScript untuk membangun UI",
            "Database NoSQL",
        ],
    },
    {
        question: "Apa itu Vite?",
        correct: "Build tool modern untuk frontend",
        options: [
            "Framework backend",
            "Build tool modern untuk frontend",
            "Database",
            "Plugin React",
        ],
    },
    {
        question: "Apa fungsi useState di React?",
        correct: "Menyimpan dan mengubah state komponen",
        options: [
            "Menghubungkan ke database",
            "Menyimpan dan mengubah state komponen",
            "Mengatur routing",
            "Membuat API",
        ],
    },
    {
        question: "Apa itu JSX?",
        correct: "Sintaks mirip HTML di JavaScript",
        options: [
            "Bahasa pemrograman baru",
            "Sintaks mirip HTML di JavaScript",
            "Framework CSS",
            "Database",
        ],
    },
    {
        question: "Apa itu npm?",
        correct: "Package manager untuk JavaScript",
        options: [
            "Framework CSS",
            "Package manager untuk JavaScript",
            "Database",
            "Plugin React",
        ],
    },
    {
        question: "Apa itu component di React?",
        correct: "Bagian UI yang dapat digunakan ulang",
        options: [
            "Fungsi untuk routing",
            "Bagian UI yang dapat digunakan ulang",
            "Database",
            "Plugin CSS",
        ],
    },
    {
        question: "Apa itu props di React?",
        correct: "Data yang dikirim ke komponen anak",
        options: [
            "Data yang dikirim ke komponen anak",
            "State global",
            "Database",
            "Plugin React",
        ],
    },
    {
        question: "Apa itu useEffect di React?",
        correct: "Hook untuk efek samping di komponen",
        options: [
            "Hook untuk efek samping di komponen",
            "Membuat API",
            "Mengatur routing",
            "Database",
        ],
    },
    {
        question: "Apa itu SPA?",
        correct: "Single Page Application",
        options: [
            "Single Page Application",
            "Server Page Application",
            "Simple Page Application",
            "Static Page Application",
        ],
    },
    {
        question: "Apa itu state di React?",
        correct: "Data lokal yang bisa berubah di komponen",
        options: [
            "Data lokal yang bisa berubah di komponen",
            "Database",
            "Plugin React",
            "Framework CSS",
        ],
    },
];

// Fungsi untuk mengacak array (Fisher-Yates Shuffle)
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Fungsi untuk membuat opsi acak (jawaban salah dari soal lain)
function generateRandomOptions(questions) {
    // Kumpulkan semua opsi salah dari semua soal
    const allWrongOptions = [];
    questions.forEach((q) => {
        allWrongOptions.push(...q.options.filter((opt) => opt !== q.correct));
    });

    // Untuk setiap soal, buat opsi acak (1 benar, 3 salah acak)
    return questions.map((q) => {
        // Ambil 3 opsi salah acak (tidak boleh sama dengan jawaban benar)
        let wrongs = shuffleArray(
            allWrongOptions.filter((opt) => opt !== q.correct)
        ).slice(0, 3);
        // Gabungkan dengan jawaban benar, lalu acak urutannya
        let options = shuffleArray([q.correct, ...wrongs]);
        return {
            ...q,
            options,
        };
    });
}

// Komponen utama halaman kuis
const QuizPage = () => {
    // State untuk soal kuis yang sudah diacak
    const [questions, setQuestions] = useState([]);
    // State untuk jawaban user (index opsi per soal)
    const [userAnswers, setUserAnswers] = useState({});
    // State untuk status submit
    const [submitted, setSubmitted] = useState(false);
    // State untuk loading submit (simulasi kirim ke database)
    const [loading, setLoading] = useState(false);
    // State untuk skor
    const [score, setScore] = useState(0);

    // Saat komponen mount, acak soal dan opsi
    useEffect(() => {
        // Acak urutan soal
        let shuffledQuestions = shuffleArray(QUIZ_QUESTIONS);
        // Acak opsi tiap soal (dengan opsi salah acak)
        shuffledQuestions = generateRandomOptions(shuffledQuestions);
        setQuestions(shuffledQuestions);
        setUserAnswers({});
        setSubmitted(false);
        setScore(0);
    }, []);

    // Handler saat user memilih jawaban
    const handleOptionSelect = (qIdx, optIdx) => {
        if (submitted) return; // Tidak bisa ganti jawaban setelah submit
        setUserAnswers((prev) => ({
            ...prev,
            [qIdx]: optIdx,
        }));
    };

    // Handler submit kuis
    const handleSubmit = async () => {
        // Validasi: semua soal harus dijawab
        if (Object.keys(userAnswers).length !== questions.length) {
            alert("Silakan jawab semua soal sebelum submit!");
            return;
        }
        setLoading(true);

        // Hitung skor
        let newScore = 0;
        questions.forEach((q, idx) => {
            if (q.options[userAnswers[idx]] === q.correct) {
                newScore += 1;
            }
        });

        // Simulasi kirim ke database (misal 1 detik)
        setTimeout(() => {
            setScore(newScore);
            setSubmitted(true);
            setLoading(false);
        }, 1000);
    };

    // Handler mulai ulang kuis
    const handleRestart = () => {
        // Acak ulang soal dan opsi
        let shuffledQuestions = shuffleArray(QUIZ_QUESTIONS);
        shuffledQuestions = generateRandomOptions(shuffledQuestions);
        setQuestions(shuffledQuestions);
        setUserAnswers({});
        setSubmitted(false);
        setScore(0);
    };

    // Render progress bar
    const renderProgress = () => (
        <ProgressBar
            now={(Object.keys(userAnswers).length / questions.length) * 100}
            label={`${Object.keys(userAnswers).length}/${questions.length}`}
            style={{ height: 20, backgroundColor: "#f3e6f3" }}
            variant="custom"
        />
    );

    // Render soal dan opsi
    const renderQuestions = () =>
        questions.map((q, idx) => (
            <Card
                key={idx}
                className="mb-4 shadow"
                style={{
                    borderColor: PRIMARY_COLOR,
                    borderWidth: 2,
                    borderRadius: 16,
                }}
            >
                <Card.Body>
                    <Card.Title>
                        <FaQuestionCircle color={PRIMARY_COLOR} />{" "}
                        <span style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}>
                            Soal {idx + 1}
                        </span>
                    </Card.Title>
                    <Card.Text style={{ fontSize: "1.2rem" }}>{q.question}</Card.Text>
                    <ListGroup variant="flush">
                        {q.options.map((opt, optIdx) => {
                            // Jika sudah submit, tampilkan warna benar/salah
                            let variant = "light";
                            let icon = null;
                            if (submitted) {
                                if (optIdx === userAnswers[idx]) {
                                    if (opt === q.correct) {
                                        variant = "success";
                                        icon = <FaCheckCircle color="#28a745" />;
                                    } else {
                                        variant = "danger";
                                        icon = <FaTimesCircle color="#dc3545" />;
                                    }
                                } else if (opt === q.correct) {
                                    // Tampilkan jawaban benar
                                    variant = "success";
                                    icon = <FaCheckCircle color="#28a745" />;
                                }
                            } else {
                                // Saat belum submit, highlight opsi yang dipilih
                                if (optIdx === userAnswers[idx]) {
                                    variant = "primary";
                                }
                            }
                            return (
                                <ListGroup.Item
                                    key={optIdx}
                                    action={!submitted}
                                    active={!submitted && optIdx === userAnswers[idx]}
                                    variant={variant}
                                    onClick={() => handleOptionSelect(idx, optIdx)}
                                    style={{
                                        cursor: submitted ? "default" : "pointer",
                                        borderRadius: 8,
                                        marginBottom: 6,
                                        borderColor: PRIMARY_COLOR,
                                        borderWidth: 1.5,
                                        background:
                                            !submitted && optIdx === userAnswers[idx]
                                                ? PRIMARY_COLOR
                                                : undefined,
                                        color:
                                            !submitted && optIdx === userAnswers[idx]
                                                ? "#fff"
                                                : undefined,
                                        fontWeight: "500",
                                        fontSize: "1.05rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    {icon}
                                    {opt}
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                </Card.Body>
            </Card>
        ));

    // Render hasil dan evaluasi
    const renderResult = () => (
        <Card className="mb-4 shadow" style={{ borderRadius: 16 }}>
            <Card.Body>
                <Card.Title>
                    <span style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}>
                        Hasil Kuis
                    </span>
                </Card.Title>
                <h2>
                    Skor Anda:{" "}
                    <span style={{ color: PRIMARY_COLOR }}>
                        {score} / {questions.length}
                    </span>
                </h2>
                <Alert
                    variant={score >= 8 ? "success" : score >= 5 ? "warning" : "danger"}
                    className="mt-3"
                >
                    {score === questions.length
                        ? "Luar biasa! Semua jawaban benar!"
                        : score >= 8
                        ? "Bagus sekali! Hanya sedikit salah."
                        : score >= 5
                        ? "Cukup baik, tapi masih bisa lebih baik lagi."
                        : "Ayo belajar lagi, jangan menyerah!"}
                </Alert>
                <Button
                    variant="outline-primary"
                    style={{
                        borderColor: PRIMARY_COLOR,
                        color: PRIMARY_COLOR,
                        fontWeight: "bold",
                        borderWidth: 2,
                        marginTop: 10,
                    }}
                    onClick={handleRestart}
                >
                    Mulai Kuis Baru
                </Button>
            </Card.Body>
        </Card>
    );

    // Render evaluasi soal
    const renderEvaluation = () =>
        questions.map((q, idx) => (
            <Card
                key={idx}
                className="mb-3"
                style={{
                    borderColor: PRIMARY_COLOR,
                    borderWidth: 1.5,
                    borderRadius: 12,
                }}
            >
                <Card.Body>
                    <Card.Title>
                        <span style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}>
                            Soal {idx + 1}
                        </span>
                    </Card.Title>
                    <Card.Text>{q.question}</Card.Text>
                    <ListGroup>
                        {q.options.map((opt, optIdx) => {
                            let variant = "light";
                            let icon = null;
                            if (opt === q.correct) {
                                variant = "success";
                                icon = <FaCheckCircle color="#28a745" />;
                            }
                            if (optIdx === userAnswers[idx] && opt !== q.correct) {
                                variant = "danger";
                                icon = <FaTimesCircle color="#dc3545" />;
                            }
                            return (
                                <ListGroup.Item
                                    key={optIdx}
                                    variant={variant}
                                    style={{
                                        fontWeight: opt === q.correct ? "bold" : undefined,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    {icon}
                                    {opt}
                                    {optIdx === userAnswers[idx] && (
                                        <span style={{ marginLeft: 8, fontStyle: "italic" }}>
                                            {opt === q.correct
                                                ? "(Jawaban Anda - Benar)"
                                                : "(Jawaban Anda - Salah)"}
                                        </span>
                                    )}
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                </Card.Body>
            </Card>
        ));

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f3e6f3 0%, #fff 100%)",
                paddingTop: 40,
                paddingBottom: 40,
            }}
        >
            <Container style={{ maxWidth: 800 }}>
                <Card
                    className="mb-4 shadow"
                    style={{
                        background: PRIMARY_COLOR,
                        color: "#fff",
                        borderRadius: 18,
                        border: "none",
                    }}
                >
                    <Card.Body>
                        <Card.Title style={{ fontSize: "2rem", fontWeight: "bold" }}>
                            <FaQuestionCircle size={32} /> Kuis Online Course IT/Programming
                        </Card.Title>
                        <Card.Text style={{ fontSize: "1.1rem" }}>
                            Jawab semua soal berikut. Skor dan evaluasi akan muncul setelah submit.
                        </Card.Text>
                    </Card.Body>
                </Card>
                {!submitted && (
                    <>
                        {renderProgress()}
                        <div className="mt-4">{renderQuestions()}</div>
                        <div className="d-flex justify-content-end">
                            <Button
                                variant="primary"
                                size="lg"
                                style={{
                                    background: PRIMARY_COLOR,
                                    borderColor: PRIMARY_COLOR,
                                    borderRadius: 12,
                                    fontWeight: "bold",
                                    minWidth: 160,
                                    fontSize: "1.1rem",
                                }}
                                disabled={
                                    Object.keys(userAnswers).length !== questions.length || loading
                                }
                                onClick={handleSubmit}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />{" "}
                                        Mengirim...
                                    </>
                                ) : (
                                    "Kirim Jawaban"
                                )}
                            </Button>
                        </div>
                    </>
                )}
                {submitted && (
                    <>
                        {renderResult()}
                        <Card className="mb-4 shadow" style={{ borderRadius: 16 }}>
                            <Card.Body>
                                <Card.Title>
                                    <span style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}>
                                        Evaluasi Kuis
                                    </span>
                                </Card.Title>
                                <Card.Text>
                                    Berikut evaluasi jawaban Anda. Jawaban benar ditandai hijau, salah merah.
                                </Card.Text>
                                {renderEvaluation()}
                            </Card.Body>
                        </Card>
                    </>
                )}
            </Container>
            {/* Custom style untuk progress bar */}
            <style>{`
                .progress-bar.bg-custom, .progress-bar.bg-primary {
                    background-color: ${PRIMARY_COLOR} !important;
                }
            `}</style>
        </div>
    );
};

export default QuizPage;

/**
 * Penjelasan kode:
 * - Data soal di-acak urutannya dan opsi jawaban salah diambil acak dari semua soal.
 * - User memilih jawaban, progress bar update otomatis.
 * - Setelah submit, skor dihitung, hasil dan evaluasi soal ditampilkan.
 * - Evaluasi menampilkan jawaban benar (hijau) dan salah (merah) dengan icon.
 * - Warna utama #cc00cc digunakan di seluruh elemen utama.
 * - UI responsif, interaktif, dan nyaman digunakan.
 * - Simulasi submit ke database dengan loading spinner.
 * - Mulai ulang kuis akan mengacak ulang soal dan opsi.
 */