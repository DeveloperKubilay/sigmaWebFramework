# sigmaWebFramework

# Installation
```sh
npm install express ws ansi-colors chokidar mime
```

# Create template
```html
<sigma template="id"> You can think of it as a new class, give it a name

        <issigma data="username=='Qplay' ? 1 : 0"> Working with eval
            <h1> ![username ? "Hello" : "Hi"] </h1> Working with eval
    
            <elifsigma data="IsABot">
              <h1> $[username] </h1> Static not eval 
            </elifsigma>
    
            <elsesigma>
                <h1> idk u </h1>
            </elsesigma>
        </issigma>

        <img data-sigmaload="$[pfp]" />

</sigma>

```
# For use

```html
<beta template="id" username="wasd" data="admin">
```

# Framework
```html
<!--
const Layout = ./layout.html;
const Test = ./test.html;
-->
<Layout pagetitle="sigmawebframework",evet="evetttttttt">
    <a href="https://www.google.com">link bunlar</a>
    <Test>
        <h1>deneme</h1>
    </Test>
</Layout>
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> </pagetitle> </title>
    <link href="/tailwind.css" rel="stylesheet">
</head>
<body class="bg-black text-white">
    </evet>
    <br>
    <slot></slot>
</body>
</html>
```
