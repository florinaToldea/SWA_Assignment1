const data = {
  type: "temperature",
  time: "2019-07-30T10:07:00.000Z",
  place: "Aarhus",
  value: 21,
  unit: "C",
};

fetch("http://localhost:8080/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
