//apikey = bbcf57a4
//http://www.omdbapi.com/?apikey=bbcf57a4&t=captain+america

//importing stuff

import { loadJSON } from './carousel.js';


// Start by assigning the various HTML elements to constants
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// Get movies from the OMDb API
async function loadMovies(searchTerm) {
    const URL = `https://www.omdbapi.com/?apikey=bbcf57a4&s=${searchTerm}*`;
    const res = await fetch(URL);
    const data = await res.json();
    if(data.Response === 'True') displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // using imdbID from OMDb api
        movieListItem.classList.add('search-list-item');
        let moviePoster;
        if(movies[idx].Poster !== "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "./resources/missing-poster.svg"; 

        movieListItem.innerHTML = `
        <div class="search-item-thumbnail">
            <img src="${moviePoster}" alt="${movies[idx].Title} + ${movies[idx].Year}">
        </div>
        <div class="search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            // Fixed HTTP to HTTPS
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=bbcf57a4`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${(details.Poster !== "N/A") ? details.Poster : "./resources/missing-poster.svg"}" alt="movie poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Rated: ${details.Rated}</li>
            <li class="released">Release date: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre: </b>${details.Genre}</p>
        <p class="writer"><b>Writers: </b>${details.Writer}</p>
        <p class="actors"><b>Actors: </b> ${details.Actors}</p>
        <p class="plot"><b>Plot: </b>${details.Plot}</p>
        <p class="language"><b>Language: </b>${details.Language}</p>
        <p class="awards"><b><i class="fa-solid fa-award"></i></b>${details.Awards}</p>
    </div>
    `;
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Event listener for search input
    if (movieSearchBox) {
        movieSearchBox.addEventListener('keyup', findMovies);
    }

    // Hide the search list when clicking outside, otherwise it look weird
    window.addEventListener('click', (event) => {
        if(event.target.className !== "form-control"){
            searchList.classList.add('hide-search-list');
        }
    });
});

//Feth top movies from Jesper's JSON file

async function fetchTopMovies() {
    const response = await fetch('https://santosnr6.github.io/Data/favoritemovies.json');
    const data = await response.json();
    console.log(data);

    if (data && data.movies) {
        const topMovies = data.movies.slice(0, 20);
        displayTopMovies(topMovies);
    }
}

fetch('https://santosnr6.github.io/Data/favoritemovies.json')
  .then(response => response.json())
  .then(data => {
    const movieList = document.getElementById('movie-list');
    data.forEach(movie => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <h2>${movie.Title}</h2>
        <img src="${movie.Poster}" alt="Movie Poster">
        <p>Trailer Link: <a href="${movie.Trailer_link}" target="_blank">Watch Trailer</a></p>
      `;
      movieList.appendChild(listItem);
    });
  })
  .catch(error => console.error('Dude, you got another error:', error));

  //trailers from carousel.js
  loadJSON();

  document.getElementById('prev').addEventListener('click', () => {
    loadJSON();
  });
  
  document.getElementById('next').addEventListener('click', () => {
    loadJSON();
  });
  