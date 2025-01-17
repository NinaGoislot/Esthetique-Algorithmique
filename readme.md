Nina Goislot et Paul Marchiset

Workshop - Esthétique algorithmique

<h2>Explication des algorithmes</h2>

```
sketch.js
```

Cet algorithme principal est utilisé pour l'analyse des paramètres choisis par l'utilisateur ainsi que pour la lecture et la représentation graphique de ces derniers sur le "canvas".

Après avoir initialisé de nombreuses variables, l'algorithme récupère les valeurs correspondant à chaque couple de concepts (chaud/froid ; actif/passif ; brillant/terne).




```
color.js
```

Cet algorithme est dédié à la page ```color.html```.

Le programme récupère d’abord les ensembles de palettes de couleurs

Ensuite, pour chaque set de couleurs, je créé un wrapper pour avoir à l’intérieur, le nom de ma palette de couleur ; un canva qui, à l’aide de p5, affichera la palette avec un espacement entre  les couleurs ; une div pour les informations des couleurs (leur code hexadécimal).

Pour calculer le code hexadécimal à partir de la valeur HSB, j’utilise p5 pour obtenir les valeurs de red, green et blue. Une fonction transforme ces valeurs en code hexadécimal en arrondissant déjà les valeurs à l’excès que je peux ensuite transformer sans problèmes.

Pour trouver la bonne couleur de texte, en respectant les normes de contraste du W3C, un fonction calcule la luminance de chaque couleur pour que le texte soit blanc ou noir en fonction de la luminance.