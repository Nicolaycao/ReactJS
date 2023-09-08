import { Container, Row, Alert } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './API';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Home } from './HomeComponent';
import { NavBar } from './Component/Navbar'
import { PublicSurvey } from './Component/SurveyComponent';
import { LoginForm } from './Component/LoginComponents';
import { Manage } from './Component/ManagePage.js';
import { CreateSurvey } from './Component/CreateSurvey.js';
import { Answers } from './Component/AnswersComponent';
import { LeaderBoardComponent } from './Component/LeaderBoardComponent.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
function App() {
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await API.getUserInfo();
      setLoggedIn(true);
    } catch (err) {
      console.error(err.error);
    }
  };

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user}!`, type: 'success' });
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
  }

  return (
    <Router>
      <NavBar loggedIn={loggedIn} logout={doLogOut}></NavBar>
      <Container className="App">

        {message && <Row>
          <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </Row>}

        <Switch>
          <Route path="/admin/answers/:id" render={() =>
            <>
              {loggedIn ?
                //<Row>
                <Answers />
                //</Row>
                : <Redirect to="/login" />}
            </>
          } />

          <Route path="/admin/survey" render={() =>
            <>
              {loggedIn ?
                // <Row>
                <CreateSurvey setMessage={setMessage} />
                // </Row>
                : <Redirect to="/login" />}
            </>
          } />


          <Route path="/admin" render={() =>
            <>
              {loggedIn ?
                // <Row>
                <Home  setMessage={setMessage}/>
                // </Row>
                : <Redirect to="/login" />}
            </>
          } />


          <Route path="/login" render={() =>
            <>{loggedIn ? <Redirect to="/admin" /> : <LoginForm login={doLogIn} />}</>
          } />

          <Route path="/survey/:id" render={() =>
            <Row>
              <PublicSurvey setMessage={setMessage} />
            </Row>
          } />
          <Route path="/top3" render={() =>
            <Row>
              <LeaderBoardComponent />
            </Row>
          } />
          <Route path="/" render={() =>
            <Row>
              <Manage />
            </Row>
          } />




        </Switch>
      </Container>
    </Router>);
}

export default App;
