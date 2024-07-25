document
  .getElementById("city-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const cityName = document.getElementById("city_name").value;
    const countryName = document.getElementById("country_name").value;

    const response = await fetch("/api/cities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city_name: cityName, country_name: countryName }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `<h2>${result.name}, ${result.country}</h2>
                            <h3>Meals</h3>
                            <ul>${result.meals
                              .map(
                                (item) =>
                                  `<li>${item.item_name}: ${item.average_price} ${item.currency}</li>`
                              )
                              .join("")}</ul>
                            <h3>Transportation</h3>
                            <ul>${result.transportation
                              .map(
                                (item) =>
                                  `<li>${item.item_name}: ${item.average_price} ${item.currency}</li>`
                              )
                              .join("")}</ul>`;
  });
