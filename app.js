const API_KEY = "f99a07df";



const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const yearFilter = document.getElementById("yearFilter");
const loadElement = document.querySelector("#load")

const grid = document.getElementById("grid");

function showLoad() {
    console.log("SHOW loader");
    loadElement.classList.remove("load--hidden");
    
}
function hideLoad() {

    loadElement.classList.add("load--hidden")
}

async function searchMovies(query, type, year) {
    let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;

    if (type) {
        url += `&type=${type}`;
    }
    if (year) {
        url += `&y=${year}`;
    }
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "False") {
        return [];
    }
    return data.Search;
}


function renderMovies(movies) {
    if (movies.length === 0) {
        grid.innerHTML = `<p>No movies found.</p>`;
        return;
    }

    grid.innerHTML = movies
        .map((movie) => {
            const poster =
                movie.Poster && movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/300x450?text=No+Poster";

            return `
                <div class="card" data-imdbid="${movie.imdbID}">
                  <img class="card__img"
                       src="${poster}"
                       alt="${movie.Title}"
                       onerror="this.onerror=null;this.src='https://via.placeholder.com/300x450?text=No+Poster';"/>
                 <div class="card__body">
                        <h3>${movie.Title}</h3>
                        <p>${movie.Year}</p>
                    </div>
                </div>
            `;
        })
        .join("");
}

async function loadMovies() {
    const query = searchInput.value.trim();
    const type = typeFilter.value;
    const year = yearFilter.value.trim();

    if (!query) return;
    showLoad();
    grid.innerHTML = "";
    try {
        const movies = await searchMovies(query, type, year);
        renderMovies(movies);
    } catch (err) {
        console.error(err);
        grid.innerHTML = `<p>Failed to load movies. Please try again.</p>`;
    } finally {
        hideLoad();
    }
}
searchBtn.addEventListener("click", () => {
    loadMovies();
});

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        loadMovies();
    }
});

searchInput.value = "Search";
loadMovies();



