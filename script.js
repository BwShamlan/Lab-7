const btnXHR = document.getElementById('xhrSearch');
const btnFetch = document.getElementById('fetchSearch');
const btnFetchAsynAwait = document.getElementById('fetchAsyncAwaitSearch');

let searchQueryElem = document.getElementById('query');
let searchResults = document.getElementById('searchResults');

const API_URL = 'https://api.unsplash.com/search/photos';
const API_KEY = 'qOT1xmX0RtV4CqknUADxSW16Q2Tqe6fajF-HAhxKusk';

btnXHR.addEventListener('click', function () {
    searchResults.innerHTML = '';
    searchUsingXHR(searchQueryElem.value);
});

btnFetch.addEventListener('click', function () {
    searchResults.innerHTML = '';
    searchUsingFetch(searchQueryElem.value);
});

btnFetchAsynAwait.addEventListener('click', function () {
    searchResults.innerHTML = '';
    searchUsingAsyncAwait(searchQueryElem.value);
});

function searchUsingXHR(query) {
    if (!query || query.trim().length === 0) {
        return;
    }
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            displayResults(JSON.parse(xhr.responseText));
        }
    });
    let params = "client_id=" + API_KEY + "&query=" + query + "&per_page=5";
    xhr.open('GET', API_URL + '?' + params);
    xhr.send();
}

function searchUsingFetch(query) {
    if (!query || query.trim().length === 0) {
        return;
    }
    let params = "client_id=" + API_KEY + "&query=" + query + "&per_page=5";
    fetch(API_URL + '?' + params, { method: "GET" })
        .then((response) => {
            return response.json();
        }).then((data) => {
            displayResults(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

async function searchUsingAsyncAwait(query) {
    if (!query || query.trim().length === 0) {
        return;
    }
    let params = "client_id=" + API_KEY + "&query=" + query + "&per_page=5";
    let response = await fetch(API_URL + '?' + params, { method: "GET" });
    let data = await response.json();
    displayResults(data);
}

function displayResults(responseObject) {
    for (item of responseObject.results) {
        let imgElement = document.createElement('img');
        imgElement.src = item.urls.regular;
        imgElement.alt = item.alt_description;
        searchResults.appendChild(imgElement);

        let infoContainer = document.createElement('div');
        infoContainer.classList.add('image-info');
        
        let description = document.createElement('p');
        description.textContent = "Description: " + item.description;
        infoContainer.appendChild(description);

        let creator = document.createElement('p');
        creator.textContent = "Creator: " + item.user.name;
        infoContainer.appendChild(creator);

        let location = document.createElement('p');
        location.textContent = "Location: " + (item.user.location ? item.user.location : 'N/A');
        infoContainer.appendChild(location);

        let likes = document.createElement('p');
        likes.textContent = "Likes: " + item.likes;
        infoContainer.appendChild(likes);

        let tags = document.createElement('p');
        tags.textContent = "Tags: " + item.tags.map(tag => tag.title).join(', ');
        infoContainer.appendChild(tags);

        searchResults.appendChild(infoContainer);
    }
}
