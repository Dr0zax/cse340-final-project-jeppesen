import { getAllVehicles } from "../catalog/catalog.js"

const getFeaturedVehicle = async (vehicles) => {
    const allVehicles = await getAllVehicles();
    const featuredVehicle = allVehicles[Math.floor(Math.random() * allVehicles.length)];
    return featuredVehicle;
}

export { getFeaturedVehicle };