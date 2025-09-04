import { useDebounce } from 'react-use';
import { useState, useEffect } from 'react';
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

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchMovie);
    },
    1000,
    [searchMovie]
  );

  const handleFetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await fetchMovies(query);
      if (!data.results || data.results.length === 0) {
        setErrorMessage("No movies found.");
        setMovieList([]);
        return;
      }
      setMovieList(data?.results || []);
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
    // Show modal immediately with basic info
    setSelectedMovie(movie);
    setIsMovieDetailsOpen(true);

    // Fetch extra details in background
    try {
      const detailedMovie = await fetchMovieDetails(movie.id);
      if (detailedMovie) {
        setSelectedMovie(detailedMovie); // Update modal with full details
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const closeMovieDetails = () => {
    setIsMovieDetailsOpen(false);
    setSelectedMovie(null);
  };

  useEffect(() => {
    handleFetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

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

          {isLoading ? (
            <p className='text-white'>Loading...</p>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => handleMovieClick(movie)} />
              ))}
            </ul>
          )
          }

        </section>
      </div>

      {/* Movie Details Modal */}
      <MovieDetails
        movie={selectedMovie}
        isOpen={isMovieDetailsOpen}
        onClose={closeMovieDetails}
      />
    </div>
  );
}

export default App;