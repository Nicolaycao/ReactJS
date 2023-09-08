import { DropdownButton, Dropdown, Form,Button,InputGroup,ButtonGroup,Col } from 'react-bootstrap';
import {  useState } from 'react';
import API from '../API';
import { useHistory } from 'react-router';

function CreateSurvey({setMessage}) {

    const [questions, setQuestions] = useState([]);
    const [name, setName] = useState('');
    const [level, setLevel] = useState(1);
    const [duration, setDuration] = useState(30);
    const [timer, setTimer] = useState(30);
    const [correctanswer, setCorrectanswer] = useState('');
    const [hintone, setHintone] = useState('');
    const [hinttwo, setHinttwo] = useState('');
    const history = useHistory();
    const addQuesion = (e, type) => {
        e.preventDefault();
        let _questions = [...questions];

        if (type === 0) {
            _questions.push({
                type,
                title: '',
                // mutilple: false,
                optional: false,
                options: [''],
                min: 0,
                max: 1,
            })
        } else if (type === 1) {
            _questions.push({
                type,
                title: '',
                optional: false,
            })
        }

        setQuestions(_questions);
    }

    const handleInputChange = (e, index, optionIndex) => {
        // e.preventDefault();
        let { name, value } = e.target
        let _questions = [...questions];
        // console.log(name)
        if (name === 'optional' || name==='mutilple')
            _questions[index][name] =  !_questions[index][name];
        else if (name === 'option')
            _questions[index]['options'][optionIndex] = value;
        else
            _questions[index][name] = value;

        // console.log(_questions)

        setQuestions(_questions);
    } 

    const handleAddAnswer = (e, index)=>{
        e.preventDefault();
        let _questions = [...questions];
        if(_questions[index].options.length >10){
            setMessage({ msg: `At most 10 option`, type: 'warning' });
        }else{
            _questions[index].options.push('');
        }
        setQuestions(_questions);
    }

    const handleRemoveAnswer = (e, index, optionIndex)=>{
        e.preventDefault();
        let _questions = [...questions];
        if(_questions[index].options.length >=2)
            _questions[index].options.splice(optionIndex, 1);
        else{
            setMessage({ msg: `At least one option`, type: 'warning' });
        }
        
        setQuestions(_questions);
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        let openstate=1;
        setTimer(duration);
        API.saveSurvey({name,questions,level,duration,timer,correctanswer,hintone,hinttwo,openstate,})
        .then(response=>{
            history.push('/admin');
            console.log(response);
        })
    }

    const handleMove = (e, index, action)=>{
        let _questions = [...questions];
        let f = _questions.splice(index, 1)[0];
      
        let to = action === 'up'? index===0?0:index-1:index === _questions.length?index:index+1;
      
        _questions.splice(to, 0, f);
        setQuestions(_questions);
    }

    const handleDelete = (e, index) =>{
        let _questions = [...questions];
         _questions.splice(index, 1);
         setQuestions(_questions);
    }   

    return <>

        <Form className="w-100" onSubmit={handleSubmit}>
            <DropdownButton id="dropdown-basic-button" title="Add Question">
                {/* <Dropdown.Item href="#" onClick={(e) => addQuesion(e, 0,)}>Closed-answer question</Dropdown.Item> */}
                <Dropdown.Item href="#" onClick={(e) => addQuesion(e, 1)}>Open-ended question</Dropdown.Item>
            </DropdownButton>
            <Form.Group className="mb-3" >
                 <Form.Label>Name</Form.Label>
                 <Form.Control size="sm" type="text" value={name} onChange={(e) => { setName(e.target.value) }} required/>
             </Form.Group>
            {
                questions.map((question, index) => {
                    return question.type === 1 ? <>
                        <div key={index} className="border p-3 mb-2 mt-2 position-relative">
                        <ButtonGroup className="position-absolute" style={{right:'10px'}}>
                            <Button variant="secondary" onClick={(e)=>{handleMove(e, index, 'up')}} >up</Button>
                            <Button variant="secondary" onClick={(e)=>{handleMove(e, index, 'down')}}>down</Button>
                            <Button variant="danger" onClick={(e)=>handleDelete(e,index)}>Delete</Button>
                        </ButtonGroup>
                            
                            <Form.Group className="mb-3" >
                                <Form.Text className="text-muted">
                                    Open-ended question
                                </Form.Text>
                                <Form.Label>Question Title
                                    
                                </Form.Label>
                                <Form.Control size="sm" type="text" name="title" value={question.title} onChange={(e) => { handleInputChange(e, index) }} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Check type="checkbox" name="optional" checked={question.optional} onChange={(e) => { handleInputChange(e, index) }} label="Optional" />
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom04">
                                <Form.Label>Level</Form.Label>
                                <Form.Control type="number" placeholder="Duration" value={level} min={1} max={3} required onChange={(event) => { setLevel(event.target.value) }} />
                                <Form.Control.Feedback type="invalid">
                                    Must choose a  Level
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom04">
                                <Form.Label>Duration</Form.Label>
                                <Form.Control type="number" placeholder="Duration" value={duration} min={30} max={600} required onChange={(event) => { setDuration(event.target.value) }} />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid duration
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Label>Correct Answer</Form.Label>
                                <Form.Control size="sm" type="text" value={correctanswer} onChange={(e) => { setCorrectanswer(e.target.value) }} required />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a correctanswer
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Label>Hint One</Form.Label>
                                <Form.Control size="sm" type="text" value={hintone} onChange={(e) => { setHintone(e.target.value) }} required />
                                <Form.Control.Feedback type="invalid">
                                    Please provide first hint
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Label>Hint Two</Form.Label>
                                <Form.Control size="sm" type="text" value={hinttwo} onChange={(e) => { setHinttwo(e.target.value) }} required />
                                <Form.Control.Feedback type="invalid">
                                    Please provide second hint
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    </> : <>
                        <div key={index} className="border p-3 mb-2 mt-2 position-relative">
                        <ButtonGroup className="position-absolute" style={{right:'10px'}}>
                            <Button variant="secondary" onClick={(e)=>{handleMove(e, index, 'up')}} >up</Button>
                            <Button variant="secondary" onClick={(e)=>{handleMove(e, index, 'down')}}>down</Button>
                            <Button variant="danger" onClick={(e)=>handleDelete(e,index)}>Delete</Button>
                        </ButtonGroup>
                            <Form.Group size="sm" className="mb-3" >
                                <Form.Text className="text-muted">
                                    Closed-answer question
                                </Form.Text>
                                <Form.Label>Question Title <span></span></Form.Label>
                                <Form.Control type="text" size="sm" name="title" value={question.title} onChange={(e) => { handleInputChange(e, index) }} required/>
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col} sm={2}>
                                <Form.Label>Max accepted</Form.Label>
                                <Form.Control as="select" size="sm" name="max" value={question.max} onChange={(e) => { handleInputChange(e, index) }} >
                                   {
                                    question.options.map((a,index)=>{
                                        return <option>{index + 1}</option>
                                    })
                                   }
                                </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col} sm={2}>
                                <Form.Label>Min accepted</Form.Label>
                                <Form.Control as="select" size="sm" name="min" value={question.min} onChange={(e) => { handleInputChange(e, index) }} >
                                    <option>0</option>
                                    <option>1</option>
                                </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Form.Group className="mb-3" >
                          
                                {/* <Form.Check type="checkbox" name="optional" checked={question.optional} onChange={(e) => { handleInputChange(e, index) }} label="Optional" /> */}
                                <Button onClick={(e)=>{handleAddAnswer(e, index)}} size="sm">Add possible answer</Button>
                            </Form.Group>
                            <h6>Possible answers</h6>
                            {
                                question.options.map((option, optionIndex) => {
                                    return <InputGroup size="sm" key={`option-${index}-${optionIndex}`} className="mb-3" > 
                                       
                                        <Form.Control type="text" name="option" value={option} onChange={(e) => { handleInputChange(e, index, optionIndex) }} required/>
                                     
                                        <InputGroup.Append>
                                             <InputGroup.Text onClick={(e)=>{handleRemoveAnswer(e, index, optionIndex)}}>Remove</InputGroup.Text>
                                        </InputGroup.Append>
                                       
                                    </InputGroup>
                                })
                            }
                        </div>
                    </>
                })
            }
             <Button type="submit">Publish</Button>
        </Form>
    </>
}



export { CreateSurvey };