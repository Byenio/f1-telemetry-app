import { useEffect, useState } from 'react'
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
import io from 'socket.io-client'

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

const socket = io.connect('http://localhost:5050')

const LapChart = () => {
    
    const [labels, setLabels] = useState([])
    const [time, setTime] = useState([])
    let options ={
      responsive: true,
    }
    useEffect(() => {
        socket.on('lapData', (data) => {
            let currentLap = data[21].currentLapNum
            let found = labels.find((el) => el === currentLap - 1)
            if (currentLap - 1 > 0 && found === undefined) {
                let tmp_labels = labels
                tmp_labels.push(currentLap - 1)
                setLabels(tmp_labels)
                let tmp_time = time
                tmp_time.push(data[21].lastLapTimeInMS)
                setTime(tmp_time.slice())
                options = {
                  responsive: true,
                  scales: {
                    yAxis: {
                      min: Math.min(time)*0.6,
                      max: Math.max(time)*0.6
                    }
                  }
                }
            }
        })
    }, [ labels, time ])

    return (
        <div className='flex flex-col w-full'>
            <Line 
                options={ options }
                data={{
                  labels,
                  datasets: [
                    {
                      fill: true,
                      label: 'Laptime',
                      data: labels.map((el, index) => (time[index])/1000),
                      borderColor: 'rgb(53, 162, 235)',
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                    
                  ],
                }}
            />
        </div>
        
    )
}

export default LapChart