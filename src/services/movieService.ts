// src/services/movieService.ts
import axios, { type AxiosInstance } from "axios";
import type { Movie } from "../types/movie";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN as string;

const api: AxiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
});

export interface SearchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(query: string, page = 1): Promise<SearchMoviesResponse> {
  const { data } = await api.get<SearchMoviesResponse>("/search/movie", {
    params: { query: query.trim(), include_adult: false, language: "en-US", page },
  });
  return data;
}
