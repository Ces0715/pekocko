// recuperer le modele sauce
const Sauce = require ('../models/Sauce');
// recuperer modele file system pour les images
const fs = require('fs');

//creer une sauce
exports.createOneSauce = (req, res, _) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
  .then( () => {
    res.status(201).json({message: 'sauce créée.'}); 
  })
  .catch((error) => {
    res.status(400).json({error})});
  };

// modifier une sauce   put 
exports.modifyOneSauce = (req, res, _) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'sauce modifiée.' }))
    .catch(error => res.status(400).json({error}));
    };
  
//supprimer une sauce
exports.deleteOneSauce = (req, res, _) => { 
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'sauce supprimée.'}))
          .catch(error => res.status(400).json({ error }));  
    };  


    //accéder à une sauce route get
exports.getOneSauce = (req, res, _) => {
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => { res.status(200).json(sauce);})
  .catch((error) => {res.status(404).json({error});
});
};

//accéder à toutes les sauces
exports.getAllSauce = (_req, res, _) => {
Sauce.find()
.then((sauces) => {res.status(200).json(sauces);})
.catch((error) => {res.status(400).json({error});
});
};




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
 