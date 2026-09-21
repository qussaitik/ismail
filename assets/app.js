const API = 'https://alshaqi.alwaysdata.net/api.php';
const input = document.getElementById('files');
const drop = document.getElementById('dropzone');
const choose = document.getElementById('chooseBtn');
const list = document.getElementById('fileList');
const btn = document.getElementById('sendBtn');
const statusBox = document.getElementById('status');
const wrap = document.getElementById('progressWrap');
const bar = document.getElementById('progressBar');
const pct = document.getElementById('progressText');
let selected = [];
function size(n){const u=['B','KB','MB','GB'];let i=0;while(n>=1024&&i<3){n/=1024;i++}return (i?n.toFixed(1):Math.round(n))+' '+u[i]}
function render(){list.innerHTML='';selected.forEach(f=>{const el=document.createElement('div');el.className='file';el.innerHTML='<span class="icon">▣</span><span class="name"></span><span class="size"></span>';el.querySelector('.name').textContent=f.name;el.querySelector('.size').textContent=size(f.size);list.appendChild(el)});btn.disabled=!selected.length}
function add(files){selected=[...selected,...Array.from(files)].slice(0,10);render()}
choose.addEventListener('click',e=>{e.stopPropagation();input.click()});drop.addEventListener('click',()=>input.click());drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click()}});input.addEventListener('change',()=>add(input.files));
['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('drag')}));['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('drag')}));drop.addEventListener('drop',e=>add(e.dataTransfer.files));
btn.addEventListener('click',()=>{if(!selected.length)return;const data=new FormData();selected.forEach(f=>data.append('files[]',f,f.name));btn.disabled=true;wrap.hidden=false;bar.style.width='0%';pct.textContent='0%';statusBox.className='status';statusBox.textContent='جارٍ الإرسال…';const xhr=new XMLHttpRequest();xhr.open('POST',API,true);xhr.timeout=0;xhr.upload.onprogress=e=>{if(e.lengthComputable){const p=Math.round(e.loaded/e.total*100);bar.style.width=p+'%';pct.textContent=p+'%'}};xhr.onload=()=>{let r;try{r=JSON.parse(xhr.responseText)}catch(e){r=null}if(xhr.status>=200&&xhr.status<300&&r?.ok){bar.style.width='100%';pct.textContent='100%';statusBox.className='status ok';statusBox.textContent='تم الإرسال ✓';selected=[];input.value='';render()}else{statusBox.className='status err';statusBox.textContent='تعذر إرسال الملفات';btn.disabled=false}};xhr.onerror=()=>{statusBox.className='status err';statusBox.textContent='تعذر الاتصال بالخادم';btn.disabled=false};xhr.ontimeout=()=>{statusBox.className='status err';statusBox.textContent='انتهت مهلة الاتصال';btn.disabled=false};xhr.send(data)});
