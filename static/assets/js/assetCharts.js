//GLOBAL VARIABLES

//charts scripts

//tempreturn line chart
var ctxTEMPLINE=document.getElementById('tempretureLineChart').getContext('2d');
ctxTEMPLINE.canvas.height = 80;
const gradient = ctxTEMPLINE.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(141,196,237,0.75)');
      gradient.addColorStop(0.2, 'rgba(141,196,237,0.5)');
      gradient.addColorStop(1, 'rgba(141,196,237,0)');
var tempretureLineChart=new Chart(ctxTEMPLINE, {
    type: 'line', data: {
        labels: [],
        datasets: [ {
            label: 'TEMPRETURE',
            data: [],
            backgroundColor: gradient,
            borderColor: 'RGBA(141,196,237,1)',
            pointBackgroundColor: 'white',//'RGBA(102,148,217,0.75)',
            borderWidth: '2.5',
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
});


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
            backgroundColor: 'RGBA(141,196,237,1)',
            borderColor: 'RGBA(141,196,237,1)',
            pointBackgroundColor: 'white',//'RGBA(102,148,217,0.75)',
            borderWidth: '2.5',
        },
        {
            label: 'Y',
            fill: false,
            data: [],
            backgroundColor: 'RGBA(151,251,226,1)',
            borderColor: 'RGBA(151,251,226,1)',
            pointBackgroundColor: 'white',
            borderWidth: '2.5',
          },
          {
              label: 'Z',
              fill: false,
              data: [],
              backgroundColor: 'RGBA(161,164,229,1)',
              borderColor: 'RGBA(161,164,229,1)',
              pointBackgroundColor: 'white',
              borderWidth: '2.5',
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
