//requete HTTP et reponse
const http = require('http');
const app = require('./app');

//fonction normalizePort (renvoie un port de connection valide)
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//ajout du port de connection-- si aucun port ecouter sur port 3000
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// fonction errorHandler pour rechercher les erreurs et enregister dans le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//creation de const pour appel des serveurs
const server = http.createServer(app);

//gestion des evenements serveur
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// ecouter le port
server.listen(port);
