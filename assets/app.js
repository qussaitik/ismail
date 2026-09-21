const API_BASE = 'https://alshaqi.alwaysdata.net';
const input = document.getElementById('files');
const drop = document.getElementById('dropzone');
const list = document.getElementById('fileList');
const btn = document.getElementById('sendBtn');
const form = document.getElementById('uploadForm');
const statusBox = document.getElementById('status');
const wrap = document.getElementById('progressWrap');
const bar = document.getElementById('progressBar');
const pct = document.getElementById('progressText');
let selected=[];
function size(n){const u=['B','KB','MB','GB'];let i=0;while(n>=1024&&i<3){n/=1024;i++}return(i?n.toFixed(1):Math.round(n))+' '+u[i]}
function render(){list.innerHTML='';selected.forEach(f=>{const el=document.createElement('div');el.className='file';el.innerHTML='<span>📄</span><span class="name"></span><span class="size">'+size(f.size)+'</span>';el.querySelector('.name').textContent=f.name;list.appendChild(el)});btn.disabled=!selected.length}
function add(files){selected=[...selected,...files].slice(0,10);render()}
input.addEventListener('change',()=>add(input.files));
['dragenter','dragover'].forEach(e=>drop.addEventListener(e,x=>{x.preventDefault();drop.classList.add('drag')}));
['dragleave','drop'].forEach(e=>drop.addEventListener(e,x=>{x.preventDefault();drop.classList.remove('drag')}));
drop.addEventListener('drop',e=>add(e.dataTransfer.files));
form.addEventListener('submit',e=>{e.preventDefault();if(!selected.length)return;const data=new FormData();selected.forEach(f=>data.append('files[]',f,f.name));btn.disabled=true;wrap.hidden=false;statusBox.className='status';statusBox.textContent='جارٍ رفع الملفات...';bar.style.width='0%';pct.textContent='0%';const xhr=new XMLHttpRequest();xhr.open('POST',API_BASE+'/upload.php');xhr.upload.onprogress=e=>{if(e.lengthComputable){const p=Math.round(e.loaded/e.total*100);bar.style.width=p+'%';pct.textContent=p+'%'}};xhr.onload=()=>{try{const r=JSON.parse(xhr.responseText);if(r.ok){statusBox.className='status ok';statusBox.textContent='✓ تم إرسال الملفات';selected=[];input.value='';render();bar.style.width='100%';pct.textContent='100%'}else{statusBox.className='status err';statusBox.textContent='✕ '+(r.message||'حدث خطأ أثناء الرفع');btn.disabled=false}}catch(_){statusBox.className='status err';statusBox.textContent='✕ حدث خطأ غير متوقع';btn.disabled=false}};xhr.onerror=()=>{statusBox.className='status err';statusBox.textContent='✕ انقطع الاتصال أثناء الرفع';btn.disabled=false};xhr.send(data)});
