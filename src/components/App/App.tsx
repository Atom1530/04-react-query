import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  fetchMovies,
  type SearchMoviesResponse,
} from "../../services/movieService";
import type { AxiosError } from "axios";
import { Toaster, toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import css from "../Pagination/Pagination.module.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedValue, setSearchedValue] = useState("");
  const [selected, setSelected] = useState<Movie | null>(null);

  const { data, isLoading, isError, isFetching } = useQuery<
    SearchMoviesResponse,
    AxiosError
  >({
    queryKey: ["movies", searchedValue, currentPage],
    queryFn: () => fetchMovies(searchedValue, currentPage),
    enabled: searchedValue.trim() !== "",
    placeholderData: keepPreviousData,
  });

  const handleSearch = (value: string) => {
    const q = value.trim();
    if (!q) return;
    setSelected(null);
    setCurrentPage(1);
    setSearchedValue(q);
  };

  const handleSelectMovie = (movie: Movie) => setSelected(movie);
  const handleCloseModal = () => setSelected(null);

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (!isLoading && !isError && data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isLoading, isError, data]);

  return (
    <>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {(isLoading || isFetching) && <Loader />}
      {!isLoading && isError && <ErrorMessage />}

      {!isLoading && !isError && data && data.results.length > 0 && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              previousLabel="<"
              onPageChange={({ selected }) => setCurrentPage(selected + 1)}
              pageRangeDisplayed={5}
              pageCount={totalPages}
              containerClassName={css.pagination}
              activeClassName={css.active}
              marginPagesDisplayed={1}
              renderOnZeroPageCount={null}
              forcePage={currentPage - 1}
            />
          )}
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
        </>
      )}

      {selected && <MovieModal movie={selected} onClose={handleCloseModal} />}
    </>
  );
}
