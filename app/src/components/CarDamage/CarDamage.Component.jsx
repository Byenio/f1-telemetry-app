import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:5050')


const CarDamage = () => {
    
    const [ playerId, setPlayerId ] = useState(0);

    const [tyresWear, setTyresWear] = useState(null || [])
    const [brakesDamage, setBrakesDamage] = useState(null)
    const [frontLeftWingDamage, setFrontLeftWingDamage] = useState(null)
    const [frontRightWingDamage, setFrontRightWingDamage]= useState(null)
    const [rearWingDamage, setRearWingDamage] = useState(null)
    const [floorDamage, setFloorDamage] = useState(null)
    const [diffuserDamage, setDiffuserDamage] = useState(null)
    const [gearBoxDamage, setGearBoxDamage] = useState(null)
    const [engineDamage, setEngineDamage] = useState(null)

    useEffect(() => {
        
        socket.on('participants', data => {
            setPlayerId(data[data.length - 1].header.playerId);
        });

        socket.on("carDamage", (data) => {

            setTyresWear(data[playerId].tyresWear)
            setBrakesDamage(data[playerId].brakesDamage)
            setFrontLeftWingDamage(data[playerId].frontLeftWingDamage)
            setFrontRightWingDamage(data[playerId].frontRightWingDamage)
            setRearWingDamage(data[playerId].rearWingDamage)
            setFloorDamage(data[playerId].floorDamage)
            setDiffuserDamage(data[playerId].diffuserDamage)
            setGearBoxDamage(data[playerId].GearBoxDamage)
            setEngineDamage(data[playerId].engineDamage)

        })

    }, [ socket, playerId ])

    return (
        <div className='flex flex-col w-full'>
            <p className='text-lg my-2'>
                Car Damage
            </p>
            <div className='flex flex-row w-full'>
                <div className='flex flex-row w-1/2'>
                    <p>
                        Tyres Wear<span className='font-f1Regular'>:</span>
                    </p>
                </div>
                <div className='flex flex-row w-1/2'>
                    <p>
                        Rear left {Math.floor(tyresWear[0]) || 0}%
                    </p>
                    <p>
                        Rear right {Math.floor(tyresWear[1]) || 0}%
                    </p>
                    <p>
                        Front left {Math.floor(tyresWear[2]) || 0}%
                    </p>
                    <p>
                        Front right {Math.floor(tyresWear[3]) || 0}%
                    </p>
                </div>
            </div>
            <div className='flex flex-row w-full'>
                <div className='flex flex-row w-1/2'>
                    <p>
                        Brakes {brakesDamage}
                    </p>
                </div>
            </div>
            <div className='flex flex-row w-full'>
                <div className='flex flex-row w-1/2'>
                    <p>
                        Front Left Wing {frontLeftWingDamage}
                    </p>
                </div>
            </div>
            <div className='flex flex-row w-full'>
                <div className='flex flex-row w-1/2'>
                    <p>
                        Front Right Wing {frontRightWingDamage}
                    </p>
                </div>
            </div>
            <div className='flex flex-row w-full'>
                <div className='flex flex-row w-1/2'>
                    <p>
                        Rear Wing {rearWingDamage}
                    </p>
                </div>
            </div>
            <div className='flex flex-row w-full'>
                <div className='flex flex-row w-1/2'>
                    <p>
                        Floor {floorDamage}
                    </p>
                </div>
            </div>
            <div className='flex flex-row w-full'>
                <div className='flex flex-row w-1/2'>
                    <p>
                        Diffuser {diffuserDamage}
                    </p>
                </div>
            </div>
            <div className='flex flex-row w-full'>
                <div className='flex flex-row w-1/2'>
                    <p>
                        Gear Box {gearBoxDamage}
                    </p>
                </div>
            </div>
            <div className='flex flex-row w-full'>
                <div className='flex flex-row w-1/2'>
                    <p>
                        Engine {engineDamage}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CarDamage