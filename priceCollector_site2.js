const priceData = [];

(async () => {
  document.body.innerHTML = '';
  document.body.style.margin = 0;
  const script = document.createElement('script');
  await new Promise(resolve => {
    script.onload = resolve;
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js';
    document.body.appendChild(script);
  });

  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Mua vào',
          backgroundColor: 'rgba(41, 128, 185, 0.2)',
          borderColor: 'rgb(41, 128, 185)'
        },
        {
          label: 'Bán ra',
          backgroundColor: 'rgba(142, 68, 173, 0.2)',
          borderColor: 'rgb(142, 68, 173)'
        }
      ]
    },
    options: {
      responsive: false,
      title: { display: true, text: 'Lịch sử giá vàng' },
      scales: {
        xAxes: [{
          scaleLabel: { display: true, labelString: 'Ngày' }
        }],
        yAxes: [{
          scaleLabel: { display: true, labelString: 'Giá' },
          ticks: { callback: value => value + ',000' }
        }]
      },
      elements: {
        point: { radius: 2 }
      },
    }
  });

  for (let i = 0; i <= 1000; i++) {
    let date = (new Date(Date.now() - 864e5 * i)).toLocaleDateString('zh-Hans-CN', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const html = await fetch('https://giavangonline.com/goldhistory.php?date=' + date);
    const div = document.createElement('div');
    div.innerHTML = await html.text();
    if (div.querySelector('#sjcexchange table td:nth-of-type(2)') !== null) {
      const [buy, sell] = div.querySelector('#sjcexchange table td:nth-of-type(2)').innerText.split(' / ').map(p => +p.replace(/,/g, ''));
      date = date.slice(0, 6) + date.slice(8);
      priceData.unshift({ date, buy, sell });
      chart.data.labels.unshift(date);
      chart.data.datasets[0].data.unshift(buy);
      chart.data.datasets[1].data.unshift(sell);
      chart.update();
    }
  }
})();
