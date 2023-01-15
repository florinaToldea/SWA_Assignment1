//Getting data with fetch.

const data = {};
const forecast = {};

await fetch(`http://localhost:8080/data/${city}`)
  .then((response) => {
    data = response.json();
  })
  .catch((error) => {
    console.log(error);
  });

await fetch(`http://localhost:8080/forecast/${city}`)
  .then((response) => {
    forecast = response.json();
  })
  .catch((error) => {
    console.log(error);
  });
