import io from 'socket.io-client';
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
  } from 'chart.js';
import './Fuel.Style.css';
import { useEffect, useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

var socket = io.connect('http://localhost:5050');

function FuelChart() {

  const [ playerId, setPlayerId ] = useState(0);

  const [ fuelAmount, setFuelAmount ] = useState([]);
  const [ allFuel, setAllFuel ] = useState([]);

  const [ fuelDelta, setFuelDelta ] = useState([]);

  const [ labels, setLabels ] = useState([]);

  useEffect(() => {
    socket.on('participants', data => {
        setPlayerId(data[data.length - 1].header.playerId);
    });
    socket.on('carStatus', (data) => {
        let tmp_fuel = allFuel;
        tmp_fuel.push(data[playerId].fuelRemainingLaps);
    })
    socket.on('lapData', (data) => {
        let currentLap = data[playerId].currentLapNum
        let found = labels.find((el) => el === currentLap - 1)
        if (currentLap - 1 > 0 && found === undefined) {
            let tmp_labels = labels;
            tmp_labels.push(currentLap - 1);
            setLabels(tmp_labels);
            let tmp_fuel = fuelAmount;
            tmp_fuel.push(allFuel[allFuel.length - 1]);
            setFuelAmount(tmp_fuel.slice());
        }
    })
  }, [ fuelAmount, allFuel, labels ]);

  return (
    <div className='flex flex-col w-full'>
            <Line 
                options={{
                    responsive: true
                }}
                data={{
                    labels,
                    datasets: [
                        {
                            fill: true,
                            label: 'Fuel delta [laps]',
                            data: labels.map((el, index) => fuelAmount[index]),
                            borderColor: 'rgb(153, 0, 153)',
                            backgroundColor: 'rgba(153, 0, 153, 0.3)',
                        },
                    ]
                }}
            />
    </div>
  );
}

export default FuelChart;