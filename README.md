# AUTOCOMPLETE

'Autocomplete' is an API running on Node JS.

The API renders a json file with a 4-word maximum matching a data dictionary with a get request with parameters.

**exemple**

`http://localhost:5050/autocomplete?query=john`

will render 

```
[
"john doe",
"john lennon",
"john jackson",
"john wayne"
]
```

## HOW TO USE IT

install node JS (https://nodejs.org/en/download/)

**- Launch** :

open a terminal on root folder and launch `node index.js`

**- Add words in dictionary file** : 

edit './datas/dictionary.js'

```js
module.exports = {
datas :
`
john doe
john lennon
john jackson
john wayne
/END/
`
}
```

**! Important !** don't remove `/END/` line

**- Call to the API** : 

make a GET request on 

http://localhost:5050/autocomplete?query=johndoe

## DETAIL DE L'APPROCHE

Afin de limiter le temps de réponse j'ai fais le choix de ne pas générer un tableau à partir de la méthode `split()` mais de chercher directement la première occurence du mot cherché dans la liste.

Une fois la première occurence trouvée, le programme réalise une boucle à partir de l'index de l'occurence jusqu'à l'index du quatrième retour à la ligne `\n`.

Ainsi le programme récupère les 4 mots suivants du dictionnaire puis filtre ceux correspondant à la requête.

Cela évite de poursuivre la boucle jusqu'à la fin du dictionnaire qui pourrait s'avérer long.

**Ajout d'un endpoint dans le dictionnaire**

Dans un souci d'amélioration des performances, la solution que je propose nécessite d'ajouter '\ENDPOINT\' à la fin du dictionnaire.

Cela permet d'éviter de devoir parcourir l'ensemble du dictionnaire afin de déterminer sa longueur et de stopper le script dans la situation où la boucle atteint la dernière ligne.

### Limite de cette approche
cette approche évite de boucler sur l'ensemble du dictionnaire et permet donc un rendu plus rapide.
Il faut néanmoins que les mots soient bien inscrits par ordre alphabétique dans le dictionnaire.

Pour avoir cette garantie, nous pourrions réaliser un script qui ordonne les mots et que l'on déclenche à chaque mise à jour du fichier.

## PERSPECTIVES D'EVOLUTIONS

Si le dictionnaire de données devient important, il pourrait être intéressant d'indexer les mots afin de faciliter la recherche des correspondances.

Ainsi nous pourrions imaginer un script que l'on déclenche à chaque mise à jour du dictionnaire pour génerer un fichier js avec les mots répartis selon l'alphabet.

**Exemple**

```js
words = {
    a: ['antivirus', 'application security', 'assets'],
    b: ['business impact assessment'],
    ...etc
}
```

**Le script permettant de générer ce fichier**

créer un dossier `script` à la racine du projet puis créer dedans un fichier `'indexing.js'`

```js
const fs = require('fs');
let dictionary = require('../datas/dictionary');

const createIndexFile = function() {

    const letters = 'abcdefghijklmnopqrstuvwxyz';

    dictionary = dictionary.datas.split('\n');

    let indexedDictionary = {};

    for(let letter of letters) {

        // Creating empty array for each letter of alphabet
        indexedDictionary[letter] = [];

        // Loop on each word of dictionary and adding them in object indexedDictionary
        for(let word of dictionary) {
            if(word[0] == letter) {
                indexedDictionary[letter].push(word)
            }
        }
    }

    // Stringify result to create file indexedDictionary.js
    let jsonDictionary = JSON.stringify(indexedDictionary);

    // Creating file
    fs.appendFileSync('./datas/indexedDictionary.js',
        `module.exports =` + jsonDictionary
    );
}

createIndexFile();
```

**Lancer le script**

Se mettre à la racine du projet et saisir dans l'invite de commandes : `node scripts/indexing.js`

Cela générera un fichier 'indexedDictionary.js' dans le dossier datas avec la forme suivante
```js
module.exports ={"a":["antivirus","application security","asset","attack surface","authorization"],"b":["business impact assessment"],"c":["cloud computing","computer network defense analysis","computer network defense infrastructure support","computer security incident","cryptanalysis","cryptographers","cryptographic algorithm","cryptography","cryptology"],"d":["data breach","data integrity","data leakage"],"e":[],"f":[],"g":[],"h":["hacker","hash value","hashing"],"i":[],"j":[],"k":["key","keylogger"],"l":[],"m":["malicious code","malware"],"n":[],"o":[],"p":[],"q":[],"r":[],"s":["symmetric cryptography","symmetric encryption algorithm"],"t":[],"u":[],"v":[],"w":[],"x":[],"y":[],"z":[]}
```

Nous pourrions ensuite exploiter ce fichier en utilisant la méthode `filter` dans notre programme et en limitant le nombre d'occurence à quatre.

## AUTRES EVOLUTIONS POSSIBLES

Afin de faciliter l'utilisation de l'API par des personnes ayant des données qui peuvent prendre des formes différentes, il faudrait ajouter au script la gestion des cas ou chaque mot du dictionnaire serait séparé par une virgule, un tiret, un point.

**Gestion de la pertinence des suggestions faites**

Je propose de retourner un json comprenant :

- jusqu'à 4 occurences "directes" (mots commençant par les lettres de la requête)
- Ainsi que jusqu'à 2 occurences "indirectes" (mots composés comprenant les lettres de la requête)

Exemple :

```
[
"cryptanalysis",
"cryptographers",
"cryptographic algorithm",
"cryptography"
],
[
"symmetric cryptography",
"symmetric encryption algorithm"
]
```
