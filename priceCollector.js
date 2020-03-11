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

  for (let i = 1; i <= 200; i++) {
    let date = (new Date(Date.now() - 864e5 * i)).toLocaleDateString(void 0, { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const html = await fetch('https://tygiadola.com/LichSuGiaVang?date=' + date);
    const div = document.createElement('div');
    div.innerHTML = await html.text();
    const tr = [...div.querySelectorAll('table tr')].filter(tr => {
      const td = tr.querySelector('td');
      if (td) {return td.innerText.trim() === 'SJC HCM 1-10L'; }
      return false;
    })[0];
    if (tr) {
      let [buy, sell] = [...tr.querySelectorAll('td')]
        .map(td => +td.innerText.trim().slice(0, 6).replace(',', '.')).slice(1);
      date = date.slice(0, 6) + date.slice(8);
      priceData.unshift({ date, buy, sell });
      chart.data.labels.unshift(date);
      chart.data.datasets[0].data.unshift(buy);
      chart.data.datasets[1].data.unshift(sell);
      chart.update();
    }
  }
})();
