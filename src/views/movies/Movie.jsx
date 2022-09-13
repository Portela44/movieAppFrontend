import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { faHeartCrack } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
const colage = require("colage");

export default function Movie() {
    const {  user } = useContext(AuthContext);
    const [movie, setMovie] = useState("");
    const [reviews, setReviews] = useState("");
    const {movieId} = useParams();
    const storedToken = localStorage.getItem('authToken');
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [inWatchlist, setInWatchlist] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const getMovie = async () => {
            try {
                const movieFromDB = await axios.get(`${process.env.REACT_APP_API_URL}/movies/${movieId}`, { headers: { Authorization: `Bearer ${storedToken}` } });
                setMovie(movieFromDB.data.data);
            } catch (error) {
                console.log(error);
            }
        }
        getMovie();
    },[storedToken, movieId]);
    useEffect(() => {
        const getReviews = async () => {
            try {
                const reviewsFromDB = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/${movieId}/recent`, { headers: { Authorization: `Bearer ${storedToken}` } });
                setReviews(reviewsFromDB.data.data)
            } catch (error) {
                console.log(error);
            }
        }
        getReviews();
    },[storedToken, movieId]);
    useEffect(() => {
        const isInWatchlist = async () => {
            try {
                const myWatchlist = await axios.get(`${process.env.REACT_APP_API_URL}/watchlist`, { headers: { Authorization: `Bearer ${storedToken}` } });
                setInWatchlist(myWatchlist.data.data.some(vote => vote.movieId._id === movieId && vote.userId === user._id));
            } catch (error) {
                setErrorMessage(error.response.data.error);
            }
        };
        isInWatchlist();
    });
    const handleNextMovie = async () => {
        try {
            const nextMovie = await axios.get(`${process.env.REACT_APP_API_URL}/movies/next`, { headers: { Authorization: `Bearer ${storedToken}` } });
            navigate(`/movies/${nextMovie.data.data._id}`)
        } catch (error) {
            setErrorMessage(error.response.data.error);
        }
    };
    const handleLike = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/votes/${movieId}/like`, {}, { headers: { Authorization: `Bearer ${storedToken}` } });
            handleNextMovie();
        } catch (error) {
            setErrorMessage(error.response.data.error);
        }
    };
    const handleDislike = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/votes/${movieId}/dislike`, {}, { headers: { Authorization: `Bearer ${storedToken}` } });
            handleNextMovie();
        } catch (error) {
            setErrorMessage(error.response.data.error);
        }
    };
    const handleIgnore = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/votes/${movieId}/ignore`, {}, { headers: { Authorization: `Bearer ${storedToken}` } });
            handleNextMovie();
        } catch (error) {
            setErrorMessage(error.response.data.error);
        }
    };
    const handleWatchlist = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/watchlist/${movieId}/add`, {}, { headers: { Authorization: `Bearer ${storedToken}` } });
            handleNextMovie();
        } catch (error) {
            setErrorMessage(error.response.data.error);
        }
    };
    const handleDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/movies/${movieId}/delete`, { headers: { Authorization: `Bearer ${storedToken}` } });
            toast.error(`${movie.name} was deleted!`);
            navigate("/");
        } catch (error) {
            setErrorMessage(error.response.data.error);
        }
    };
    return (
        <div>
            {movie && <div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <div>
                    <img src={movie.translations[0].poster.og} alt="poster" />
                </div>
                <div id="voteButtons">
                    <button onClick={() => handleLike()} className="voteButtons"><FontAwesomeIcon icon={faHeart} className='heart-icon'/></button>
                    <button onClick={() => handleDislike()} className="voteButtons"><FontAwesomeIcon icon={faHeartCrack} className='crack-heart-icon'/></button>
                    <button onClick={() => handleIgnore()} className="voteButtons"><FontAwesomeIcon icon={faEyeSlash} className='eye-slash-icon'/></button>
                    {!inWatchlist && <button onClick={() => handleWatchlist()} className="voteButtons"><FontAwesomeIcon icon={faEyeSlash} className='eye-slash-icon'/>Watch later</button>}
                    {inWatchlist && <button onClick={() => handleNextMovie()} className="voteButtons"><FontAwesomeIcon icon={faEyeSlash} className='eye-slash-icon'/>Keep in Watchlist</button>}
                </div>
                <img src={movie.image.og} alt="movie-frame" />
                <h1>{movie.name}</h1>
                <h3><span>{colage.ge([`${movie.genres[0]}`],"en")}</span><span>{colage.ge([`${movie.genres[1]}`],"en")}</span><span>{colage.ge([`${movie.genres[2]}`],"en")}</span></h3>
                <NavLink active="true" className={(element) => element.isActive ? "selected" : ""} to={`/movies/${movieId}/overview`}>About Movie</NavLink>
                <NavLink className={(element) => element.isActive ? "selected" : ""} to={`/movies/${movieId}/reviews`}>Reviews</NavLink>
                <Outlet context={[movie, reviews]}/>
                <NavLink state={{myState:"edit",movie:movie}} to={`/movies/${movieId}/edit`}>Edit</NavLink>
                <button onClick={handleDelete} method="DELETE" type="submit">Delete</button>
            </div>}
        </div>
    )
}
