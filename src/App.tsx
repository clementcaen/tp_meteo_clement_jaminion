import './App.css'
import {useEffect, useRef, useState} from "react";

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

const dico_advice :{ [key: string]: string } = { //généré par ia parce que c'est dûr d'etre créatif, et ce ne sont pas des tenues, mais ça rajoute du vivant, youpi !
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
    const [loading, setLoading] = useState(false);
    const [errorInternet, setErrorInternet] = useState("");
    const searchInput = useRef<HTMLInputElement>(null);//pour obtenir la value de l'input du html, htmlinputElement permet de définir le type pour pouvoir get le value après

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const {latitude, longitude} = position.coords;
                    console.log(latitude, longitude);
                    const response = await fetch(`/geo/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    setCity(data.address.city);
                    setCountry(data.address.countryName);
                    funcSearchMeteo();
                },
                () => {
                    setErrorInternet("La géolocalisation échoué");
                }
            );
        }
    });


    function funcSearchMeteo(){
        const searchvalue = searchInput.current?.value;
        if(searchvalue) {
            setLoading(true);
            setTimeout(() => {
                fetch(`/api/v1/weathers?search=${searchvalue}`).then((response) => response.json())
                    .then((meteojson) => setMeteoData(meteojson[0]))
                    .then(() => setLoading(false))
                    .catch(() => {setLoading(false);setErrorInternet("Erreur, pas de connexion internet");});
            }, 2000);//on ajoute un délai pour bien voir
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
        if (loading) {
            return <div>Veuillez patientez que le nuage arrive...</div>;
        }
        if (errorInternet) {
            return <div>{errorInternet}</div>
        }
        return <div className="meteoDisplay">
            <div className="meteoDisplayLocation">
                <h2 className="city">{city}</h2>·<h3 className="country">{country}</h3>
            </div>
            <hr/>
            <div className="meteoDisplaytemp">
                <div className="tempNdesc">
                    {temperature != -273.15 && <h1>{temperature}°C</h1>}
                    <h2 className="temperature">{temps}</h2>
                </div>
                <h1 className="img_temps">{dico_desc[temps]}</h1>
            </div>
            <hr/>
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
