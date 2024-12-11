document.addEventListener("DOMContentLoaded", () => {
    searchSigma(document);

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return; 

                    const tagName = node.tagName;
                    if (tagName === 'DIV') {
                        searchSigma(node);
                        setTimeout(() => searchBeta(node), 100);
                    } else if (tagName === 'SIGMA') {
                        searchSigma(node, true);
                    } else if (tagName === 'BETA') {
                        searchBeta(node);
                    }
                });
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    setTimeout(() => searchBeta(document), 150);
});

console.log("Sigma loaded");

const database = {};

function searchSigma(x, single = false) {
    const sigmaElements = single ? [x] : x.querySelectorAll('sigma');
    sigmaElements.forEach((element) => {
        database[element.getAttribute('template')] = element;
        element.style.display = 'none';
    });
}

function searchBeta(x, single = false) {
    const betaElements = single ? [x] : x.querySelectorAll('beta');
    betaElements.forEach((element) => {
        const template = database[element.getAttribute('template')];
        if (!template) return;

        const attributes = Array.from(element.attributes)
            .filter(attr => attr.name !== 'template' && !attr.name.includes('astro'))
            .map(attr => ({ name: attr.name, value: attr.value }));
        const names = attributes.map(attr => attr.name);
        const values = attributes.map(attr => attr.value);

        let tempData = template.innerHTML;

        template.querySelectorAll('issigma').forEach((issigma) => {
            let prompt = issigma.getAttribute('data')

            let wegetsolision = false;
            try{
                const res = new Function(...names, 'return '+prompt)(...values)
                if(res) wegetsolision = res;
            }catch {wegetsolision = false};

            
            if(wegetsolision){
                tempData = tempData.replaceAll(issigma.querySelector('elsesigma').outerHTML, "");
                tempData = tempData.replaceAll(issigma.querySelector('elifsigma').outerHTML, "");
            }
            else{
                let found = false;
                issigma.querySelectorAll('elifsigma').forEach((elifsigma) => {
                    let elifPrompt = elifsigma.getAttribute('data')
                    let wegetsolision = false;
                    try{
                    const res = new Function(...names, 'return '+elifPrompt)(...values)
                    if(res) wegetsolision = res;
                    }catch{
                        wegetsolision = false;
                    }
                    if(wegetsolision){
                        found = true;
                        tempData = tempData.replaceAll(issigma.outerHTML, elifsigma.outerHTML);
                    }
                });
                if (!found) {
                    tempData = tempData.replaceAll(issigma.outerHTML, issigma.querySelector('elsesigma').outerHTML);
                }
            }
        });

        tempData.match(/\$\[[^\]]+\]/g)?.forEach((match) => {
            const key = match.slice(2, -1);
            if(!names.includes(key)) return;
            tempData = tempData.replaceAll(match, values[names.indexOf(key)]);
        });
        
        tempData.match(/\!\[[^\]]+\]/g)?.forEach((match) => {
            const key = match.slice(2, -1);
            let data;
            try{
                const res = new Function(...names, 'return '+key)(...values)
                data = res;
            }catch{}
            if(!data) return;
            tempData = tempData.replaceAll(match, data);
        });

        element.innerHTML = tempData;
    });
}
