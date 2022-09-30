//    GET the weather for the next 24 hours in Horsens
const last24Hours = (city) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `http://localhost:8080/forecast/${city}`);
  xhr.onload = () => {
    const body = xhr.responseText;
    var textArea = document.getElementById("next24HoursOfWeather");
    jsonData = JSON.stringify(JSON.parse(body), null, 3);
    textArea.value = jsonData;
  };
  xhr.onerror = () => {
    console.log("An error has occured");
  };
  xhr.send();
};

// Minimum & Maximum temperature for the last day, using data.
const minAndMax = (city) => {
  const xhr1 = new XMLHttpRequest();
  xhr1.open("GET", `http://localhost:8080/data/${city}`);
  xhr1.onload = () => {
    const response = xhr1.responseText;
    const body1 = JSON.parse(response);
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
  };
  xhr1.onerror = () => {
    console.log("An error has occured.");
  };
  xhr1.send();
};

// Total precipitation for the last day.
const precipitationLastDay = (city) => {
  const xhr2 = new XMLHttpRequest();
  xhr2.open("GET", `http://localhost:8080/data/${city}`);
  xhr2.onload = () => {
    const response = xhr2.responseText;
    const body2 = JSON.parse(response);
    var summ = 0;
    const length = body2.length;

    for (let i = length - 1; i >= 0; i--) {
      if (body2[i].type === "preacipitation") {
        summ = summ + body2[i].value;
      }
    }
    document.getElementById("totalPrecipitation").innerText = summ;
  };
  xhr2.onerror = () => {
    console.log("An error has occured");
  };
  xhr2.send();
};

// Average wind speed for the last 24 hours.
const averageWind = (city) => {
  const xhr3 = new XMLHttpRequest();
  xhr3.open("GET", `http://localhost:8080/data/${city}`);
  xhr3.onload = () => {
    const response = xhr3.responseText;
    const body3 = JSON.parse(response);
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
    console.log(avgWindSpeed);
  };
  xhr3.onerror = () => {
    console.log("An error has occured.");
  };
  xhr3.send();
};

//	All data for the latest measurement of each kind
const latestMeasurements = (city) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `http://localhost:8080/data/${city}`);
  xhr.onload = () => {
    const response = xhr.responseText;
    const body = JSON.parse(response);
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
  };
  xhr.onerror = () => {
    console.log("An error has occured");
  };
  xhr.send();
};

// Dropdown for choosing the city.
const chooseCity = () => {
  var selectingCity = document.getElementById("cityDropdown").value;
  last24Hours(selectingCity);
  minAndMax(selectingCity);
  precipitationLastDay(selectingCity);
  averageWind(selectingCity);
  latestMeasurements(selectingCity);
};
