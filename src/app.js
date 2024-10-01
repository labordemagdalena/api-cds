import express from 'express';
import dotenv from "dotenv"
import bodyParser from 'body-parser';
import userRoutes from './controllers/user.js';
import moviesRoutes from './controllers/movies.js';

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use('/api/', userRoutes);
app.use('/api/', moviesRoutes);



//basic route
app.get('/', (req,res) => {
    res.send("Hi");
})

//server on
app.listen(process.env.PORT, ()=> {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`)
})