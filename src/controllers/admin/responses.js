import { getAllContactForms } from "../../models/forms/contact.js";

const contactResponsesPage = async (req, res) =>{
    const responses = await getAllContactForms();
    addResponsesSpecificStyles(res);
    res.render("admin/responses", { title: "Contact Responses", responses });
}

const addResponsesSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/responses.css">');
}

export { contactResponsesPage };