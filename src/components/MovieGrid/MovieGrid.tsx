import css from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_IMG = "https://placehold.co/500x750?text=No+Image";

interface Props {
  onSelect: (movie: Movie) => void;
  movies: Movie[];
}

export default function MovieGrid({ onSelect, movies }: Props) {
  return (
    <ul className={css.grid}>
      {movies.map((movie) => {
        const src = movie.poster_path
          ? `${IMG_BASE}${movie.poster_path}`
          : movie.backdrop_path
          ? `${IMG_BASE}${movie.backdrop_path}`
          : FALLBACK_IMG;

        return (
          <li key={movie.id}>
            <div
              className={css.card}
              onClick={() => onSelect(movie)}
              role="button"
            >
              <img
                className={css.image}
                src={src}
                alt={movie.title}
                loading="lazy"
              />
              <h2 className={css.title}>{movie.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
