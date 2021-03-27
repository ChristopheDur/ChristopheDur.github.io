"use strict";

import { save, load } from "./storage.js";

/****
 * VARIABLES GLOBALE
 *
 */
let form;

let STORAGE = "todolist"; //Clé de l'item (key) stocké dans le localStorage

let taskList = [];

let index;

/*************************
 * FONCTIONS
 *************************/

/***
 * Fonction pour montrer le formulaire
 */

function showForm() {
  //On passe la variable data-mode du formulaire en mode "add" (ajout de données)
  form.dataset.mode = "add";
  //On vide le formulaire
  form.reset();
  //permet d'afficher le formulaire
  form.classList.toggle("hide");
}

/**
 *
 * fonction pour afficher la liste des taches (voir lancement de la page HTML)
 */
function displayTasks() {
  //Récupération des taches enregistrées dans le localStorage
  let taskList = load(STORAGE);
  //On met à null la chaine pour créer une liste vide au départ
  document.querySelector("#todo").innerHTML = "<ul></ul>";
  const UL = document.querySelector("#todo ul");
  //console.log(UL);

  taskList.forEach((task, index) => {
    //si le niveau de la tache = 100 alors on ajoute la barre avec une condition ternaire
    //Création d'un lien avec un data-index pour identifier le lien cliqué
    UL.insertAdjacentHTML(
      "beforeend",
      `<li>
      <a class="task ${
        task.lvl == 100 ? "barre" : ""
      }" data-index="${index}"> ${task.label} - ${task.lvl}%</a>
      </li>`
    );
  });

  //on ajoute un gestionnaire d'événement pour chaque élément de la liste
  document
    .querySelectorAll("#todo .task")
    .forEach((a) => a.addEventListener("click", showDetail));
}

/***
 * Fonction pour Enregistrer le formulaire
 */
function saveTask(event) {
  //on annule le comportement par défaut de soumission du formulaire en php
  event.preventDefault();
  //load doit retourner ce qu'il y a dans le localStorage et le parser
  let taskList = load(STORAGE);

  //cibler et récupérer la valeur du nom, du level et de la description (la value du champ)
  const newTask = {
    label: document.querySelector("#name").value,
    lvl: document.querySelector("#lvl").value,
    desc: document.querySelector("#description").value,
  };
  //On récupère l'index de la tache avec le numéro du lien <a>
  let index = document.querySelector("#task-details a").dataset.index;

  //L'index permet de récupérer la ligne dans le tableau correspondant à la liste
  console.log("index :" + index);
  let task = taskList[index];

  if (form.dataset.mode == "add") {
    //Si le formulaire est en data-mode= "add" (ajout)
    //On ajoute une nouvelle tâche à la liste
    taskList.push(newTask);
  } else {
    //Si le formulaire est en data-mode= "edit" (édition)
    //sinon on remplace la tâche existante par la nouvelle tâche à l'index correspondant dans la taskList
    taskList.splice(index, 1, newTask); // autre façon
    //On vient mettre à jour la ligne taskList
    //taskList[index] = task;
  }

  //Enregistrement de la liste dans le localStorage
  save(STORAGE, taskList);
  console.log(taskList);
  //On referme le formulaire
  form.classList.add("hide");
  //On affiche la liste

  alert("Afficher la liste maintenant");
  //On affiche la liste des tâches
  displayTasks();
}

/******
 * Fonction permettant l'affichage du détail d'une tâche sélecionnée parmi la liste des tâches
 */
function showDetail() {
  console.log(this);
  //On récupère le numéro d'index de la ligne sélectionnée
  //this contient la balise qui a déclenché l'événement
  index = this.dataset.index;

  console.log(index);
  const ASIDE = document.querySelector("#task-details");
  //console.log(UL);

  //On récupère la taskList depuis le localStorage
  let taskList = load(STORAGE);
  //L'index permet de récupérer la ligne dans le tableau correspondant à la liste
  let task = taskList[index];

  //Pas d'injection ici, on remplace entièrement le contenu de la balise h3
  //On ajoute une icone check si tâche réalisée dans le détail de la liste
  document.querySelector("#task-details h3").innerHTML =
    (task.lvl == 100 ? `<i class="fas fa-check"></i>&nbsp;` : "") +
    task.label +
    "-" +
    task.lvl +
    "%";

  // document.querySelector("#task-details h3").textContent =
  //   task.label + "-" + task.lvl + "%";
  document.querySelector("#task-details p").textContent = task.desc;
  //on rajoute la valeur de l'index au dataset data-index du lien <a href="#">
  //on récupère l'index dans le dataset.index du lien "Editer cette tâche"
  document.querySelector("#task-details a").dataset.index = index;
  //on récupère l'index dans le dataset.index du lien "Supprimer cette tâche"
  document.querySelector("#supprimer").dataset.index = index;
  console.log(task.lvl);

  //On affiche le détail de la liste  #task-details
  ASIDE.classList.remove("hide");
}

