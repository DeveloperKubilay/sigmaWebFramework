# sigmaWebFramework

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

        <img sigmaload="$[pfp]" />

</sigma>

```
# For use

```html
<beta template="id" username="wasd" data="admin">
```
