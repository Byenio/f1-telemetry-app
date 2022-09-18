function parseCarStatusPacketFunc(packet) {
    return {
        "allCarStatus": packet.m_carStatusData
    }
}

function parseLapStatusPacketFunc(packet) {
    return {
        "allDriversLapData": packet.m_lapData
    }
}

function parseParticipantsDataPacketFunc(packet) {
    return {
        "header": packet.m_header,
        "allParticipantsData": packet.m_participants
    }
}

function parseSessionDataPacketFunc(packet) {
    return {
        "sessionData": packet
    }
}

function parseCarTelemetryPacketFunc(packet) {
    return {
        "allCarTelemetry": packet.m_carTelemetryData
    }
}

function parseCarDamagePacketFunc(packet) {
    return {
        "carDamage": packet.m_carDamageData
    }
}

export const parseCarStatusPacket = parseCarStatusPacketFunc
export const parseLapStatusPacket = parseLapStatusPacketFunc
export const parseParticipantsDataPacket = parseParticipantsDataPacketFunc
export const parseSessionDataPacket = parseSessionDataPacketFunc
export const parseCarTelemetryPacket = parseCarTelemetryPacketFunc
export const parseCarDamagePacket = parseCarDamagePacketFunc