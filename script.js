//apikey = bbcf57a4
//http://www.omdbapi.com/?apikey=bbcf57a4&t=captain+america

//start by asigning the various html elements to constants

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

//get movies from the OMDb API

async function loadMovies(searchTerm) {
    const URL= `https://www.omdbapi.com/?apikey=bbcf57a4&t=${searchTerm}`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if(data.Response == 'True') displayMovieList(data.Search);
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
        console.log('Movies:', movies); // log the movies array
        
        if (!movies || !Array.isArray(movies)) {
            console.error('Invalid movies array:', movies); // Log an error if movies is not an array
            return;
        }
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; //using imdbID from OMDb api
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "resources/missing-poster.svg"; 

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}" alt = "${movies[idx].Title} + ${movies[idx].Year}">
        </div>
        <div class = "search-item-info">
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
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=bbcf57a4`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}


function displayMovieDetails(details) {
    resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="./resources/medium-cover.jpg" alt="Movie Poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">Captain America: Brave New World</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: 2025</li>
            <li class="rated">Rated: PG-13</li>
            <li class="released">Release date: 14 February 2025</li>
        </ul>
        <p class="genre"><b>Genre: </b>Action, Adventure, Sci-Fi</p>
        <p class="writer"><b>Writers: </b>Rob Edwards, Malcom Spellman, Dalan Musson</p>
        <p class="actors"><b>Actors: </b> Anthony Mackie, Harrison Ford, Shira Haas, Danny Ramirez...</p>
        <p class="plot"><b>Plot: </b>Sam Wilson, the new Captain America, finds himself in the middle of an international incident and must discover the motive behind a nefarious global plan.</p>
        <p class="language"><b>Language: </b>English</p>
        <p class="awards"><b><i class = "fa-solid fa-award"></i></b>Nominated for the Rusty Bagel Awards</p>
    </div>
    `;

}