import { Col, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from './API';
import { useParams } from "react-router";
import { Questions } from './Component/SurveyComponent';

function Header() {
    return <thead>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Level</th>
            <th>LeftTime</th>
            {/* <th>Username</th> */}
        </tr>
    </thead>
}

function Home(props) {
    const { setMessage } = props;
    const params = useParams();
    const [surveys, setSurveys] = useState([]);
    // const [timer, setTimer] = useState(6);
    const [survey, setSurvey] = useState({});
    const [answers, setAnswers] = useState([])
    const [interval, setIntervalInstance] = useState(null);

    useEffect(() => {
        getSurveys();
        getAnswers();
        setMessage('');
    }, [])


    // const handleAnswerSame = ()=>{
    //     if (answers.survey_id===survey.id) {
    //         setMessage({ msg: "you can not answer it twice" ,type: 'info' }) 
    //     }

    // }
    useEffect(() => {
        getSurveys();
        if (survey.openstate === 2) {
            setIntervalInstance(setInterval(() => {
                survey.timer= survey.timer-1;
            }, 1000)) 
        if (survey.timer === survey.duration / 2) {
            setMessage({ msg: survey.hintone, type: 'info' })
        }
        if (survey.timer === survey.duration / 4) {
            setMessage({ msg: survey.hinttwo, type: 'info' })
        }
        if (survey.timer === 0) {
            clearInterval(interval)
            setMessage({ msg: `Times Up!`, type: 'info' })
            API.updateSurvey(2,survey.id);
            //setOpenstate(0);   change the openstate to 0;

        }
    }
    }, [survey.timer])
    const getSurveys = () => {
        API.getAllSurveys().then(response => {
            setSurveys(response)
        })

    }
    const getAnswers = () => {
        API.getAnswers(params.id).then((response) => {
            setAnswers(response)
        })
    }

    // const getSurvey = () => {
    //     API.getSurvey(params.id)
    //         .then((response) => {
    //             let _answers = response.questions.map((question) => {
    //                 return {
    //                     title: question.title,
    //                     texts: []
    //                 }
    //             })
    //             setAnswers(_answers)

    //             setSurvey(response)
    //         })
    // }



    return <Col>
        <h1>Opened Riddles</h1>
        <Link to="/admin/survey">Create a new survey</Link>
        <Table >
            <Header></Header>
            <tbody>
                {surveys.filter((survey) => survey.openstate === 1 | 2)
                    .map((survey) => (
                        <tr key={survey.id}>
                            <td>{survey.id}</td>
                            <td><Link to={`/survey/${survey.id}`}>{survey.name}</Link></td>
                            <td>{survey.level}</td>
                            {/* <td className="timer" >{timer}</td> */}
                            <td className="timer" >{survey.timer}</td>
                        </tr>
                    )
                    )}
            </tbody>
        </Table>
    </Col>;
}

export { Home };