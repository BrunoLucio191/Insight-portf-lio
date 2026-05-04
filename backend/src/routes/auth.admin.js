import express from "express";
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/protect.js'
const router = express.Router();

//configurando os cookies, cada propriedade dessa significa uma coisa
//recomendo ver a documentação para mais informações
const cookiesOptions = {
  httpOnly: true,
  secure: process.env.NODE_DEV ==='production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000,
};

//função que recebe id(numero aleatorio) e gere um token unico, assina o token
//a JWT_SECRET do arquivo .env
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
}
  
//Rota usada para pega a senha e salva nos cookies
router.post("/admin", (req, res) => {
  const password = Object.keys(req.body)[0];
  
  //console.log(password);

  if (password !== process.env.ADMIN_PASS) {
    return res.status(400).json({ error: "Invalid Credentials" });
  }
  
  const randomNumber = () => Math.floor(Math.random() * 101);

  const token = generateToken(randomNumber());

  res.cookie('token', token, cookiesOptions);
  
  res.json({ message: "logged out successfuly"});
}); 

//rota usada pelo botao de logout
router.post('/logout', (req, res) => {
  res.cookie('token', '', {...cookiesOptions, maxAge: 1});
  res.json({ message: "logged out successfuly"});
})

//rota usada para setar o useState users
//A rota é protegida por um middleware, protection apenas libera a resposta se o 
//user ja tive um token
router.get('/me', protect, (req, res) => {  
  res.json({ message:'authenticated' }) 
})

export default router;
