$(document).ready(function() {
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
        const circleItem = `<div class="notification-item"><h3>${name}</h3><p>Next Contribution: $${amount}</p></div>`;
        circleList.append(circleItem);
        $('#select-circle').append(`<option value="${name}" data-amount="${amount}">${name}</option>`);
    }

    function showNotification(message) {
        const notificationList = $('#notificationList');
        const notificationItem = `<p class="notification-item">${message}</p>`;
        notificationList.append(notificationItem);
    }

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
