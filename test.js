$(document).ready(function() {
    // Sample data structure for circles
    let circles = [];
    const userId = 'user123'; // Replace this with actual user ID after login

    // Load circles from local storage if they exist
    function loadCirclesFromLocalStorage() {
        const storedCircles = localStorage.getItem(`circles_${userId}`);
        if (storedCircles) {
            circles = JSON.parse(storedCircles);
            populateCircleDropdown();
            circles.forEach(circle => {
                addCircle(circle.name, circle.totalContributed);
            });
        }
    }

    // Save circles to local storage
    function saveCirclesToLocalStorage() {
        localStorage.setItem(`circles_${userId}`, JSON.stringify(circles));
    }

    // Fade-in effect for specific elements
    $('#header').addClass('fade-in-from-above'); // Header fades in from above
    setTimeout(function() {
        $('#header').addClass('show-from-above'); // Show after delay
    }, 50);

    $('#someElement').addClass('fade-in-from-left'); // Specific element fades in from left
    setTimeout(function() {
        $('#someElement').addClass('show-from-left'); // Show after delay
    }, 100);

    // Example for footer fading in from the right
    $('#footer').addClass('fade-in-from-right'); // Footer fades in from right
    setTimeout(function() {
        $('#footer').addClass('show-from-right'); // Show after delay
    }, 150);

    // Populate the dropdown with circles
    function populateCircleDropdown() {
        const selectCircle = $('#select-circle');
        selectCircle.empty(); // Clear existing options

        // Create a default option
        const defaultOption = $('<option>').val('').text('Select a circle');
        selectCircle.append(defaultOption);

        // Populate the dropdown with circles
        circles.forEach(circle => {
            const option = $('<option>').val(circle.id).data('amount', circle.goal).text(circle.name);
            selectCircle.append(option);
        });
    }

    // Handle circle creation
    $('#create-circle-form').on('submit', function(event) {
        event.preventDefault();
        
        const circleName = $('#circle-name').val();
        const contributionAmount = parseFloat($('#contribution-amount').val());

        // Add the new circle to the circles array
        const newCircle = {
            id: circles.length + 1, // Simple ID assignment
            name: circleName,
            goal: contributionAmount,
            contributions: [],
            totalContributed: contributionAmount // Initialize with contribution amount
        };

        circles.push(newCircle); // Update the circles array
        saveCirclesToLocalStorage(); // Save to local storage

        addCircle(circleName, newCircle.totalContributed); // Pass the total contribution
        showNotification(`Created circle: ${circleName} with a contribution goal of $${contributionAmount}`);
        
        $(this).trigger("reset");
        populateCircleDropdown(); // Update dropdown after adding a circle
    });

    // Handle logging contributions
    $('#log-contribution-form').on('submit', function(event) {
        event.preventDefault();

        const selectedCircleId = $('#select-circle').val();
        const logAmount = parseFloat($('#log-amount').val());
        
        const selectedCircle = circles.find(circle => circle.id == selectedCircleId);
        if (!selectedCircle) {
            alert('Please select a valid circle.');
            return;
        }

        // Check if the logged amount matches the designated amount
        if (logAmount !== selectedCircle.goal) {
            alert(`Error: The contribution amount must be exactly $${selectedCircle.goal}.`);
            return;
        }

        // Update total contributed
        selectedCircle.totalContributed += logAmount;
        $('#log-message').text(`You have logged a contribution of $${logAmount} to ${selectedCircle.name}.`).show();

        // Update the displayed total contributions
        updateCircleContribution(selectedCircle.id, selectedCircle.totalContributed);
        saveCirclesToLocalStorage(); // Save to local storage

        showNotification(`Logged contribution of $${logAmount} to ${selectedCircle.name}.`);

        $(this).trigger("reset");
    });

    function addCircle(name, total) {
        const circleList = $('#circleList');
        const circleItem = `<div class="notification-item fade-in-from-below"><h3>${name}</h3><p>Total Contributions: $${total}</p></div>`;
        
        // Clear the "No circles yet" message if circles exist
        if (circleList.find('.notification-item').length === 0) {
            circleList.empty(); // Clear existing content to avoid duplicates
        }

        circleList.append(circleItem);
        // Triggering the show effect for the newly added item
        setTimeout(() => {
            circleList.children().last().addClass('show-from-below');
        }, 50); // Delay to allow the fade-in effect to start

        // Check if there are any circles to display
        if (circleList.children().length === 0) {
            circleList.append('<p>No circles yet.</p>'); // Show message if empty
        }
    }

    function updateCircleContribution(circleId, total) {
        // Update the displayed total contributions for the specific circle
        const circleItem = $('.notification-item').eq(circleId - 1);
        circleItem.find('p').text(`Total Contributions: $${total}`);
    }

    function showNotification(message) {
        const notificationList = $('#notificationList');
        const notificationItem = `<p class="notification-item fade-in-from-below">${message}</p>`;
        notificationList.append(notificationItem);
        
        // Check if notifications exist and clear the "No notifications" message
        if (notificationList.find('.notification-item').length === 1) {
            notificationList.empty(); // Clear existing content
        }
        
        notificationList.append(notificationItem);
        
        // Triggering the show effect for the newly added notification
        setTimeout(() => {
            notificationList.children().last().addClass('show-from-below');
        }, 50); // Delay to allow the fade-in effect to start

        // Check if there are any notifications to display
        if (notificationList.children().length === 0) {
            notificationList.append('<p>No notifications yet.</p>'); // Show message if empty
        }
    }

    // Sample data for charts
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

    function updateCharts() {
        // Generate random data for demonstration
        data.datasets[0].data = data.datasets[0].data.map(() => Math.floor(Math.random() * 20));
        
        contributionChart.update();
        contributionChartAdvanced.update();
    }

    // Sync the charts and update every second
    setInterval(updateCharts, 1000);

    // Toggle layout functionality
    $('#toggle-layout').on('click', function() {
        $('#mainLayout').toggle();
        $('#advancedLayout').toggle();
    });

    // Toggle dark mode functionality
    $('#toggle-dark-mode').on('click', function() {
        $('body').toggleClass('dark-mode');
    });

    // Load circles on page load
    loadCirclesFromLocalStorage();
});