
var postData;
var i = 0;
const limit = 100;
var loops = 0;

//Allows for easy editing of the cities involved and potentially makes it easier to apend/remove to the list
var latlong = {
    "Cairo":[30.0444,31.2357],
    "Dubai":[25.2048,55.2708],
    "Moscow":[55.7558,37.6178],
    "New York":[40.7128,-74.0060],
    "Tokyo":[35.6895,139.6917]
}

function getPosts(){
    return fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json());
}

//Gets posts when scorlled (nearly) to the bottom of the page
function posts(){
    getPosts().then(data => {
        postData = data;
        while(document.body.scrollHeight <= window.scrollY + window.innerHeight){loadMore();}
        window.onscroll = function() {
            let pageHeight = document.body.scrollHeight;
            let currScroll = window.scrollY + window.innerHeight;
            //The 200 offset was chosen by trial and error
            while(pageHeight <= (currScroll + 200) && i < 100){
                loadMore();
                pageHeight = document.body.scrollHeight;
                currScroll = window.scrollY + window.innerHeight;
            }
        }
    });
}

function loadMore(){
    postbox = document.getElementById("postBox");
    for(let j = 0; j < 3 && i < limit; j++, i++){
        let newPost = document.createElement("div");
        newPost.classList.add("post");
        newPost.innerHTML = `
        <p><h3>Post ID: ${postData[i].id}</h3> (User ID: ${postData[i].userId})</p>
        <p>${postData[i].title}</p>
        <p>${postData[i].body}</p>
        `;
        postbox.appendChild(newPost);
    }
    let newclearfix = document.createElement("div");
    newclearfix.classList.add("clearfix");
    postbox.appendChild(newclearfix);
}

//Sets up the divs to be used to store/present weather data
function initWeather(){
    let container = document.getElementById("locations");

    for(let key of Object.keys(latlong)){
        let newCity = document.createElement("tr");
        newCity.classList.add("location");
        newCity.id = key;
        newCity.innerHTML = `
        <td class="name">${key}</td>
        <td class="temp"></td>
        <td class="windSpeed"></td>
        <td class="windDirection"></td>
        `;
        container.appendChild(newCity);
    }
}

function weather(){
    initWeather();
    setInterval(loadWeather,30000);
    loadWeather();
}

function loadWeather(){
    let container = document.getElementById("locations");
    Array.from(container.children).forEach(city => {
        let loc = latlong[city.id];
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc[0].toString()}&longitude=${loc[1].toString()}&current_weather=true`)
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((data) => {
                let curr = data["current_weather"];
                //Tried using . notation for children, but didnt work
                //Found this solution on: https://stackoverflow.com/questions/12166753/how-to-get-child-element-by-class-name
                city.querySelector(".temp").innerHTML = curr["temperature"];
                city.querySelector(".windSpeed").innerHTML = curr["windspeed"];
                city.querySelector(".windDirection").innerHTML = direction(curr["winddirection"]);
                console.log(data);
            });
    });
}
//Found on: https://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words
function direction(degrees){
    degrees = parseInt(degrees);
    return ["N","NNE","NE","ENE","E","ESE","SE","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"][Math.round(degrees/22.5)%16];
}