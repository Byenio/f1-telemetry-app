import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import { F1TelemetryClient, constants } from '@racehub-io/f1-telemetry-client';
import { parseCarStatusPacket, parseLapStatusPacket, parseParticipantsDataPacket, parseSessionDataPacket, parseCarTelemetryPacket, parseCarDamagePacket } from './parsers/packets.js';

//* Express App and Socket
const app = express();
app.use(cors());

const PORT = 5050;
const DEBUG = false;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

// io.on(
//     'connection',
//     (socket) => {
//         console.log('✅ Client connected!');
// });
// io.on(
//     'disconnect',
//     (socket) => {
//         console.log('❌ Client disconnected!');
// });

//* F1 telemetry client
const { PACKETS } = constants;
const client = new F1TelemetryClient({
    port: 20777,
    forwardAddresses: [
        {
            port: 20777,
            ip: '10.0.0.30'
        },
        {
            port: 20777,
            ip: '10.0.0.31'
        },
        {
            port: 20777,
            ip: '10.0.0.32'
        },
        {
            port: 20777,
            ip: '10.0.0.33'
        },
        {
            port: 20777,
            ip: '10.0.0.34'
        },
        {
            port: 20777,
            ip: '10.0.0.35'
        },
        {
            port: 20777,
            ip: '10.0.0.36'
        },
        {
            port: 20777,
            ip: '10.0.0.37'
        },
        {
            port: 20777,
            ip: '10.0.0.38'
        },
        {
            port: 20777,
            ip: '10.0.0.39'
        }
    ]
});

// client.on('event', data => {
//     console.log(data);
// })

/* Client info send functions */
function sendPacket(type, packet) {
    let data = []
    let send = true
    switch (type) {
        case PACKETS.carStatus:
            packet.allCarStatus.map((el) => data.push({
                "tyreCompound": el.m_visualTyreCompound,
                "tyresAgeLaps": el.m_tyresAgeLaps,
                "fuelInTank": el.m_fuelInTank,
                "fuelRemainingLaps": el.m_fuelRemainingLaps,
                "ersDeployMode": el.m_ersDeployMode,
                "ersDeployedThisLap": el.m_ersDeployedThisLap
            }))
            break
        case PACKETS.lapData:
            packet.allDriversLapData.map((el, index) => data.push({
                "position": el.m_carPosition, 
                "lapTime": el.m_currentLapTimeInMS, 
                "arrayIndex": index, 
                "lastLapTimeInMS": el.m_lastLapTimeInMS,
                "currentLapNum": el.m_currentLapNum,
                "sector1Time": el.m_sector1TimeInMS,
                "sector2Time": el.m_sector2TimeInMS,
                "penalties": el.m_penalties,
                "warnings": el.m_warnings,
                "sector": el.m_sector,
                "numPitStops": el.m_numPitStops,
                "lapDistance": el.m_lapDistance
            }))
            break
        case PACKETS.participants:
            packet.allParticipantsData.map((el) => data.push({
                "driverId": el.m_driverId,
                "teamId": el.m_teamId
            }))
            data.push({
                "header": {
                    "playerId": packet.header.m_playerCarIndex,
                    "secondaryPlayerId": packet.header.m_secondaryPlayerCarIndex
                }
            })
            break
        case PACKETS.session:
            data = {
                "totalLaps": packet.sessionData.m_totalLaps,
                "sessionTimeLeft": packet.sessionData.m_sessionTimeLeft,
                "sessionType": packet.sessionData.m_sessionType,
                "trackTemperature": packet.sessionData.m_trackTemperature,
                "trackId": packet.sessionData.m_trackId,
                "safetyCarStatus": packet.sessionData.m_safetyCarStatus,
                "sessionDuration": packet.sessionData.m_sessionDuration,
                "weather": packet.sessionData.m_weather,
                "forecastAccuracy": packet.sessionData.m_forecastAccuracy,
            }
            break
        case PACKETS.carTelemetry:
            packet.allCarTelemetry.map((el) => data.push({
                "surfaceTemps": el.m_tyresSurfaceTemperature,
                "innerTemps": el.m_tyresInnerTemperature,
                "tyresPressure": el.m_tyresPressure,
                "engineTemps": el.m_engineTemperature,
                "drs": el.m_drs
            }))
            break
        case PACKETS.carDamage:
            if (packet.carDamage != undefined) {
                packet.carDamage.map((el) => data.push({
                    "tyresWear": el.m_tyresWear,
                    "brakesDamage": el.m_brakesDamage,
                    "frontLeftWingDamage": el.m_frontLeftWingDamage,
                    "frontRightWingDamage": el.m_frontRightWingDamage,
                    "rearWingDamage": el.m_rearWingDamage,
                    "floorDamage": el.m_floorDamage,
                    "diffuserDamage": el.m_diffuserDamage,
                    "gearBoxDamage": el.m_gearBoxDamage,
                    "engineDamage": el.m_engineDamage
                }))
            } 
            else send = false
            break
        default:
            break
    }
    if (send) {
        io.emit(type, data);
    }
}

/* F1 Websocket connections */
client.on(PACKETS.lapData, (data) => {
    if (DEBUG) console.log(data)
    let packet = parseLapStatusPacket(data)
    //console.log(packet)
    sendPacket(PACKETS.lapData, packet)
})

client.on(PACKETS.carStatus, (data) => {
    if (DEBUG) console.log(data)
    let packet = parseCarStatusPacket(data)
    //console.log(packet)
    sendPacket(PACKETS.carStatus, packet)
})

client.on(PACKETS.participants, (data) => {
    if (DEBUG) console.log(data)
    let packet = parseParticipantsDataPacket(data)
    //console.log(packet)
    sendPacket(PACKETS.participants, packet)
})

client.on(PACKETS.session, (data) => {
    if (DEBUG) console.log(data)
    let packet = parseSessionDataPacket(data)
    //console.log(packet)
    sendPacket(PACKETS.session, packet)
})

client.on(PACKETS.carTelemetry, (data) => {
    if (DEBUG) console.log(data)
    let packet = parseCarTelemetryPacket(data)
    //console.log(packet)
    sendPacket(PACKETS.carTelemetry, packet)
})

client.on(PACKETS.carDamage, (data) => {
    if (DEBUG) console.log(data)
    let packet = parseCarDamagePacket(data)
    //console.log(packet)
    sendPacket(PACKETS.carDamage, packet)
})

client.start();

app.get('/', (req, res) => {
    res.send('Hello world!')
});

server.listen(
    PORT,
    () => {
        console.log(`Telemetry client started on port ${PORT}`)
})