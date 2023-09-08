import { Button, Modal, Alert, PageItem } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useHistory, useParams, Redirect } from "react-router";
import API from "../API";

const ClosedAnswerQuestion = ({ answer, question, index, handleInputAnswer }) => {

    return <div>
        {answer && <Form.Group className="mb-3">
            <Form.Label><strong>{index}. {question.title}</strong> <span class="text-muted">(Max accepted {question.max}, Min accepted {question.min})</span> </Form.Label>
            {question.options.map((text) => (
                <div key={`${text}`} className="mb-3">
                    <Form.Check
                        checked={answer.texts ? answer.texts.includes(text) : false}
                        onChange={(e) => { handleInputAnswer(e, index - 1, question.max > 1 ? 'checkbox' : 'radio', text) }}
                        type={'checkbox'}
                        name={question.id}
                        label={text}
                    />
                </div>
            ))}
        </Form.Group>
        }
    </div>
}

const OpenEndedQuestion = ({ answer, question, index, handleInputAnswer }) => {
    return <div>{answer && <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label><strong>{index}. {question.title} {question.optional ? '(Optional)' : ''}</strong> <span class="text-muted"> (No more than 200 characters)</span> </Form.Label>
        <Form.Control value={answer.texts ? answer.texts[0] : ''} onChange={(e) => { handleInputAnswer(e, index - 1, 'input') }} as="textarea" rows={3} required={!question.optional} />
    </Form.Group>}

    </div>
}

const Questions = ({ disabled, questions, answers, handleSubmit, handleInputAnswer }) => {

    return <fieldset disabled={disabled}>
        <Form onSubmit={handleSubmit} className="w-100">

            {questions && questions.map((question, index) => {
                return <div key={index}>
                    {question.type === 0 ?
                        <ClosedAnswerQuestion answer={answers[index]} handleInputAnswer={handleInputAnswer} question={question} index={index + 1} /> :
                        <OpenEndedQuestion answer={answers[index]} handleInputAnswer={handleInputAnswer} question={question} index={index + 1} />}
                </div>
            })}
            {!disabled && <Button type="submit">Submit</Button>}

        </Form>
    </fieldset>
}

