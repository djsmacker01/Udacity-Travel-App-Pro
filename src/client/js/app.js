// import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.scss';
import '../styles/media.scss'
// import 'bootstrap';
const $ = require("jquery");
import { getCity, getTripStart, getTripEnd } from './region'
import { getGeoLocation, getWeatherForecast, getImageURL, getCountryInfo } from './request';
import { showModal, displayTrip } from './interface';

// declare a global variable object
const trip = {};

// add Button handle functions 

const check = async (e) => {
  e.preventDefault();

  trip.city = getCity();
  trip.start = getTripStart();
  trip.end = getTripEnd();

  const geoLocation = await getGeoLocation(trip.city);

  trip.latitude = geoLocation.latitude;
  trip.longitude = geoLocation.longitude;
  trip.countryCode = geoLocation.countryCode;

  trip.weatherForecast = await getWeatherForecast(geoLocation.latitude, geoLocation.longitude);

  const countryInfo = await getCountryInfo(trip.countryCode);

  trip.country = countryInfo.name;
  trip.countryFlag = countryInfo.flag;

  trip.image = await getImageURL(trip.city, trip.country);

  console.log(trip);

  showModal(trip);
}

const saveContent = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:8080/save',
      {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trip: trip })
      });
    if (response.ok) {
      const jsonRes = await response.json();
      displayTrip(jsonRes);
      return jsonRes;
    }
  } catch (error) {
    console.log(error);
  }
}

const cancel = (e) => {
  e.preventDefault();
  $('#tripModal').modal('toggle');
  document.querySelector('.caption').style.display = 'block';
}

/* Add event listeners */

document.getElementById('button_search').addEventListener('click', check);

document.querySelector('.trip_save').addEventListener('click', saveContent)

document.querySelectorAll('.trip_cancel').forEach(element => {
  element.addEventListener('click', cancel);
});
