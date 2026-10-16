const userContainer = document.querySelector('.userContainer');
const statusMessage = document.querySelector('#statusMessage');
const searchInput = document.querySelector('#searchInput');

const searchBtn = document.querySelector('#searchBtn');
const loadBtn = document.querySelector('#loadBtn');

const  APIURL = 'https://jsonplaceholder.typicode.com/users/';

let users = [];
let isLoading = false;



async function fetchUsers() {

    if (isLoading) {
        return;
    }
    try {
        isLoading = true;
        searchBtn.disabled = true;
        loadBtn.disabled = true;
        statusMessage.textContent = 'Loading ...'
        const response = await fetch(APIURL);
    if (!response.ok) {
        throw new Error(
            `HTTPError: ${
                response.status
            }`
        )
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
        throw new Error('Invalid data');
    }

    users = data;
    renderUsers(users);
    } catch (error) {
        statusMessage.textContent = `Failed Load Users ${error}`
    } finally {
        isLoading = false;
        searchBtn.disabled = false;
        loadBtn.disabled = false;
        statusMessage.textContent = 'search using input and next press Search';
    }
        
}


function renderUsers(usersToRender) {
    userContainer.replaceChildren();
    if (usersToRender.length === 0) {
        statusMessage.textContent = "No user loaded";
        return;
    } else {
        statusMessage.textContent = '';
    }

    const fragment = document.createDocumentFragment();
    usersToRender.forEach(user => {
        const card = document.createElement("div");
        card.className = 'user-card';
        const name = document.createElement('h2');
        name.textContent = user.name;

        const username = document.createElement('p');
        username.textContent = `Username: ${user.username}`;

        card.append(
            name, username
        )

        fragment.appendChild(card);
    });
    userContainer.appendChild(fragment);


}

function searchUsers() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredUsers = users.filter(user => {
        return user.name.toLowerCase().includes(searchTerm);
    });
    renderUsers(filteredUsers);
}


loadBtn.addEventListener('click', fetchUsers);
searchBtn.addEventListener('click', searchUsers);

searchInput.addEventListener('keydown', event => {
    if(event.key === 'Enter') {
        searchUsers();
    }
})

