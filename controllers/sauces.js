// recuperer le modele sauce
const Sauce = require ('../models/Sauce');
// recuperer modele file system pour les images
const fs = require('fs');

//route get
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
      next();
    }
  );
}

exports.getAllSauces = (_req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
    next();
};

//route post
exports.createSauce = (req, res, next) => {
  // On stocke les données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
  const sauceObject = JSON.parse(req.body.sauce);
  // On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
  delete sauceObject._id;
  // Création d'une instance du modèle Sauce
  const sauce = new Sauce({
   ...sauceObject,
   // On modifie l'URL de l'image, on veut l'URL complète, quelque chose dynamique avec les segments de l'URL
   imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
   
 });
  // Sauvegarde de la sauce dans la base de données
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce créée!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
  next();
};

//route put
exports.modifySauce = (req, res, next) => {
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Sauce modifiée!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
  next();
}

//route delete
exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Sauce supprimée!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
  next();
}



// Création du like et dislike
exports.likeSauce = (req, res, next) => {    
  const like = req.body.like;
  if(like === 1) { // Option like
      Sauce.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
      .then( () => res.status(200).json({ message: 'Vous aimez cette sauce !' }))
      
      .catch( error => res.status(400).json({ error}))
  } else if(like === -1) { // Option dislike
      Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
      .then( () => res.status(200).json({ message: 'Vous n\'aimez pas cette sauce !' }))
      .catch( error => res.status(400).json({ error}))

  } else {    // Annuler like ou dislike
      Sauce.findOne( {_id: req.params.id})
      .then( sauce => {
          if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
               Sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })
              .then( () => res.status(200).json({ message: 'Vous n aimez plus cette sauce !' }))
              .catch( error => res.status(400).json({ error}))
              }
          else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
              Sauce.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
              .then( () => res.status(200).json({ message: 'Vous aimez cette sauce !' }))
              .catch( error => res.status(400).json({ error}))
              }           
      })
      .catch( error => res.status(400).json({ error}));             
  next()  ;
};











};
 