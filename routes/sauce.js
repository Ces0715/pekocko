const express = require('express');
const router = express.Router();
//const auth = require('../middleware/auth');
//const multer = require('../middleware/multer-config');
//const saucesCtrl = require('../controllers/sauces');




const Sauce = require('../models/Sauce');

router.post('/', (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
    delete sauceObject._id;
    // Création d'une instance du modèle Sauce
    const sauce = new Sauce({
     ...sauceObject,
     // On modifie l'URL de l'image, on veut l'URL complète, quelque chose dynamique avec les segments de l'URL
     imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

router.get('/:id', (req, res, next) => {
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
    }
  );
});

router.put('/:id', (req, res, next) => {
  
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

router.delete('/:id', (req, res, next) => {
  Sauce.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

router.get('/:id',(req, res, next) => {
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
  

router.get('/', (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

});
//router.post('/', auth,multer, saucesCtrl.createSauce);
//router.put('/:id', auth,multer, saucesCtrl.modifySauce);
//router.delete('/:id', auth, saucesCtrl.deleteSauce);
//router.get('/:id', auth, saucesCtrl.getOneSauce);
//router.get('/', auth, saucesCtrl.getAllSauces);
//router.post('/:id/like', auth, saucesCtrl.likeSauce);
module.exports = router;


