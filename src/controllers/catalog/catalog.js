import { getSortedVehicles, getVehicleBySlug } from "../../models/catalog/catalog.js";

const vehicleCatalogPage = async (req, res) => {
    const currentSort = req.query.sort || "year";
    const vehicles = await getSortedVehicles(currentSort);
    
    const title = "Catalog";
    addCatalogSpecificStyles(res);
    res.render("catalog/list", { title, vehicles: vehicles, currentSort });
}

const vehicleDetailsPage = async (req, res) => {
    const slug = req.params.vehicleSlug;
    const vehicle = await getVehicleBySlug(slug);
    console.log(slug, vehicle);
    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    addCatalogSpecificStyles(res);
    res.render("catalog/detail", { title, vehicle });
}

const addCatalogSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
}

export { vehicleCatalogPage, vehicleDetailsPage };