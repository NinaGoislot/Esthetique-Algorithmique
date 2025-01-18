# S2 | Workshop - Esthétique algorithmique
> Par Paul Marchiset & Nina Goislot

Bienvenue le github du projet MUSIKOLOR !

## Table des matières
- [ 📝 Indications](#-indications)
- [ 📁 Organisation des fichiers](#-organisation-des-fichiers)
- [ 📁 Décomposition du fichier principal](#-décomposition-du-du-fichier-principal)
- [ 👩‍💻 Grandes étapes du code](#-grandes-étapes-du-code)

## 📝 Indications
**Ce document à pour objectif d'expliquer le processus du code afin de mieux se repérer lors de sa lecture.**  

informations générales : 
- Système d'exploitation utilisé : *Windows 10 / Windows 11*
- IDE : *VS code*
- Librairie(s) manipulée(s) : *p5.js*

## 📁 Organisation des fichiers

**► concepts.json**

    Contient les données initiales de chaque concept : 
    - Son id
    - Son nom
    - Ses couleurs associées
    - Le couple auquel il appartient

    Tous les concepts ont un binôme, ils sont appelés "couple". Tout au long du code, le concept associé au "négatif" (Cold, Passive, Dull) sera représenté par la valeur 1 dans le couple, tandis que le concept à connotation positive (Warm, Active, Bright) l'est par la valeur 2.

[Code source des données](./data/concepts.json)

**► sketch.js**

    Algorithme principal utilisé pour la gestion de l'affichage du canvas, pour l'analyse des paramètres choisis par l'utilisateur ainsi que pour la lecture et la représentation graphique des résultats.

[Code source du fichier sketch.js](./src/js/sketch.js)


**► colors.js**

Cet algorithme est dédié à la page ```color.html``` seulement.

    Le programme affiche les palettes de couleurs, minicieusement choisies pour chaque concept, au sein d'une même page. Cette page est accessible depuis un lien sur 'index.html'.

    Les couleurs, initialement sous format HSB, sont recalculées en format RVB et la couleur du texte s'adapte à la luminance (blanc ou noir), respectant les normes de contraste du W3C.

[Code source du fichier color.js](./src/js/color.js)


**► script.js**

    Adapte la couleur de chaque slider en fonction de la propriété qui l'influe le plus. Par exemple : 

    Temperature -> Hue
    Action -> Saturation
    Vibe -> Brigthness

[Code source du fichier script.js](./src/js/script.js)


## 📁 Décomposition du du fichier principal

Le code dont il est question ici est issu de [sketch.js](./src/js/sketch.js).

---

Tous le code est découpé en grandes sections (séparées par un gros commentaire). A chaque section sa particularité : 

- **Données :** Gère les variables des données des couleurs
- **DEBUG :** Permet d'activer ou désactiver les commentaires dans la console pour un suivi des variables manipulées. Divisé en plusieurs parties (car le code est conséquent ici).

*⚠️ Pour afficher les étapes du code dans la console, la constante concernée est "DEBUG_STEP_CODE_ON"*

- **Déclaration :** Zone pour déclarer toutes les variables ou constantes globales. 

*⚠️ L'affichage de la composition est entièrement dynamique. On peut tester de générer les couleurs avec un set de 3 couleurs, avec 6 grilles différentes, 40 sets, 2 lignes par griles, ect. Toutes les valeurs sont modifiables ici (ligne 23):  "*

```js
    const MAX_SETS = 20; // Nombre de sets générés
    const COLORS_BY_SET = 4; //Nb couleurs par ligne de chaque bloc (largeur d'une grille)
    const SETS_BY_GRID = 4; //Nb de lignes de chaque bloc (hauteur)
    const PERCENTS_DEFAULT = 50; // % d'origine de chaque concept
```
*(vous pouvez tester !)*

- **Canvas :** Gère le chargement des données et l'affichage p5, les grilles générées. 

- **Functions :** Fonctions des étapes du code pour le décomposer en plusieurs parties.  

- **Animation :** Gère la lecture de la composition sous forme musicale

- **Utilities :** Regroupe les petites fonctions appelées plusieurs fois dans le code pour réduire les fonctions principales. 

- **Event listeners :** ajout des écouteurs nécessaires au fonctionnement de l'analyse des concepts et de la lecture de la partition. 



## 👩‍💻 Grandes étapes du code

Le code dont il est question ici est issu de [sketch.js](./src/js/sketch.js).


    Étape 1 :

*function preload() & function load()*

On `charge` les données du fichier json

    Étape 2 :

*function setup()*

On `setup` le canvas

    Étape 3 :

*function draw() avec play=false*

On `draw` la première fois la base du canvas

    Étape 4 :

*function getTabPossibleColors()*

On `récupère` les couleurs de chaque concept

    Étape 5 :

*function setCurrentSet()*

On `prépare` la génération d'un nouveau set

    Étape 6 :

*function setCurrentSet()*

Pour chaque couleur du set (4 couleurs), on `créer un tableau des couleurs possibles` en bouclant sur toutes les couleurs des concepts. Les couleurs sont définies comme "possibles" selon un mécanisme précis : 

- `1ère couleur du set :` Doit être une couleur qui s'inscrit dans tous les concepts dominants selon le % du slider (ex : Une couleur à la fois froide, terne, et active)

- `2ème couleur du set :` Même logique que pour la première, sauf qu'il existe une probabilité qui permet d'ignorer un ou plusieurs concepts dit "dominant". (ex : Une couleurs à la fois froide & active au lieu de froide & terne & active)

- `3ème couleur du set :` On récupère la palette de couleur issu du concept avec le plus haut taux de pourcentage venant du slider

- `4ème couleur du set et plus :` Chaque pourcentage de chaque slider se transforme en une probabilité pour chaque concept de voir sa palette utilisée pour les couleurs possibles de la couleur. 

Avec cet algorithme, les sets générés tolèrent de plus en plus les couleurs externes à celles demandées à l'origine, sans pour autant les forcer et permettant une génération de sets uniques à chaque fois, même si les paramètres initiaux sont les mêmes.


    Étape 7 :

*function setCurrentSet()*

On `choisi` chaque couleur du set en prenant une `couleur au hasard` de chaque `tableau des couleurs possibles`. 


    Étape 8 :

*function setCurrentSet()*

On `enregistre` le set final calculé et on repasse au reste de la fonction draw(). 


    Étape 9 :

*function checkGridHue() && ajustHue*

On cherche à `correspondre parfaitement aux % voulus` de Warm ou Cold, à 5% près (pas de marge d'erreur si le pourcentage voulu est de 100%). Si une grille a trop de couleurs "Warm" ou pas assez de couleurs "Warm", on va `ajuster la composition`. 

*Il existe également des fonctions `checkGridSat() && ajustSat` et `checkGridBright() && ajustBright` pour retravailler les couleurs passives/actives et ternes/lumineuses. Ces fonctions sont encore à retravailler car elles ne fournissaient pas de résultats esthétiques attendus. Elles sont donc mises de coté, mais bien présentes et fonctionnelles en l'état.*


    Étape finale :

*function reDraw()*

On `redessine la composition` avec les nouvelles valeurs. La partition est prête !


    Étape Bonus : Jouer la partition

*⚠️ Activer le son !*

*function playAnimation() & draw()*

Cliquer sur le bouton "Play" prépare l'état d'animation de la partition. On `redéfini la fonction draw()` comme étant une boucle et on change son fonctionnement : 

- On adapte le framerate en fonction des paramètres de luminance
- On associe la hue et la saturation à un type de note
- On fait défiler les couleurs de la partition au rythme du framerate en jouant sur l'opacité

A la fin, la partition s'arrête et toutes les couleurs retrouvent leur opacité d'origine. 

