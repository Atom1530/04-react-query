import { fetchMovies } from "../../services/movieService";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../Loader/Loader";
import { useState } from "react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selected, setSelected] = useState<Movie | null>(null);

  const handleSelectMovie = (movie: Movie) => setSelected(movie);
  const handleCloseModal = () => setSelected(null);

  const handleSearch = async (query: string): Promise<void> => {
    setIsError(false);
    setMovies([]);
    setSelected(null);
    setIsLoading(true);

    try {
      const results = await fetchMovies(query);

      if (results.length === 0) {
        console.log("No movies found for your request.");
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(results);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}

      {!isLoading && isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {selected && <MovieModal movie={selected} onClose={handleCloseModal} />}
    </>
  );
}
