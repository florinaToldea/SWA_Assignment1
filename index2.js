// POST: In addition, you must make a page to allow sending weather data to the server.
const sendingData = () => {
    const sendText = document.getElementById("temperatureValueSend").value;
    const jsonParse = JSON.parse(sendText);
    const jsonText = JSON.stringify(jsonParse);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/data');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = () => {
        console.log(xhr.responseText);
    };
    xhr.onerror = () => {
        console.log("An error has occured.");
    }
    xhr.send(jsonText);
}