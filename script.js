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
                        setTimeout(() => searchBeta(node), 50);
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

    setTimeout(() => searchBeta(document), 100);
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

        let tempData = template.innerHTML;
        template.querySelectorAll('issigma').forEach((issigma) => {
            let prompt = issigma.getAttribute('data').split("=");
            const data = attributes.find(z => z.name === prompt[0]);

            if ((prompt.length === 1 && data) || (data && data.value === prompt[1])) {
                tempData = tempData.replaceAll(issigma.querySelector('elsesigma').outerHTML, "");
                tempData = tempData.replaceAll(issigma.querySelector('elifsigma').outerHTML, "");
            } else {
                let found = false;
                issigma.querySelectorAll('elifsigma').forEach((elifsigma) => {
                    let elifPrompt = elifsigma.getAttribute('data').split("=");
                    const elifData = attributes.find(z => z.name === elifPrompt[0]);
                    if ((elifPrompt.length === 1 && elifData) || (elifData && elifData.value === elifPrompt[1])) {
                        found = true;
                        tempData = tempData.replaceAll(issigma.outerHTML, elifsigma.outerHTML);
                    }
                });
                if (!found) {
                    tempData = tempData.replaceAll(issigma.outerHTML, issigma.querySelector('elsesigma').outerHTML);
                }
            }
        });

        attributes.forEach(attr => {
            tempData = tempData.replaceAll(`$[${attr.name}]`, attr.value);
        });

        element.innerHTML = tempData;
    });
}
