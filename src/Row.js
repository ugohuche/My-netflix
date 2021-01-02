import { useEffect, useState } from "react";
import instance from "./axios";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import './Row.css';

const  baseURL = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {

        async function fetchData() {
            const request = await instance.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl, title]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1
        },
    };

    const handleClick = movie => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.name || movie?.title || movie?.original_title || "")
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get("v"));
            })
            .catch((err) => console.error(err));
        }
    };

    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row__posters">
                {movies.map((movie) => {
                    return <img 
                        key={movie.id}
                        style={{cursor: "pointer"}}
                        onClick={() => handleClick(movie)}
                        className={`row__poster row__posterLarge`} 
                        src={`${baseURL}${movie.poster_path}`} 
                        alt="" />
                })}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    )
};

export default Row;