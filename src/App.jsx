import { useDebounce } from 'react-use';
import { useState, useEffect, useRef } from 'react';
import logo from './assets/hero.png';
import Search from './components/SearchMovie/Search';
import MovieCard from './components/MovieCard/MovieCard';
import MovieDetails from './components/MovieDetails/MovieDetails';
import { getTrendingSearches, updateSearchCount } from './appwrite';
import { fetchMovies, fetchMovieDetails } from './api/tmdb';

function App() {
  const [searchMovie, setSearchMovie] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isMovieDetailsOpen, setIsMovieDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loader = useRef(null);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchMovie);
    },
    1000,
    [searchMovie]
  );

  // Fetch movies with pagination
  const handleFetchMovies = async (query = '', page = 1, append = false) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await fetchMovies(query, page);
      if (!data.results || data.results.length === 0) {
        setErrorMessage("No movies found.");
        if (!append) setMovieList([]);
        setHasMore(false);
        return;
      }
      setHasMore(data.results.length > 0);
      if (append) {
        setMovieList(prev => [...prev, ...data.results]);
      } else {
        setMovieList(data.results);
      }
      if (query && data.results.length > 0)
        updateSearchCount(query, data.results[0]);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      const movies = await getTrendingSearches();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);
    setIsMovieDetailsOpen(true);
    try {
      const detailedMovie = await fetchMovieDetails(movie.id);
      if (detailedMovie) {
        setSelectedMovie(detailedMovie);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const closeMovieDetails = () => {
    setIsMovieDetailsOpen(false);
    setSelectedMovie(null);
  };

  // Initial and search fetch
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    setMovieList([]); // <-- Clear movie list on new search
    handleFetchMovies(debouncedSearchTerm, 1, false);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || isLoading || movieList.length >= 50) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading && hasMore && movieList.length < 50) {
          setIsLoading(true); // Prevent multiple triggers
          handleFetchMovies(debouncedSearchTerm, currentPage + 1, true).then(() => {
            setCurrentPage(prev => prev + 1);
          });
        }
      },
      { threshold: 1 }
    );

    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
      observer.disconnect();
    };
  }, [loader, hasMore, isLoading, currentPage, debouncedSearchTerm, movieList.length]);

  return (
    <div className="pattern">
      <div className="wrapper">
        <header>
          <img src={logo} alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without Hassle
          </h1>
        </header>

        <Search searchMovie={searchMovie} setSearchMovie={setSearchMovie} />
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading && <p className='text-white'>Loading...</p>}
          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
          <ul>
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={() => handleMovieClick(movie)} />
            ))}
          </ul>
          <div ref={loader} style={{ height: 40 }} />
        </section>
      </div>
      <MovieDetails
        movie={selectedMovie}
        isOpen={isMovieDetailsOpen}
        onClose={closeMovieDetails}
      />
    </div>
  );
}

export default App;