//Docs: https://github.com/DeveloperKubilay/sigmaWebFramework
    console.log("Sigma loaded");

document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return; 

                    const tagName = node.tagName;
                    if (tagName === 'SIGMA') searchSigma(node, true); else { searchSigma(node);}
                });
            }
        }
    });


    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
    searchSigma(document);
});

const database = {};

function searchSigma(x, single = false) {
    const sigmaElements = single ? [x] : x.querySelectorAll('sigma');
    sigmaElements.forEach((element) => {
        database[element.getAttribute('template')] = element;
        element.style.display = 'none';
        element.remove();
    });
}


window.beta = function (mtemplate,mdata) {
        const template = database[mtemplate];
        if (!template) return;
        const names = [], values = [];
        if(!mdata) mdata = {};

        for (const [key, value] of Object.entries(mdata)) {
            names.push(key);
            values.push(value);
        }

        let tempData = template.innerHTML;

        template.querySelectorAll('issigma').forEach((issigma) => {
            let prompt = issigma.getAttribute('data')

            let wegetsolision = false;
            try{
                const res = new Function(...names, 'return '+prompt)(...values)
                if(res) wegetsolision = res;
            }catch { wegetsolision = false };

            if(wegetsolision){
                try{tempData = tempData.replace(issigma.querySelector('elsesigma').outerHTML, "");}catch{}
                try{tempData = tempData.replace(issigma.querySelector('elifsigma').outerHTML, "");}catch{}
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
                        tempData = tempData.replace(issigma.outerHTML, elifsigma.outerHTML);
                    }
                });
                if (!found) {
                    try{
                    if(issigma.querySelector('elsesigma')) tempData = tempData.replace(issigma.outerHTML, issigma.querySelector('elsesigma').outerHTML);
                    else tempData = tempData.replace(issigma.outerHTML, "");
                    }catch{}
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
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = tempData;

        tempDiv.querySelectorAll('img').forEach((sigima) => {
            if(sigima.getAttribute('data-sigmaload'))
                sigima.src = sigima.getAttribute('data-sigmaload');
        })
        const lk = tempDiv.innerHTML;
        tempDiv.remove();
        return lk;
}
