import mysql from 'mysql'
import crypto from 'crypto'
//const crypto = require('crypto');
// const mysql =  require('mysql')


// Подключение к базе данных MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'stream_users',
  });
  
  connection.connect(err => {
    if (err) {
      console.error('Ошибка подключения к базе данных:', err);
    } else {
      console.log('Подключено к базе данных MySQL');
    }
  });
  
  // Проверка IP в базе данных
  export function checkIPInDatabase(ip, callback) {
    const query = 'SELECT * FROM users WHERE lastip = ?';
    connection.query(query, [ip], (err, results) => {
      if (err) {
        console.error('Ошибка выполнения запроса:', err);
        callback(false);
      } else {
        console.log('Кого-то нашел!')
        callback(results.length > 0);
      }
    });
  }
  
  export async function register(data, clientIp){
    console.log(`Проверяю возможность регистрации для ${data.login}`)
    let firstCheck = await isLoginUnique(data.login)
    if(firstCheck == 'err'){
        return 'err'
    }
    else if(firstCheck == 'notUnique'){
        return false
    }
    else{
        console.log(`not created: ${firstCheck}`)
        console.log(firstCheck)
        let isCreated = createUser(data, clientIp)
        if(!isCreated){
            return 'notCreated'
        }
        return true
    }
  }

  async function isLoginUnique(login){
    return new Promise((resolve, reject) => {
       connection.query(`SELECT * FROM users WHERE login = '${login}'`, async (err, result) => {
          if (err) {
              console.log(err);
              reject('err')
          }
          else {
              let res = await result
              if (res.length == 0) {
                  resolve('ok')
              }
              else {
                  resolve('notUnique')
              }
          }
      }) 
    })
    
  }

  async function createUser(data, clientIp){
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO users (login, password, lastip) VALUES (?, ?, ?)`, [data.login, data.password, clientIp], (err, result) => {
            if(err){
                console.log(err)
                reject(err)
            }
            else{
                console.log(result)
                resolve(true)
            }
        })
    })
  }

  export async function checkPassword(data){

    try {
      let queryResult = await new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE login = ?', [data.username], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      console.log(queryResult)
      if (queryResult.length === 0) {
        // Пользователь с заданным username не найден
        console.log('0')
        return false;
      }

      let storedPasswordHash = queryResult[0].password
      console.log(storedPasswordHash)
      let hashedPassword = crypto.createHash('sha256').update(data.password).digest('hex')
      

      // Сравниваем хэшированный пароль из базы данных с хэшированным введенным паролем
      let passwordMatches = hashedPassword === storedPasswordHash
      console.log(passwordMatches)
      return passwordMatches;

    } catch (error) {
      
    }




    //return new Promise((resolve, reject) => {
    //  connection.query(`SELECT * FROM users WHERE login = ? `, [data.username], (err, result) => {
    //      if(err){
    //          console.log(err)
    //          reject(err)
    //      }
    //      else{
    //          console.log(result)
    //          resolve(true)
    //      }
    //  })
    //})
  }