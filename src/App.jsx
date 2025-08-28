import { useDebounce } from 'react-use';
import { useState, useEffect } from 'react';
import logo from './assets/hero.png';
import Search from './components/Search';
import MovieCard from './components/MovieCard';
import { updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const [searchMovie, setSearchMovie] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(
  () => {
    setDebouncedSearchTerm(searchMovie);
  },
  500,
  [searchMovie]
);

  const fetchMovies = async (query='') => {

    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query
      ?  `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (!data.results || data.results.length === 0) {
        setErrorMessage("No movies found.");
        setMovieList([]);
        return;
      }
      setMovieList(data?.results || []);

      if (query && data.results.length > 0)
        updateSearchCount(query, data.results[0]);
    }
    
    catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

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

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <p className='text-white'>Loading...</p>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )
          }

        </section>
      </div>
    </div>
  );
}

export default App;