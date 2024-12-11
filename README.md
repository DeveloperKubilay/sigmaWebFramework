# sigmaWebFramework

# Create template
```html
<sigma template="id"> You can think of it as a new class, give it a name
    <issigma data="username=wasd">
        <h1> $[username] </h1>

        <elifsigma data="admin">
          <h1> Admin </h1>
        </elifsigma>

        <elsesigma>
            <h1> idk u </h1>
        </elsesigma>

</sigma>

```
# For use

```html
<beta template="id" username="wasd" data="admin">
```
