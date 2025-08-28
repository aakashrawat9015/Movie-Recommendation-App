import React from 'react'

const Search = ({ searchMovie, setSearchMovie }) => {
  return (
    <div className='search'>
      <div>
        <img
          src="src/assets/search.svg"
          alt="search"
        />
        <input type="text" 
        placeholder='Search Through Thousands of Movies'
        value={searchMovie}
        onChange={(event)=>{
          setSearchMovie(event.target.value)
        }}/>
      </div>
    </div>
  )
}

export default Search