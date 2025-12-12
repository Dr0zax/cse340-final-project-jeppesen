import { getAllServiceRequests } from "../../models/forms/service-request.js";

const showServiceRequestsPage = async (req, res) =>{
    const requests = await getAllServiceRequests();
    console.log(requests);
    
    
    addServiceRequestsSpecificStyles(res);
    res.render("admin/service-requests", { title: "Service Requests", requests: requests });
}

const addServiceRequestsSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/service-request.css">');
}

export { showServiceRequestsPage };