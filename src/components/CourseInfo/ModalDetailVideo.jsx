import { Modal,Button, Spinner } from "react-bootstrap"
import { server_url } from "../../scripts/url"
import React from "react"

const ModalDetailVideo = React.memo(({
        show,
        showFormEditCourse,
        editCourse,
        editChapter,
        thumbnail,
        chapter,
        setCourse,
        setChapter,
        course,
        changeThumbnail,
        closeViewChapter,
        loading,
        setThumbnail,
        postChapter,
        showNewChapter,
    }) =>{
    return (
        <Modal
            show={show||showNewChapter}
            onHide={closeViewChapter}
            centered
            size="lg"
            backdrop="static"
            contentClassName="border-0"
        >
            <form onSubmit={postChapter!==null?postChapter:showFormEditCourse?editCourse:editChapter}>
                <Modal.Header
                closeButton
                style={{
                    background: "#f8fafc",
                    borderBottom: "2px solid #cc00cc",
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                }}
                >
                <Modal.Title
                    className="fw-bold"
                    style={{
                        color: "#cc00cc",
                        letterSpacing: 1,
                        fontSize: "1.5rem",
                    }}
                >
                    {postChapter!==null?"Chapter Baru":showFormEditCourse?"Edit Course":"Edit Chapter"}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body
                style={{
                    background: "#f8fafc",
                    borderBottomLeftRadius: 18,
                    borderBottomRightRadius: 18,
                }}
                >
                {/* Video Preview */}
                <div className="mb-4 text-center">
                    {showFormEditCourse ? (
                        <img
                        src={thumbnail||""}
                        controls
                        style={{
                            width: "100%",
                            maxWidth: 480,
                            borderRadius: 16,
                            boxShadow: "0 2px 16px #cc00cc44",
                            background: "#000",
                            border: "2px solid #cc00cc",
                        }}
                        />
                    ) : chapter.video ? (
                        <video
                        src={`${server_url}/courses/videos/${chapter.video}`}
                        controls
                        style={{
                            width: "100%",
                            maxWidth: 480,
                            borderRadius: 16,
                            boxShadow: "0 2px 16px #cc00cc44",
                            background: "#000",
                            border: "2px solid #cc00cc",
                        }}
                        />
                    ) : (
                        <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                            width: "100%",
                            maxWidth: 480,
                            height: 220,
                            borderRadius: 16,
                            margin: "0 auto",
                            color: "#cc00cc",
                            fontSize: 18,
                            border: "2px dashed #cc00cc",
                            background: "#f3e8ff",
                        }}
                        >
                        No Video Preview
                        </div>
                    )}
                </div>
                {/* Edit Form */}
                    <div className="mb-3">
                        <label
                        htmlFor="chapterTitle"
                        className="form-label fw-semibold"
                        style={{ color: "#cc00cc" }}
                        >
                        {showFormEditCourse?"Course title":"Chapter Name"}
                        </label>
                        <input
                        type="text"
                        className="form-control"
                        id="chapterTitle"
                        placeholder={showFormEditCourse?"Enter course title":"Enter chapter name"}
                        value={showFormEditCourse?(course.title||""):(chapter.title||"")}
                        onChange={e =>{
                                if (showFormEditCourse) {
                                    setCourse({...course, title: e.target.value})
                                } else {
                                    setChapter({ ...chapter, title: e.target.value })
                                }
                            }
                        }
                        autoFocus
                        required
                        style={{
                            border: "2px solid #cc00cc",
                            borderRadius: 8,
                            background: "#fff0fa",
                            color: "#3b3b5c",
                            fontWeight: 500,
                        }}
                        />
                    </div>
                    {showFormEditCourse&&(
                        <div className="mb-3">
                            <label
                                htmlFor="coursePrice"
                                className="form-label fw-semibold"
                                style={{ color: "#cc00cc" }}
                            >
                            {"Harga course"}
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="coursePrice"
                                placeholder={"Enter course price"}
                                value={course.price||""}
                                onChange={e =>
                                    setCourse({...course, price: e.target.value})
                                }
                                autoFocus
                                required
                                style={{
                                    border: "2px solid #cc00cc",
                                    borderRadius: 8,
                                    background: "#fff0fa",
                                    color: "#3b3b5c",
                                    fontWeight: 500,
                                }}
                            />
                        </div>
                    )}
                    <div className="mb-3">
                        <label
                            htmlFor="chapterNote"
                            className="form-label fw-semibold"
                            style={{ color: "#cc00cc" }}
                        >
                        Chapter Note
                        </label>
                        <textarea
                            required={showFormEditCourse}
                            className="form-control"
                            id="chapterNote"
                            maxLength={250}
                            rows={3}
                            placeholder={showFormEditCourse?"Write notes or description for this course":"Write notes or description for this chapter"}
                            value={showFormEditCourse?(course.description||""):(chapter.chapterNote||"")}
                            onChange={e =>{
                                if (showFormEditCourse) {
                                    setCourse({...course, description: e.target.value})
                                } else {
                                    setChapter({ ...chapter, chapterNote: e.target.value })
                                }
                            }}
                            style={{
                                border: "2px solid #cc00cc",
                                borderRadius: 8,
                                background: "#fff0fa",
                                color: "#3b3b5c",
                                fontWeight: 500,
                            }}
                        />
                    </div>
                    {showFormEditCourse?(
                        <div className="mb-3">
                        <label
                            htmlFor="courseTitle"
                            className="form-label fw-semibold"
                            style={{ color: "#cc00cc" }}
                        >
                            Upload New Thumbnail{" "}
                            <span className="text-muted small">(optional)</span>
                        </label>
                        <input
                            className="form-control"
                            type="file"
                            id="courseTitle"
                            accept="image/png"
                            onChange={e =>changeThumbnail(e.target.files[0])}
                            style={{
                                border: "2px solid #cc00cc",
                                borderRadius: 8,
                                background: "#fff0fa",
                                color: "#3b3b5c",
                                fontWeight: 500,
                            }}
                        />
                        <div className="form-text" style={{ color: "#cc00cc" }}>
                            Choose a new video file to replace the current one.
                        </div>
                        </div>
                    ) : (
                        <div className="mb-3">
                        <label
                            htmlFor="chapterVideo"
                            className="form-label fw-semibold"
                            style={{ color: "#cc00cc" }}
                        >
                            Upload New Video{" "}
                            <span className="text-muted small">(optional)</span>
                        </label>
                        <input
                            className="form-control"
                            type="file"
                            id="chapterVideo"
                            accept="video/mp4"
                            onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                    setChapter({
                                        ...chapter,
                                        video: e.target.files[0],
                                    });
                                    if (showFormEditCourse) {
                                        setThumbnail(e.target.files[0])
                                    }
                                }
                            }}
                            style={{
                                border: "2px solid #cc00cc",
                                borderRadius: 8,
                                background: "#fff0fa",
                                color: "#3b3b5c",
                                fontWeight: 500,
                            }}
                        />
                        <div className="form-text" style={{ color: "#cc00cc" }}>
                            Choose a new video file to replace the current one.
                        </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer
                style={{
                    background: "#f8fafc",
                    borderTop: "2px solid #cc00cc",
                    borderBottomLeftRadius: 18,
                    borderBottomRightRadius: 18,
                }}
                >
                <Button
                    variant="outline-secondary"
                    onClick={closeViewChapter}
                    style={{
                        borderColor: "#cc00cc",
                        color: "#cc00cc",
                        borderRadius: 8,
                        fontWeight: 600,
                        minWidth: 100,
                    }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    style={{
                        background: "linear-gradient(90deg, #cc00cc 0%, #6d28d9 100%)",
                        border: "none",
                        borderRadius: 8,
                        minWidth: 140,
                        fontWeight: 700,
                        letterSpacing: 1,
                        boxShadow: "0 2px 8px #cc00cc44",
                    }}
                    disabled={loading||(showFormEditCourse?(!course.title||!course.description||!course.price):!chapter.title)}
                >
                    {loading&&(<Spinner size="sm" color="white"/>)}
                    &nbsp;
                    Save Changes
                </Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
})

export default ModalDetailVideo