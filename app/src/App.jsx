import './App.css';
import TyreChart from './components/Tyre/Tyre.Component';
import LapChart from './components/Laptime/Laptime.Component';
import CarTelemetry from './components/CarTelemetry/CarTelemetry.Component';
import CarDamage from './components/CarDamage/CarDamage.Component';
import FuelChart from './components/Fuel/Fuel.Component';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { DRIVERS } from './components/parsers/driver';
var socket = io.connect('http://localhost:5050');

function App() {

  const [ playerId, setPlayerId ] = useState();

  useEffect(() => {
    socket.on('participants', data => {
      setPlayerId(data[data.length - 1].header.secondaryPlayerId);
    })
  })

  return (
    <>
      <TyreChart />
      <LapChart />
      <FuelChart />
      <CarDamage />
      <CarTelemetry />
    </>
  )

}

export default App;
