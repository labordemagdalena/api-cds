## api-cds
Breve descripción 

##requisitos
node.js -> use la version 18
npm install 

## para correr 
- en dev: nodemon src/app.js
- npm start

#.env:
completar .env.example con .env (van las claves que utilice en el correo) 

##algunos ejemplos para postman: 

#register
POST: http://localhost:3004/api/register 
BODY:   {
    "email": "",
    "firstName" : "",
    "lastName": "",
    "password": ""
  }

#login
POST: http://localhost:3004/api/login
BODY:  {
    "email": "",
    "password": ""
  }
  

  #get movies
  GET: http://localhost:3004/api/getmovies
    AUTHORIZATION
  
  #fav movies:
  POST : http://localhost:3004/api/favmovies
  BODY: {
          "id": ,
        "release_date": "",
        "title": "",
        "suggestionScore": 
  }
  AUTHORIZATION
  
  #getfavmovies:
  GET: http://localhost:3004/api/getfavmovies
  AUTHORIZATION
