import { useEffect, useState } from "react";
import { Carousel, Form, Row, Col, Button } from "react-bootstrap";
import { useParams } from "react-router";
import { Questions } from './SurveyComponent';
import API from "../API";


const Answers = () => {
    const params = useParams();
    const [answers, setAnswers] = useState([])
    const [survey, setSurvey] = useState(null)
    const [nav, setNav] = useState([])
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        getAnswers();
    }, [])

    const getAnswers = () => {
        API.getAnswers(params.id).then((response) => {
            setAnswers(response)
            setNav(response.map(answer => answer.username))
        })
        API.getSurvey(params.id).then((response) => {
            setSurvey(response)
        })
    }
    return <>
        <Row>
            <Col md={4}>
                <Form.Group className="w-100">
                    <Form.Label>Respondent Name list</Form.Label>
                    <Form.Control as="select" onChange={(e) => setActiveIndex(Number(e.target.value))} multiple>
                        {nav.map((name, index) => <option value={index}>{name}</option>)}
                    </Form.Control>
                </Form.Group>
            </Col>
            <Col md={8}>
                {answers.length === 0 ? <h2>No answers</h2> : <>
                    <Carousel className="w-100" activeIndex={activeIndex} controls={false}>
                        {
                            survey && answers && answers.map((answer, index) => {
                                return <Carousel.Item key={index}>
                                    <div className="">
                                        <h5>Respondent Name: {answer.username}</h5>
                                        <Questions disabled={true} answers={answer.result} questions={survey.questions} setMessage={() => { }} />
                                    </div>
                                    {index + 1}/{answers.length}
                                </Carousel.Item>
                            })
                        }
                    </Carousel>
                    <div className="d-flex justify-content-between">
                        <Button size="sm" onClick={() => { setActiveIndex(Math.max(0, activeIndex - 1)) }} > Backword</Button>
                        <Button size="sm" onClick={() => { setActiveIndex(Math.min(answers.length - 1, activeIndex + 1)) }} >Forword</Button>
                    </div></>
                }
            </Col>
        </Row>
    </>


}

export { Answers };