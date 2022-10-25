
export async function getMeetingInfo() {
    const response = await fetch('https://backend-dev.hologis.app/api/meeting/attendee');
    const json = response.json();

    return json;
}

