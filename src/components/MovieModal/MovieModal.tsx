import css from "./MovieModal.module.css";
import { createPortal } from "react-dom";
import type { Movie } from "./../../types/movie";
import { useEffect } from "react";

const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER = "https://placehold.co/1280x720?text=No+Image";

interface ModalProps {
  onClose: () => void;
  movie: Movie;
}

export default function MovieModal({ movie, onClose }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const imgSrc = movie.backdrop_path
    ? `${BACKDROP_BASE}${movie.backdrop_path}`
    : movie.poster_path
    ? `${POSTER_BASE}${movie.poster_path}`
    : PLACEHOLDER;

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img src={imgSrc} alt={movie.title} className={css.image} />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
}
