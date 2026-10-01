const markersData = [
  {id:'vice-city',name:'Vice City',region:'Vice City',x:0,y:700,evidence:'official',confidence:'Nom officiel · placement estimé',desc:'La métropole néon de Leonida. Son existence est officielle ; sa forme, ses limites et son placement précis restent reconstruits.',source:'https://www.rockstargames.com/VI/only-in-leonida'},
  {id:'vice-beach',name:'Vice Beach',region:'Vice City',x:1750,y:1000,evidence:'community',confidence:'Placement triangulé',desc:'Façade océanique inspirée de Miami Beach, reconstruite grâce aux hôtels et immeubles reconnaissables dans les images officielles.',source:'https://github.com/rolux/gtadb.org'},
  {id:'downtown',name:'Downtown Vice City',region:'Vice City',x:-550,y:450,evidence:'community',confidence:'Forte confiance relative',desc:'Centre vertical de Vice City. Plusieurs tours récurrentes permettent de croiser les lignes de vue entre les scènes.',source:'https://www.reddit.com/r/GTA6/comments/1p8ow14/inside_gta_vi_mapping_the_community_rebuilding/'},
  {id:'airport',name:'Vice City International Airport',region:'Vice City',x:-2508,y:-520,evidence:'community',confidence:'Coordonnées communautaires',desc:'Le complexe aéroportuaire est placé à l’ouest de la ville à partir de hangars, de la tour de contrôle et des axes routiers visibles.',source:'https://github.com/rolux/gtadb.org'},
  {id:'jack-hearts',name:'Jack of Hearts',region:'Vice City',x:-686,y:1195,evidence:'community',confidence:'Repère identifié',desc:'Club de Crosstown associé à Boobie Ike dans les contenus officiels. La position est celle de la reconstruction GTADB.',source:'https://www.rockstargames.com/VI/only-in-leonida'},
  {id:'nine1nine',name:'NINE1NINE',region:'Vice City',x:-671,y:468,evidence:'community',confidence:'Repère identifié',desc:'Établissement du Downtown utilisé comme point de repère par les mappeurs.',source:'https://github.com/rolux/gtadb.org'},
  {id:'little-cuba',name:'Little Cuba',region:'Vice City',x:-1150,y:100,evidence:'community',confidence:'Quartier reconstruit',desc:'Secteur urbain à l’ouest du centre, identifié par recoupement des rues, enseignes et équivalents floridiens.',source:'https://github.com/rolux/gtadb.org'},
  {id:'keys',name:'Leonida Keys',region:'Leonida Keys',x:-2900,y:-6200,evidence:'official',confidence:'Nom officiel · contour estimé',desc:'Archipel officiellement présenté par Rockstar. La géométrie des îles et de l’Overseas Highway reste communautaire.',source:'https://www.rockstargames.com/VI/only-in-leonida'},
  {id:'jason-house',name:'Maison de Jason',region:'Leonida Keys',x:-2354,y:-5532,evidence:'leak',confidence:'Coordonnée issue de l’enquête',desc:'Point placé à partir des coordonnées et recoupements communautaires. Le site ne redistribue aucune image du leak.',source:'https://gtaforums.com/topic/985670-mapping-vice-city-map-discussion-thread-no-leak-footage-allowed/'},
  {id:'brian-marina',name:'Marina de Brian',region:'Leonida Keys',x:-2558,y:-5861,evidence:'community',confidence:'Repère identifié',desc:'La marina liée à Brian Heder, personnage officiellement présenté par Rockstar, est replacée ici selon GTADB.',source:'https://www.rockstargames.com/VI/only-in-leonida'},
  {id:'grassrivers',name:'Grassrivers',region:'Grassrivers',x:-3300,y:-4300,evidence:'official',confidence:'Nom officiel · limites estimées',desc:'Immense zone humide inspirée des Everglades, officiellement nommée par Rockstar.',source:'https://www.rockstargames.com/VI/only-in-leonida'},
  {id:'grass-center',name:'Grassrivers Visitor Center',region:'Grassrivers',x:-2665,y:-4761,evidence:'community',confidence:'Correspondance réelle',desc:'Centre d’accueil identifié par comparaison avec son équivalent floridien et replacé sur la carte communautaire.',source:'https://github.com/rolux/gtadb.org'},
  {id:'port-gellhorn',name:'Port Gellhorn',region:'Port Gellhorn',x:-6200,y:3200,evidence:'official',confidence:'Nom officiel · centre estimé',desc:'Ville portuaire officiellement révélée par Rockstar. Sa trame urbaine est reconstruite à partir des plans disponibles.',source:'https://www.rockstargames.com/VI/only-in-leonida'},
  {id:'raceway',name:'Gellhorn International Raceway',region:'Port Gellhorn',x:-6752,y:2298,evidence:'community',confidence:'Coordonnées GTADB',desc:'Circuit identifié dans la base collaborative de lieux et placé sur la reconstruction YANIS.',source:'https://github.com/rolux/gtadb.org'},
  {id:'ambrosia',name:'Ambrosia',region:'North Leonida',x:-2700,y:3900,evidence:'official',confidence:'Nom officiel · centre estimé',desc:'Ville industrielle officiellement nommée. Les silos et installations sucrières structurent sa reconstruction.',source:'https://www.rockstargames.com/VI/only-in-leonida'},
  {id:'sugar-mill',name:'Allied Crystal Sugar Mill',region:'North Leonida',x:-3017,y:3347,evidence:'community',confidence:'Repère industriel',desc:'Complexe industriel utilisé comme ancre visuelle pour Ambrosia.',source:'https://github.com/rolux/gtadb.org'},
  {id:'kalaga',name:'Mount Kalaga National Park',region:'North Leonida',x:-3430,y:6371,evidence:'official',confidence:'Nom officiel · étendue inconnue',desc:'Parc national officiellement présenté. Son relief exact et ses frontières ne sont pas publiés.',source:'https://www.rockstargames.com/VI/only-in-leonida'},
  {id:'penitentiary',name:'Leonida Penitentiary',region:'North Leonida',x:-2800,y:-2850,evidence:'leak',confidence:'Nom officiel · position communautaire',desc:'La prison est officielle dans l’histoire de Lucia ; sa position sur la carte repose sur les coordonnées et le travail communautaire.',source:'https://www.rockstargames.com/VI/only-in-leonida'}
];