const PublicSurvey = (props) => {
    const { disabled = false, answerid, setMessage } = props;
    const params = useParams();
    const [survey, setSurvey] = useState({})
    const [answers, setAnswers] = useState({})
    const [show, setShow] = useState(!disabled)
    const [username, setUsername] = useState('');

    const [timer, setTimer] = useState();
    const [interval, setIntervalInstance] = useState(null)
    const [error, setError] = useState('')

    let histroy = useHistory();

    useEffect(() => {
        getSurvey()
        setMessage('')
        const getUser = async () => { return await API.getUserInfo() };
        // const user =(await API.getUserInfo());
        getUser().then(user => setUsername(user.name));

        // setTimer(survey.duration);
        // setIntervalInstance(setInterval(() => {
        //     setTimer((timer) => timer - 1)
        // }, 1000))

        // console.log(username);
        // setUsername(API.getUserInfo().username);
        // const getUser = async() => {return await API.getUserInfo()};
        // const user = getUser();
        // setUsername(user.name);
        // console.log(user);
    }, [])
    useEffect(() => {


        if (timer === survey.duration / 2) {
            setMessage({ msg: survey.hintone, type: 'info' })
        }
        if (timer === survey.duration / 4) {
            setMessage({ msg: survey.hinttwo, type: 'info' })
        }
        if (timer === 0) {
            clearInterval(interval)
            setMessage({ msg: `Times Up!`, type: 'info' })
            for (let index = 0; index < answers.length; index++) {
                if (answers[index].texts[0] && answers[index].texts[0].includes(survey.correctanswer)) {
                    API.saveAnswer({
                        username,
                        result: answers,
                        survey_id: survey.id,
                        score: survey.level
                    }).then(() => {
                        setMessage({ msg: `saved`, type: 'success' });
                        histroy.push('/')
                    })
                    API.updateSurvey(0, survey.id);
                } else {
                    API.saveAnswer({
                        username,
                        result: answers,
                        survey_id: survey.id,
                        score: 0
                    }).then(() => {
                        setMessage({ msg: `saved`, type: 'success' });
                        histroy.push('/')
                    })
                    API.updateSurvey(2, survey.id);
                }
            }
        }

    }, [timer])

    const getSurvey = () => {
        API.getSurvey(params.id)
            .then((response) => {
                let _answers = response.questions.map((question) => {
                    return {
                        title: question.title,
                        texts: []
                    }
                })
                setAnswers(_answers)

                setSurvey(response)

            })



    }

    const handleInputAnswer = (e, index, type, text) => {

        let _answers = [...answers];

        if (type === 'checkbox') {
            if (_answers[index].texts.includes(text)) {
                _answers[index].texts.splice(_answers[index].texts.indexOf(text), 1);
            } else {
                if (_answers[index].texts.length < survey.questions[index].max)
                    _answers[index].texts.push(text)
            }
        } else if (type === 'radio') {
            if (_answers[index].texts.includes(text)) {
                _answers[index].texts.splice(_answers[index].texts.indexOf(text), 1);
            } else {
                _answers[index].texts[0] = text;
            }
        } else {
            _answers[index].texts[0] = e.target.value;
        }
        setAnswers(_answers);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();


        for (let index = 0; index < answers.length; index++) {
            if (survey.questions[index].type === 1) {
                if (answers[index].texts[0] && answers[index].texts[0].length > 200) {
                    alert(`No more than 200 characters for question ${index + 1}`);
                    return;
                }
            } else {
                if (Number(survey.questions[index].min) === 1)
                    if (!answers[index].texts[0] || answers[index].texts[0].length < survey.questions[index].min) {
                        alert(`At least one option must be choosen for question ${index + 1}`);
                        return;
                    }
            }
        }
        // const user =(await API.getUserInfo());
        // //  console.log(await (API.getUserInfo()));
        // console.log((await API.getUserInfo()).name);
        // console.log('user.name', user.name);
        // console.log('username',username)
        // setUsername(() => user.name);

        for (let index = 0; index < answers.length; index++) {
            if (answers[index].texts[0] && answers[index].texts[0].includes(survey.correctanswer)) {
                API.saveAnswer({
                    username,
                    result: answers,
                    survey_id: survey.id,
                    score: survey.level,
                }).then(() => {
                    setMessage({ msg: `saved`, type: 'success' });
                    histroy.push('/')
                })
                API.updateSurvey(0, survey.id);
            } else {
                API.saveAnswer({
                    username,
                    result: answers,
                    survey_id: survey.id,
                    score: 0,
                }).then(() => {
                    setMessage({ msg: `saved`, type: 'success' });
                    histroy.push('/')
                })
                API.updateSurvey(2, survey.id);
            }
        }

    }

    const handleClose = () => {

        // if (answers.map(a => a.username).includes(username)) {
        //     setMessage({ msg: " you can not answer it twice", type: 'info' })
        //     setTimeout(() => { <Redirect to="/" /> }, 1000)
        // }
         setShow(false);
        setTimer(survey.duration);
        setIntervalInstance(setInterval(() => {
            setTimer((timer) => timer - 1)
        }, 1000))


        // if (username.length > 0)
        //     setShow(false)
        // else {
        //     setError('Missing username')
        // }
    }
    return <>
        {/* <div className="timer">Timer {props.timer}</div> */}
        <Questions {...props}
            handleSubmit={handleSubmit}
            handleInputAnswer={handleInputAnswer}
            questions={survey.questions}
            answers={answers} />
        <div className="timer">Timer {timer}</div>
        <Modal show={show} onHide={handleClose}>

            <Modal.Body>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label> are you sure to start</Form.Label>
    
                </Form.Group>
                <Button size="sm" variant="secondary" onClick={() => histroy.push('/')}>
                    Back
                </Button>
                <Button size="sm" className="ml-2" variant="primary" onClick={handleClose}>
                    Comfirm
                </Button>

                {
                    error.length > 0 ? <Alert className="mt-2" variant="danger">{error}</Alert> : ''
                }
            </Modal.Body>

        </Modal>
    </>
}

export { PublicSurvey, Questions };







