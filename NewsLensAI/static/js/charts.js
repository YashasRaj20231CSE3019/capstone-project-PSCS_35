// 360° News Feedback Platform - Charts and Visualizations

/**
 * Initialize story-specific charts for feedback visualization
 */
function initializeStoryCharts(storyId) {
    // Fetch chart data via API endpoint
    fetch(`/api/story/${storyId}/chart-data`)
        .then(response => response.json())
        .then(data => {
            createRatingsChart(data.ratings);
            createSentimentChart(data.sentiment_distribution);
        })
        .catch(error => {
            console.error('Error loading chart data:', error);
            showChartError();
        });
}

/**
 * Create ratings radar chart for story feedback
 */
function createRatingsChart(ratingsData) {
    const ctx = document.getElementById('ratingsChart');
    if (!ctx) return;

    const data = {
        labels: [
            'Accuracy',
            'Bias Balance', 
            'Relevance',
            'Local Impact'
        ],
        datasets: [{
            label: 'Average Ratings',
            data: [
                ratingsData.accuracy || 0,
                ratingsData.bias || 0,
                ratingsData.relevance || 0,
                ratingsData.local_impact || 0
            ],
            backgroundColor: 'rgba(13, 110, 253, 0.2)',
            borderColor: 'rgba(13, 110, 253, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(13, 110, 253, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(13, 110, 253, 1)',
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };

    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Feedback Ratings Overview',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 5,
                    min: 0,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                }
            },
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    };

    new Chart(ctx, config);
}

/**
 * Create sentiment distribution doughnut chart
 */
function createSentimentChart(sentimentData) {
    const ctx = document.getElementById('sentimentChart');
    if (!ctx) return;

    const data = {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
            data: [
                sentimentData.positive || 0,
                sentimentData.neutral || 0,
                sentimentData.negative || 0
            ],
            backgroundColor: [
                'rgba(25, 135, 84, 0.8)',   // Success green for positive
                'rgba(108, 117, 125, 0.8)',  // Secondary gray for neutral
                'rgba(220, 53, 69, 0.8)'     // Danger red for negative
            ],
            borderColor: [
                'rgba(25, 135, 84, 1)',
                'rgba(108, 117, 125, 1)',
                'rgba(220, 53, 69, 1)'
            ],
            borderWidth: 2,
            hoverOffset: 10
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Community Sentiment',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    return {
                                        text: `${label}: ${value}`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor[i],
                                        lineWidth: data.datasets[0].borderWidth,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '50%',
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    };

    new Chart(ctx, config);
}

/**
 * Initialize category statistics chart for dashboard
 */
function initializeCategoryChart(categoryData) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const labels = categoryData.map(item => item.label);
    const storyData = categoryData.map(item => item.stories);
    const feedbackData = categoryData.map(item => item.feedback);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Stories',
                data: storyData,
                backgroundColor: 'rgba(13, 110, 253, 0.8)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            },
            {
                label: 'Feedback',
                data: feedbackData,
                backgroundColor: 'rgba(25, 135, 84, 0.8)',
                borderColor: 'rgba(25, 135, 84, 1)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            }
        ]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Content Distribution by Category',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        },
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Categories',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0,
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    display: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    };

    new Chart(ctx, config);
}

/**
 * Initialize region statistics chart for dashboard
 */
function initializeRegionChart(regionData) {
    const ctx = document.getElementById('regionChart');
    if (!ctx) return;

    const labels = regionData.map(item => item.label);
    const storyData = regionData.map(item => item.stories);
    const feedbackData = regionData.map(item => item.feedback);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Stories',
                data: storyData,
                backgroundColor: 'rgba(255, 193, 7, 0.8)',
                borderColor: 'rgba(255, 193, 7, 1)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            },
            {
                label: 'Feedback',
                data: feedbackData,
                backgroundColor: 'rgba(13, 202, 240, 0.8)',
                borderColor: 'rgba(13, 202, 240, 1)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            }
        ]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Horizontal bar chart
            plugins: {
                title: {
                    display: true,
                    text: 'Content Distribution by Region',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        },
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.x;
                            return `${label}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Regions',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'y',
                intersect: false
            }
        }
    };

    new Chart(ctx, config);
}

/**
 * Create a trend line chart for feedback over time
 */
function createFeedbackTrendChart(trendData, canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const data = {
        labels: trendData.labels,
        datasets: [{
            label: 'Feedback Count',
            data: trendData.values,
            borderColor: 'rgba(13, 110, 253, 1)',
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(13, 110, 253, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Feedback Trends Over Time',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time Period',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    display: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Feedback Count',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    };

    new Chart(ctx, config);
}

/**
 * Show error message when chart data fails to load
 */
function showChartError() {
    const chartContainers = document.querySelectorAll('.charts-container canvas');
    chartContainers.forEach(canvas => {
        const container = canvas.parentElement;
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-exclamation-triangle fa-2x text-warning mb-3"></i>
                <p class="text-muted">Unable to load chart data</p>
                <button class="btn btn-sm btn-outline-primary" onclick="location.reload()">
                    <i class="fas fa-refresh me-1"></i>Retry
                </button>
            </div>
        `;
    });
}

/**
 * Create animated counter for statistics
 */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

/**
 * Initialize all dashboard counters with animation
 */
function initializeDashboardCounters() {
    const counters = document.querySelectorAll('.card h3');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        if (!isNaN(target)) {
            counter.textContent = '0';
            animateCounter(counter, target);
        }
    });
}

/**
 * Export chart data as image
 */
function exportChart(chartId, filename = 'chart.png') {
    const canvas = document.getElementById(chartId);
    if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
    }
}

/**
 * Toggle chart animation
 */
function toggleChartAnimation(chart) {
    chart.options.animation = chart.options.animation ? false : { duration: 1000 };
    chart.update();
}

/**
 * Resize all charts when window resizes
 */
window.addEventListener('resize', debounce(() => {
    Chart.helpers.each(Chart.instances, (instance) => {
        instance.resize();
    });
}, 300));

// Initialize dashboard counters when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add small delay for visual effect
    setTimeout(initializeDashboardCounters, 500);
});

// Export functions for global use
window.ChartUtils = {
    initializeStoryCharts,
    initializeCategoryChart,
    initializeRegionChart,
    createFeedbackTrendChart,
    exportChart,
    toggleChartAnimation,
    animateCounter
};
