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
import './Tyre.Style.css';
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

function TyreChart() {
  const [ tyresDamage, setTyresDamage ] = useState([]);
  const [ labels, setLabels ] = useState([]);
  const [ allTyresDamage, setAllTyresDamage ] = useState([]);

  useEffect(() => {
    socket.on('carDamage', (data) => {
        let wear = 0
        data[21].tyresWear.map(el => wear += el)
        wear = 100 - wear/4
        let tmp_wear = allTyresDamage
        tmp_wear.push(wear)
        setAllTyresDamage(tmp_wear)
    })
    socket.on('lapData', (data) => {
        let currentLap = data[21].currentLapNum
        let found = labels.find((el) => el === currentLap - 1)
        if (currentLap - 1 > 0 && found === undefined) {
            let tmp_labels = labels
            tmp_labels.push(currentLap - 1)
            setLabels(tmp_labels)
            let tmp_damage = tyresDamage;
            tmp_damage.push(allTyresDamage[allTyresDamage.length - 1])
            setTyresDamage(tmp_damage.slice());
        }
    })
  }, [ tyresDamage, allTyresDamage, labels ]);

  return (
    <div className='flex flex-col w-full'>
            <Line 
                options={{
                    responsive: true,
                        scales: {
                            yAxis: {
                                min: 20,
                                max: 100
                            }
                        }
                }}
                data={{
                    labels,
                    datasets: [
                        {
                            fill: true,
                            label: 'Tyre Wear',
                            data: labels.map((el, index) => tyresDamage[index]),
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        },
                    ]
                }}
            />
    </div>
  );
}

export default TyreChart;