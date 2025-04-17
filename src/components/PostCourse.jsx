import { useState } from 'react'
import { Form,FloatingLabel,Modal,Button } from 'react-bootstrap'
import NavbarComponent from './NavbarComponent'

const PostCourse = () => {
    const [course,setCourse] = useState({
        title:'',
        description:'',
        price:0,
        thumbnail:'',
        chapters:[]
    })

    const [show,setShow] = useState(false)

    const [chapter,setChapter] = useState({
        title:'',
        video:'',
    })

    const [previewChapter,setPreviewChapter] = useState({
        key:0,
        title:'',
        video:'',
    })

    const viewChapter =(key,title,video)=>{
        setPreviewChapter({...previewChapter,key,title,video})
        setShow(true)
    }

    const closeViewChapter =()=>{
        setShow(false)
        setPreviewChapter({})
    }

    const postcourse = async(e) => {
        try {
            
        } catch (error) {
            
        }
    }
    return(
        <>
            <Form>
                <NavbarComponent/>
                <article className="course col-lg-6 col-sm-8 col-10 mx-auto mt-5 mb-3 rounded-5 p-3 shadow-lg">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Nama Kursus</Form.Label>
                        <Form.Control required={true} type="search" onChange={(e)=>setCourse({...course,title:e.target.value})} placeholder="Nama kursus" />
                    </Form.Group>

                    <FloatingLabel controlId="floatingTextarea2" label="Deskripsi kursus">
                        <Form.Control
                        as="textarea"
                        onChange={(e)=>setCourse({...course,description:e.target.value})}
                        placeholder="Deskrisi kursus"
                        style={{ height: '100px' }}
                        required={true}
                        />
                    </FloatingLabel>

                    <Form.Group className="position-relative mb-3">
                        <Form.Label>File</Form.Label>
                        <Form.Control
                        type="file"
                        required={true}
                        onChange={(e)=>setCourse({...course,thumbnail:e.target.files[0]})}
                        />
                    </Form.Group>

                    {course.chapters.length>0&&(
                        <section className='bg-secondary opacity-3 p-3 rounded-5'>
                            {course.chapters.map((v,k)=>(
                                <aside key={k} onClick={()=>viewChapter(k,v.title,v.video)} className='d-flex justify-content-between align-items-center'>
                                    <video controls={true}>
                                        <source src={URL.createObjectURL(v.video)} type="video/mp4" />
                                    </video>
                                    <span className='fs-3 overflow-auto'>{v.title}</span>
                                </aside>
                            ))}
                        </section>
                    )}

                    <div className="d-flex my-2 justify-content-between align-items-center">
                        <hr className='w-100 mx-3'/>
                        <span className='fs-5'>CHAPTER</span>
                        <hr className='w-100 mx-3'/>
                    </div>

                    <section className="chapter-course rounded-5 p-3">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Nama Chapter</Form.Label>
                            <Form.Control required={true} type="search" onChange={(e)=>setChapter({...chapter,title:e.target.value})} placeholder="Nama kursus" />
                        </Form.Group>

                        <Form.Group className="position-relative mb-3">
                            <Form.Label>File</Form.Label>
                            <Form.Control
                            type="file"
                            required={true}
                            onChange={(e)=>{setChapter({...chapter,video:e.target.files[0]})}}
                            />
                        </Form.Group>
                        <button className='btn btn-info' disabled={!chapter.title||!chapter.video} onClick={()=>setCourse({...course,chapters:course.chapters.push(chapter)})}>hai</button>
                    </section>
                </article>
            </Form>

            <Modal show={show} onHide={closeViewChapter}>
                <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={null}>
                    Close
                </Button>
                <Button variant="primary" onClick={null}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PostCourse