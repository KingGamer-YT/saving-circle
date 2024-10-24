$(document).ready(function() {
    // Initialize an empty array to hold circle data
    let circles = [];
    // Get the logged-in user's ID from localStorage
    const userId = localStorage.getItem('loggedInUser');

    // Function to load circles from localStorage
    function loadCirclesFromLocalStorage() {
        const storedCircles = localStorage.getItem(`circles_${userId}`);
        if (storedCircles) {
            circles = JSON.parse(storedCircles);
            populateCircleDropdown();
            circles.forEach(circle => {
                addCircle(circle.name, circle.totalContributed, circle.numberOfPeople, circle.frequency);
            });
        }
    }

    // Event listener for logout button
    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('loggedInUser'); // Remove user session
        window.location.href = 'index.html'; // Redirect to login page
    });

    // Function to check login status
    function checkLoginStatus() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            window.location.href = "index.html"; // Redirect to login page if not logged in
        }
    }

    // Check login status on page load
    window.onload = checkLoginStatus;

    // Function to save circles to localStorage
    function saveCirclesToLocalStorage() {
        localStorage.setItem(`circles_${userId}`, JSON.stringify(circles));
    }

    // Add fade-in animations to elements
    $('#header').addClass('fade-in-from-above');
    setTimeout(function() {
        $('#header').addClass('show-from-above');
    }, 50);

    $('#someElement').addClass('fade-in-from-left');
    setTimeout(function() {
        $('#someElement').addClass('show-from-left');
    }, 100);

    $('#footer').addClass('fade-in-from-right');
    setTimeout(function() {
        $('#footer').addClass('show-from-right');
    }, 150);

    // Function to populate the circle dropdown menu
    function populateCircleDropdown() {
        const selectCircle = $('#select-circle');
        selectCircle.empty();

        const defaultOption = $('<option>').val('').text('Select a circle');
        selectCircle.append(defaultOption);

        circles.forEach(circle => {
            const option = $('<option>').val(circle.id).data('amount', circle.goal).text(circle.name);
            selectCircle.append(option);
        });
    }

    // Event listener for circle creation form submission
    $('#create-circle-form').on('submit', function(event) {
        event.preventDefault();

        const circleName = $('#circle-name').val();
        const contributionAmount = parseFloat($('#contribution-amount').val());
        const numberOfPeople = parseInt($('#number-of-people').val(), 10);
        const frequency = $('#payment-frequency').val();

        if (isNaN(numberOfPeople) || numberOfPeople <= 0) {
            alert("Please enter a valid number of people.");
            return;
        }

        const newCircle = {
            id: circles.length + 1,
            name: circleName,
            goal: contributionAmount,
            contributions: [],
            totalContributed: contributionAmount,
            numberOfPeople: numberOfPeople,
            frequency: frequency
        };

        circles.push(newCircle);
        saveCirclesToLocalStorage();
        addCircle(circleName, newCircle.totalContributed, numberOfPeople, frequency);
        showNotification(`Created circle: ${circleName} with a contribution goal of $${contributionAmount} and ${numberOfPeople} people with frequency ${frequency}`);
        
        $(this).trigger("reset");
        populateCircleDropdown();
    });

    // Event listener for logging contributions
    $('#log-contribution-form').on('submit', function(event) {
        event.preventDefault();

        const selectedCircleId = $('#select-circle').val();
        const logAmount = parseFloat($('#log-amount').val());
        
        const selectedCircle = circles.find(circle => circle.id == selectedCircleId);
        if (!selectedCircle) {
            alert('Please select a valid circle.');
            return;
        }

        if (logAmount !== selectedCircle.goal) {
            alert(`Error: The contribution amount must be exactly $${selectedCircle.goal}.`);
            return;
        }

        selectedCircle.totalContributed += logAmount;
        $('#log-message').text(`You have logged a contribution of $${logAmount} to ${selectedCircle.name}.`).show();

        updateCircleContribution(selectedCircle.id, selectedCircle.totalContributed, selectedCircle.numberOfPeople);
        saveCirclesToLocalStorage();

        showNotification(`Logged contribution of $${logAmount} to ${selectedCircle.name}.`);

        $(this).trigger("reset");
    });
    
    // Function to add a circle to the display list
    function addCircle(name, total, numberOfPeople, frequency) {
        const circleList = $('#circleList');
        const circleItem = `
            <div class="notification-item fade-in-from-below">
                <h3>${name} <i class="fa fa-trash delete-circle" aria-hidden="true" style="font-size: 12px; float: right; cursor: pointer;"></i></h3>
                <p>Total Contributions: $${total}</p>
                <p>Number of People: ${numberOfPeople}</p>
                <p>Payment Frequency: ${frequency}</p>
            </div>`;

        // Clear the list if it's the first item
        if (circleList.find('.notification-item').length === 0) {
            circleList.empty();
        }

        circleList.append(circleItem);
        setTimeout(() => {
            circleList.children().last().addClass('show-from-below');
        }, 50);

        // Check if no circles exist
        if (circleList.children().length === 0) {
            circleList.append('<p>No circles yet.</p>');
        }

        // Add delete functionality
        circleList.find('.delete-circle').off('click').on('click', function() {
            const circleName = $(this).closest('.notification-item').find('h3').text().trim();
            $(this).closest('.notification-item').remove();
            // Remove the circle from the circles array
            circles = circles.filter(circle => circle.name !== circleName);
            saveCirclesToLocalStorage();
            showNotification(`Deleted circle: ${circleName}.`);
        });
    }

    // Function to update circle contribution details
    function updateCircleContribution(circleId, total, numberOfPeople) {
        const circleItem = $('.notification-item').eq(circleId - 1);
        circleItem.find('p').eq(0).text(`Total Contributions: $${total}`);
        circleItem.find('p').eq(1).text(`Number of People: ${numberOfPeople}`);
    }

    // Function to show notifications
    function showNotification(message) {
        const notificationList = $('#notificationList');
        const notificationItem = `<p class="notification-item fade-in-from-below">${message}</p>`;

        // Clear the previous notifications before adding new
        notificationList.empty();
        
        notificationList.append(notificationItem);
        setTimeout(() => {
            notificationList.children().last().addClass('show-from-below');
        }, 50);

        if (notificationList.children().length === 0) {
            notificationList.append('<p>No notifications yet.</p>');
        }
    }

    // Chart.js data and configuration
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            label: 'Monthly Contributions',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: 'rgba(40, 167, 69, 1)',
            borderWidth: 2,
            fill: false,
            backgroundColor: 'rgba(40, 167, 69, 0.2)',
        }]
    };

    const ctx = document.getElementById('contributionChart').getContext('2d');
    const ctxAdvanced = document.getElementById('contributionChartAdvanced').getContext('2d');
    
    // Initialize charts
    let contributionChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    let contributionChartAdvanced = new Chart(ctxAdvanced, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Function to update charts data
    function updateCharts() {
        data.datasets[0].data = data.datasets[0].data.map(() => Math.floor(Math.random() * 20));
        contributionChart.update();
        contributionChartAdvanced.update();
    }

    // Update charts every second
    setInterval(updateCharts, 1000);

    // Toggle between layouts
    $('#toggle-layout').on('click', function() {
        $('#mainLayout').toggle();
        $('#advancedLayout').toggle();
    });

    // Toggle dark mode
    $('#toggle-dark-mode').on('click', function() {
        $('body').toggleClass('dark-mode');
    });

    // Load circles from localStorage on page load
    loadCirclesFromLocalStorage();
})