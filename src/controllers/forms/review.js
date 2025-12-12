import { validationResult } from "express-validator";
import { saveReviewForm} from "../../models/forms/review.js";
import { getAllVehicles } from "../../models/catalog/catalog.js";

const showReviewForm = async (req, res) => { 
    const vehicles = await getAllVehicles();

    addReviewSpecificStyles(res);
    res.render('forms/review/form', {title: "Give us a review!", vehicles});
}

const processReview = async (req, res) => {
    const currentUser = req.session.user;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.redirect('/review');
    }

    const { vehicle, rating, comment } = req.body;

    const savedForm = await saveReviewForm(currentUser.id, vehicle, rating, comment);
    if (!savedForm) {
        return res.redirect('/review');
    }

    res.redirect('/review');
}

const showUpdateReviewForm = async (req, res) => {

}

const addReviewSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/review.css">')
}

export {showReviewForm, processReview, showUpdateReviewForm};