"use strict";

/*****
 *@param {string} key nom de la clé correspondant à l'item dans le localStorage
 *@param(Array) list Tableau de données à stocker
 //
 **/

//Sauvegarde dans le localStorage au format JSON
export function save(key, list) {
  //transformation du tableau list en fichier JSON --> sérialisation
  window.localStorage.setItem(key, JSON.stringify(list));
}

//Récupération des données stockées dans le localStorage au format JSON vers le
//format tabeau --> désérialisation
export function load(key) {
  //Si pas de données dans le localStorage alors un tableau nul
  const datas = window.localStorage.getItem(key);
  //Désérialisation du fichier JSON en tableau
  return datas != null ? JSON.parse(datas) : [];
}
