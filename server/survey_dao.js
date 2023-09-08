const { OPEN_SHAREDCACHE } = require('sqlite3');
const db = require('./db.js')

exports.listSurveys = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM surveys';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const surveys = rows.map((e) => ({ id: e.id, name: e.name, questions: JSON.parse(e.questions),level: e.level,duration: e.duration,timer:e.timer,correctanswer: e.correctanswer, hintone:e.hintone, hinttwo:e.hinttwo, openstate:e.openstate,created_at: e.created_at }));
      resolve(surveys);
    });
  });
};


exports.getSurvey = id => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM surveys WHERE id=?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        row.questions = JSON.parse(row.questions)
        //const surveys = rows.map((e) => ({ name: e.name, questions: JSON.parse(e.questions) }));
        resolve(row);
      });
    });
  }
  
  exports.saveSurvey = (survey, userId) => {
    
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO surveys (user_id,name,questions,level,duration,timer,correctanswer,hintone,hinttwo,openstate,created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,strftime('%Y-%m-%d %H:%M', 'now'))`;
      db.run(sql, [userId, survey.name, JSON.stringify(survey.questions),survey.level,survey.duration,survey.timer,survey.correctanswer,survey.hintone,survey.hinttwo,survey.openstate], (err, response) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        resolve(response);
      });
    })
  }

  exports.updateSurvey=(openstate, survey_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE surveys SET openstate=? WHERE id=?';
        db.run(sql, [openstate, survey_id], function (err) {
      
          if (err) {
            console.log(err)
            reject(err);
            return;
          }
          resolve(this.changes!==0);
        });
    });
}

  exports.saveAnswers = (answers) => {
    return new Promise((resolve, reject) => {
      console.log(answers)
      const sql = `INSERT INTO answers (survey_id,result,username,score,created_at) VALUES (?, ?, ?, ?, strftime('%Y-%m-%d %H:%M', 'now'))`;
      db.run(sql, [answers.survey_id, JSON.stringify(answers.result), answers.username,answers.score], (err, response) => {
        console.log(err)
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      });
    })
  }




  exports.listMySurveys = (userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'select S.*, count(A.id) as num_of_users from surveys S LEFT JOIN answers A ON S.id=A.survey_id WHERE user_id=? GROUP BY S.id';
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const surveys = rows.map((e) => ({ id: e.id, name: e.name, num_of_users: e.num_of_users, questions: JSON.parse(e.questions), created_at: e.created_at }));
        resolve(surveys);
      });
    });
  };
  
  exports.getAnswers = (survey_id) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM answers WHERE survey_id=?`;
      db.all(sql, [survey_id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const answers = rows.map((e) => ({ id: e.id, survey_id: e.survey_id, username: e.username, result: JSON.parse(e.result), created_at: e.created_at }));
        resolve(answers);
      });
    })
  }

  exports.getTopThree = () => {
    return new Promise((resolve, reject) => {
        const sql = 'select U.name, sum(A.score) as score  from answers A, user U where A.username = U.name  group by username order By score desc limit 3';

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const leaderboard = rows.map((e) => (
                {
                    name: e.name,
                    score: e.score,
                }));

            resolve(leaderboard);
        });
    });
};