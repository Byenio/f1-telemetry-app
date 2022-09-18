import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { TeamParser } from '../parsers/team'
import { DRIVERS } from '../parsers/driver'
import CarTelemetryProvider from './CarTelemetry.Provider'

const tp = new TeamParser()
const socket = io.connect('http://localhost:5050')

const CarTelemetry = () => {
    
    const [ participantsStatus, setParticipantsStatus ] = useState([]);
    const [ playerId, setPlayerId ] = useState(0);


    useEffect(() => {
        socket.on('participants', (data) => {
            setParticipantsStatus(data.slice());
            setPlayerId(data[data.length - 1].header.playerId);
        })
    }, [socket])

    return (
        <div className='flex flex-col p-2 w-full text-white font-f1Bold py-2 px-2'>
            {/* <div className='flex flex-row w-full'>
                <div className='flex flex-row w-1/2 items-center'>
                    <p className='my-2 text-lg mr-2'>
                        Select Car
                    </p>
                    <select value={selectedCar} onChange={e => setSelectedCar(parseInt(e.target.value))} className='w-1/5 my-2 h-6 border-solid border-4 border-white rounded-md color-#252525'>
                        {participantsStatus.map((participant, index) => 
                            <option key={DRIVERS[participant.driverId]?.abbreviation} value={index} className='bg-#252525'>
                                <div className='flex flex-row w-full'>
                                    <div className="w-7 h-7 mx-1">
                                        <img src={tp.parseTeamIdWithImage(participant?.teamId)}/>
                                    </div>
                                    <p>
                                        {DRIVERS[participant.driverId]?.abbreviation}
                                    </p>
                                </div>
                                
                            </option>    
                        )}
                    </select>
                </div>
                
            </div> */}
            <CarTelemetryProvider selectedCar={playerId}/>
        </div>
    )
}

export default CarTelemetry