const PORT = 3100;

const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const c = require('ansi-colors');
const fs = require('fs');
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const ramdb = new Map();

app.use((req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url;
    var temp = path.join('src', url)
    if(ramdb.has(temp)){
        res.send(`<script>
        var ws = new WebSocket('ws://localhost:${PORT}');
        ws.onmessage = function(event) {
            if(event.data === 'reload') {
                location.reload();
            }
        };
        </script>`+ramdb.get(temp));
        return;
    }else{
        temp = path.join('public', url)
        if(fs.existsSync(temp)){
            res.send(fs.readFileSync(temp, 'utf8'));
            return;
        }
    }
});


const chokidar = require('chokidar');

const watcher = chokidar.watch('./src', {
    ignored: [
        '**/node_modules/**',
        '**/.*' 
    ],
    persistent: true
});

connected = {}
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
        let tempdb, args = {};
        if (fs.existsSync("./src/" + mydb[key])) {
            var text = fs.readFileSync("./src/" + mydb[key], "utf8");
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
                    .split(" ");
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
            tmp = tmp.replace("</" + key + ">", args[key]);
        });
        editedtext = tmp;
    });
    return editedtext;
}


function forwatcher(path){
    console.log(c.green(Date.now()),c.blue("Edited"),c.gray(path))
    try {
        fs.accessSync(path);
        const file = fs.readFileSync(path, 'utf8');
        connected[path]?.forEach((item) => {
            ramdb.set(item, editfile(item,fs.readFileSync(item, 'utf8')));
        });
        ramdb.set(path, editfile(path,file));
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('reload');
            }
        });
    } catch {}
}

watcher.on('change', forwatcher).on("add", forwatcher).on("unlink", (path) => {
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
)


server.listen(PORT, () => {
    console.log(c.green("Server is running on"), c.green.bold.underline(`http://localhost:${PORT}`));
});

const child_process = require('child_process');
const packageJson = require('./package.json');
if(packageJson.auto_open_url) child_process.exec('start http://localhost:' + PORT);
child_process.exec('npx tailwindcss -i ./base.css -o ./public/tailwind.css --watch');
