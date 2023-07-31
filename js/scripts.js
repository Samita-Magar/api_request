// Function to fetch random user data from The Random User Generator API
async function fetchRandomUsers() {
    try {
      const response = await fetch('https://randomuser.me/api/?results=12&nat=us');
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching random users:', error);
    }
  }
  
  // Function to format phone number as (XXX) XXX-XXXX
  function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phoneNumber;
  }
  
  // Function to format date as MM/DD/YYYY
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
  
  // Function to filter users by name
  function filterUsersByName(users, searchTerm) {
    const filteredUsers = users.filter((user) => {
      const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    return filteredUsers;
  }
  
  // Function to create user cards and display them in the DOM
  function displayUsers(users) {
    const gallery = document.getElementById('gallery');
  
    users.forEach((user, index) => {
      const userCard = `
        <div class="card" data-index="${index}">
          <div class="card-img-container">
            <img class="card-img" src="${user.picture.large}" alt="Profile Picture">
          </div>
          <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
          </div>
        </div>
      `;
      gallery.insertAdjacentHTML('beforeend', userCard);
    });
  
    // Add event listener to each user card to open the modal window
    const userCards = document.querySelectorAll('.card');
    userCards.forEach((card) => {
      card.addEventListener('click', (event) => displayModal(event.target.closest('.card').getAttribute('data-index'), users));
    });
  }
  
  // Function to create and display the modal window
  function displayModal(index, users) {
    const user = users[index];
  
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.dataset.currentIndex = index;
    const modal = `
      <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
          <img class="modal-img" src="${user.picture.large}" alt="Profile Picture">
          <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
          <p class="modal-text">${user.email}</p>
          <p class="modal-text cap">${user.location.city}</p>
          <hr>
          <p class="modal-text">${formatPhoneNumber(user.cell)}</p>
          <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.state} ${user.location.postcode}</p>
          <p class="modal-text">Birthday: ${formatDate(user.dob.date)}</p>
        </div>
      </div>
    `;
    modalContainer.innerHTML = modal;
    document.body.appendChild(modalContainer);
  
    // Add event listener to the close button to close the modal window
    const closeButton = modalContainer.querySelector('#modal-close-btn');
    closeButton.addEventListener('click', () => document.body.removeChild(modalContainer));
  }
  
  // Function to handle search input
  function handleSearchInput(users) {
    const searchInput = document.getElementById('search-input');
    const gallery = document.getElementById('gallery');
  
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.trim();
      const filteredUsers = filterUsersByName(users, searchTerm);
      gallery.innerHTML = '';
      displayUsers(filteredUsers);
    });
  }

  // Fetch random users and display them in the DOM
  fetchRandomUsers().then((users) => {
    displayUsers(users);
    handleSearchInput(users);
  });
  