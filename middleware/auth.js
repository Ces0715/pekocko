// recuperer jsontoken
const jwt = require('jsonwebtoken');

// securiser les routes
module.exports = (req, res, next) => {
  try {
    // recuperer le token qui provient de la requete
    const token = req.headers.authorization.split(' ')[1];
    //decoder le token
    const decodedToken = jwt.verify(token,'RANDOM_TOKEN_SECRET' );
      
    // recuperer le user ID
    const userId = decodedToken.userId;
    //si user ID different
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};