import React from 'react';

const MovieDetails = ({ movie, isOpen, onClose }) => {
  if (!isOpen || !movie) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-dark-100 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all"
          >
            ✕
          </button>
          
          {/* Hero section with backdrop */}
          <div className="relative h-64 sm:h-80">
            <img
              src={movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-movie.png'}
              alt={movie.title}
              className="w-full h-full object-cover rounded-t-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent rounded-t-2xl" />
          </div>
        </div>

        <div className="p-6">
          {/* Movie title and basic info */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '/no-movie.png'}
              alt={movie.title}
              className="w-32 h-48 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
              <div className="flex items-center gap-4 text-gray-300 mb-3">
                <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                <span>•</span>
                <span className="capitalize">{movie.original_language}</span>
                {movie.runtime && (
                  <>
                    <span>•</span>
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  </>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <img src="src/assets/star.svg" alt="star" className="w-5 h-5" />
                  <span className="text-white font-bold text-lg">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                <span className="text-gray-400">({movie.vote_count ? movie.vote_count.toLocaleString() : 'N/A'} votes)</span>
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-light-100/10 text-light-200 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Overview */}
          {movie.overview && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>
          )}

          {/* Additional details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {movie.budget && movie.budget > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2">Budget</h4>
                <p className="text-gray-300">${movie.budget.toLocaleString()}</p>
              </div>
            )}
            
            {movie.revenue && movie.revenue > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2">Revenue</h4>
                <p className="text-gray-300">${movie.revenue.toLocaleString()}</p>
              </div>
            )}

            {movie.production_companies && movie.production_companies.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2">Production Companies</h4>
                <p className="text-gray-300">{movie.production_companies.map(company => company.name).join(', ')}</p>
              </div>
            )}

            {movie.spoken_languages && movie.spoken_languages.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2">Spoken Languages</h4>
                <p className="text-gray-300">{movie.spoken_languages.map(lang => lang.english_name).join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
