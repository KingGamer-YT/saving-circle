$(document).ready(function() {
    // Initialize an empty array to hold circle data
    let circles = [];
    const userId = localStorage.getItem('loggedInUser');

    function checkLoginStatus() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            window.location.href = "index.html"; // Redirect to login page if not logged in
        }
    }

    window.onload = checkLoginStatus;

    function loadCirclesFromLocalStorage() {
        const storedCircles = localStorage.getItem(`circles_${userId}`);
        if (storedCircles) {
            circles = JSON.parse(storedCircles);
            populateCircleDropdown();
            renderCircles(); // Ensure circles are rendered on load
        }
    }

    function saveCirclesToLocalStorage() {
        localStorage.setItem(`circles_${userId}`, JSON.stringify(circles));
    }

    function populateCircleDropdown() {
        const selectCircle = $('#select-circle');
        selectCircle.empty();
        const defaultOption = $('<option>').val('').text('Select a circle');
        selectCircle.append(defaultOption);
        circles.forEach(circle => {
            const option = $('<option>').val(circle.id).data('goal', circle.goal).text(circle.name);
            selectCircle.append(option);
        });
    }

    function renderCircles() {
        const circleList = $('#circleList');
        circleList.empty(); // Clear existing list
    
        if (circles.length === 0) {
            const row = $('<tr>').append(
                $('<td>')
                    .attr('colspan', 5) // Adjust colspan to match the number of columns
                    .addClass('text-center no-circles-message') // Add class for styling
                    .text('No circles Created yet.')
            );
            circleList.append(row);
        } else {
            circles.forEach(circle => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${circle.name}</td>
                    <td>$${circle.goal}</td> <!-- Changed to show goal instead of total contributed -->
                    <td>${circle.numberOfPeople}</td>
                    <td>${circle.frequency}</td>
                    <td>
                        <div class="dropdown">
                            <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Actions
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item edit-circle" href="#" data-id="${circle.id}">Edit</a>
                                <a class="dropdown-item manage-circle" href="#" data-id="${circle.id}">Manage</a>
                                <a class="dropdown-item delete-circle" href="#" data-id="${circle.id}">Delete</a>
                            </div>
                        </div>
                    </td>
                `;
                circleList.append(row);
            });
        }    

        // Add delete functionality
        circleList.find('.delete-circle').off('click').on('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            const circleId = $(this).data('id');
            circles = circles.filter(circle => circle.id !== circleId);
            saveCirclesToLocalStorage();
            showNotification(`Deleted circle with ID: ${circleId}.`);
            renderCircles(); // Re-render the list after deletion
        });

        // Add edit functionality
        $('#circleList').on('click', '.edit-circle', function(event) {
            event.preventDefault();
            const circleId = $(this).data('id');
            const circleToEdit = circles.find(circle => circle.id === circleId);
            if (circleToEdit) {
                // Pre-fill the edit form with circle data
                $('#edit-circle-name').val(circleToEdit.name);
                $('#edit-contribution-amount').val(circleToEdit.goal); // Change to reflect goal
                $('#edit-number-of-people').val(circleToEdit.numberOfPeople);
                $('#edit-payment-frequency').val(circleToEdit.frequency);
                $('#edit-circle-id').val(circleId); // Store the circle ID for submission
                $('#editCircleModal').modal('show'); // Show the edit modal
            }
        });

        // Handle form submission for editing a circle
        $('#edit-circle-form').on('submit', function(event) {
            event.preventDefault();
            const circleId = parseInt($('#edit-circle-id').val(), 10);
            const updatedName = $('#edit-circle-name').val();
            const updatedGoal = parseFloat($('#edit-contribution-amount').val());
            const updatedPeople = parseInt($('#edit-number-of-people').val(), 10);
            const updatedFrequency = $('#edit-payment-frequency').val();

            // Find the circle and update its data
            const circleToUpdate = circles.find(circle => circle.id === circleId);
            if (circleToUpdate) {
                circleToUpdate.name = updatedName;
                circleToUpdate.goal = updatedGoal; // Change goal property
                circleToUpdate.numberOfPeople = updatedPeople;
                circleToUpdate.frequency = updatedFrequency;

                // Save updated circles to localStorage and re-render the circles
                saveCirclesToLocalStorage();
                renderCircles();
                showNotification(`Updated circle: ${updatedName}.`);

                // Hide the modal after saving
                $('#editCircleModal').modal('hide');
            }
        });

        // Update manage-circle click function
        circleList.find('.manage-circle').off('click').on('click', function(event) {
            event.preventDefault();
            const circleId = $(this).data('id'); // Get the circle ID
            // Navigate to the analytics page with circle ID in URL
            window.location.href = `analytics.html?circleId=${circleId}`;
        });
    }

    function showNotification(message) {
        const notificationList = $('#notificationList');
        const notificationItem = `<p class="notification-item fade-in-from-below">${message}</p>`;
        notificationList.empty();
        notificationList.append(notificationItem);
        setTimeout(() => {
            notificationList.children().last().addClass('show-from-below');
        }, 50);
    }

    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });

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

    $('#create-circle-form').on('submit', function(event) {
        event.preventDefault();
        const circleName = $('#circle-name').val();
        const goalAmount = parseFloat($('#contribution-amount').val()); // Change to reflect goal
        const numberOfPeople = parseInt($('#number-of-people').val(), 10);
        const frequency = $('#payment-frequency').val();

        if (isNaN(numberOfPeople) || numberOfPeople <= 0) {
            alert("Please enter a valid number of people.");
            return;
        }

        const newCircle = {
            id: circles.length + 1,
            name: circleName,
            goal: goalAmount, // Change to reflect goal
            contributions: [],
            totalContributed: 0, // Reset total contributed for new circles
            numberOfPeople: numberOfPeople,
            frequency: frequency
        };

        circles.push(newCircle);
        saveCirclesToLocalStorage();
        showNotification(`Created circle: ${circleName} with a goal of $${goalAmount} and ${numberOfPeople} people with frequency ${frequency}`);

        $(this).trigger("reset");
        populateCircleDropdown();
        renderCircles(); // Re-render circles to display the new one

        // Close the modal after creating the circle
        $('#createCircleModal').modal('hide'); // Adjust the modal ID as necessary
    });

    $('#log-contribution-form').on('submit', function(event) {
        event.preventDefault();
        const selectedCircleId = $('#select-circle').val();
        const logAmount = parseFloat($('#log-amount').val());
        
        const selectedCircle = circles.find(circle => circle.id == selectedCircleId);
        if (!selectedCircle) {
            alert('Please select a valid circle.');
            return;
        }

        if (logAmount <= 0) {
            alert('Error: The contribution amount must be a positive number.');
            return;
        }

        selectedCircle.totalContributed += logAmount;
        $('#log-message').text(`You have logged a contribution of $${logAmount} to ${selectedCircle.name}.`).show();

        updateCircleContribution(selectedCircle.id, selectedCircle.totalContributed);
        saveCirclesToLocalStorage();

        showNotification(`Logged contribution of $${logAmount} to ${selectedCircle.name}.`);

        $(this).trigger("reset");
    });

    function updateCircleContribution(circleId, total) {
        const circleList = $('#circleList');
        const circleRow = circleList.find(`button[data-id="${circleId}"]`).closest('tr');
        circleRow.find('td:nth-child(2)').text(`$${total}`); // Update to show total contributions
    }

    loadCirclesFromLocalStorage();
});
