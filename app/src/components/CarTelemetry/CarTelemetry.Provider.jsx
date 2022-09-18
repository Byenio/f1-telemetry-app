import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { ERS_DEPLOY_MODE, ERS_DEPLOY_MODE_COLOR } from '../parsers/ersDeployMode'
import { TYRES } from '../parsers/tyres'
//import CarDamage from './CarDamage'
import LapChart from '../Laptime/Laptime.Component'
import TyreChart from '../Tyre/Tyre.Component'

const socket = io.connect('http://localhost:5050')

const CarTelemetryProvider = ({selectedCar}) => {

    const [drs, setDrs] = useState(null)
    const [surfaceTemps, setSurfaceTemps] = useState(null || [])
    const [innerTemps, setInnerTemps] = useState(null || [])
    const [tyresPressure, setTyresPressure] = useState(null || [])
    const [engineTemps, setEngineTemps] = useState(null)

    const [position, setPosition] = useState(null)
    const [sector1Time, setSector1Time] = useState(null)
    const [sector2Time, setSector2Time] = useState(null)
    const [penalties, setPenalties] = useState(null)
    const [warnings, setWarnings] = useState(null)
    const [numPitStops, setNumPitStops] = useState(null)

    const [tyresAgeLaps, setTyresAgeLaps] = useState(null)
    const [fuelRemainingLaps, setFuelRemainingLaps] = useState(null)
    const [ersDeployMode, setErsDeployMode] = useState(null)
    
    useEffect(() => {
        
        socket.on('carTelemetry', (data) => {
            setSurfaceTemps(data[selectedCar].surfaceTemps)
            setInnerTemps(data[selectedCar].innerTemps)
            setTyresPressure(data[selectedCar].tyresPressure)
            setEngineTemps(data[selectedCar].engineTemps)
            setDrs(data[selectedCar].drs)
        })
        socket.on('lapData', (data) => {
            setPosition(data[selectedCar].position)
            setSector1Time(data[selectedCar].sector1Time)
            setSector2Time(data[selectedCar].sector2Time)
            setPenalties(data[selectedCar].penalties)
            setWarnings(data[selectedCar].warnings)
            setNumPitStops(data[selectedCar].numPitStops)
        })
        socket.on('carStatus', (data) => {
            setTyresAgeLaps(data[selectedCar].tyresAgeLaps)
            setFuelRemainingLaps(data[selectedCar].fuelRemainingLaps)
            setErsDeployMode(data[selectedCar].ersDeployMode)
        })
    }, [ selectedCar, surfaceTemps, innerTemps, tyresPressure, engineTemps, drs, position, sector1Time, sector2Time, penalties, warnings, numPitStops, tyresAgeLaps, fuelRemainingLaps, ersDeployMode ])

    return (
        <div className='flex flex-row w-full h-full border-solid border-4 border-white rounded-md'>
            <div className='h-full flex flex-col w-1/3 p-2'>

                <div className='h-1/2'>
                <p className='text-lg my-2'>Driver status</p>
                <div className='flex flex-row'>
                    <div className='flex flex-row w-1/2'>
                        <p>
                            Position {position}
                        </p>
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className='flex flex-row w-1/2'>
                        <p>
                            Sector 1 {Math.floor(sector1Time /60000)}:{((sector1Time % 60000)/1000).toFixed(0)}.{sector1Time%1000}
                        </p>
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className='flex flex-row w-1/2'>
                        <p>
                            Sector 2 {Math.floor(sector2Time /60000)}:{((sector2Time % 60000)/1000).toFixed(0)}.{sector2Time%1000}
                        </p>
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className='flex flex-row w-1/2'>
                        <p>
                            Penalties {penalties}
                        </p>
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className='flex flex-row w-1/2'>
                        <p>
                            Warnings {warnings}
                        </p>
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className='flex flex-row w-1/2'>
                        <p>
                            Pit Stops {numPitStops}
                        </p>
                    </div>
                </div>
                <br/>
                </div>
            </div>
            <div className='h-full flex flex-col w-1/3 p-2'>
                <div className='h-1/2'>
                    <p className='my-2 text-lg'>Car status</p>
                    <div className='flex flex-row'>
                        <div className='flex flex-row w-1/2'>
                            <p className={drs === 0 ? 'text-[#E10600]' : 'text-[#55FF52]'}>
                                DRS {drs === 0 ? 'Off' : 'Active'}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='flex flex-row w-1/2'>
                            <p>
                                Tyres Age Lap {tyresAgeLaps}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='flex flex-row w-1/2'>
                            <p>
                                Fuel Remaining Laps {fuelRemainingLaps?.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='flex flex-row w-1/2'> 
                            <p className={'text-[' + ERS_DEPLOY_MODE_COLOR[ersDeployMode] + ']'}>
                                ERS Deploy Mode {ERS_DEPLOY_MODE[ersDeployMode]}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-full flex flex-col w-1/3 p-2'>
                <div className='h-1/2'>
                    <strong className='my-2 text-lg'>Car temps</strong>
                    <div className='flex flex-row'>
                        <div className='flex flex-row w-1/2'>
                            <strong>Surface temps</strong>
                            <p>
                                Rear left {Math.floor(surfaceTemps[0]) || 0}
                            </p>
                            <p>
                                Rear right {Math.floor(surfaceTemps[1]) || 0}
                            </p>
                            <p>
                                Front left {Math.floor(surfaceTemps[2]) || 0}
                            </p>
                            <p>
                                Front right {Math.floor(surfaceTemps[3]) || 0}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='flex flex-row w-1/2'>
                            <strong>Inner temps</strong>
                            <p>
                                Rear left {Math.floor(innerTemps[0]) || 0}
                            </p>
                            <p>
                                Rear right {Math.floor(innerTemps[1]) || 0}
                            </p>
                            <p>
                                Front left {Math.floor(innerTemps[2]) || 0}
                            </p>
                            <p>
                                Front right {Math.floor(innerTemps[3]) || 0}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='flex flex-row w-1/2'>
                            <strong>Tyres pressure</strong>
                            <p>
                                Rear left {(tyresPressure[0]).toFixed(2) || 0}
                            </p>
                            <p>
                                Rear right {(tyresPressure[1]).toFixed(2) || 0}
                            </p>
                            <p>
                                Front left {(tyresPressure[2]).toFixed(2) || 0}
                            </p>
                            <p>
                                Front right {(tyresPressure[3]).toFixed(2) || 0}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <div className='flex flex-row w-1/2'>
                            <p>
                                Engine temps {engineTemps}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarTelemetryProvider