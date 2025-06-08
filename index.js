const PORT = 3100;

const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const c = require('ansi-colors');
const fs = require('fs');
const app = express();
const mime = require('mime');
const child_process = require('child_process');
const packageJson = require('./package.json');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const wscode = `
${packageJson.useTailwind ? `<link rel="stylesheet" href="/tailwind.css">` : ''}
<script src="/SigmaFramework/script.js"></script>
            <script>
document.addEventListener("DOMContentLoaded", async () => {
            var ws = new WebSocket('ws://localhost:${PORT}');
            ws.onmessage = function(event) {
                if(event.data === 'reload') {
                    location.reload();
                }
            };
});
            </script>`


if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public');
    fs.mkdirSync('./public/js');
}
if (!fs.existsSync('./src')) fs.mkdirSync('./src');
if (!fs.existsSync('./SigmaFramework')) {
    fs.mkdirSync('./SigmaFramework');
    fs.mkdirSync('./SigmaFramework/Layouts');
    fs.copyFileSync('./singleFramework.js', "./SigmaFramework/script.js");
    fs.copyFileSync('./src/route.js', "./SigmaFramework/route.js");
    fs.copyFileSync('./LICENSE', "./SigmaFramework/LICENSE");
    fs.copyFileSync('./README.md', "./SigmaFramework/README.md");
    fs.copyFileSync('./src/Layout.html', "./SigmaFramework/Layouts/Layout.html");
    fs.copyFileSync('./src/script.js', "./public/js/script.js");
    fs.copyFileSync('./src/.gitignore', ".gitignore");
    fs.unlinkSync('./src/.gitignore');
    fs.unlinkSync('./src/nOCxhiI.png');
    fs.unlinkSync('./singleFramework.js');
    fs.unlinkSync('./src/route.js');
    fs.unlinkSync('./src/script.js');
    fs.unlinkSync('./src/Layout.html');
    fs.unlinkSync('./LICENSE');
    fs.unlinkSync('./README.md');
    fs.writeFileSync('./SigmaFramework/info.txt',
        "If you need help you can look here\nhttps://github.com/DeveloperKubilay/sigmaWebFramework"
    )
    if (packageJson.useTailwind) {
        fs.writeFileSync('./SigmaFramework/tailwind.config.js', `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}',
    './public/**/*.{html,js}',
    './SigmaFramework/Layouts/**/*.html'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
        );
        fs.writeFileSync('./SigmaFramework/base.css', `@tailwind base;\n@tailwind components;\n@tailwind utilities;`);
    }
}


const ramdb = new Map();
const route = require('./SigmaFramework/route.js');

app.get("/SigmaFramework/script.js", (req, res) => {
    return res.sendFile(path.join(__dirname, 'SigmaFramework/script.js'));
})

app.use((req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const tmp = route(req.url);
    req.url = tmp.router;
    const url = req.url === '/' ? '/index.html' : req.url;

    let temp = path.join('./src', url);
    if (!fs.existsSync(temp)) temp = path.join('./src', url + '.html');
    if (ramdb.has(temp)) {
        res.send(wscode + (tmp.render ? route(tmp.orjurl, ramdb.get(temp)) : ramdb.get(temp)));
        return;
    } else {
        temp = path.join('./public', url);
        if (!fs.existsSync(temp)) temp = path.join('./public', url + '.html');
        if (fs.existsSync(temp)) {
            var type = 'application/octet-stream';
            try {
                type = mime.getType(temp) || 'application/octet-stream';
            } catch { }
            res.setHeader('Content-Type', type);
            res.sendFile(path.resolve(temp));
            return;
        } else {
            console.log(c.red('404 File Not Found:'), c.yellow(temp.replace(".html", ""))); // Log the missing path
            res.status(404).send(wscode + '<style>*{font-family:sans-serif;color:#ddd;background-color:#000}</style><h1>Sigma Framework</h1><h2>404 File Not Found</h2>');
        }
    }
});

const chokidar = require('chokidar');
const watcher = chokidar.watch(['./src', './SigmaFramework/Layouts'], {
    ignored: [
        '**/node_modules/**',
        '**/.*'
    ],
    persistent: true,
});

connected = {};
function editfile(nath, editedtext) {
    let mydb = {};
    if (editedtext.startsWith("<!--")) {
        var text = editedtext.split("<!--", 2)[1].split("-->", 1)[0];
        if (!text) return editedtext;
        text = text.trim();
        text.split(";").forEach((item) => {
            item = item.trim();
            if (!item.startsWith("const")) return;
            var key = item.split("const", 2)[1].split("=", 1)[0].trim();
            var value = item.split("=", 2)[1].trim();
            if (!key || !value) return;
            connected[path.join(path.dirname(nath), value)] = [...(connected[nath] || []), nath];
            mydb[key] = value;
        });
    }

    Object.keys(mydb).forEach((key) => {
        let tempdb, args = {}, l = path.join(path.dirname(nath), mydb[key]);
        if (fs.existsSync(l)) {
            var text = fs.readFileSync(l, "utf8");
            text = text.split("<slot></slot>");
            tempdb = text;
        }

        let tmp = editedtext.split("<" + key);

        tmp = tmp.map((item, c) => {
            if (c === 0) return item;
            const text = item.split("</" + key + ">")[0];
            if (!text) return item;
            if (item[0] === " ") {
                var targs = (item.split('">', 1)[0] + '"')
                    .trim()
                    .split(",");

                targs.forEach((x) => {
                    const t = x.split("=");
                    args[t[0]] = t[1].replace('"', "").replace('"', "");
                });

                item = item.split('">').slice(1).join('">');
            } else {
                item = item.substring(1);
            }
            let temptext = [...tempdb];

            temptext.splice(1, 0, item);
            return temptext.join("").replaceAll("</" + key + ">", "");
        });

        tmp = tmp.join("");
        Object.keys(args).forEach((key) => {
            tmp = tmp.replaceAll("</" + key + ">", args[key]);
        });
        editedtext = tmp;
    });
    return editedtext;
}

function forwatcher(path) {
    //console.log(c.green(Date.now()), c.blue("Edited"), c.gray(path));
    try {
        fs.accessSync(path);
        const file = fs.readFileSync(path, 'utf8');
        if (connected[path]?.length > 0) {
            connected[path].forEach((item) => {
                try {
                    const depContent = fs.readFileSync(item, 'utf8');
                    const processedContent = editfile(item, depContent);
                    ramdb.set(item, processedContent);
                } catch (err) {
                    console.error(c.red(`Error processing dependent file ${item}:`), err);
                }
            });
        }
        var a = editfile(path, file)
        ramdb.set(path, a);
    } catch (err) {
        console.error(c.red(`Error processing file ${path}:`), err);
    }
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('reload');
        }
    });
}

watcher.on('change', forwatcher).on("add", forwatcher).on("unlink", (path) => {
    if (connected[path]) {
        connected[path].forEach(depPath => ramdb.delete(depPath));
        delete connected[path];
    }
    ramdb.delete(path);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('reload');
        }
    });
});

console.log("⚠️",
    c.yellowBright(" WARNING"),
    c.red('SIGMA FRAMEWORK LOADED')
);

server.listen(PORT, () => {
    console.log(c.green("Server is running on"), c.green.bold.underline(`http://localhost:${PORT}`));
});

if (!packageJson.useTailwind && packageJson.auto_open_url) child_process.exec('start http://localhost:' + PORT);
if (packageJson.useTailwind) {
    var exc = child_process.exec(
        'npx tailwindcss --config ./SigmaFramework/tailwind.config.js ' +
        '-i ./SigmaFramework/base.css -o ./public/tailwind.css --watch'
        , { cwd: __dirname });
        if(packageJson.auto_open_url) {
            const openUrlOnce = (data) => {
                if(data.includes("Done")) {
                    child_process.exec('start http://localhost:' + PORT);
                    exc.stderr.off('data', openUrlOnce);
                }
            };
            exc.stderr.on('data', openUrlOnce);
        }
    /*exc.stdout.on('data', (data) => {
        console.log(c.cyan(data));
    });
    exc.stderr.on('data', (data) => {
        console.error(c.red(data));
    });*/

}