/***
 * Fonction pour éditer une tâche après avoir cliqué sur le lien correspondant dans Editer cette tache
 * à l'aide du même formulaire
 */

function editTask() {
  const SELECT = document.querySelector("#name");
  const INPUT = document.querySelector("#lvl");
  const TEXT = document.querySelector("#description");

  //On masque le détail de la tâche que l'on souhaite modifier
  document.querySelector("#task-details").classList.add("hide");

  //On recharge la taskList depuis le localStorage
  let taskList = load(STORAGE);
  //On récupère le dataset.index du lien hypertexte sur lequel on a cliqué avant
  let index = this.dataset.index;
  //L'index permet de récupérer la ligne dans le tableau correspondant à la liste
  let task = taskList[index];

  //Mise à jour du formulaire avec les données récupérées dans le localStorage
  //grâce à l'index récupérée en cliquant sur le lien de la tâche via le data-index
  SELECT.value = task.label;
  INPUT.value = task.lvl;
  TEXT.value = task.desc;

  //On passe le formulaire en mode edition data-mode="edit" pour pouvoir le modifier
  form.dataset.mode = "edit"; //on change le data-attribute du formulaire en mode edit

  //On affiche le formulaire avec les champs mis à jour en supprimant la classe "hide"
  form.classList.remove("hide");
}

/***
 * Fonction pour supprimer toutes les tâches du localStorage
 * à l'aide du bouton #clear-todo
 * */

function deleteTodo() {
  //Enregistrement d'une liste vide dans le localStorage ( taskList = [] )
  save(STORAGE, []);
  //localStorage.clear(STORAGE);
  // Mise à jour de la liste des tâches en vidant la liste via la fonction displayTask
  displayTasks();
}

/***
 * Fonction pour supprimer la tâche séléctionnée dans le localStoragelien
 * à l'aide du lien supprimer
 * */

function deleteTask() {
  //load récupère les objets qu'il y a dans le localStorage et les parse
  let taskList = load(STORAGE);
  //On masque le détail de la tâche que l'on souhaite supprimer
  document.querySelector("#task-details").classList.add("hide");

  index = this.dataset.index;
  //L'index permet de récupérer la ligne dans le tableau correspondant à la liste

  //On supprime la ligne correspondant à l'index dans la taskList
  if (index > -1) {
    // Si l'index existe dans la taskList alors il est supprimé
    taskList.splice(index, 1);
  } else {
    alert("L'article n'existe pas dans la liste");
  }
  //On enregistre la nouvelle liste dans le localStorage
  save(STORAGE, taskList);

  // Mise à jour de la liste des tâches en vidant la liste via la fonction displayTask
  displayTasks();
}

/****************
 * CODE PRINCIPAL
 */

document.addEventListener("DOMContentLoaded", () => {
  //On affiche la liste des tâches dès le chargement de la page HTML
  displayTasks();
  form = document.querySelector("#task-form");
  //au clic sur add-Task on appelle la fonction ShowForm qui fait apparaitre le formulaire()
  document.querySelector("#add-task").addEventListener("click", showForm);

  //Listener pour enregistrer une tâche
  form.addEventListener("submit", saveTask);

  //Listener pour editer une tâche en cliquant sur le lien de la tâche
  document.querySelector("#task-details a").addEventListener("click", editTask);

  //Listener pour editer une tâche en cliquant sur le lien de la tâche
  document.querySelector("#supprimer").addEventListener("click", deleteTask);

  //Listener pour effacer toutes les tâches de la liste
  document.querySelector("#clear-todo").addEventListener("click", deleteTodo);
});
