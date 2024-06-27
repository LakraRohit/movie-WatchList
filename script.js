document.addEventListener('DOMContentLoaded', () => {
    const addMovieButton = document.getElementById('add-movie-button');
    const movieFormContainer = document.getElementById('movie-form-container');
    const movieForm = document.getElementById('movie-form');
    const movieList = document.getElementById('movie-list');

    addMovieButton.addEventListener('click', () => {
        movieFormContainer.classList.toggle('hidden');
        resetMovieForm();
    });

    movieForm.addEventListener('submit', handleSubmit);

    function handleSubmit(e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const releaseYear = document.getElementById('releaseYear').value;
        const genre = document.getElementById('genre').value;
        const movieId = `movie-${Date.now()}`;

        const movie = {
            id: movieId,
            title,
            description,
            releaseYear,
            genre,
            watched: false,
            reviews: [],
            rating: null
        };

        addOrUpdateMovie(movie);
        resetMovieForm();
        movieFormContainer.classList.add('hidden');
    }

    function addOrUpdateMovie(movie) {
        let movieBanner = document.getElementById(movie.id);

        if (!movieBanner) {
            movieBanner = document.createElement('div');
            movieBanner.classList.add('movie-banner');
            movieBanner.setAttribute('id', movie.id);
            movieList.appendChild(movieBanner);
        }

        movieBanner.innerHTML = `
            <h3>Title: ${movie.title}</h3>
            <p>ID: ${movie.id}</p>
            <p>Description: ${movie.description}</p>
            <p>Release Year: ${movie.releaseYear}</p>
            <p>Genre: ${movie.genre}</p>
            <div class="toggle-switch ${movie.watched ? 'watched' : ''}" onclick="toggleWatched('${movie.id}')">
                <div class="toggle-switch-inner"></div>
            </div>
            <button onclick="editMovie('${movie.id}')">Edit</button>
            <button onclick="deleteMovie('${movie.id}')">Delete</button>
            <button onclick="showMovieDetails('${movie.id}')">Movie Details</button>
        `;
    }

    function resetMovieForm() {
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('releaseYear').value = '';
        document.getElementById('genre').value = '';
    }

    window.toggleWatched = function(movieId) {
        const movieBanner = document.getElementById(movieId);
        const toggleSwitch = movieBanner.querySelector('.toggle-switch');
        toggleSwitch.classList.toggle('watched');
    };

    window.editMovie = function(movieId) {
        const movieBanner = document.getElementById(movieId);
        const titleElement = movieBanner.querySelector('h3');
        const descriptionElement = movieBanner.querySelector('p:nth-child(3)');
        const releaseYearElement = movieBanner.querySelector('p:nth-child(4)');
        const genreElement = movieBanner.querySelector('p:nth-child(5)');

        const title = titleElement.textContent.split(': ')[1];
        const description = descriptionElement.textContent.split(': ')[1];
        const releaseYear = releaseYearElement.textContent.split(': ')[1];
        const genre = genreElement.textContent.split(': ')[1];

        const movieForm = document.getElementById('movie-form');
        const movieFormContainer = document.getElementById('movie-form-container');

        movieFormContainer.classList.remove('hidden');

        document.getElementById('title').value = title;
        document.getElementById('description').value = description;
        document.getElementById('releaseYear').value = releaseYear;
        document.getElementById('genre').value = genre;

        movieForm.removeEventListener('submit', handleSubmit);

        movieForm.addEventListener('submit', function handleEdit(e) {
            e.preventDefault();
            titleElement.textContent = `Title: ${document.getElementById('title').value}`;
            descriptionElement.textContent = `Description: ${document.getElementById('description').value}`;
            releaseYearElement.textContent = `Release Year: ${document.getElementById('releaseYear').value}`;
            genreElement.textContent = `Genre: ${document.getElementById('genre').value}`;

            movieForm.reset();
            movieFormContainer.classList.add('hidden');
            movieForm.removeEventListener('submit', handleEdit);
            movieForm.addEventListener('submit', handleSubmit);
        });
    };

    window.deleteMovie = function(movieId) {
        const movieBanner = document.getElementById(movieId);
        movieList.removeChild(movieBanner);
    };

    window.showMovieDetails = function(movieId) {
        const movieBanner = document.getElementById(movieId);
        let movieDetails = document.getElementById(`details-${movieId}`);

        if (!movieDetails) {
            movieDetails = document.createElement('div');
            movieDetails.setAttribute('id', `details-${movieId}`);
            movieDetails.classList.add('movie-details');
            movieBanner.appendChild(movieDetails);
        } else {
            movieDetails.innerHTML = ''; // Clear previous details
        }

        movieDetails.innerHTML = `
            <h3>${movieBanner.querySelector('h3').textContent}</h3>
            <p>${movieBanner.querySelector('p:nth-child(3)').textContent}</p>
            <p>${movieBanner.querySelector('p:nth-child(4)').textContent}</p>
            <p>${movieBanner.querySelector('p:nth-child(5)').textContent}</p>
            <p>Rating: <span id="movie-rating-${movieId}">N/A</span></p>
            <p>Reviews: <span id="movie-reviews-${movieId}">N/A</span></p>
            <div class="rating-container" id="rating-container-${movieId}">
                Rate this movie:
                <span class="star" data-value="1">&#9733;</span>
                <span class="star" data-value="2">&#9733;</span>
                <span class="star" data-value="3">&#9733;</span>
                <span class="star" data-value="4">&#9733;</span>
                <span class="star" data-value="5">&#9733;</span>
            </div>
            <textarea id="review-${movieId}" placeholder="Write a review"></textarea>
            <button onclick="submitReview('${movieId}')">Submit Review</button>
        `;

        document.querySelectorAll(`#rating-container-${movieId} .star`).forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.getAttribute('data-value');
                document.getElementById(`movie-rating-${movieId}`).textContent = rating;
                document.querySelectorAll(`#rating-container-${movieId} .star`).forEach(s => {
                    s.style.color = s.getAttribute('data-value') <= rating ? 'yellow' : 'gray';
                });
            });
        });
    };

    window.submitReview = function(movieId) {
        const reviewTextarea = document.getElementById(`review-${movieId}`);
        const reviewText = reviewTextarea.value;
        if (reviewText) {
            const movieReviews = document.getElementById(`movie-reviews-${movieId}`);
            const existingReviews = movieReviews.textContent;
            movieReviews.textContent = existingReviews === 'N/A' ? reviewText : `${existingReviews}, ${reviewText}`;
            reviewTextarea.value = '';
        }
    };
});
