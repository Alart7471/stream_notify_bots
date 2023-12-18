//const express = require('express')
import express from 'express'
import path from 'path'
//const path = require('path')
//const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken'

import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { register, checkIPInDatabase, checkPassword } from './modules/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = 8004;
const app = express();
app.use(express.json())

app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'client')))

app.get('/', (req, res) =>{
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.post('/api/register', async (req, res) => {
  console.log(req.body)

  console.log(req.ip)

  let result = await register(req.body, req.ip)
  console.log(result)
  res.json(result)
})

app.post('/api/login', async (req, res) => {

    
    let result = await checkPassword(req.body)

    let username = req.body.username
    const secretKey = 'aboba'; // Замените этот ключ на что-то более безопасное
    const token = jwt.sign({ username }, secretKey, { expiresIn: '24h' });

    res.json({ token });
});

// Middleware для авторизации по IP
app.use((req, res, next) => {
  const clientIp = req.ip; // Получаем IP клиента
  console.log(`Middleware: ${clientIp}`)
  checkIPInDatabase(clientIp, isAuthorized => {
    if (isAuthorized) {
      next(); // Продолжаем обработку запроса
    } else {
      res.status(403).send('Доступ запрещен');
    }
  });
});

app.listen(PORT, (err) => {
    if(err){
      return console.log(err);
    }
    console.log(`Server OK :${PORT}`)
})
