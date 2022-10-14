import { Card } from "./Card";
import { FC, useEffect, useState } from "react";
import { Movie } from "../models/Movie";
import * as Web3 from "@solana/web3.js";

const MOVIE_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";

export const MovieList: FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    /* We will not use account hook here because we want to fetch data 
    from program accounts wether its connected or not. */

    useEffect(() => {
        const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"));
        connection
            .getProgramAccounts(new Web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID))
            .then(async (accounts) => {
                const movies: Movie[] = accounts.reduce((accum: Movie[], { pubkey, account }) => {
                    const movie = Movie.deserialize(account.data);
                    if (!movie) return accum;
                    return [...accum, movie];
                }, []);

                setMovies(movies);
            });
    }, []);

    return (
        <div>
            {movies.map((movie, i) => {
                if (movie.description !== "undefined") {
                    console.log(movie);

                    return <Card key={i} movie={movie} />;
                }
            })}
        </div>
    );
};
