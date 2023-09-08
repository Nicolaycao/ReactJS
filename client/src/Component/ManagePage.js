import { Col, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../API';

function Header() {
  return <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Level</th>
      <th>State</th>    
    </tr>
  </thead>
}

function Manage() {


  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    getMySurveys()

  }, [])

  // const getMySurveys = () => {
  //   API.getMySurveys().then(response => {
  //     setSurveys(response)
  //   })
  // }

  const getMySurveys = () => {
    API.getAllSurveys().then(response => {
        setSurveys(response)
    })
}
  return <Col>
    {/* <Link to="/admin/survey">Create a new survey</Link> */}
    <Table >
      <Header></Header>
      <tbody>
        {surveys.map((survey) => (
          <tr key={survey.id}>
            <td><Link to={`/admin/answers/${survey.id}`}>{survey.id}</Link></td>
            <td>{survey.name}</td>
            <td>{survey.level}</td>
            { survey.openstate===1 ?
                          <td>open</td>
              :  
              <td>close </td>
            }
            
          </tr>
        ))
        }
      </tbody>
    </Table>
  </Col>;
}

export { Manage };
