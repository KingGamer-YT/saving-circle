$(document).ready(function() {
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

    // Handle circle creation
    $('#create-circle-form').on('submit', function(event) {
        event.preventDefault();
        
        const circleName = $('#circle-name').val();
        const contributionAmount = $('#contribution-amount').val();

        addCircle(circleName, contributionAmount);
        showNotification(`Created circle: ${circleName} with a contribution of $${contributionAmount}`);
        
        $(this).trigger("reset");
    });

    // Handle logging contributions
    $('#log-contribution-form').on('submit', function(event) {
        event.preventDefault();

        const selectedCircle = $('#select-circle').val();
        const logAmount = parseFloat($('#log-amount').val());
        const expectedAmount = parseFloat($('#select-circle option:selected').data('amount'));

        if (logAmount !== expectedAmount) {
            alert(`Error: The contribution amount must be exactly $${expectedAmount}.`);
            return;
        }

        $('#log-message').text(`You have logged a contribution of $${logAmount} to ${selectedCircle}.`);
        showNotification(`Logged contribution of $${logAmount} to ${selectedCircle}.`);

        $(this).trigger("reset");
    });

    function addCircle(name, amount) {
        const circleList = $('#circleList');
        const circleItem = `<div class="notification-item fade-in-from-below"><h3>${name}</h3><p>Next Contribution: $${amount}</p></div>`;
        circleList.append(circleItem);
        
        // Triggering the show effect for the newly added item
        setTimeout(() => {
            circleList.children().last().addClass('show-from-below');
        }, 50); // Delay to allow the fade-in effect to start
    }

    function showNotification(message) {
        const notificationList = $('#notificationList');
        const notificationItem = `<p class="notification-item fade-in-from-below">${message}</p>`;
        notificationList.append(notificationItem);
        
        // Triggering the show effect for the newly added notification
        setTimeout(() => {
            notificationList.children().last().addClass('show-from-below');
        }, 50); // Delay to allow the fade-in effect to start
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
});
