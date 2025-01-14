---
title: 2.2 Hello, World!
layout: base.liquid

prev: /blog/c-fr/installation
next: /blog/c-fr/syntax
---

*Il n'est pas obligatoire de comprendre cette partie, ce n'est qu'une prévisualisation.*

Maintenant que vous avez installé GCC et un environnement de développement intégré (IDE), créons un simple programme "Hello, World !" ("Bonjour, monde!" en anglais) en C.

**Qu'est-ce que le programme "Hello, World !"?** <br>
Le programme "Hello, World !" est un programme traditionnel qui est souvent utilisé pour introduire les débutants à un nouveau langage de programmation et vérifier si l'environnement est correctement configuré. Il s'agit d'un programme simple qui affiche "Hello, World !" à l'écran.

Voici un exemple en Python:
```py
print("Hello, World!")
```

Ou encore en Ocaml:
<pre class="language-ocaml"><code class="language-py"><span class="token keyword">print_string</span> <span class="token string">"Hello, World!\n"</span></code></pre>

Créez le fichier `main.c` dans un nouveau répertoire (où vous apprendrez C) et écrivez :

```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```
<br>

*Il n'est pas obligatoire de comprendre ce code tout de suite.*

<section class="accordion">
    <input type="checkbox" checked>
    <h4>Explication<i></i></h4>
<article>

```c
#include <stdio.h>
```
Cette ligne charge le contenu de la bibliothèque stdio, c'est une librairie qui contient une variété de fonctions pour gérer les entrées (clavier par exemple) et sorties (par exemple `printf` pour afficher dans la console).

*Pourquoi `.h` et non `.c` ? Le h signifie "header" ("en-tête" en anglais), c'est simplement un fichier qui n'est pas le principal, seulement `main.c` a l'extension `.c`.*
<br>
<br>

```c
int main() { ... }
```
Cette ligne déclare la fonction principale, c'est ici que le programme commence.  <br>
Le mot `int` définit que notre fonction `main` retournera un entier. <br>
Les symboles `{` et `}` sont utilisés pour définir le début et la fin d'un groupe d'expressions (instructions).
<br>
<br>

```c
printf("Hello, World!\n");
```
Cette ligne appelle la fonction `printf` - affiche dans la console le texte saisi comme paramètre, inclue dans stdio.h - avec une chaîne de caractères comme paramètre. <br>
<br>

*`\n` représente <!-- le christ --> un saut de ligne, on peut utiliser `printf` sans saut de ligne final.<br>
Utilisez le symbole `\` pour afficher des caractères spéciaux (appelés [caractères d'échappement](https://fr.wikipedia.org/wiki/Caract%C3%A8re_d%27%C3%A9chappement)).* <br><br>
Notez que à la fin de la ligne, nous utilisons un `;`, ce qui signifie que nous avons terminé pour cette expression, car C nous permet de sauter des lignes entre chaque mots pour rendre le code moins compact.
<br>
<br>

```c
return 0;
```
Ici, nous utilisons `return`, qui nous permet d'arrêter la fonction et de retourner la valeur spécifiée, dans ce cas `0` *(pour dire à l'ordinateur que tout s'est bien passé, nous n'allons pas nous y attarder)*.
</article>
</section>

<br>

### Compilation:
**Un compilateur est un programme qui transforme un code source en un code que la machine peut lire (par exemple un jeu vidéo ou une application).** (Source: [Wikipedia](https://fr.wikipedia.org/wiki/Compilateur))

Pour compiler notre "Hello, World!" sur Linux et Apple, il nous faut ouvrir le terminal et entrer:

```sh
gcc -o main main.c  # dans la console
```
`gcc` est l'appelle de la commande, `-o main` signifie que nous voulons nommer le binaire "main" (sans extension) et `main.c` est le fichier principal.
<br>
<br>

Pour le moment rien ne s'affiche, c'est normal, il faut l'exécuter. Toujours dans le terminal, entrer:
```sh
./main  # dans la console
```
Ici, nous demandons à l'ordinateur de démarrer le programme compilé. Vous devriez obtenir ce résultat:
```
Hello, World!
```

<!-- <section class="accordion">
    <input type="checkbox" checked>
    <h4>English version 🇬🇧<i></i></h4>
<article>

Now that you have installed GCC & an IDE, let's create a simple "Hello, World!" program in C.

**What is the "Hello, World!" program?** <br>
The "Hello, World!" program is a traditional program that is often used to introduce beginners to a new programming language & check if the environment is well setup. It's a simple program that prints "Hello, World!" to the screen.

Create the file `main.c` in a new directory (where you'll be learning C):

```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

<br>

### Compile it:
```sh
gcc -o main main.c  # in the console
```
This command tells GCC to convert our code into machine code (so that the computer can execute it). Here, a file named `main` will be created in the current directory. <br>
*The word `-o` means that we want to indicate the name of the file to be created (in this case `main`)*.

<br>

### Run it:
```sh
./main  # in the console
```
Here we tell the computer to start the compiled program. You should get this result:
```
Hello, World!
```

<br>

### Explanation:
```c
#include <stdio.h>
```
This line loads the contents of the stdio library to get the `printf` function.

```c
int main() { ... }
```
This line declares the main function, this is where the program starts. <br>
The word `int` defines that our `main` function will return an integer. <br>
The `{` & `}` symbols are used to define the beginning & end of a group of expressions.

```c
printf("Hello, World!\n");
```
This line calls the `printf` function - displays in the console the text entered as parameter - with a string as parameter, ending in `\n` to create a new line at the end of the display. <br>
Use the `\` symbol to display special characters *(named [Escape characters](https://en.wikipedia.org/wiki/.Escape_character))*. <br><br>
Note that at the end of the line we use a `;`, which means we're done for this expression, because C lets you jump lines anytime you want to make the code less compact.

```c
return 0;
```
Here we use `return`, which allows us to stop the function & return the specified value, in this case `0` *(to tell the computer that all has gone well, we won't be looking into it)*.
</article>
</section> -->
