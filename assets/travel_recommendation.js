function fetchTravelData() {
    fetch("./api/travel_recommendation_api.json")
        .then((response) => {
            if(!response.ok){   
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error("Error fetching travel data", error)
        })
}
fetchTravelData();



const searchBtn = document.getElementById("searchBtn");
// const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("destinationInput");
const resultsContainer = document.getElementById("recommendationResults");

// Fetch and display travel recommendations
async function searchRecommendations() {
  const keyword = searchInput.value.trim().toLowerCase();

  // Clear previous results
  resultsContainer.innerHTML = "";

  if (!keyword) {
    alert("Please enter a keyword!");
    return;
  }

  try {
    const response = await fetch("./api/travel_recommendation_api.json");

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    let recommendations = [];

    // Beach recommendations
    if (keyword === "beach" || keyword === "beaches") {
      recommendations = data.beaches;
    }

    // Temple recommendations
    else if (keyword === "temple" || keyword === "temples") {
      recommendations = data.temples;
    }

    // Country recommendations
    else if (keyword === "country" || keyword === "countries") {
      recommendations = data.countries.flatMap(
        (country) => country.cities
      );
    }

    // No matching keyword
    else {
      resultsContainer.textContent =
        "No recommendations found. Try beach, temple, or country.";
      return;
    }

    // Display at least two recommendations
    const selectedPlaces = recommendations.slice(0, 2);

    if (selectedPlaces.length < 2) {
      resultsContainer.textContent =
        "Not enough recommendations available.";
      return;
    }

    selectedPlaces.forEach((place) => {
      const card = document.createElement("div");
      card.className = "recommendation-card";

      const image = document.createElement("img");
      image.src = place.imageUrl;
      image.alt = place.name;

      const content = document.createElement("div");
      content.className = "recommendation-content";

      const title = document.createElement("h3");
      title.textContent = place.name;

      const description = document.createElement("p");
      description.textContent = place.description;

      content.append(title, description);
      card.append(image, content);

      resultsContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Error:", error);
    resultsContainer.textContent =
      "Failed to load travel recommendations.";
  }
}

// Search button event
if (searchBtn && searchInput && resultsContainer) {
  searchBtn.addEventListener("click", searchRecommendations);
}

// Reset button event
// if (resetBtn && searchInput && resultsContainer) {
//   resetBtn.addEventListener("click", () => {
//     searchInput.value = "";
//     resultsContainer.innerHTML = "";
//   });
// }


function clearResults() {
  const searchInput = document.getElementById("destinationInput");
  const resultsContainer = document.getElementById("recommendationResults");

  // Clear the search input
  searchInput.value = "";

  // Remove all recommendation results
  resultsContainer.innerHTML = "";
}

// Call the function when Clear button is clicked
const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
  resetBtn.addEventListener("click", clearResults);
}

