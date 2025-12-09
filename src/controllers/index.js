const homePage = (req, res) => {
    const title = "Car Dealership Home Page";
    res.render('home', { title });
}

export { homePage }