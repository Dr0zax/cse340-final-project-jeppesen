import { validationResult } from "express-validator";
import { saveServiceRequestForm } from "../../models/forms/service-request.js";

const showServiceRequestForm = async (req, res) => { 
    addServiceRequestSpecificStyles(res);
    res.render('forms/service-request/form', {title: "Submit a service request"});
}

const processServiceRequest = async (req, res) => {
    const currentUser = req.session.user;

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.redirect('/service-request');
    }

    console.log(req.body);
    

    const { vehicle, vehiclePlate, serviceType, notes } = req.body;

    const savedForm = saveServiceRequestForm(currentUser.id, vehicle, vehiclePlate, serviceType, notes);
    if (!savedForm) {
        return res.redirect('/service-request');
    }

    res.redirect('/service-request');

}

const addServiceRequestSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/service-request.css">')
}

export {showServiceRequestForm, processServiceRequest};