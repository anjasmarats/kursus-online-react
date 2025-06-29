import { useEffect, useState } from 'react'
import { Form,FloatingLabel,Modal,Button, Spinner,Alert } from 'react-bootstrap'
import NavbarComponent from '../NavbarComponent'
import Swal from 'sweetalert2'
import { MdOutlineEdit } from 'react-icons/md'
import { IoClose } from 'react-icons/io5'
import axios from 'axios'
import { server_url } from '../../scripts/url'
import { useNavigate } from 'react-router-dom'
import auth from '../../scripts/auth'
import { persistor } from '../../app/store'
import { set_time_out_session } from '../../scripts/profiledataedit'
import { useDispatch } from 'react-redux'

const PostCourse = () => {
    const [course,setCourse] = useState({
        title:'',
        description:'',
        price:0,
        thumbnail:'',
        chapters:[]
    })

    const navigate = useNavigate()

    const [loading,setLoading] = useState(false)
    const [loadingPage,setLoadingPage] = useState(false)

    const [show,setShow] = useState(false)

    const [chapter,setChapter] = useState({
        title:'',
        video:null,
        chapterNote:''
    })

    const [previewChapter,setPreviewChapter] = useState({
        key:0,
        title:'',
        video:null,
    })

    const [error,setError] = useState(false)

    const viewChapter =(key,title,video,chapterNote)=>{
        try {
            console.info("key",key,"title",title,"video",video,"chapterNote",chapterNote)
            if (!title||!video) return
            setPreviewChapter({...previewChapter,key,title,video,chapterNote})
            setChapter({...chapter,title,video,chapterNote })
            setShow(true)
        } catch (error) {
            console.error(`error vchptr ${error}`)
        }
    }

    const closeViewChapter =()=>{
        try {
            setShow(false)
            setPreviewChapter({title:'',video:null})
            setChapter({title:'',video:''})
        } catch (error) {
            console.error(`error xviewchapter ${error}`)
        }
    }

    const deleteChapter = async(title) => {
        try {
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
        } catch (error) {
            console.error(`error xchapter ${error}`)
        }
    }

    const updateChapter = (key) => {
        try {
            if (!chapter.title||!chapter.video) return
            course.chapters[key] = {...chapter}
            closeViewChapter()
        } catch (error) {
            console.error(`error upchptr ${error}`)
        }
    }

    const postcourse = async(e) => {
        try {
            e.preventDefault()
            setLoading(true)
            const formData = new FormData()
            formData.append('title',course.title)
            formData.append('description',course.description)
            formData.append('price',course.price)
            formData.append('image',course.thumbnail)
            formData.append('chapters',JSON.stringify(course.chapters))
            course.chapters.map((v,k)=>{
                formData.append('chaptersVideo',v.video)
            })
            await axios.post(`${server_url}/api/course`,formData,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("session")}`,
                    "Content-Type":"multipart/form-data"
                }
            })

            navigate("/")
            console.log(course)
        } catch (error) {
            if (error.response) {
                if (error.response.status === 500) {
                    setError("Error Server")
                }
                if(error.response.status === 403) {
                    setError("Nama kursus sudah ada")
                }
            }
            console.error("Error")
            setLoading(false)
        }
    }
    const dispatch = useDispatch()
    
    const cekauth =async()=>{
        setLoadingPage(true)
        const result = await auth()
        if (!result) {
            await persistor.purge()
            dispatch(set_time_out_session())
            navigate("/")
        }
        setLoadingPage(false)
    }

    useEffect(()=>{
        cekauth()
    },[])

    // console.log("chapter title",chapter.title)
    // console.log("chapter video",chapter.video)

    // console.log("!course.chapters||course.chapters.length===0",(!course.chapters||course.chapters.length===0),"!course.title",!course.title,"!course.thumbnail",!course.thumbnail,'!course.description',!course.description,"!course.price",!course.price,"loading",loading)

    console.log(course)
    if (!loadingPage) {
        return(
            <>
                <NavbarComponent/>
                <Form onSubmit={postcourse} noValidate={true}>
                {error&&(<Alert variant='danger' key={"danger"} className='col-lg-6 col-sm-8 col-10 mx-auto mt-5 mb-3'>{error}</Alert>)}
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

                        <Form.Group className="mb-3" controlId="formBasicHarga">
                            <Form.Label>Harga</Form.Label>
                            <Form.Control required={true} type="number" onChange={(e)=>setCourse({...course,price:e.target.value})} placeholder="Harga Kursus" />
                        </Form.Group>

                        <Form.Group className="position-relative mb-3">
                            <Form.Label>Poster kursus</Form.Label>
                            <Form.Control
                            type="file"
                            accept='image/png'
                            required={true}
                            onChange={(e)=>setCourse({...course,thumbnail:e.target.files[0]})}
                            />
                        </Form.Group>

                        {course.chapters&&course.chapters.length>0&&(
                            <section className='bg-info opacity-3 px-3 py-2 rounded-3'>
                                {course.chapters.map((v,k)=>(
                                    <aside key={k} className='bg-primary p-2 my-2 rounded-3 d-flex justify-content-between align-items-center'>
                                        <div className='w-100 rounded-3'>
                                            <div className='overflow-auto text-light fw-bolder'>{v.title}</div>
                                            <div className='overflow-auto text-light'>{v.video.name}</div>
                                        </div>
                                        <div className="d-flex ms-5">
                                            <MdOutlineEdit size={30} style={{ cursor:"pointer" }} className='mx-2 text-light' onClick={()=>viewChapter(k,v.title,v.video,v.chapterNote)}/>
                                            <IoClose size={30} style={{ cursor:"pointer" }} className='mx-2 text-light' onClick={()=>deleteChapter(v.title)}/>
                                        </div>
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
                            <Form.Group className="mb-3" controlId="formBasicNamaChapter">
                                <Form.Label>Nama Chapter</Form.Label>
                                <Form.Control required={true} type="search" value={chapter.title} onChange={(e)=>setChapter({...chapter,title:e.target.value})} placeholder="Nama materi" />
                            </Form.Group>

                            <Form.Group className="position-relative mb-3">
                                <Form.Label>Video materi</Form.Label>
                                <Form.Control
                                type="file"
                                accept='video/mp4'
                                required={true}
                                onChange={(e)=>{setChapter({...chapter,video:e.target.files[0]})}}
                                />
                            </Form.Group>

                            <FloatingLabel controlId="floatingTextarea" label="Catatan/informasi materi tambahan" className='mb-3'>
                                <Form.Control
                                as="textarea"
                                onChange={(e)=>setChapter({...chapter,chapterNote:e.target.value})}
                                placeholder="Catatan/informasi materi tambahan"
                                rows={4}
                                style={{ height: '100px' }}
                                />
                            </FloatingLabel>

                            <div className="d-flex justify-content-end">
                                <button className='btn btn-info mx-3' disabled={!chapter.title||!chapter.video} onClick={()=>{
                                    setCourse({...course,chapters:course.chapters&&course.chapters.length>0 ?
                                        [...course.chapters,{...chapter}]
                                        :
                                        [{...chapter}]
                                    })
                                    setChapter({title:'',video:null,chapterNote:''})
                                }} type='button'>Tambah Materi</button>
                                <button className="btn btn-primary px-4 py-2" type='submit' disabled={!course.chapters||course.chapters.length===0||!course.title||!course.thumbnail||!course.price||loading}>{loading&&(<Spinner size='sm' className='me-2'/>)}Simpan</button>
                            </div>
                        </section>
                    </article>
                </Form>

                <Modal show={show} onHide={closeViewChapter}>
                    <Modal.Header closeButton>
                    <Modal.Title>{previewChapter.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <video controls={true} className='w-100'>
                        <source src={previewChapter.video?URL.createObjectURL(previewChapter.video):null} type='video/mp4'/>
                        </video>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Nama Chapter</Form.Label>
                            <Form.Control required={true} type="search" value={chapter.title} onChange={(e)=>setChapter({...chapter,title:e.target.value})} placeholder="Nama materi" />
                        </Form.Group>

                        <Form.Group className="position-relative mb-3">
                            <Form.Label>File</Form.Label>
                            <Form.Control
                            type="file"
                            accept='video/mp4'
                            required={true}
                            onChange={(e)=>{setChapter({...chapter,video:e.target.files[0]})}}
                            />
                        </Form.Group>

                        <FloatingLabel controlId="floatingTextareanew" label="Catatan/informasi singkat materi" className='mb-3'>
                            <Form.Control
                            value={chapter.chapterNote}
                            as="textarea"
                            onChange={(e)=>setChapter({...chapter,chapterNote:e.target.value})}
                            placeholder="Catatan/informasi singkat materi"
                            maxLength={255}
                            max={255}
                            rows={4}
                            style={{ height: '100px' }}
                            />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={()=>updateChapter(previewChapter.key)}>
                        Simpan
                    </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default PostCourse