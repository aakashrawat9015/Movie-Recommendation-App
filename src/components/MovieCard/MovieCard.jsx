import React from 'react'

const MovieCard = ({ movie, onClick }) => {
  const { title, poster_path, release_date, vote_average, vote_count, original_language } = movie;
  
  return (
    <>
      <div className='movie-card cursor-pointer hover:scale-105 transition-transform duration-200' onClick={onClick}>
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'} alt={title} />
        <div className='mt-4'>
          <h3>{title}</h3>
          <div className="content">
            <div className="rating">
              <img src="src/assets/star.svg" alt="star img" />
              <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
            </div>

            <span>•</span>
            <p className='lang'>{original_language}</p>
            <span>•</span>
            <p className='year'>{release_date ? release_date.split('-')[0] : 'NA'}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default MovieCard