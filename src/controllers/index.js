import { getFeaturedVehicle } from '../models/home/home.js';

const homePage = async (req, res) => {
    const title = "Car Dealership Home Page";
    const featuredVehicle = await getFeaturedVehicle();
    addHomeSpecificStyles(res);
    res.render('home', { title, featuredVehicle });
}

const addHomeSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/home.css">')
}
export { homePage }