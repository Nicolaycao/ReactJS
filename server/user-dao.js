'use strict';
const db = require('./db');
const bcrypt = require('bcrypt');


// DAO operations for validating users

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err)
                reject(err); // DB error
            else if (row === undefined)
                resolve(false); 
            else {
                bcrypt.compare(password, row.password).then(result => {
                    if (result) 
                        resolve({id: row.id, username: row.email, name:row.name});
                    else
                        resolve(false); 
                })
            }
        });
    });
};

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM user WHERE id = ?';
        db.get(sql, [id], (err, row) => {
          if (err) 
            reject(err);
          else if (row === undefined)
            resolve({error: 'User not found.'});
          else {
           
            const user = {id: row.id, username: row.email, name: row.name}
            resolve(user);
          }
      });
    });
  };
  