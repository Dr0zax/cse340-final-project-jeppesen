import { getAllReviews } from "../../models/forms/review.js";

const reviewResponsesPage = async (req, res) =>{
    const responses = await getAllReviews();
    const currentUser = req.session.user
    
    addResponsesSpecificStyles(res);
    res.render("forms/review/review-responses", { title: "Review Responses", responses, currentUser });
}

const addResponsesSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/review-responses.css">');
}

export { reviewResponsesPage };