'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const session = require('express-session'); // session middleware

const passport = require('passport');
const passportLocal = require('passport-local');

const surveyDao = require('./survey_dao'); // module for accessing the surveys in the DB
const userDao = require('./user-dao');

// initialize and configure passport
passport.use(new passportLocal.Strategy((username, password, done) => {
  // verification callback for authentication
  userDao.getUser(username, password).then(user => {
    if (user)
      done(null, user);
    else
      done(null, false, { message: 'Username or password wrong' });
  }).catch(err => {
    done(err);
  });
}));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});


// init express
const app = express();
const port = 3009;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'not authenticated' });
}


// initialize and configure HTTP sessions
app.use(session({
  secret: 'this and that and other',
  resave: false,
  saveUninitialized: false
}));

// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

/*** surveys APIs ***/


// GET /api/surveys
app.get('/api/surveys', (req, res) => {
  surveyDao.listSurveys()
    .then((surveys) => res.json(surveys))
    .catch(() => res.status(500).end());
});


app.get('/api/surveys/:id', (req, res) => {
  surveyDao.getSurvey(req.params.id)
    .then(survey => res.json(survey))
    .catch(() => res.status(500).end());
});

app.post('/api/answers', async (req, res) => {
  // console.log(req.body)
  try {
    await surveyDao.saveAnswers(req.body)
      .then(() => res.json({}))
      .catch(() => res.status(500).end());
  } catch (err) {
    // console.log(err)
    res.status(500).end();
  }
});
app.get('/api/admin/surveys/me', isLoggedIn, async (req, res) => {
  try {
    const surveys = await surveyDao.listMySurveys(req.user.id);
    res.json(surveys);
  } catch (err) {
    res.status(500).end();
  }
});

app.post('/api/admin/surveys', async (req, res) => {

  if (req.isAuthenticated())
    try {
      await surveyDao.saveSurvey(req.body, req.user.id)
        .then(() => res.json({}))
        .catch(() => res.status(500).end());
    } catch (err) {

      res.status(500).end();
    }

});
app.put('/api/admin/surveys', async (req, res) => {
  console.log(req.body.openstate, req.body.survey_id)
  if (req.isAuthenticated())
    try {
      await surveyDao.updateSurvey(req.body.openstate, req.body.survey_id)
        .then(() => res.json({}))
        .catch(() => res.status(500).end());
    } catch (err) {

      res.status(500).end();
    }

});

app.get('/api/answers/:id', async (req, res) => {
  try {
    await surveyDao.getAnswers(req.params.id)
      .then((answers) => res.json(answers))
      .catch(() => res.status(500).end());
  } catch (err) {
    
    res.status(500).end();
  }
});


/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});


// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});

/*** Other express-related instructions ***/
app.get('/api/admin/top3', async (req, res) => {
  try {
    const data = await surveyDao.getTopThree()
    res.json({ data });
  } catch (err) {
    res.status(500).end();
  }
})
// Activate the server
app.listen(port, () => {
  console.log(`react-score-server-mini listening at http://localhost:${port}`);
});



