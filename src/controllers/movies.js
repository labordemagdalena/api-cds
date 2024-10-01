import { Router } from 'express';
import axios from 'axios';
import fs from 'fs' ;
import path from 'path';
import dotenv from "dotenv"
import { authenticateToken } from '../utils/authentication.js'


const router = Router ();
dotenv.config();

const MOVIE_DB_API_URL = 'https://api.themoviedb.org/3/search/movie';
const API_KEY = process.env.API_KEY; 
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const favoritesFile = path.join(process.cwd(), 'src', 'data', 'favoritos.txt');

//GET (obtener películas)
router.get('/getmovies', authenticateToken, async (req, res) => {
    try {
        const { keyword } = req.query; 
        const queryParams = {
            api_key: API_KEY,
            query: keyword || '', 
            page: 1 
        };

        const response = await axios.get(MOVIE_DB_API_URL, { params: queryParams });
        const movies = response.data.results;

        const moviesWithScore = movies.map(movie => ({
            ...movie,
            suggestionScore: Math.floor(Math.random() * 100) 
        }));

        const sortedMovies = moviesWithScore.sort((a, b) => b.suggestionScore - a.suggestionScore);

        res.json(sortedMovies);

    } catch (error) {
        console.error('Error fetching movies from TheMovieDB:', error);
        res.status(500).json({ error: 'Error fetching movies' });
    }
});

//POST ()
router.post('/favmovies', authenticateToken, (req,res)=> {
    try {
        const { id, title, release_date, suggestionScore } = req.body;

        if (!id || !title || !release_date || !suggestionScore){
            return res.status(400).json ({error: "Missing mandatory field"});
        }

        const favoriteMovie = {
            id,
            title,
            release_date,
            suggestionScore,
            addedAt: new Date().toISOString()
        };

        fs.readFile(favoritesFile, 'utf-8', (err,data) => {
            if (err){
                return callback({ error: "Cannot read file", statusCode: 500 });
            }

            const favorites = data ? JSON.parse(data) : [];
            const movieExists = favorites.find(movie => movie.id === id);

            if (movieExists){
                return res.status(400).json ({error: 'Movie is alreday in favorites'});
            }

            favorites.push(favoriteMovie);

            fs.writeFile(favoritesFile, JSON.stringify(favorites, null, 2), (err) =>{
                if (err){
                    return res.status(500).json ({error: "Error saving movie"})
                }
                res.status(201).json({message: "Movie dadded with success", movie: favoriteMovie});
            });
        })
        

    } catch (error){
        console.error('Error adding movie to favorites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//GET
router.get('/getfavmovies', authenticateToken, (req,res) => {
    try {
        fs.readFile(favoritesFile, 'utf8', (err,data) => {
            if (err){
                return callback({ error: "Cannot read file", statusCode: 500 });
            }
            const favorites = data ? JSON.parse(data) : [];
            const favoritesWithScore = favorites.map(movie => ({
                ...movie,
                suggestionForTodayScore: Math.floor(Math.random() * 100) 
            }));
            const sortedFavorites = favoritesWithScore.sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore);
            res.json(sortedFavorites);
        });
    } catch (error){
        console.error('Error fetching favorite movies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

//router.get('/getmovies', (req,res) =>{
//    res.send("movies");
//});

export default router;