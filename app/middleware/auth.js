const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
      res.status(401).send('You have logout sucessfully');
    }
}

module.exports = isLoggedIn