const $=id=>document.getElementById(id);
const stage=$('mapStage'), canvas=$('mapCanvas'), ctx=canvas.getContext('2d');
const ranges=[[[0,0],[3,3]],[[1,1],[6,6]],[[2,2],[12,12]],[[5,5],[25,24]],[[10,10],[51,49]]];
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let favorites;
try{favorites=new Set(JSON.parse(localStorage.getItem('leonida-favorites')||'[]'))}catch{favorites=new Set()}
const state={x:-2400,y:-1000,z:0,region:'all',query:'',evidence:new Set(['official','community','leak']),selected:null,favorites:false};
const tiles=new Map(), pointers=new Map(), pins=new Map();
let width=0,height=0,frame=0,animation=0,moved=false,gesture=null;
const labels={official:'Nom officiel',community:'Reconstruction',leak:'Indice du leak'};
function ppm(){return 2**state.z/32}
function screen(x,y){return [width/2+(x-state.x)*ppm(),height/2-(y-state.y)*ppm()]}
function world(x,y){return [state.x+(x-width/2)/ppm(),state.y-(y-height/2)/ppm()]}
function requestRender(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;render()})}
function resize(){const r=stage.getBoundingClientRect();if(!r.width||!r.height)return;width=r.width;height=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=width*d;canvas.height=height*d;ctx.setTransform(d,0,0,d,0,0);requestRender()}
function filtered(){return markersData.filter(m=>state.evidence.has(m.evidence)&&(state.region==='all'||m.region===state.region)&&(!state.favorites||favorites.has(m.id))&&normalize(m.name+' '+m.region).includes(normalize(state.query)))}
function image(z,x,y){const key=z+','+y+','+x;if(tiles.has(key))return tiles.get(key);const im=new Image();tiles.set(key,im);im.onload=requestRender;im.onerror=()=>{im.failed=true;$('mapMessage').textContent='Certaines zones ne sont pas disponibles. Vérifiez votre connexion.'};im.src='assets/tiles/'+z+'/'+key+'.jpg';return im}
function render(){
 ctx.fillStyle='#183b40';ctx.fillRect(0,0,width,height);
 const z=Math.max(0,Math.min(4,Math.ceil(state.z))),size=256*2**(state.z-z),ox=width/2-(state.x+16384)*ppm(),oy=height/2-(16384-state.y)*ppm(),[[x0,y0],[x1,y1]]=ranges[z];
 for(let y=Math.max(y0,Math.floor(-oy/size));y<=Math.min(y1,Math.ceil((height-oy)/size));y++)for(let x=Math.max(x0,Math.floor(-ox/size));x<=Math.min(x1,Math.ceil((width-ox)/size));x++){
  const im=image(z,x,y);
  if(im.complete&&im.naturalWidth)ctx.drawImage(im,ox+x*size,oy+y*size,size+.5,size+.5);
  else for(let p=z-1;p>=0;p--){const factor=2**(z-p),parent=image(p,Math.floor(x/factor),Math.floor(y/factor));if(parent.complete&&parent.naturalWidth){ctx.drawImage(parent,(x%factor)*256/factor,(y%factor)*256/factor,256/factor,256/factor,ox+x*size,oy+y*size,size+.5,size+.5);break}}
 }
 const shown=new Set(filtered().map(m=>m.id));
 markersData.forEach(m=>{const b=pins.get(m.id),[x,y]=screen(m.x,m.y);b.hidden=!shown.has(m.id)||x<-40||y<-40||x>width+40||y>height+40;b.style.left=x+'px';b.style.top=y+'px';b.classList.toggle('selected',state.selected===m.id);b.classList.toggle('labeled',m.evidence==='official'&&state.z<1.7);b.setAttribute('aria-pressed',String(state.selected===m.id))});
 $('zoomLabel').textContent='NIVEAU '+state.z.toFixed(1);$('coordLabel').textContent='POSITION ESTIMÉE';
}
markersData.forEach(m=>{const b=document.createElement('button');b.className='marker '+m.evidence;b.setAttribute('aria-label',m.name);const label=document.createElement('span');label.className='marker-label';label.textContent=m.name;b.append(label);b.addEventListener('pointerdown',e=>e.stopPropagation());b.onclick=e=>{e.stopPropagation();select(m,true)};$('markers').append(b);pins.set(m.id,b)});
function stopAnimation(){cancelAnimationFrame(animation)}
function fly(x,y,z){stopAnimation();const start={...state},t0=performance.now(),duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:360;function tick(t){const k=duration?Math.min(1,(t-t0)/duration):1,e=1-(1-k)**3;state.x=start.x+(x-start.x)*e;state.y=start.y+(y-start.y)*e;state.z=start.z+(z-start.z)*e;requestRender();if(k<1)animation=requestAnimationFrame(tick)}animation=requestAnimationFrame(tick)}
function overview(){closeCard();fly(-3000,500,Math.max(-.8,Math.min(1.2,Math.log2(Math.min(width/16000,height/21000)*32))))}
function select(m,focus){
 state.selected=m.id;$('placeRegion').textContent=m.region==='North Leonida'?'NORD DE LEONIDA':m.region.toUpperCase();$('placeTitle').textContent=m.name;$('placeDescription').textContent=m.desc;
 $('placeEvidence').textContent=labels[m.evidence];$('placeEvidence').className='evidence '+m.evidence;$('placeConfidence').textContent=m.confidence;$('placeSource').href=m.source;
 $('placeCard').classList.add('open');$('placeCard').inert=false;$('favoritePlace').textContent=favorites.has(m.id)?'★ Enregistré':'☆ Enregistrer';
 if(focus){const z=Math.max(2.2,state.z),scale=2**z/32;fly(m.x+(innerWidth>900?120:0)/scale,m.y-(innerWidth<=900?height*.17:0)/scale,z)}
 history.replaceState(null,'','#lieu='+m.id);requestRender();updateList();
}
function closeCard(){state.selected=null;$('placeCard').classList.remove('open');$('placeCard').inert=true;history.replaceState(null,'',location.pathname+location.search);updateList();requestRender()}
function zoomAt(delta,x=width/2,y=height/2){stopAnimation();const [wx,wy]=world(x,y);state.z=Math.max(-.8,Math.min(4,state.z+delta));state.x=wx-(x-width/2)/ppm();state.y=wy+(y-height/2)/ppm();requestRender()}
function local(e){const r=stage.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}}
function resetGesture(){const p=[...pointers.values()];if(p.length>=2){const x=(p[0].x+p[1].x)/2,y=(p[0].y+p[1].y)/2;gesture={distance:Math.max(1,Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)),z:state.z,anchor:world(x,y)}}else gesture=null}
stage.onpointerdown=e=>{if(e.button&&e.pointerType==='mouse')return;stopAnimation();moved=false;pointers.set(e.pointerId,local(e));stage.setPointerCapture(e.pointerId);stage.classList.add('dragging');$('gestureHint').classList.add('hidden');resetGesture()};
stage.onpointermove=e=>{if(!pointers.has(e.pointerId))return;const old=pointers.get(e.pointerId),p=local(e);pointers.set(e.pointerId,p);if(Math.hypot(p.x-old.x,p.y-old.y)>2)moved=true;
 if(pointers.size>=2&&gesture){moved=true;const a=[...pointers.values()],x=(a[0].x+a[1].x)/2,y=(a[0].y+a[1].y)/2,d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);state.z=Math.max(-.8,Math.min(4,gesture.z+Math.log2(Math.max(1,d)/gesture.distance)));state.x=gesture.anchor[0]-(x-width/2)/ppm();state.y=gesture.anchor[1]+(y-height/2)/ppm()}
 else{state.x-=(p.x-old.x)/ppm();state.y+=(p.y-old.y)/ppm()}requestRender()};
