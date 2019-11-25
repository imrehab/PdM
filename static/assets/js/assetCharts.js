//charts scripts
var chart=JSC.chart('GaugeChart', {
    debug: true, type: 'gauge ', legend_visible: false, chartArea_boxVisible: false, xAxis: {
        /*Used to position marker on top of axis line.*/
        scale: {
            range: [0, 1], invert: true
        }
    }
    , palette: {
        pointValue: '%yValue', ranges: [ {
            value: [70, 0], color: '#FF5353'
        }
        , {
            value: [85, 70], color: '#FFD221'
        }
        , {
            value: [95, 85], color: '#77E6B4'
        }
        , {
            value: [95, 100], color: '#21D683'
        }
        ]
    }
    , yAxis: {
        defaultTick: {
            padding: 13, enabled: false
        }
        , customTicks: [70, 85, 95], line: {
            width: 15, breaks_gap: 0.03, color: 'smartPalette'
        }
        , scale: {
            range: [0, 100]
        }
    }
    , defaultSeries: {
        shape: {
            label: {
                align: 'center', verticalAlign: 'middle'
            }
        }
    }
    , series: [ {
        type: 'marker', name: 'Score', shape_label: {
            text: '<span style=\'fontSize: 32; color: #21D683\'>98%</span> <span style=\'fontSize: 28; color: #21D683\'>HEALTHY</span>', style: {
                fontSize: 48
            }
        }
        , defaultPoint: {
            tooltip: '%yValue', marker: {
                outline: {
                    width: 2, color: 'white'
                }
                , type: 'circle', visible: true, size: 36
            }
        }
        , points: [ [1, 98]]
    }
    ]
}

);
//tempreturn line chart
var ctxTEMPLINE=document.getElementById('tempretureLineChart').getContext('2d');
ctxTEMPLINE.canvas.height = 80;
var tempretureLineChart=new Chart(ctxTEMPLINE, {
    type: 'line', data: {
        labels: [],
        datasets: [ {
            label: 'TEMPRETURE',
            data: [],
            backgroundColor: 'RGBA(102,148,217,0.25)',
            borderColor: 'RGBA(102,148,217,0.5)',
        }
        ]
    }
    ,
    responsive: true,
    maintainAspectRatio: false,
    options: {
        layout: {
        //    padding: 10
        }
        , scales: {
            yAxes: [ {
                ticks: {
                    beginAtZero: false
                }
            }
          ],
            xAxes: [ {
                ticks: {
                    beginAtZero: false
                }
            }
            ]
        }
    }
}

);
//motion line chart
var ctxMOTIONLINE=document.getElementById('motionLineChart').getContext('2d');
ctxMOTIONLINE.canvas.height = 80;
var motionLineChart=new Chart(ctxMOTIONLINE, {
    type: 'line', data: {
        labels: [],
        datasets: [ {
            label: 'X',
            fill: false,
            data: [],
            backgroundColor: 'RGBA(102,148,217,0.75)',
            borderColor: 'RGBA(102,148,217,0.75)',
        },
        {
            label: 'Y',
            fill: false,
            data: [],
            backgroundColor: 'RGBA(255,101,80,0.75)',
            borderColor: 'RGBA(255,101,80,0.75)',
          },
          {
              label: 'Z',
              fill: false,
              data: [],
              backgroundColor: 'RGBA(102,222,119,0.75)',
              borderColor: 'RGBA(102,222,119,0.75)',
            },
        ]
    }
    ,
    responsive: true,
    maintainAspectRatio: false,
    options: {
        layout: {
      //      padding: 10
        }
        , scales: {
            yAxes: [ {
                ticks: {
                    beginAtZero: false
                }
            }
          ],
            xAxes: [ {
                ticks: {
                    beginAtZero: false
                }
            }
            ]
        }
    }
}

);
//doughnut chart
var ctxDOUGHNUT=document.getElementById('DoughnutChart').getContext('2d');
var doughnutChart=new Chart(ctxDOUGHNUT, {
    type: 'doughnut', data: {
        labels: ['LOW', 'MEDIUM', 'HIGH'], datasets: [ {
            label: 'EVENT STATISTICS',
             data: [],
              backgroundColor: [ 'RGBA(250,234,12,0.75)', 'RGBA(253,183,5,0.75)', 'RGBA(233,89,16,0.75)'],
        }
        ],
    }
    , options: {
        layout: {
        //    padding: 20
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: "#333",
            fontSize: 10
          }
        },
      }
});
