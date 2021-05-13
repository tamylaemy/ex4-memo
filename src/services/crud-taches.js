import firebase from 'firebase/app';
import { collUtil, collTaches } from './config';
import { instanceFirestore } from './firebase-initialisation';

/**
 * Créer une nouvelle tâche pour l'utilisateur connecté
 * @param {string} uid identifiant d'utilisateur Firebase 
 * @param {Object} tache document à ajouter aux tâches de l'utilisateur
 * @returns {Promise<null>} Promesse sans paramètre
 */
export async function creer(uid, tache) {
  // On ajoute la propriété 'date' à l'objet représentant la tâche en prenant la 
  // date du serveur Firestore.
  tache.date = firebase.firestore.FieldValue.serverTimestamp();
  return instanceFirestore.collection(collUtil).doc(uid).collection(collTaches)
    .add(tache).then(
      tacheRef => tacheRef.get()
    );
}

/**
 * Obtenir toutes les tâches d'un utilisateur
 * @param {string} uid identifiant d'utilisateur Firebase 
 * @returns {Promise<any[]>} Promesse avec le tableau des tâches
 */
export async function lireTout(uid) {
  const taches = [];
  return instanceFirestore.collection(collUtil).doc(uid).collection(collTaches)
                .orderBy('date', 'desc')
                .get()
                .then(
                  reponse => reponse.forEach(
                    doc => {
                      taches.push({id: doc.id, ...doc.data()})
                    }
                  )
                ).then(
                  () => taches
                );

}

export async function basculer(uid, idTache, completee) {
  if(completee == true) {
    return instanceFirestore.collection(collUtil).doc(uid).collection(collTaches).doc(idTache).update(
        {completee: false}
      )
  }
    else{
      return instanceFirestore.collection(collUtil).doc(uid).collection(collTaches).doc(idTache).update(
        {completee: true}
      )
    }
}

export async function supprimer(uid, idTache) {
  return instanceFirestore.collection(collUtil).doc(uid).collection(collTaches).doc(idTache).delete();
}

