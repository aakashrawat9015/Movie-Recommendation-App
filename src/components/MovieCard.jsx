import React from 'react'

const MovieCard = ({ movie:
  { title, poster_path, release_date, vote_average, vote_count, original_language }
}) => {
  return (
    <>
      <div className='movie-card'>
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