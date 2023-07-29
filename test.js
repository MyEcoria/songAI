const readline = require('readline');
const fs = require('fs');

const inputFile = 'input.json';
const outputFile = 'output.txt';

// Créer une interface de lecture pour lire le fichier ligne par ligne
const rl = readline.createInterface({
  input: fs.createReadStream(inputFile),
  crlfDelay: Infinity
});

// Tableau pour stocker les textes extraits du fichier JSON
const allTexts = [];

// Fonction pour extraire le texte de chaque ligne JSON et l'ajouter au tableau
function extractTextFromLine(line) {
  try {
    const jsonData = JSON.parse(line);
    if (jsonData.hasOwnProperty('text')) {
      allTexts.push(jsonData.text);
    }
  } catch (error) {
    console.error('Erreur lors de l\'extraction du texte :', error.message);
  }
}

// Écouteur d'événement 'line' pour chaque ligne lue
rl.on('line', extractTextFromLine);

// Écouteur d'événement 'close' une fois que tout le fichier a été lu
rl.on('close', () => {
  // Écrire tous les textes dans le fichier de sortie avec des sauts de ligne
  fs.writeFile(outputFile, allTexts.join('\n'), (err) => {
    if (err) {
      console.error('Erreur lors de l\'écriture dans le fichier de sortie.');
    } else {
      console.log('Tous les textes ont été écrits dans le fichier de sortie.');
    }
  });
});
