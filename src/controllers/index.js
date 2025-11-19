const homePage = (req, res) => {
    const title = "Home Page";
    res.render('home', { title });
}

export { homePage }