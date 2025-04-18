import { useState } from 'react'
import { Form,FloatingLabel,Modal,Button } from 'react-bootstrap'
import NavbarComponent from './NavbarComponent'
import Swal from 'sweetalert2'

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

    const deleteChapter = async(title) => {
        const confirm = await Swal.fire({
            title:`Hapus chapter ${title}`,
            showCancelButton:true,
            cancelButtonColor:"blue",
            showConfirmButton:true,
            confirmButtonColor:"red",
            confirmButtonText:"Delete"
        }).then(res=>res.isConfirmed)
        if (!confirm) {
            return
        }
        setCourse({...course,chapters:course.chapters.filter((item)=>{return item.title!==title})})
        closeViewChapter()
    }

    const postcourse = async(e) => {
        try {
            e.preventDefault()
            console.log(course)
        } catch (error) {
            
        }
    }

    console.log(course)
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
                        rows={4}
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
                        <section className='bg-info opacity-3 px-3 py-2 rounded-2'>
                            {course.chapters.map((v,k)=>(
                                <aside key={k} style={{ cursor:"pointer" }} onClick={()=>viewChapter(k,v.title,v.video)} className=''>
                                    <div className='fs-4 overflow-auto'>{v.title}</div>
                                    <div className='overflow-auto'>{v.video.name}</div>
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
                            <Form.Control required={true} type="search" onChange={(e)=>setChapter({...chapter,title:e.target.value})} placeholder="Nama materi" />
                        </Form.Group>

                        <Form.Group className="position-relative mb-3">
                            <Form.Label>File</Form.Label>
                            <Form.Control
                            type="file"
                            required={true}
                            onChange={(e)=>{setChapter({...chapter,video:e.target.files[0]})}}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <button className='btn btn-info mx-3' disabled={!chapter.title||!chapter.video} onClick={()=>setCourse({...course,chapters:[...course.chapters,{...chapter}]})} type='button'>hai</button>
                            <button className="btn btn-primary px-4 py-2" type='submit' disabled={course.chapters.length===0}>Simpan</button>
                        </div>
                    </section>
                </article>
            </Form>

            <Modal show={show} onHide={closeViewChapter}>
                <Modal.Header closeButton>
                <Modal.Title>{previewChapter.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {previewChapter.video}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={()=>deleteChapter(previewChapter.title)}>
                    Hapus
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PostCourse