/* Greatness: career award selections across seven recorded categories. */
(function () {
  var labels = [
    ['A\u2019ja', 'Wilson'],
    ['Tina', 'Charles'],
    ['Tamika', 'Catchings'],
    ['Candace', 'Parker'],
    ['Breanna', 'Stewart'],
    ['Sylvia', 'Fowles'],
    ['Diana', 'Taurasi'],
    ['Elena', 'Delle Donne'],
    ['Lauren', 'Jackson'],
    ['Maya', 'Moore'],
    ['Angel', 'McCoughtry'],
    ['Nneka', 'Ogwumike'],
    ['Lisa', 'Leslie'],
    ['Brittney', 'Griner'],
    ['Alyssa', 'Thomas'],
    ['Jonquel', 'Jones'],
    ['Napheesa', 'Collier'],
    ['Cappie', 'Pondexter'],
    ['Sabrina', 'Ionescu'],
    ['Courtney', 'Vandersloot']
  ];

  var datasets = [
    {
      sortKey: 'mvp',
      label: 'MVP',
      data: [4, 1, 1, 2, 2, 1, 1, 2, 3, 1, 0, 1, 3, 0, 0, 1, 0, 0, 0, 0],
      backgroundColor: '#4e79a7'
    },
    {
      sortKey: 'all-wnba-first',
      label: 'All-WNBA First Team',
      data: [5, 5, 7, 7, 6, 3, 10, 4, 7, 5, 2, 1, 7, 3, 3, 1, 3, 3, 0, 2],
      backgroundColor: '#f28e2b'
    },
    {
      sortKey: 'all-defensive-first',
      label: 'All-Defensive First Team',
      data: [4, 1, 10, 0, 3, 8, 0, 0, 2, 0, 6, 4, 2, 3, 3, 2, 2, 1, 0, 0],
      backgroundColor: '#59a14f'
    },
    {
      sortKey: 'all-wnba-second',
      label: 'All-WNBA Second Team',
      data: [1, 4, 5, 3, 1, 5, 4, 1, 1, 2, 4, 7, 2, 3, 1, 4, 1, 1, 4, 3],
      backgroundColor: '#ffbe7d'
    },
    {
      sortKey: 'all-defensive-second',
      label: 'All-Defensive Second Team',
      data: [1, 3, 2, 2, 4, 3, 0, 0, 3, 2, 1, 3, 2, 4, 4, 2, 2, 0, 0, 0],
      backgroundColor: '#8cd17d'
    },
    {
      sortKey: 'player-month',
      label: 'Player of the Month',
      data: [15, 12, 3, 7, 7, 9, 4, 7, 3, 8, 4, 3, 0, 1, 4, 4, 4, 2, 5, 1],
      backgroundColor: '#499894'
    },
    {
      sortKey: 'player-week',
      label: 'Player of the Week',
      data: [30, 33, 22, 26, 20, 13, 21, 24, 19, 20, 16, 14, 14, 14, 12, 13, 9, 14, 10, 8],
      backgroundColor: '#f1ce63'
    }
  ];

  function baseTotalAt(index) {
    return datasets.reduce(function (sum, dataset) {
      return sum + dataset.data[index];
    }, 0);
  }

  function chartTotalAt(chart, index) {
    return chart.data.datasets.reduce(function (sum, dataset) {
      return sum + dataset.data[index];
    }, 0);
  }

  function displayName(label) {
    return Array.isArray(label) ? label.join(' ') : label;
  }

  function reorderChart(chart, sortKey) {
    var selectedDataset = datasets.find(function (dataset) {
      return dataset.sortKey === sortKey;
    });
    var order = labels.map(function (_, index) { return index; });

    order.sort(function (a, b) {
      var valueA = selectedDataset ? selectedDataset.data[a] : baseTotalAt(a);
      var valueB = selectedDataset ? selectedDataset.data[b] : baseTotalAt(b);
      return valueB - valueA || baseTotalAt(b) - baseTotalAt(a) || a - b;
    });

    chart.data.labels = order.map(function (index) { return labels[index]; });
    chart.data.datasets.forEach(function (chartDataset, datasetIndex) {
      chartDataset.data = order.map(function (index) {
        return datasets[datasetIndex].data[index];
      });
    });
    chart.update();

    document.querySelectorAll('[data-award-sort]').forEach(function (button) {
      var active = button.getAttribute('data-award-sort') === sortKey;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    var status = document.getElementById('award-sort-status');
    if (status) {
      status.textContent = sortKey === 'total'
        ? 'Players ordered by total selections.'
        : 'Players ordered by ' + selectedDataset.label + ' selections.';
    }
  }

  function connectSortControls(chart) {
    document.querySelectorAll('[data-award-sort]').forEach(function (button) {
      button.addEventListener('click', function () {
        reorderChart(chart, button.getAttribute('data-award-sort'));
      });
    });
  }

  var stackTotals = {
    id: 'careerAwardStackTotals',
    afterDatasetsDraw: function (chart) {
      var ctx = chart.ctx;
      var lastMeta = chart.getDatasetMeta(chart.data.datasets.length - 1);
      var horizontal = chart.options.indexAxis === 'y';

      ctx.save();
      ctx.fillStyle = '#111716';
      ctx.font = "700 11px 'Manrope', sans-serif";

      lastMeta.data.forEach(function (bar, index) {
        var total = chartTotalAt(chart, index);
        if (horizontal) {
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(total, chart.scales.x.getPixelForValue(total) + 7, bar.y);
        } else {
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(total, bar.x, chart.scales.y.getPixelForValue(total) - 7);
        }
      });

      ctx.restore();
    }
  };

  var awardSortControls = {
    id: 'awardSortControls',
    afterInit: function (chart) {
      connectSortControls(chart);
    }
  };

  lazyChart('careerAwardsChart', function () {
    var horizontal = window.innerWidth < 700;

    return {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets.map(function (dataset) {
          return Object.assign({
            stack: 'career-awards',
            borderColor: '#ffffff',
            borderWidth: 1,
            borderSkipped: false,
            barPercentage: horizontal ? 0.76 : 0.82,
            categoryPercentage: horizontal ? 0.82 : 0.86
          }, dataset);
        })
      },
      plugins: [stackTotals, awardSortControls],
      options: {
        indexAxis: horizontal ? 'y' : 'x',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: horizontal
            ? { right: 34, top: 4 }
            : { top: 24, right: 4, left: 4 }
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            grid: {
              display: horizontal,
              color: '#e6ebe9'
            },
            ticks: {
              color: '#596461',
              font: { size: horizontal ? 10 : 9, weight: '600' },
              maxRotation: 0,
              autoSkip: false
            },
            title: {
              display: horizontal,
              text: 'Recorded award selections',
              color: '#596461',
              font: { size: 11, weight: '700' }
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            suggestedMax: horizontal ? undefined : 66,
            grid: {
              display: !horizontal,
              color: '#e6ebe9'
            },
            ticks: {
              color: '#596461',
              stepSize: horizontal ? undefined : 10,
              font: { size: horizontal ? 10 : 10, weight: '600' }
            },
            title: {
              display: !horizontal,
              text: 'Recorded award selections',
              color: '#596461',
              font: { size: 11, weight: '700' }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function (items) {
                var label = items[0].label;
                return Array.isArray(label) ? label.join(' ') : label;
              },
              label: function (context) {
                return context.dataset.label + ': ' + context.parsed[
                  horizontal ? 'x' : 'y'
                ];
              },
              footer: function (items) {
                return 'Total selections: ' + chartTotalAt(
                  items[0].chart,
                  items[0].dataIndex
                );
              }
            }
          }
        }
      }
    };
  });
})();
