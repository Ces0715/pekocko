 // On stocke les données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
 const sauceObject = JSON.parse(req.body.sauce);
 // On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
 delete sauceObject._id;
 // Création d'une instance du modèle Sauce
 const sauce = new Sauce({
   ...sauceObject,
   // On modifie l'URL de l'image, on veut l'URL complète, quelque chose dynamique avec les segments de l'URL
   imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
   likes: 0,
   dislikes: 0,
   usersLiked: [],
   usersDisliked: []
 });


 


   // Sauvegarde de la sauce dans la base de données
   sauce.save()
     // On envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête
     .then(() => res.status(201).json({
       message: 'Sauce enregistrée !'
     }))
     // On ajoute un code erreur en cas de problème
     .catch(error => res.status(400).json({
       error
     }));
   

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


      exports.likeSauce = (req, res, next) => {
        const like = req.body.like;
        if (like === 1) { // Option like
          Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Vous aimez cette sauce !' }))
      
            .catch(error => res.status(400).json({ error }))
        } else if (like === -1) { // Option dislike
          Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Vous n\'aimez pas cette sauce !' }))
            .catch(error => res.status(400).json({ error }))
      
        } else {    // Annuler like ou dislike
          Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
              if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id })
                  .then(() => res.status(200).json({ message: 'Vous n aimez plus cette sauce !' }))
                  .catch(error => res.status(400).json({ error }))
              }
              else if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id })
                  .then(() => res.status(200).json({ message: 'Vous aimez cette sauce !' }))
                  .catch(error => res.status(400).json({ error }))
              }
            })
            .catch(error => res.status(400).json({ error }));
          next();
        };
      
      };





      // Création du like et dislike
exports.likeDislike = (req, res, _) => {
  // Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
  // Like présent dans le body
  let like = req.body.like
  // On prend le userID
  let userId = req.body.userId
  // On prend l'id de la sauce
  let sauceId = req.params.id

  if (like === 1) { // Si il s'agit d'un like
    Sauce.updateOne({
      _id: sauceId
    }, {
      // On push l'utilisateur et on incrémente le compteur de 1
      $push: {
        usersLiked: userId
      },
      $inc: {
        likes: +1
      }, // On incrémente de 1
    })
      .then(() => res.status(200).json({
        message: 'j\'aime ajouté !'
      }))
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === -1) {
    Sauce.updateOne( // S'il s'agit d'un dislike
      {
        _id: sauceId
      }, {
      $push: {
        usersDisliked: userId
      },
      $inc: {
        dislikes: +1
      }, // On incrémente de 1
    }
    )
      .then(() => {
        res.status(200).json({
          message: 'Dislike ajouté !'
        })
      })
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
    Sauce.findOne({
      _id: sauceId
    })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) { // Si il s'agit d'annuler un like
          Sauce.updateOne({
            _id: sauceId
          }, {
            $pull: {
              usersLiked: userId
            },
            $inc: {
              likes: -1
            }, // On incrémente de -1
          })
            .then(() => res.status(200).json({
              message: 'Like retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
        if (sauce.usersDisliked.includes(userId)) { // Si il s'agit d'annuler un dislike
          Sauce.updateOne({
            _id: sauceId
          }, {
            $pull: {
              usersDisliked: userId
            },
            $inc: {
              dislikes: -1
            }, // On incrémente de -1
          })
            .then(() => res.status(200).json({
              message: 'Dislike retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
      })
      .catch((error) => res.status(404).json({
        error
      }))
  }
}
