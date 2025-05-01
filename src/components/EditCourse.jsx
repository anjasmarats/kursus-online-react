import { useState,useEffect } from 'react'
import { Form,FloatingLabel,Modal,Button, Spinner,Alert } from 'react-bootstrap'
import NavbarComponent from './NavbarComponent'
import Swal from 'sweetalert2'
import { MdOutlineEdit } from 'react-icons/md'
import { IoClose } from 'react-icons/io5'
import axios from 'axios'
import { server_url } from '../scripts/url'
import { useNavigate,useParams } from 'react-router-dom'
import auth from '../scripts/auth'
import "../styles/EditCourse.css"

const EditCourse = () => {
    const { id } = useParams()
    const [idCourse,setIdCourse] = useState(0)
    const [courseThumbnail,setCourseThumbnail] = useState(0)
    const [course,setCourse] = useState({
        title:'',
        description:'',
        price:0,
        thumbnail:'',
        chapters:[]
    })

    const navigate = useNavigate()

    const [loading,setLoading] = useState(false)

    const [loadingData,setLoadingData] = useState(false)

    const [show,setShow] = useState(false)

    const [chapter,setChapter] = useState({
        title:'',
        videodata:null,
        videonew:null,
        description:''
    })

    const [previewChapter,setPreviewChapter] = useState({
        key:0,
        title:'',
        video:null,
    })

    const [error,setError] = useState(false)

    const viewChapter = async(key,title,video,description,chapterId)=>{
        try {
            console.info("key",key,"title",title,"video",video,"description",description)
            if (!title||!video) console.error("title or video not found")
            setPreviewChapter({...previewChapter,key,title,video,description})
            const dataVideo = chapter.videonew?chapter.videonew:await getChapterVideo({courseId:idCourse,chapterId})
            setChapter({...chapter,title,video:dataVideo,description })
            console.log("chapter",chapter)
            console.log("chapter.video",chapter.video)
            setShow(true)
        } catch (error) {
            console.error(`error vchptr ${error}`)
        }
    }

    const closeViewChapter =()=>{
        try {
            setShow(false)
            setPreviewChapter({title:'',videonew:null})
            setChapter({title:'',videodata:'',videonew:''})
        } catch (error) {
            console.error(`error xviewchapter ${error}`)
        }
    }

    const getChapterVideo = async(data)=>{
        try {
            console.log("idCourse",idCourse)
            const { courseId,chapterId } = data
          const res = await fetch(`${server_url}/api/course/${courseId}/chapter/${chapterId}/video`, {
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("session")}`
            }
          })
          
          if (res.status === 500) {
            setError("Internal Server Error")
            return
          }
    
          if (res.status===200) {
            const blob = await res.blob()
            return URL.createObjectURL(blob)
          }
        } catch (error) {
          setError("Error")
          console.error(`error app ${error}`)
          setLoading(false)
        } finally {
          setLoading(false)
        }
      }

      const getThumbnail = async(data)=>{
        try {
          const res = await fetch(`${server_url}/api/course/photo`, {
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${data}`
            }
          })
          
          if (res.status === 500) {
            setError("Internal Server Error")
            return
          }
    
          if (res.status===200) {
            const blob = await res.blob()
            return URL.createObjectURL(blob)
          }
        } catch (error) {
          setError("Error")
          console.error(`error app ${error}`)
          setLoading(false)
        } finally {
          setLoading(false)
        }
      }

    const fetchData = async () => {
        try {
            let chapters=[]
          setLoadingData(true)
          const {adminuser} = await auth()
          if (!adminuser) {
            navigate('/')
          }
          const response = await axios.get(`${server_url}/api/course/${id}`)
          const res = await response.data
        //   console.log("res.course",res.course.Chapters[2])
          const { courseId,title,description,image,price,Chapters } = res.course
          setIdCourse(courseId)
          for (let i = 0; i < Chapters.length; i++) {
            setChapter({...chapter,title:Chapters[i].title,videodata:Chapters[i].video,description:Chapters[i].description})
            chapters.push(chapter)
          }
          chapters=[]
          const thumbnail = await getThumbnail(image)
          setCourseThumbnail(thumbnail)
          setCourse({...course,title,description,price,chapters:[...chapters] })
          setChapter({})
          setLoadingData(false)
        } catch (error) {
          if (error.response && error.response.status === 500) {
            setError("Internal Server Error")
          }
          console.error(`error app ${error}`)
          setLoadingData(false)
        } finally {
          setLoadingData(false)
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
            console.log("chapter",chapter)
            if (!chapter.title||!chapter.videonew) return
            console.log("chapter",chapter,"key",key)
            course.chapters[key] = {...chapter}
            // console.log("chapter",chapter)
            console.log(course.chapters.map((v,k)=>{
                console.log("v",v,"k",k)
            }))
            closeViewChapter()
        } catch (error) {
            console.error(`error upchptr ${error}`)
        }
    }

    const editcourse = async(e) => {
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
            formData.append('chapterNote',chapter.description)
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

    // console.log("chapter title",chapter.title)
    // console.log("chapter video",chapter.video)

    // console.log("!course.chapters||course.chapters.length===0",(!course.chapters||course.chapters.length===0),"!course.title",!course.title,"!course.thumbnail",!course.thumbnail,'!course.description',!course.description,"!course.price",!course.price,"loading",loading)

    // console.log(course.chapters)

    useEffect(() => {
        fetchData()
    }, [])

    return(
        <>
            <NavbarComponent/>
            <Form onSubmit={editcourse} noValidate={true}>
            {error&&(<Alert variant='danger' key={"danger"} className='col-lg-6 col-sm-8 col-10 mx-auto mt-5 mb-3'>{error}</Alert>)}
                <article className="edit-course col-lg-6 col-sm-8 col-10 mx-auto mt-5 mb-3 rounded-5 p-3 shadow-lg">
                    {loadingData?(
                        <div className='w-100 bg-secondary rounded-3 py-3 my-3 loading'>&nbsp;</div>
                    ):(<img src={course.thumbnail?URL.createObjectURL(course.thumbnail):courseThumbnail} alt="" className='w-100 my-3'/>)}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        {loadingData?(
                            <div className='w-100 bg-secondary rounded-3 py-3 my-3 loading'>&nbsp;</div>
                        ):(
                            <>
                                <Form.Label>Nama Kursus</Form.Label>
                                <Form.Control required={true} type="search" value={course.title} onChange={(e)=>setCourse({...course,title:e.target.value})} placeholder="Nama kursus" />
                            </>
                        )}
                    </Form.Group>

                    {loadingData?(
                        <div className='w-100 bg-secondary rounded-3 py-3 my-3 loading'>&nbsp;</div>
                    ):(
                        <FloatingLabel controlId="floatingTextarea2" label="Deskripsi kursus">
                            <Form.Control
                            as="textarea"
                            value={course.description}
                            onChange={(e)=>setCourse({...course,description:e.target.value})}
                            placeholder="Deskrisi kursus"
                            rows={4}
                            style={{ height: '100px' }}
                            required={true}
                            />
                        </FloatingLabel>
                    )}

                    <Form.Group className="mb-3" controlId="formBasicHarga">
                        {loadingData?(
                            <div className='w-100 bg-secondary rounded-3 py-3 my-3 loading'>&nbsp;</div>
                        ):(
                            <>
                                <Form.Label>Harga</Form.Label>
                                <Form.Control required={true} value={course.price} type="number" onChange={(e)=>setCourse({...course,price:e.target.value})} placeholder="Harga Kursus" />
                            </>
                        )}
                    </Form.Group>

                    <Form.Group className="position-relative mb-3">
                        {loadingData?(
                            <div className='w-100 bg-secondary rounded-3 py-3 my-3 loading'>&nbsp;</div>
                        ):(
                            <>
                                <Form.Label>Poster kursus</Form.Label>
                                <Form.Control
                                type="file"
                                accept='image/png'
                                required={true}
                                onChange={(e)=>setCourse({...course,thumbnail:e.target.files[0]})}
                                />
                            </>
                        )}
                    </Form.Group>

                    {loadingData?(
                        <div className='w-100 bg-secondary rounded-3 py-3 my-3 loading'>&nbsp;</div>
                    ):course.chapters&&course.chapters.length>0&&(
                        <section className='bg-info opacity-3 px-3 py-2 rounded-3'>
                            {course.chapters.map((v,k)=>(
                                <aside key={k} className='bg-primary p-2 my-2 rounded-3 d-flex justify-content-between align-items-center'>
                                    <div className='w-100 rounded-3'>
                                        <div className='overflow-auto text-light fw-bolder'>{v.title}</div>
                                        <div className='overflow-auto text-light'>{v.video.name}</div>
                                    </div>
                                    <div className="d-flex ms-5">
                                        <MdOutlineEdit size={30} style={{ cursor:"pointer" }} className='mx-2 text-light' onClick={()=>viewChapter(k,v.title,v.video,v.description,v.id)}/>
                                        <IoClose size={30} style={{ cursor:"pointer" }} className='mx-2 text-light' onClick={()=>deleteChapter(v.title)}/>
                                    </div>
                                </aside>
                            ))}
                        </section>
                    )}

                    <div className={loadingData?'w-100 loading':`d-flex my-2 justify-content-between align-items-center`}>
                        {!loadingData?(
                            <>&nbsp;</>
                        ):(
                            <>
                                <hr className='w-100 mx-3'/>
                                <span className='fs-5'>CHAPTER</span>
                                <hr className='w-100 mx-3'/>
                            </>
                        )}
                    </div>

                    {loadingData?(
                        <div className='w-100 bg-secondary rounded-3 py-3 my-3 loading'>&nbsp;</div>
                    ):(<section className="chapter-course rounded-5 p-3">
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
                            onChange={(e)=>{setChapter({...chapter,videonew:e.target.files[0]})}}
                            />
                        </Form.Group>

                        <FloatingLabel controlId="floatingTextarea" label="Catatan/informasi materi tambahan" className='mb-3'>
                            <Form.Control
                            as="textarea"
                            onChange={(e)=>setChapter({...chapter,description:e.target.value})}
                            placeholder="Catatan/informasi materi tambahan"
                            rows={4}
                            style={{ height: '100px' }}
                            />
                        </FloatingLabel>

                        <div className="d-flex justify-content-end">
                            <button className='btn btn-info mx-3' disabled={!chapter.title||!chapter.videonew} onClick={()=>{
                                setCourse({...course,chapters:course.chapters&&course.chapters.length>0 ?
                                    [...course.chapters,{...chapter}]
                                    :
                                    [{...chapter}]
                                })
                                setChapter({title:'',video:null,description:''})
                            }} type='button'>Tambah Materi</button>
                            <button className="btn btn-primary px-4 py-2" type='submit' disabled={!course.chapters||course.chapters.length===0||!course.title||!course.thumbnail||!course.price||loading}>{loading&&(<Spinner size='sm' className='me-2'/>)}Simpan</button>
                        </div>
                    </section>)}
                </article>
            </Form>

            <Modal show={show} onHide={closeViewChapter}>
                <Modal.Header closeButton>
                <Modal.Title>{chapter.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <video controls={true} className='w-100'>
                    <source src={chapter.videonew} type='video/mp4'/>
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
                        onChange={(e)=>{setChapter({...chapter,videonew:e.target.files[0]})}}
                        />
                    </Form.Group>

                    <FloatingLabel controlId="floatingTextareanew" label="Deskripsi Materi" className='mb-3'>
                        <Form.Control
                        value={chapter.description}
                        as="textarea"
                        onChange={(e)=>setChapter({...chapter,description:e.target.value})}
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

export default EditCourse