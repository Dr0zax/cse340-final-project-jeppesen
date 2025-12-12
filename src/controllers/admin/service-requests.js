import { getAllServiceRequests, getServiceRequestsByUserId, updateServiceRequestStatus } from "../../models/forms/service-request.js";

const showServiceRequestsPage = async (req, res) =>{
    const currentUser = req.session.user

    console.log(currentUser);
    
    
    let requests;
    // Show all requests for owner and employee, only user's own requests for regular users
    if (currentUser.role_name === "owner" || currentUser.role_name === "employee") {
        requests = await getAllServiceRequests();
    } else {
        requests = await getServiceRequestsByUserId(currentUser.id);
    }
    
    addServiceRequestsSpecificStyles(res);
    res.render("forms/service-request/service-requests", { title: "Service Requests", requests: requests, currentUser });
}

const processUpdateServiceRequestStatus = async (req, res) => {
    const { requestId, status } = req.body;

    if (!requestId || !status) {
        return res.redirect('/service-requests');
    }

    await updateServiceRequestStatus(requestId, status);
    res.redirect('/service-requests');
}

const addServiceRequestsSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/service-request.css">');
}

export { showServiceRequestsPage, processUpdateServiceRequestStatus };