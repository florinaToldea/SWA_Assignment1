//    GET the weather for the next 24 hours in Horsens
const next24Hours = (city) => {
  fetch(`http://localhost:8080/forecast/${city}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then((res) => res.json())
    .then((body) => {
      var textArea = document.getElementById("next24HoursOfWeather");
      textArea.value = body;
    })
    .catch((error) => console.log(error));
};

const minAndMax = (city) => {
  fetch(`http://localhost:8080/data/${city}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then((res) => res.json())
    .then((body1) => {
      const length = body1.length;
      var minim = body1[0].value;
      var maxim = body1[0].value;

      for (let i = length - 1; i >= 0; i--) {
        if (body1[i].type === "temperature") {
          if (body1[i].value < minim) {
            minim = body1[i].value;
          }
          if (body1[i].value > maxim) {
            maxim = body1[i].value;
          }
        }
      }
      document.getElementById("minTemp").innerText = minim;
      document.getElementById("maxTemp").innerText = maxim;
    });
};

const precipitationLastDay = (city) => {
  fetch(`http://localhost:8080/data/${city}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then((res) => res.json())
    .then((body2) => {
      var summ = 0;
      const length = body2.length;

      for (let i = length - 1; i >= 0; i--) {
        if (body2[i].type === "preacipitation") {
          summ = summ + body2[i].value;
        }
      }
      document.getElementById("totalPrecipitation").innerText = summ;
    });
};

const averageWind = (city) => {
  fetch(`http://localhost:8080/data/${city}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then((res) => res.json())
    .then((body3) => {
      const length = body3.length;
      let i = length - 1;
      let x = 0;
      let measureCount = 0;
      let dataSet = [];

      //24 measurements a day * 4 sets each
      while (i >= length - 96) {
        switch (body3[i].type) {
          case "temperature":
            dataSet[x] = { ...dataSet[x], temperature: body3[i] };
            measureCount++;
            break;
          case "wind speed":
            dataSet[x] = { ...dataSet[x], wind: body3[i] };
            measureCount++;
            break;
          case "precipitation":
            dataSet[x] = { ...dataSet[x], precipitation: body3[i] };
            measureCount++;
            break;
          case "cloud coverage":
            dataSet[x] = { ...dataSet[x], cloud: body3[i] };
            measureCount++;
            break;
        }

        if (measureCount === 4) {
          x++;
          measureCount = 0;
        }
        i--;
      }
      //latest measurements of each kind
      const latest = dataSet[dataSet.length - 1];
      console.log(latest);

      //returns an array of just wind speed values
      const windMeasurements = dataSet.map((item) => item.wind.value);
      const avgWindSpeed =
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
        windMeasurements.reduce((item, prev) => item + prev) / 24;
      document.getElementById("averagePrecip").innerText = avgWindSpeed;
    });
};

const latestMeasurements = (city) => {
  fetch(`http://localhost:8080/data/${city}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then((res) => res.json())
    .then((body) => {
      const length = body.length;
      let i = length - 1;
      let x = 0;
      let measureCount = 0;
      let dataSet = [];

      while (i >= length - 4) {
        switch (body[i].type) {
          case "temperature":
            dataSet[x] = { ...dataSet[x], temperature: body[i] };
            measureCount++;
            break;
          case "wind speed":
            dataSet[x] = { ...dataSet[x], wind: body[i] };
            measureCount++;
            break;

          case "precipitation":
            dataSet[x] = { ...dataSet[x], precipitation: body[i] };
            measureCount++;
            break;

          case "cloud coverage":
            dataSet[x] = { ...dataSet[x], cloud: body[i] };
            measureCount++;
            break;
        }

        if (measureCount == 4) {
          x++;
          measureCount = 0;
        }
        i--;
      }

      //latest measurements of each kind
      const latest = dataSet[dataSet.length - 1];

      document.getElementById(
        "latestMeasurementsOfEachKind"
      ).value = `${latest.wind.value} 
        ${latest.temperature.value} 
        ${latest.precipitation.value} 
        ${latest.cloud.value}`;
    });
};

// Dropdown for choosing the city.
const chooseCity = () => {
  var selectingCity = document.getElementById("cityDropdown").value;
  next24Hours(selectingCity);
  minAndMax(selectingCity);
  precipitationLastDay(selectingCity);
  averageWind(selectingCity);
  latestMeasurements(selectingCity);
};
