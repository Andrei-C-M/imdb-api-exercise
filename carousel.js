// that cursed carousel thing

// const apiKey = 'bbcf57a4';


function loadJSON() {
  fetch('https://santosnr6.github.io/Data/favoritemovies.json')
    .then(response => response.json())
    .then(data => {
      const randomTrailer = data[Math.floor(Math.random() * data.length)];
      const trailerElement = document.getElementById('trailer');
      trailerElement.src = randomTrailer.Trailer_link;
      
      // Start playing 
      trailerElement.play();
    })
    .catch(error => console.error('Error loading JSON:', error));
}


export { loadJSON };


