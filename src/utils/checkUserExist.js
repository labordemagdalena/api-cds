import fs from 'fs' 
import path from 'path'
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const usersFile = path.join(process.cwd(), 'src', 'data', 'users.txt');


export const checkUserExist = (email, mode, callback) => {
    //read file 
    fs.readFile(usersFile, 'utf8', (err,data)=> {
        if (err){
            return callback({ error: "Cannot read file", statusCode: 500 });
        }
    
        const allusers = JSON.parse(data || '[]');
        const userExists = allusers.find(user => user.email === email) ;

        //if mode is register --> cannot submit an email that already exists 
        if (mode == 'register') {
            if (userExists){
                return callback({ error: "Email already exists", statusCode: 400 });
                
            }
            //if mode is login --> cannot authenticate a user that doesnt exists
        } else if (mode == 'login'){
            if (!userExists) {
                return callback({error: "User not found", statusCode:400})
            }
        }

        return callback(null, allusers, userExists);
    
    });
    
}


export const encryptPassword = (password) =>{
    const salt = crypto.randomBytes(16).toString('hex'); 
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');  
    return `${salt}:${hash}`; 
}

export const verifyPassword = (password, encryptedPassword) => {
    const [salt, hash] = encryptedPassword.split(':'); 
    if (!salt || !hash) {
        console.error("Formato de contraseña encriptada incorrecto:", encryptedPassword);
        return false;
    }

    const hashToVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    //console.log("Hash original:", hash);
    //console.log("Hash generado:", hashToVerify);

    return hash === hashToVerify;
};
