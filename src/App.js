import { Card, FormControl, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './InfoBox.js';
import Map from './Map.js';
import Table from './Table.js'
import { sortData, printStat } from './util';
import LineGraph from './LineGraph.js'
import "leaflet/dist/leaflet.css";

// https://disease.sh/v3/covid-19/countries



function App() {
  const [countries,setCountries] = useState([]);
  const [country,setCountry]=useState('worldwide');
  const [countryInfo,setCountryInfo] = useState([]);
  const [tableData,setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746 ,lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries,setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(()=>{
  //for worldwide fetch
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data)=>{
        setCountryInfo(data);
    });
  },[]);

  useEffect(()=>{
      //.async -> send a request wait for it
      //for the select dropdown
      const getCountriesData = async() =>{
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response)=> response.json())
        .then((data)=>{
          const countries = data.map((country)=>(
            {
              name: country.country,
              value: country.countryInfo.iso2
            }));
            const sortedData = sortData(data);
            setTableData(sortedData);
            setCountries(countries);
            setMapCountries(data);
        });
      };
      getCountriesData();
  },[]);

/*fun*/  const onCountryChange = async (event)=>{
  const countryCode = event.target.value;
  //console.log("onCountryChange function== ", countryCode)

  const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
 
  await fetch(url)
  .then(response => response.json())
  .then(data => {
    setCountry(countryCode);
    setCountryInfo(data);
    countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
    setMapZoom(4);
  });
};
  //console.log("country Info==",countryInfo);

  return (
    <div className="app">
      <div className="app__left">

        <div className="app__header">
          <h1>COVID-19 TRACKER-APPLICATION</h1>

          <FormControl className="app__dropdown">
            <Select variant ="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country)=>(
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
              <InfoBox
                active = {casesType==="cases"}
                title="CoronaVirus Cases" 
                onClick={(onclicked)=>setCasesType("cases")}
                cases={printStat(countryInfo.todayCases)}
                total={countryInfo.cases} />
              <InfoBox
                active = {casesType==="recovered"}
                title="Recovered Cases"
                onClick={(onclicked)=>setCasesType("recovered")}
                cases={printStat(countryInfo.todayRecovered)} 
                total={countryInfo.recovered} />
              <InfoBox
                active = {casesType==="deaths"}
                title="Deaths"
                onClick={(onclicked)=>setCasesType("deaths")}
                cases={countryInfo.todayDeaths}
                total={countryInfo.deaths} />
        </div>
      
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />

      </div>

      <Card className="app_right">
        <h2>Total Cases Registered Country-wise</h2>
        <Table countries={tableData} />
        <h3>Worldwide total {casesType}</h3>
        <LineGraph casesType={casesType} />
      </Card>

    </div>
  );
}

export default App;
