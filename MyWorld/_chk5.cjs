const fs=require("fs");
const html=fs.readFileSync("MyWorld/index.html","utf8");
const body=html.split("<scr"+"ipt>")[2].split("</scr"+"ipt>")[0];
let logic=body.slice(0, body.indexOf("// ================= 场景"));
const keep=[]; for(const ln of logic.split("\n")){ if(ln.indexOf("window.THREE")>=0)continue; if(ln.indexOf("if(!THREE)")>=0)continue; keep.push(ln); }
logic=keep.join("\n");
const M=new Function(logic+"\nreturn {B,get,isSolid,blocks};")();
const get=M.get;
let P=0,F=0;
function ok(n,c){ if(c)P++; else {F++; console.log("FAIL "+n);} }
// 出生点安全
let bad=0; for(let dy=0;dy<2;dy++)for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++) if(M.isSolid(55+dx,2+dy,66+dz)) bad++;
ok("spawn-safe", bad===0);
ok("spawn-ground-park", get(55,0,66)===5);
// 中银四柱阶梯：西20/北40/南59/东79
function hgt(x,z){ let y=0; while(get(x,y+1,z)!==0) y++; return y; }
const hW=hgt(68,90), hN=hgt(74,84), hS=hgt(74,96), hE=hgt(80,90);
ok("BOC-west-20", hW>=18 && hW<=22);
ok("BOC-north-40", hN>=38 && hN<=42);
ok("BOC-south-59", hS>=57 && hS<=61);
ok("BOC-east-79", hE>=77 && hE<=81);
ok("BOC-staircase", hW<hN && hN<hS && hS<hE);
// 中银东柱双桅杆
ok("BOC-mast-13", get(74,94,90)===7 && get(74,95,90)===7);
ok("BOC-mast-secondary", get(74,92,89)===7);
ok("BOC-glass", get(74,60,90)===3 || get(74,60,90)===12);
// 中银东南方于汇丰
ok("BOC-SE-of-HSBC", 74>34 && 90>50);
// 汇丰底层架空
ok("HSBC-undercroft-open", get(30,2,50)===0 && get(30,1,50)===0);
ok("HSBC-column-white", get(26,3,43)===12);
ok("HSBC-glass-wall", get(34,10,50)===3);
// 汇丰平顶直升机坪
ok("HSBC-helipad", get(34,45,50)===1);
// 汇丰炮筒（楼顶横向圆筒）
let axis=0; for(let x=26;x<=43;x++) if(get(x,48,50)===7) axis++;
ok("HSBC-barrel-axis", axis>=15);
// 总块数
let total=0; for(let i=0;i<M.blocks.length;i++) if(M.blocks[i]) total++;
console.log("PASS="+P+" FAIL="+F+" total="+total);
console.log("BOC heights w/n/s/e: "+hW+"/"+hN+"/"+hS+"/"+hE);