function end(e){pointers.delete(e.pointerId);resetGesture();if(!pointers.size)stage.classList.remove('dragging')}
stage.onpointerup=end;stage.onpointercancel=end;stage.onclick=()=>{if(!moved)closeCard()};
stage.addEventListener('wheel',e=>{e.preventDefault();const p=local(e);zoomAt(Math.max(-.4,Math.min(.4,-e.deltaY*.003)),p.x,p.y)},{passive:false});
stage.ondblclick=e=>{const p=local(e);zoomAt(.6,p.x,p.y)};
stage.tabIndex=0;stage.setAttribute('aria-label','Carte : flèches pour déplacer, plus et moins pour zoomer');
stage.onkeydown=e=>{const amount=80/ppm();if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','+','-','='].includes(e.key)){e.preventDefault();stopAnimation();if(e.key==='ArrowUp')state.y+=amount;if(e.key==='ArrowDown')state.y-=amount;if(e.key==='ArrowLeft')state.x-=amount;if(e.key==='ArrowRight')state.x+=amount;if(e.key==='+'||e.key==='=')zoomAt(.4);if(e.key==='-')zoomAt(-.4);requestRender()}};
$('zoomIn').onclick=()=>zoomAt(.4);$('zoomOut').onclick=()=>zoomAt(-.4);$('resetMap').onclick=overview;$('closeCard').onclick=closeCard;
function sync(){document.querySelectorAll('.check input').forEach(e=>e.checked=state.evidence.has(e.value));document.querySelectorAll('.region').forEach(e=>e.classList.toggle('active',e.dataset.region===state.region));$('savedOnly').classList.toggle('active',state.favorites);$('savedOnly').setAttribute('aria-pressed',String(state.favorites));updateList();requestRender();if(state.selected&&!filtered().some(m=>m.id===state.selected))closeCard()}
function updateList(){const rows=filtered();$('resultCount').textContent=rows.length+' lieu'+(rows.length>1?'x':'');const box=$('placeList');box.replaceChildren();if(!rows.length){box.innerHTML='<p class="empty-state">Aucun lieu ici.<br>Essayez un autre filtre ou une recherche plus courte.</p>';return}
 rows.forEach(m=>{const b=document.createElement('button');b.className='place-row'+(state.selected===m.id?' active':'');b.innerHTML='<span class="dot '+m.evidence+'"></span><span><strong></strong><small></small></span><span class="row-star"></span>';b.querySelector('strong').textContent=m.name;b.querySelector('small').textContent=m.region;b.querySelector('.row-star').textContent=favorites.has(m.id)?'★':'›';b.onclick=()=>{showView('map');closeFilters();select(m,true)};box.append(b)})}
$('searchInput').oninput=e=>{state.query=e.target.value;sync()};
document.querySelectorAll('.check input').forEach(e=>e.onchange=()=>{e.checked?state.evidence.add(e.value):state.evidence.delete(e.value);sync()});
document.querySelectorAll('.region').forEach(e=>e.onclick=()=>{state.region=e.dataset.region;sync();const rows=filtered();if(rows.length){const x=rows.reduce((s,m)=>s+m.x,0)/rows.length,y=rows.reduce((s,m)=>s+m.y,0)/rows.length;fly(x,y,state.region==='all'?.7:1.8)}});
$('resetFilters').onclick=()=>{state.evidence=new Set(['official','community','leak']);state.region='all';state.query='';state.favorites=false;$('searchInput').value='';sync()};
$('savedOnly').onclick=()=>{state.favorites=!state.favorites;sync()};
$('favoritePlace').onclick=()=>{const id=state.selected;if(!id)return;favorites.has(id)?favorites.delete(id):favorites.add(id);try{localStorage.setItem('leonida-favorites',JSON.stringify([...favorites]))}catch{}$('favoritePlace').textContent=favorites.has(id)?'★ Enregistré':'☆ Enregistrer';sync()};
$('sharePlace').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);$('sharePlace').textContent='Lien copié';setTimeout(()=>$('sharePlace').textContent='Partager',1800)}catch{$('sharePlace').textContent='Copiez l’adresse du navigateur'}};
function showView(v){closeFilters();document.querySelectorAll('.nav-link').forEach(b=>{b.classList.toggle('active',b.dataset.view===v);b.setAttribute('aria-current',b.dataset.view===v?'page':'false')});['map','investigation','sources'].forEach(key=>$(key+'View').classList.toggle('active-view',key===v));document.body.dataset.view=v;if(v==='map')resize()}
document.querySelectorAll('.nav-link').forEach(b=>b.onclick=()=>showView(b.dataset.view));
function openFilters(){$('sidebar').classList.add('open');$('sidebar').inert=false;$('sheetBackdrop').classList.add('open');$('mobileMenu').setAttribute('aria-expanded','true');$('searchInput').focus()}
function closeFilters(){$('sidebar').classList.remove('open');$('sheetBackdrop').classList.remove('open');$('mobileMenu').setAttribute('aria-expanded','false');$('sidebar').inert=innerWidth<=900}
$('mobileMenu').onclick=openFilters;$('closeSidebar').onclick=closeFilters;$('sheetBackdrop').onclick=closeFilters;
document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{state.region='all';state.query='';state.favorites=false;const m=markersData.find(m=>m.id===b.dataset.jump);state.evidence.add(m.evidence);$('searchInput').value='';sync();select(m,true)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeFilters();closeCard()}});
['official','community','leak'].forEach(k=>$('count'+k[0].toUpperCase()+k.slice(1)).textContent=markersData.filter(m=>m.evidence===k).length);
window.addEventListener('resize',()=>{resize();if(!$('sidebar').classList.contains('open'))$('sidebar').inert=innerWidth<=900});
const initial=markersData.find(m=>location.hash==='#lieu='+m.id);
resize();overview();sync();closeFilters();$('placeCard').inert=true;
if(initial)select(initial,true);
