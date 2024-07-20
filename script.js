 //This line waits for the HTML document to be completely loaded before executing the enclosed code.
document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const coinInput = document.getElementById('coinInput');
    const searchButton = document.getElementById('searchButton');
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
//fetch crypto data from API
    function fetchDataAndRender() {
        const searchTerm = coinInput.value.trim().toLowerCase();

        if (searchTerm === '') {
            contentDiv.innerHTML = `<p>Please enter a coin name.</p>`;
            return;
        }
//initiate a network to request to fetch dara
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
//cointains coins that matches users search
            .then(data => {
                const filteredCoins = data.filter(coin => coin.name.toLowerCase().includes(searchTerm));

                if (filteredCoins.length === 0) {
                    contentDiv.innerHTML = `<p>No results found for "${searchTerm}". Please try another coin.</p>`;
                    document.getElementById('error-message').innerHTML = '';
                } else {
                    contentDiv.innerHTML = '';
                    document.getElementById('error-message').innerHTML = '';

                    filteredCoins.forEach(coin => {
                        const coinElement = document.createElement('div');
                        coinElement.classList.add('coin');
                        coinElement.innerHTML = `
                            <h2>${coin.name} (${coin.symbol.toUpperCase()})</h2>
                            <img src="${coin.image}" alt="${coin.name} Logo" class="coin-logo">
                            <p>Current Price: $${coin.current_price}</p>
                            <p>Market Cap Rank: ${coin.market_cap_rank}</p>
                            <p>24h Change: ${coin.price_change_percentage_24h}%</p>
                            <button class="details-button" data-id="${coin.id}">View Details</button>
                            <div class="coin-details" id="coin-details-${coin.id}"></div>
                        `;
                        coinElement.addEventListener('click', () => {
                            toggleDetails(coin.id);
                        });
                        contentDiv.appendChild(coinElement);
                    });
                }
            })
//gives error message if no result found
            .catch(error => {
                console.error('Error fetching data:', error);
                contentDiv.innerHTML = '';
                document.getElementById('error-message').innerHTML = `<div id="error-message">Oops..Error fetching data. Please try again later.</div>`;
            });
    }
//Gets additional details about specific crypto currency
    function toggleDetails(coinId) {
        const detailsDiv = document.getElementById(`coin-details-${coinId}`);
        if (detailsDiv.innerHTML.trim() === '') {
            fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(coinData => {
                    detailsDiv.innerHTML = `
                        <h3>${coinData.name} (${coinData.symbol.toUpperCase()}) Details</h3>
                        <p>USD Price: $${coinData.market_data.current_price.usd}</p>
                        <p>Market Cap Rank: ${coinData.market_cap_rank}</p>
                        <p>24h Change: ${coinData.market_data.price_change_percentage_24h}%</p>
                        <p>Genesis Date: ${coinData.genesis_date}</p>
                        <p>Description: ${coinData.description.en}</p>
                    `;
                })
                .catch(error => {
                    console.error('Error fetching coin details:', error);
                    detailsDiv.innerHTML = `<div id="error-message">Oops..Error fetching coin details. Please try again later.</div>`;
                });
        } else {
            detailsDiv.innerHTML = '';
        }
    }

    searchButton.addEventListener('click', fetchDataAndRender);
});

