import { useState } from 'react'
import { Form } from 'react-bootstrap'

const PostCourse = () => {
    const [course,setCourse] = useState({
        title:'',
        description:'',
        price:0,
        image:'',
        chapters:[]
    })

    const [chapter,setChapter] = useState({
        title:'',
        video:'',
        thumbnail:''
    })

    const postcourse = async(e) => {
        try {
            
        } catch (error) {
            
        }
    }
    return(
        <>
            <Form>
                <article className="course col-lg-4 col-sm-8 col-10 mx-auto mt-5 mb-3">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Nama Kursus</Form.Label>
                        <Form.Control required={true} type="search" onChange={(e)=>setData({...data,email:e.target.value})} placeholder="Nama kursus" />
                    </Form.Group>

                    <FloatingLabel controlId="floatingTextarea2" label="Deskripsi kursus">
                        <Form.Control
                        as="textarea"
                        placeholder="Deskrisi kursus"
                        style={{ height: '100px' }}
                        />
                    </FloatingLabel>

                    <Form.Group className="position-relative mb-3">
                        <Form.Label>File</Form.Label>
                        <Form.Control
                        type="file"
                        required
                        name="thumbnail"
                        onChange={handleChange}
                        isInvalid={!!errors.file}
                        />
                        <Form.Control.Feedback type="invalid" tooltip>
                        {errors.file}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <section className="chapter-course">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Nama Kursus</Form.Label>
                            <Form.Control required={true} type="search" onChange={(e)=>setData({...data,email:e.target.value})} placeholder="Nama kursus" />
                        </Form.Group>

                        <FloatingLabel controlId="floatingTextarea2" label="Deskripsi kursus">
                            <Form.Control
                            as="textarea"
                            placeholder="Deskrisi kursus"
                            style={{ height: '100px' }}
                            />
                        </FloatingLabel>

                        <Form.Group className="position-relative mb-3">
                            <Form.Label>File</Form.Label>
                            <Form.Control
                            type="file"
                            required
                            name="thumbnail"
                            onChange={handleChange}
                            isInvalid={!!errors.file}
                            />
                            <Form.Control.Feedback type="invalid" tooltip>
                            {errors.file}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </section>
                </article>
            </Form>
        </>
    )
}