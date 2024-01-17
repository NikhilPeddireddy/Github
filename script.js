const apiUrl = 'https://api.github.com/users/';
let currentPage = 1;

async function getUserInfo(username) {
    try {
        const response = await fetch(`${apiUrl}${username}`);
        const userInfo = await response.json();
        return userInfo;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
}

async function getRepositories() {
    const username = document.getElementById('username').value;
    const repositoriesContainer = document.getElementById('repositories');
    const loader = document.getElementById('loader');
    const currentPageSpan = document.getElementById('currentPage');
    const userInfoContainer = document.getElementById('user-info');

    repositoriesContainer.innerHTML = '';
    loader.style.display = 'block';

    try {
        const userInfo = await getUserInfo(username);

        if (userInfo) {
            // Display user info
            userInfoContainer.innerHTML = `
                <div class="user-info">
                    <img class="user-photo" src="${userInfo.avatar_url}" alt="User Photo">
                    <h2>${userInfo.login}</h2>
                    <p>${userInfo.bio || 'No bio available'}</p>
                    <p><a href="${userInfo.html_url}" target="_blank">GitHub Profile</a></p>
                </div>
            `;
        }

        // Update the per_page parameter to 6
        const response = await fetch(`${apiUrl}${username}/repos?per_page=6&page=${currentPage}`);
        const repositories = await response.json();

        loader.style.display = 'none';
        displayRepositories(repositories);
        currentPageSpan.innerText = currentPage;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        loader.style.display = 'none';
        repositoriesContainer.innerHTML = 'Error fetching repositories. Please try again.';
    }
}

function displayRepositories(repositories) {
    const repositoriesContainer = document.getElementById('repositories');

    if (repositories.length === 0) {
        repositoriesContainer.innerHTML = 'No repositories found.';
        return;
    }

    repositories.forEach((repo, index) => {
        const repositorySection = document.createElement('div');
        repositorySection.classList.add('repository-section');

        repositorySection.innerHTML = `
            <h2>${repo.name}</h2>
            <p>${repo.description || 'No description available'}</p>
            <div class="languages-box">${getRandomLanguages()}</div>
        `;

        repositoriesContainer.appendChild(repositorySection);
    });
}

function getRandomLanguages() {
    const languages = ['HTML', 'CSS', 'JavaScript', 'React',  'Angular', 'Node.js'];
    
    // Shuffle the array randomly
    for (let i = languages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [languages[i], languages[j]] = [languages[j], languages[i]];
    }

    // Return a subset (random number of languages)
    const randomSubset = languages.slice(0, Math.floor(Math.random() * languages.length) + 1);

    return randomSubset.join(', ');
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        getRepositories();
    }
}

function nextPage() {
    currentPage++;
    getRepositories();
}
