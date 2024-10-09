$(document).ready(function() {
    $('#create-circle-form').on('submit', function(event) {
        event.preventDefault();
        
        const circleName = $('#circle-name').val();
        const contributionAmount = $('#contribution-amount').val();

        // Add circle and show notification
        addCircle(circleName, contributionAmount);
        showNotification(`Created circle: ${circleName} with a contribution of $${contributionAmount}`);
        
        // Clear form inputs
        $(this).trigger("reset");
    });

    function addCircle(name, amount) {
        const circleList = $('#circleList');
        const circleItem = `<div class="notification-item"><h3>${name}</h3><p>Next Contribution: $${amount}</p></div>`;
        circleList.append(circleItem);
    }

    function showNotification(message) {
        const notificationList = $('#notificationList');
        const notificationItem = `<p class="notification-item">${message}</p>`;
        notificationList.append(notificationItem);
    }

    // Sample Contribution Chart Data
    const ctx = document.getElementById('contributionChart').getContext('2d');
    const contributionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'Monthly Contributions',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 2,
                fill: false,
                backgroundColor: 'rgba(40, 167, 69, 0.2)',
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e9ecef',
                    }
                },
                x: {
                    grid: {
                        color: '#e9ecef',
                    }
                }
            }
        }
    });

    // Dark mode toggle
    $('#toggle-dark-mode').on('click', function() {
        $('body').toggleClass('dark-mode');
        const modeText = $('body').hasClass('dark-mode') ? 'Light Mode' : 'Dark Mode';
        $(this).text(modeText);
        
        // Update chart colors for dark mode
        updateChartColors();
    });

    function updateChartColors() {
        const chart = Chart.getChart('contributionChart'); // Get the chart instance
        if ($('body').hasClass('dark-mode')) {
            chart.data.datasets[0].borderColor = 'rgba(255, 255, 255, 1)'; // White line for dark mode
            chart.options.scales.y.grid.color = '#CCCCCC'; // Darker grid color
            chart.options.scales.x.grid.color = '#CCCCCC'; // Darker grid color
        } else {
            chart.data.datasets[0].borderColor = 'rgba(40, 167, 69, 1)'; // Original line color
            chart.options.scales.y.grid.color = '#CCCCCC'; // Original grid color
            chart.options.scales.x.grid.color = '#CCCCCC'; // Original grid color
        }
        chart.update(); // Update the chart to apply changes
    }
});
