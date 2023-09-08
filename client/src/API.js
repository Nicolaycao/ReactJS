/**
 * All the API calls
 */

 const BASEURL = '/api';


 async function getAllSurveys() {
    const response = await fetch(BASEURL + '/surveys');
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw data;  // an object with the error coming from the server
    }
  }

  
  async function getSurvey(id) {
    const response = await fetch(BASEURL + `/surveys/${id}`);
    const survey = await response.json();
    if (response.ok) {
      return survey;
    } else {
      throw survey;  // an object with the error coming from the server
    }
  }

  async function saveAnswer(answer) {
    const response = await fetch(BASEURL + '/answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answer),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw data;
    }
  }
  async function updateSurvey(openstate,survey_id) {
    const response = await fetch(BASEURL + '/admin/surveys', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({openstate,survey_id}),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw data;
    }
  }
  
  async function saveSurvey(survey) {
    const response = await fetch(BASEURL + '/admin/surveys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(survey),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw data;
    }
  }

  async function getAnswers(id) {
    const response = await fetch(BASEURL + `/answers/${id}`);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw data;
    }
  }
  

  async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user.name;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch (err) {
        throw err;
      }
    }
  }
  async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
  }
  
  async function getUserInfo() {
    const response = await fetch(BASEURL + '/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }

  async function getMySurveys() {
    // call: GET /api/courses
    const response = await fetch(BASEURL + '/admin/surveys/me');
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw data;  // an object with the error coming from the server
    }
  }
  async function getTop3() {
    const response = await fetch(BASEURL + '/admin/top3');
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw data;  // an object with the error coming from the server
    }
  }
const API = { getAllSurveys,getSurvey,saveAnswer,logIn,logOut,getUserInfo,getMySurveys,saveSurvey,updateSurvey,getAnswers,getTop3};
export default API;