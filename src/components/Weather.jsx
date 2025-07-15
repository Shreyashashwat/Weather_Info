import React, { useState, useEffect } from 'react';
import './weather.css'
import humidity from '../assets/humidity.png'
import wind from '../assets/wind.png'
import WeatherCanvas from './WeatherCanvas.jsx';

const Weather = () => {
  const[weatherData, setWeatherData] = useState(false);

  const Search = async(e) => {
    try {
      const url= `https://api.openweathermap.org/data/2.5/weather?q=${e}&appid=${import.meta.env.VITE_API_KEY}&units=metric`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setWeatherData({
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      temperature: Math.floor(data.main.temp),
      location: data.name,
      icon_url: data.weather[0].icon,
      condition: data.weather[0].main
    });
     
      console.log(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }
  
  const [city, setCity] = useState('');
  const handleClick = () => {
  if (city.trim() !== '') {
    Search(city.trim());
    setCity('');
  }
};


  return (
    <>

    {weatherData && <WeatherCanvas weather={weatherData.condition} />}
    <div className={`weather ${weatherData ? weatherData.condition : ''}`}>
       <div className="searchbar flex gap-2   ">
        {/* <div className='text-slate-800'>weather</div> */}
        <input type="text" placeholder="Search" className='rounded-lg h-6 p-2 outline-none' value={city} onChange={(e)=>{setCity(e.target.value)} } />
        <img src="https://cdn-icons-png.flaticon.com/512/861/861627.png" alt="" className='w-6 h-6 bg-slate-50  p-0.5 rounded-full cursor-pointer shadow-md hover:scale-105' onClick={(e)=>{
          handleClick(e);
        }}/>
        
        
       
      

       </div>
        {weatherData &&  (
          <>
       <div className='flex flex-col items-center justify-center  mt-4'>
         
          <img src={`https://openweathermap.org/img/wn/${weatherData.icon_url}@2x.png`} alt=""  className='w-40 '/>
          <p className='mt-4 text-3xl font-semibold '>{weatherData.temperature}°C</p>
          <p className='text-xl'>{weatherData.location}</p>

        </div>
        <div  className='flex justify-between items-center mt-10 gap-4 mb-6'>
          <div className='flex items-center gap-2'>
            <img src={humidity} alt="" className='w-8' />
              <div>
                <p className='text-lg font-medium'>{weatherData.humidity}</p>
                <p className='text-sm'>Humidity</p>
              </div>
        </div>
        <div className='flex items-center gap-2'>
         
          <img src={wind} alt=""  className='w-8'/>
          
          <div>
            <p className='text-lg font-medium'>{weatherData.windSpeed}</p>
            <p className='text-sm'>Wind</p>
          </div>
        </div>
       
        </div>
      </>
        )}
    </div>
     
    </>
  )
}

export default Weather
