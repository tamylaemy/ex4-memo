import Tache from './Tache';
import './Taches.scss';
import * as crudTaches from '../services/crud-taches';
import { useEffect } from 'react';

export default function Taches({etatTaches, utilisateur}) {
  const uid = utilisateur.uid;
  const [taches, setTaches] = etatTaches;

  /**
   * On cherche les tâches une seule fois après l'affichage du composant
   */
   useEffect(() => 
   crudTaches.lireTout(uid).then(
     taches => setTaches(taches)
   )
 , [setTaches, uid]);
  

  /**
   * Gérer le formulaire d'ajout de nouvelle tâche en appelant la méthode 
   * d'intégration Firestore appropriée, puis actualiser les tâches en faisant 
   * une mutation de l'état 'taches'.
   * @param {string} uid Identifiant Firebase Auth de l'utilisateur connecté
   * @param {Event} e Objet Event JS qui a déclenché l'appel
   */
  function gererAjoutTache(uid, e) {
    e.preventDefault();
    const texte = e.target.texteTache.value;
    if(texte.trim() !== '') {
      e.target.reset();
      crudTaches.creer(uid, {texte: texte, completee: false}).then(
        // Actualiser l'état nouvelleTache avec l'identifiant de la tâche ajoutée
        docTache => setTaches([...taches, {id: docTache.id, ...docTache.data()}])
      );
    }
  }

  function basculerTache(idTache, completee) {
    crudTaches.basculer(utilisateur.uid, idTache, completee).then(
      () => {
        setTaches(taches.map(tache => {
            if(tache.id == idTache){
              tache.completee = !completee;
            }
            return tache;
        }))
      }
    )
  }

  function supprimerTache(idTache) {
    crudTaches.supprimer(uid, idTache).then(
      () => {
        setTaches(taches.filter(t => t.id !== idTache))
      }
    )
  }

  return (
    <section className="Taches">
      <form onSubmit={e => gererAjoutTache(uid, e)}>
        <input 
          type="text"   
          placeholder="Ajoutez une tâche ..." 
          name="texteTache"
          autoComplete="off" 
          autoFocus={true} 
        />
      </form>
      <div className="listeTaches">
        {
          taches.map(tache => <Tache key={tache.id} {... tache} basculerTache = {basculerTache} supprimerTache = {supprimerTache} uid = {uid} />)
        }
      </div>
    </section>
  );
}