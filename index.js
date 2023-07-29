const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const Genius = require('genius-lyrics-api');

// Remplacez 'YOUR_GENIUS_ACCESS_TOKEN' par votre token d'accès Genius (obtenu après inscription sur leur site)
const geniusAccessToken = 'u-gtlC4mUsPwFh040HX6Oby4xffGWOS6Fi80USGnTsnVxuorIFeVj_us0-gg5RO5';

// Fonction pour récupérer toutes les chansons d'un auteur depuis Genius
async function getAllSongs(artistName) {
  const searchUrl = `https://genius.com/artists/${encodeURIComponent(artistName)}`;
  
  try {
    const response = await axios.get(searchUrl);
    const $ = cheerio.load(response.data);

    const songs = [];

    $('.mini_card').each((index, element) => {
      const title = $(element).find('.mini_card-title').text().trim();
      songs.push(title);
    });

    return songs;
  } catch (error) {
    throw new Error('Impossible de récupérer les chansons de l\'auteur.');
  }
}

// Fonction pour récupérer les paroles d'une chanson depuis Genius
async function getLyrics(songTitle, artistName) {
  const options = {
    apiKey: geniusAccessToken,
    title: songTitle,
    artist: artistName,
    optimizeQuery: true
  };

  try {
    const lyrics = await Genius.getLyrics(options);
    return lyrics;
  } catch (error) {
    throw new Error(`Impossible de récupérer les paroles de "${songTitle}".`);
  }
}

// Fonction principale pour récupérer toutes les paroles et les enregistrer dans all.txt
async function fetchAndSaveAllLyrics(artistName) {
  const allSongs = await getAllSongs(artistName);
  
  const allLyrics = [];
  for (const songTitle of allSongs) {
    try {
      const lyrics = await getLyrics(songTitle, artistName);
      allLyrics.push(`[ ${songTitle} ]\n${lyrics}\n`);
    } catch (error) {
      console.error(error.message);
    }
  }

  fs.writeFile('all.txt', allLyrics.join('\n'), (err) => {
    if (err) {
      console.error('Erreur lors de l\'enregistrement des paroles dans all.txt');
    } else {
      console.log('Toutes les paroles ont été enregistrées dans all.txt');
    }
  });
}

// Appel de la fonction principale avec le nom de l'artiste
const artistName = 'Lomepal'; // Remplacez par le nom de l'artiste souhaité
fetchAndSaveAllLyrics(artistName);
