const fs=require("fs");
const html=fs.readFileSync("MyWorld/index.html","utf8");
const body=html.split("<scr"+"ipt>")[2].split("</scr"+"ipt>")[0];
fs.writeFileSync("MyWorld/_syn.js", body, "utf8");