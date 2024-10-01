import { Router } from 'express';
import fs from 'fs' //para los archivos
import path from 'path';
import { checkUserExist, encryptPassword, verifyPassword } from '../utils/checkUserExist.js'
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

const router = Router ();
dotenv.config();

//almaceno la direc del file users.txt
const usersFile = path.join(process.cwd(), 'src', 'data', 'users.txt');

const JWT_SECRET = process.env.JWT_SECRET;

//register (POST)
router.post ('/register', (req,res)=> {
    try {
        const {email, firstName, lastName, password} = req.body;

        if (!email || !firstName || !lastName || !password){
            console.log("missing mandatory fields:", email, firstName, lastName);
            return res.status(400).json({error : "Missing mandatory fields"});
        }
    
    
        checkUserExist(email, 'register', (err, allusers) =>{
            if (err){
                return res.status(err.statusCode).json({error: err.error});
            }
    
            //encriptando
            const encryptedPassword = encryptPassword(password);
            
            //save new user
            const newUser = { email, firstName, lastName, password: encryptedPassword };
            //console.log("nuevo usuario!!!!!!!", newUser);
            allusers.push(newUser);
           
            fs.writeFile(usersFile, JSON.stringify(allusers, null, 2), (err) =>{
                if (err){
                    return res.status(500).json ({error: "Error saving user"})
                }
                res.status(201).json({message: "User register with success"})
            });
    
        });
    

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
   
});


//authentication (POST)
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing mandatory fields' });
    }

    checkUserExist(email, 'login', (err, allUsers, user) => {
        if (err){
            return res.status(err.statusCode).json ({error:err.error});
        }

        const isPasswordValid = verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

         const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

         res.status(200).json({ message: 'Login successful', token });
    });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    
});

export default router;