const apiKey = "xAu76xdVAeovj9TpNmiq";
const div = document.querySelector("div");
const promiseArray = [];
const submit = document.getElementById("streetName")
submit.addEventListener("submit", function(e) {
  const name =  document.getElementById("name").value
  e.preventDefault();
  
  fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}&name=${name}`)
  .then(function(res) {
    return res.json() })
  .then(function(data) {
    fetch(`https://api.winnipegtransit.com/v3/stops.json?api-key=${apiKey}&street=${data.streets[0].key}`)
    .then(function (response) {
      return response.json() 
    })
  .then(function(data) {
    data.stops.forEach(function(element) {
      promiseArray.push(fetch(`https://api.winnipegtransit.com/v3/stops/${element.key}/schedule.json?api-key=${apiKey}&max-results-per-route=2`)
      .then(function(responses) {
        return responses.json()
      }));
    });
  });
});
console.log(promiseArray)
Promise.all(promiseArray)
.then(function(schedule) {
  schedule.forEach(function(pro) {
    div.insertAdjacentHTML("beforeend", 
    `<h2>Name :${pro['stop-schedule']['stop']['name']}</h2>
    <p>Stop-Number: ${pro['stop-schedule']['stop']['key']}</p>
    <p>Direction:${pro['stop-schedule']['stop']['direction']}</p>
    <p>Cross-street:${pro['stop-schedule']['stop']['cross-street']['name']}</p>
    `);
    for(i = 0; i < pro['stop-schedule']['route-schedules'].length; i++) {
      if(pro['stop-schedule']['route-schedules'].length === 0) {
        div.insertAdjacentHTML("beforeend",  `<h3><b>Sorry No Bus Service</b></h3>`)
      } else {
        div.insertAdjacentHTML("beforeend", `<p>Route-number:${pro['stop-schedule']['route-schedules'][i]['route']['number']}</p>
        <p>${pro["stop-schedule"]['route-schedules'][i] ['scheduled-stops'][0]['times']['arrival']['scheduled']}</p>
        <p>${pro["stop-schedule"]['route-schedules'][i] ['scheduled-stops'][1]['times']['arrival']['scheduled']}</p>`)
          
        };
      };
    });
  });
})