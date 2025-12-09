import { getAllVehicles } from "../../models/catalog/catalog";

const vehicleCatalogPage = async (req, res) => {
    const vehicles = await getAllVehicles();

    const title = "Catalog";
    res.render("catalog/catalog", { title, vehicles });
}

export { vehicleCatalogPage };