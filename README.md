## api-cds
Breve descripción 

##requisitos
node.js -> use la version 18
npm install 

## para correr 
en dev: nodemon src/app.js
o npm start

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
    "email": "laborde1122@gmail.com",
    "password": "*12345*"
  }
  AUTHORIZATION

  #get movies
  GET: http://localhost:3004/api/getmovies

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
