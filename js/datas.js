"use strict";
export const tasks = ["ménage", "repassage", "lecture"];

export var objet = {
  niveau: "",
  nom: "",
  description: "",
};

export function afficheTache() {
  console.log(tasks);
}

//export default tasks; //export par défaut non utilisé ici
