export default async function get(host) {

    const response = await fetch(host);
    const data = await response.json();
    return data;
}


