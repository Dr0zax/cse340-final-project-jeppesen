const homePage = (req, res) => {
    const title = "Car Dealership Home Page";
    addHomeSpecificStyles(res);
    res.render('home', { title });
}

const addHomeSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/home.css">')
}
export { homePage }