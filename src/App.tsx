import './App.css'
import {useRef, useState} from "react";

// interface MeteoData {
//     city: string;
//     country: string;
//     temperature: number;
//     temps: string;
// }

/*
[{"id":9,"city":"Paris","country":"France","latitude":48.8566,"longitude":2.3522,"temperature":20.5,"weather_description":"Partly Cloudy","humidity":55,"wind_speed":6.8,"forecast":[{"date":"2023-07-28","temperature":19,"weather_description":"Cloudy","humidity":58,"wind_speed":7},{"date":"2023-07-29","temperature":21,"weather_description":"Partly cloudy","humidity":53,"wind_speed":6}]}]
 */
interface MeteoJson {
    id: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    temperature: number;
    weather_description: string;
    humidity: number;
    wind_speed: number;
    forecast: [{
        date: string;
        temperature: number;
        weather_description: string;
        humidity: number;
        wind_speed: number;
    }]
}

const dico_desc: { [key: string]: string } = {
    "Clear sky": "☀️",
    "Cloudy": "☁️",
    "Partly cloudy": "⛅",
    "Rain": "🌧️",
    "Rain showers": "🚿",
    "Rainy": "🌧️",
    "Scattered clouds": "🌤️",
    "Sunny": "🌞"
};

const dico_advice :{ [key: string]: string } = { //généré par ia mais bon, ce n'est pas une école de com
    "Clear sky": "Profite du ciel dégagé pour une randonnée ou un pique-nique !",
    "Cloudy": "C'est le moment idéal pour lire un bon livre ou regarder un film.",
    "Partly cloudy": "Parfait pour une balade en vélo ou une séance de yoga en plein air.",
    "Rain": "Pourquoi ne pas visiter un musée ou préparer des cookies maison ?",
    "Rain showers": "Enfile ton imperméable et va sauter dans les flaques !",
    "Rainy": "Journée cocooning : plaid, chocolat chaud et série TV !",
    "Scattered clouds": "Idéal pour une séance photo ou un brunch en terrasse.",
    "Sunny": "Direction la plage ou le parc pour bronzer et jouer au frisbee !"
};

function App() {
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [temperature, setTemperature] = useState(-273.15);//Un petit easter egg de physicien
    const [temps, setTemps] = useState('');

    const searchInput = useRef(null);//pour obtenir la value de l'input du html

    function funcSearchMeteo(){
        const searchvalue = searchInput.current;
        if(searchvalue) {
            fetch(`https://freetestapi.com/api/v1/weathers?search=${searchvalue.value}`).then((response) => response.json())
                .then((meteojson) => setMeteoData(meteojson[0]))
                .catch(() => console.error("Pas de connexion internet:"));
        }
    }

    function setMeteoData(meteojson : MeteoJson) {
        setCity(meteojson.city);
        setCountry(meteojson.country);
        setTemperature(meteojson.forecast[0].temperature);
        setTemps(meteojson.forecast[0].weather_description);
    }

    function FormMeteo() {

        return <form className="meteoForm">
            <button type="button" onClick={funcSearchMeteo}
                    className="">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 search_button_img">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                </svg>
            </button>
            <input type="text" className="meteoFormCity" placeholder="Rechercher" ref={searchInput}/>
        </form>
    }
    function DisplayMeteo() {

        return <div>
            <div className="meteoDisplayLocation">
                <h2>{city}</h2><h3>{country}</h3>
            </div>
            <div className="meteoDisplaytemp">
                {temperature != -273.15 && <h1>{temperature}°C</h1>}
                <h2>{temps}</h2>
                <h1>{dico_desc[temps]}</h1>
            </div>
            <p className="thelittleadvice">{dico_advice[temps]}</p>
        </div>
    }

    return (
        <div id="meteoApp">
            <FormMeteo />
            <DisplayMeteo />
        </div>
    )
}

export default App
