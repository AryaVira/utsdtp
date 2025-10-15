require("dotenv").config();

const apiKey = process.env.API_KEY;
const searchEngineId = process.env.SEARCH_ENGINE_ID;

console.log("API Key berhasil dimuat:", apiKey ? "Ya" : "Tidak");

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const showMoreButtonEl = document.getElementById("show-more-button");

let page = 1;

async function searchImages() {
  const inputData = searchInputEl.value;
  const startIndex = (page - 1) * 10 + 1;
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${inputData}&searchType=image&start=${startIndex}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (page === 1) {
      searchResultsEl.innerHTML = "";
    }

    const results = data.items;

    if (results && results.length > 0) {
      results.map((result) => {
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("search-result");
        const image = document.createElement("img");

        image.src = result.link;
        image.alt = result.title;

        const imageLink = document.createElement("a");
        imageLink.href = result.image.contextLink;
        imageLink.target = "_blank";
        imageLink.textContent = result.title;

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(imageLink);
        searchResultsEl.appendChild(imageWrapper);
      });

      setupScrollAnimation();

      page++;
      showMoreButtonEl.style.display = "block";
    } else if (page === 1) {
      searchResultsEl.innerHTML = "<p>Gambar tidak ditemukan.</p>";
      showMoreButtonEl.style.display = "none";
    }

  } catch (error) {
    console.error("Terjadi error:", error);
    searchResultsEl.innerHTML = "<p>Gagal memuat data. Periksa API Key atau koneksi.</p>";
    showMoreButtonEl.style.display = "none";
  }
}


formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  searchImages();
});

showMoreButtonEl.addEventListener("click", () => {
  searchImages();
});

const resetButtonEl = document.getElementById("reset-button");

resetButtonEl.addEventListener("click", () => {
  searchResultsEl.innerHTML = "";
  showMoreButtonEl.style.display = "none";
  window.scrollTo(0, 0);
});

function setupScrollAnimation() {
  const cards = document.querySelectorAll('.search-result:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  cards.forEach(card => {
    observer.observe(card);
  });
}