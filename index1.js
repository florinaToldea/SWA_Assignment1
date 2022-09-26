        //    GET the weather for the next 24 hours in Horsens
           const xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://localhost:8080/forecast/Horsens')
            xhr.onload = () => {
                const body = xhr.responseText;
                document.getElementById("next24HoursOfWeather").value = body;
            } 
            xhr.onerror = () => {
                console.log("An error has occured");
            };
            xhr.send();
            console.log('cevaasdasd')

        // Minimum & Maximum temperature for the last day, using data.
            const xhr1 = new XMLHttpRequest();
            xhr1.open('GET', 'http://localhost:8080/data/Horsens');
            xhr1.onload = () => {
                const response = xhr1.responseText;
                const body1 =JSON.parse(response)
                console.log(body1)
                var minim = body1[0].value;
                var maxim = body1[0].value;
                 for(let i = 0; i< 96; i++)
                     {
                         if(body1[i].type === "temperature"){
                            if(body1[i].value < minim){
                                minim = body1[i].value;
                            }
                            if(body1[i].value > maxim){
                                maxim = body1[i].value;
                            }
                         }
                     }
                document.getElementById("minTemp").innerText = minim;
                document.getElementById("maxTemp").innerText = maxim;
            }
            xhr1.onerror = () =>{
                console.log("An error has occured.")
            };
            xhr1.send();
            

        // Total precipitation for the last day.
            const xhr2 = new XMLHttpRequest();
            xhr2.open('GET', 'http://localhost:8080/data/Horsens');
            xhr2.onload = () => {
                const response = xhr2.responseText;
                const body2 = JSON.parse(response);
                console.log(body2);
                var summ = 0;
                for(let i = 0; i < 96; i++){
                    summ = summ + body2[i].value;
                }
                document.getElementById("totalPrecipitation").innerText = summ;
            }
            xhr2.onerror = () =>{
                console.log("An error has occured");
            };
            xhr2.send();


        // Average wind speed for the last 24 hours.
        const xhr3 = new XMLHttpRequest();
        xhr3.open('GET', 'http://localhost:8080/data/Horsens');
        xhr3.onload = () => {
            const response = xhr3.responseText;
            const body3 = JSON.parse(response);
            console.log(body3);
            var summm = 0;
            var average = 0;
            for(let i = 0; i < 96; i++){
                summm = summm + body3[i].value;
            }
            average = summm / 95;
            document.getElementById("averagePrecip").innerText = average;
        }
        xhr3.onerror = () => {
            console.log("An error has occured.")
        };
        xhr3.send(); 