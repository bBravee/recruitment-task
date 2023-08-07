const form = document.getElementById('cityForm')
const submitButton = document.getElementById('submitButton')
const cityDropdown = document.getElementById('cities')

// Listener formluarza
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const cityName = cityDropdown.options[cityDropdown.selectedIndex].value;

    if (cityName === 'none') {
        alert('Invalid Input!');
    } else {
        console.log(`Input Value: ${cityName}`);
    }
})


// submitButton.addEventListener('click', formSubmitHandler());
// function formSubmitHandler() {

// }