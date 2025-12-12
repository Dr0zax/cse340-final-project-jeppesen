import { validationResult } from "express-validator";
import { saveReviewForm, deleteReview } from "../../models/forms/review.js";
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

const processDeleteReview = async (req, res) => {
    // allow id from route param or form body
    const reviewId = req.params.id || req.body.id;

    if (!reviewId) {
        return res.redirect('/reviews');
    }

    try {
        const deleted = await deleteReview(reviewId);

        if (!deleted) {
            // deletion failed or nothing was deleted
            return res.redirect('/reviews');
        }

        return res.redirect('/reviews');
    } catch (error) {
        console.error('Error deleting review:', error);
        return res.redirect('/reviews');
    }
};

const addReviewSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/review.css">')
}

export {showReviewForm, processReview, showUpdateReviewForm, processDeleteReview};