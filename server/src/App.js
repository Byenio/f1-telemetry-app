import { F1TelemetryClient, constants } from '@racehub-io/f1-telemetry-client';

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

client.on(PACKETS.carDamage, ( data ) => {
    console.log(data.m_carDamageData[data.m_header.m_playerCarIndex].m_tyresWear);
})

client.start();