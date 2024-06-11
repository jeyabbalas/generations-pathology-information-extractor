import{OpenAI as N}from"https://cdn.skypack.dev/openai@4.38.5?min";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))l(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&l(d)}).observe(document,{childList:!0,subtree:!0});function o(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function l(s){if(s.ep)return;s.ep=!0;const i=o(s);fetch(s.href,i)}})();const J="/generations-pathology-information-extractor/assets/pie-D7aU8-n1.svg",_="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20aria-hidden='true'%20role='img'%20viewBox='0%200%20100%20100'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M48.854%200C21.839%200%200%2022%200%2049.217c0%2021.756%2013.993%2040.172%2033.405%2046.69%202.427.49%203.316-1.059%203.316-2.362%200-1.141-.08-5.052-.08-9.127-13.59%202.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015%204.934.326%207.523%205.052%207.523%205.052%204.367%207.496%2011.404%205.378%2014.235%204.074.404-3.178%201.699-5.378%203.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283%200-5.378%201.94-9.778%205.014-13.2-.485-1.222-2.184-6.275.486-13.038%200%200%204.125-1.304%2013.426%205.052a46.97%2046.97%200%200%201%2012.214-1.63c4.125%200%208.33.571%2012.213%201.63%209.302-6.356%2013.427-5.052%2013.427-5.052%202.67%206.763.97%2011.816.485%2013.038%203.155%203.422%205.015%207.822%205.015%2013.2%200%2018.905-11.404%2023.06-22.324%2024.283%201.78%201.548%203.316%204.481%203.316%209.126%200%206.6-.08%2011.897-.08%2013.526%200%201.304.89%202.853%203.316%202.364%2019.412-6.52%2033.405-24.935%2033.405-46.691C97.707%2022%2075.788%200%2048.854%200z'%20fill='%23fff'/%3e%3c/svg%3e",M="/generations-pathology-information-extractor",q=M+"/systemPrompt.txt";let R;const W=M+"/queries/",Y=["breastCancerType.json"];let j,S;const V=M+"/jsonldContexts/",X=["breastCancerType.json"];let O,K;async function Z(){R=await G(q),j=await B(W,Y),S=j.map(t=>ee(t)),O=await B(V,X),K=te(O)}Z().catch(t=>{console.error("Error reading the system prompt and schemas:",t)});async function G(t){try{const e=await fetch(t);if(!e.ok)throw new Error(`Failed to fetch: ${e.status} ${e.statusText}`);return e.text()}catch(e){console.error("Failed to fetch TXT file:",e)}}async function Q(t){try{const e=await fetch(t);if(!e.ok)throw new Error(`Failed to fetch: ${e.status} ${e.statusText}`);return e.json()}catch(e){console.error("Failed to fetch JSON file:",e)}}async function B(t,e){return await Promise.all(e.map(o=>Q(t+o)))}function ee(t){const e={};return e.default=Object.keys(t.properties).reduce((o,l)=>({...o,[l]:null}),{}),e.prompt=`
QUERY:

JSON keys: 

[${Object.keys(t.properties).join(", ")}]


JSON Schema:

\`\`\`json
${JSON.stringify(t,null,4)}
\`\`\`
`,e}function te(t){return t.reduce((e,o)=>{const l=o["@context"];for(let s in l)e[s]||(e[s]=l[s]);return e},{})}const k={async validateApiKey(t,e){try{return await new N({baseURL:t,apiKey:e,dangerouslyAllowBrowser:!0}).models.list(),!0}catch(o){return o.response&&o.response.status===401?(console.error("Invalid API key:",o),!1):(console.error("Error checking API key:",o),!1)}},setKey(t){localStorage.OPENAI_API_KEY=t},getKey(){return localStorage.OPENAI_API_KEY},deleteKey(){delete localStorage.OPENAI_API_KEY}};class T{constructor(e,o,l,s){this.openai=e,this.modelsList=o,this.model="",this.temperature=l,this.seed=s,this.systemPrompt=R,this.prompts=S}static async instantiate({baseURL:e,apiKey:o,seed:l=1234}){const s=new N({baseURL:e,apiKey:o,dangerouslyAllowBrowser:!0}),i=(await s.models.list()).data.map(u=>u.id).sort(),d=0;return new T(s,i,d,l)}getModel(){return this.model}async setModel(e){this.modelsList.includes(e)?this.model=e:console.error("Invalid model name:",e)}getModelsList(){return this.modelsList}async extractInformation(e){const o=this.prompts.map(i=>this.extractInformationForPrompt(e,i)),l=await Promise.all(o);let s={};for(const i of l)Object.assign(s,i);return s}async extractInformationForPrompt(e,o){const l=/```json\n([\s\S]*?)\n```/;let s=0,i,d,u;for(;s<3;){if(i=await this.openai.chat.completions.create({model:this.model,messages:[{role:"system",content:`${this.systemPrompt}


BREAST CANCER PATHOLOGY REPORT:

"""
${e}"""

`},{role:"user",content:o.prompt}],temperature:this.temperature,seed:this.seed+s}),d=i.choices[0].message.content,u=d.match(l),u)return JSON.parse(u[1]);s++}return console.error("Failed to extract valid JSON after 3 attempts, object with all missing values."),o.default}}function se(t){let e=document.getElementById(t);e.innerHTML=`
<!-- Header -->
<div id="header" class="mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-4 lg:px-8 bg-green-900 rounded-b-lg">
    <div class="flex items-center justify-between">
        <div class="flex justify-start gap-2">
            <div class="flex items-center">
                <img src="${J}" class="h-12 w-12 sm:h-16 sm:w-16 gap-2 logo vanilla" alt="pie logo" />
            </div>
            <div class="min-w-0 pl-3 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-white sm:text-3xl sm:tracking-tight">Generations</h2>
                <p class="py-1 pr-2 text-sm sm:text-base text-white">Pathology information extractor</p>
            </div>
        </div>
      
        <div class="flex md:mt-0 md:ml-4 shrink-0">
            <a title="Source code" href="https://github.com/jeyabbalas/generations-pathology-information-extractor">
                <img src="${_}" class="h-10 w-10 sm:h-12 sm:w-12 fill-current" alt="github logo" />
            </a>
        </div>
    </div>
</div>

<!-- Caution -->
<div id="info" class="mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-4 lg:px-8">
    <div id="info-usage" class="flex p-4 mt-2 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
        <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>
        <span class="sr-only">Data privacy notice</span>
        <div>
            <p><span class="font-medium">Data privacy notice</span>: Before submitting any data on this app, it is crucial that you confirm whether the associated data use agreement permits sharing this data with third-party services. This app utilizes OpenAI's API, which means your submitted data will be processed by OpenAI's servers. Once your data is submitted to OpenAI, it will be subject to OpenAI's data policies.</p>
            <p class="pl-4"></p>
        </div>
    </div>
</div>


<!--LLM API config-->
<div id="llm-config-container" class="mx-auto max-w-7xl mt-4 sm:px-6 lg:px-8 border rounded-lg">
    <div class="space-y-6 sm:space-y-5 pt-2 sm:pt-4">
        <div class="col-span-full">
            <h2 class="text-base font-semibold leading-7 text-gray-900">LLM API configuration</h2>
            <p class="mt-1 text-sm leading-6 text-gray-600">Please provide the base URL of the LLM API endpoint and the API key that you would like this application to use. that is compatible with Open API's <a href="https://platform.openai.com/docs/api-reference/chat" class="underline text-green-700">Chat API</a>. you want to use and an associated API key. The default URL below points to OpenAI's API.</p>
            <div class="mt-4 -space-y-px rounded-md flex flex-col items-center">
                <div class="relative rounded-md rounded-b-none px-3 pb-1.5 pt-2.5 w-1/2 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-green-600">
                    <label for="baseURL" class="block text-xs font-medium text-gray-900">Base URL</label>
                    <input type="url" name="baseURL" id="baseURL" class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0 sm:text-sm sm:leading-6" placeholder="http://localhost:8000/v1" value="https://api.openai.com/v1" required>
                </div>
                <div class="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 w-1/2 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-green-600">
                    <label for="apiKey" class="block text-xs font-medium text-gray-900">API key</label>
                    <input type="password" name="apiKey" id="apiKey" class="block w-full border-0 p-0 text-gray-900 focus:outline-none focus:ring-0 focus:border-0 sm:text-sm sm:leading-6">
                </div>
                <div id="api-key-message-container" class="w-1/2"></div>
            </div>
        </div>
    
        <div id="submit-api-key-buttons" class="py-2 sm:py-4">
            <div class="flex justify-center gap-2">
                <button id="forget-api-key" class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Forget API key</button>
                <button id="submit-api-key" class="inline-flex justify-center rounded-md border border-transparent bg-green-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Submit API key</button>
            </div>
        </div>
        
        <hr class="border-gray-300">
        
        <div class="col-span-full py-2 sm:py-4">
            <h2 class="text-base font-semibold leading-7 text-gray-900">Select an LLM</h2>
            <p class="mt-1 text-sm leading-6 text-gray-600">Select a model from the list of models below, that were available at your chosen API endpoint above, to perform the information extraction.</p>
            <div class="mt-4 -space-y-px rounded-md flex flex-col items-center">
                <div class="relative rounded-md px-3 pb-1.5 pt-2.5 w-1/2 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-green-600">
                    <label for="llmModel" class="block text-xs font-medium text-gray-900">LLM model</label>
                    <select id="llmModel" name="llmModel" class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0 sm:text-sm sm:leading-6">
                        <option value="" disabled selected>Set URL/API key above to see models list</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</div>


<div id="config-upload-divider" class="pt-4">
    <div  class="relative">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-300 mx-4 sm:mx-6 lg:mx-8"></div>
        </div>
        <div class="relative flex justify-center">
            <span class="bg-white px-2 text-lg font-semibold text-gray-500">Upload pathology reports for information extraction</span>
        </div>
    </div>
</div>


<!-- File upload -->
<div id="file-upload-container" class="mx-auto max-w-7xl mt-4 px-4 sm:px-6 lg:px-8 border rounded-lg">
    <div class="space-y-6 sm:space-y-5 pt-2 sm:pt-4">
        <div class="col-span-full">
            <h2 class="text-base font-semibold leading-7 text-gray-900">Upload pathology reports</h2>
            <p class="mt-1 text-sm leading-6 text-gray-600">Only TXT files are supported. Please ensure that the data is completely deidentified if the data use agreement requires it.</p>
            <div id="file-drop-area" class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div class="text-center">
                    <div id="file-upload-icon">
                        <svg class="mx-auto h-14 w-14 text-gray-300" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.956 6h.05a2.99 2.99 0 0 1 2.117.879 3.003 3.003 0 0 1 0 4.242 2.99 2.99 0 0 1-2.117.879h-1.995v-1h1.995a2.002 2.002 0 0 0 0-4h-.914l-.123-.857a2.49 2.49 0 0 0-2.126-2.122A2.478 2.478 0 0 0 6.23 5.5l-.333.762-.809-.189A2.49 2.49 0 0 0 4.523 6c-.662 0-1.297.263-1.764.732A2.503 2.503 0 0 0 4.523 11h2.494v1H4.523a3.486 3.486 0 0 1-2.628-1.16 3.502 3.502 0 0 1-.4-4.137A3.497 3.497 0 0 1 3.853 5.06c.486-.09.987-.077 1.468.041a3.486 3.486 0 0 1 3.657-2.06A3.479 3.479 0 0 1 11.956 6zm-1.663 3.853L8.979 8.54v5.436h-.994v-5.4L6.707 9.854 6 9.146 8.146 7h.708L11 9.146l-.707.707z"/>
                        </svg>
                    </div>
                    <div id="progress-ring" class="hidden">
                        <div class="relative inline-flex items-center justify-center">
                            <svg class="progress-ring" width="84" height="84">
                                <circle class="progress-ring__circle" stroke="green" stroke-width="6" fill="transparent" r="36" cx="42" cy="42"/>
                            </svg>
                            <div class="progress-ring-text absolute text-md text-green-600 font-semibold">
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 flex text-sm leading-6 text-gray-600">
                        <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500">
                            <span>Upload pathology reports</span>
                            <input id="file-upload" name="file-upload" class="sr-only" type="file" multiple accept=".txt">
                        </label>
                        <p class="pl-1">or drag and drop files here</p>
                    </div>
                    <p class="text-xs leading-5 text-gray-600">TXT files only</p>
                </div>
            </div>
            <p id="files-uploaded-message" class="mt-2 text-sm text-gray-500"></p>
        </div>
        <div id="file-upload-buttons" class="py-2 sm:py-4">
            <div class="flex justify-center gap-2">
                <button id="reset-btn" type="reset" class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Reset</button>
                <button id="submit-btn" type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-green-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Submit</button>
            </div>
        </div>
    </div>
</div>
  
<div id="upload-extraction-divider" class="pt-4">
    <div  class="relative">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-300 mx-4 sm:mx-6 lg:mx-8"></div>
        </div>
        <div class="relative flex justify-center">
            <span class="bg-white px-2 text-lg font-semibold text-gray-500">Information extracted by the LLM</span>
        </div>
    </div>
</div>
  
<!-- Information extraction -->
<div class="mx-auto max-w-7xl mt-4 px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 lg:mb-8 border rounded-lg">
    <div id="info-extraction" class="w-full mt-4 px-4 sm:px-6 lg:px-8"></div>
</div>
  
<div id="extraction-harmonization-divider" class="pt-4">
    <div class="relative">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-300 mx-4 sm:mx-6 lg:mx-8"></div>
        </div>
        <div class="relative flex justify-center">
            <span class="bg-white px-2 text-lg font-semibold text-gray-500">Data standardization to SNOMED-CT</span>
        </div>
    </div>
</div>
  
<!-- Data standardization -->
<div class="mx-auto max-w-7xl mt-4 px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 lg:mb-8 border rounded-lg">
    <div id="standardization" class="w-full mt-4 px-4 sm:px-6 lg:px-8"></div>
</div>
`}se("app");let L=null;const ne=document.getElementById("baseURL"),U=document.getElementById("apiKey"),oe=document.getElementById("forget-api-key"),z=document.getElementById("submit-api-key"),w=document.getElementById("llmModel"),v=document.getElementById("api-key-message-container");oe.addEventListener("click",function(){for(U.value="";v.firstChild;)v.removeChild(v.firstChild);H(),k.deleteKey()});w.addEventListener("change",function(){L!==null&&L.setModel(this.value)});z.addEventListener("click",async function(){const t=document.getElementById("apiKey"),e=ne.value,o=t.value,l=await k.validateApiKey(e,o);for(;v.firstChild;)v.removeChild(v.firstChild);if(l){k.setKey(o),L=await T.instantiate({baseURL:e,apiKey:o});const s=L.getModelsList();w.innerHTML="",w.disabled=!1,s.forEach(function(d,u){const c=document.createElement("option");c.value=d,c.text=d,w.appendChild(c),u===0&&(w.value=d,L.setModel(w.value))});const i=document.createElement("div");i.classList.add("bg-green-50","border","border-green-300","text-green-800","px-4","py-3","rounded","relative","mt-4"),i.innerHTML='<strong class="font-bold">Success!</strong> API key validation was successful.',v.appendChild(i)}else{H();const s=document.createElement("div");s.classList.add("bg-red-50","border","border-red-300","text-red-800","px-4","py-3","rounded","relative","mt-4"),s.innerHTML='<strong class="font-bold">Error!</strong> The input LLM API URL or API key was invalid.',v.appendChild(s)}});function H(){w.innerHTML='<option value="" disabled selected>Set URL/API key above to see models list</option>'}(async()=>{const t=k.getKey();t&&(U.value=t,z.click())})();const A=document.getElementById("info-extraction"),P=document.getElementById("standardization"),C=[];async function D(t){C.length=0;let e=[];const o=document.getElementById("file-upload-icon"),l=document.getElementById("progress-ring"),s=l.querySelector(".progress-ring-text"),i=document.getElementById("files-uploaded-message");o.classList.add("hidden"),l.classList.remove("hidden"),i.textContent="",[...t].forEach((d,u)=>{const c=new FileReader;let m=new Promise((h,f)=>{c.onload=function(x){C.push({name:d.name,data:x.target.result}),s.textContent=`${u+1}/${t.length}`,h()},c.onerror=f,c.readAsText(d)});e.push(m)}),await Promise.all(e),l.classList.add("hidden"),o.classList.remove("hidden"),i.textContent=`${C.length} files uploaded successfully.`}const I=document.getElementById("file-drop-area");function ie(t){t.preventDefault(),t.stopPropagation()}["dragenter","dragover","dragleave","drop"].forEach(t=>{I.addEventListener(t,ie,!1)});function re(t){I.classList.add("border-green-900","border-2")}function ae(t){I.classList.remove("border-green-900","border-2")}["dragenter","dragover"].forEach(t=>{I.addEventListener(t,re,!1)});["dragleave","drop"].forEach(t=>{I.addEventListener(t,ae,!1)});function le(t){const o=t.dataTransfer.files;D(o)}I.addEventListener("drop",le,!1);const F=document.getElementById("file-upload");F.addEventListener("change",t=>{const e=t.target.files;D(e)});const de=document.getElementById("reset-btn");de.addEventListener("click",t=>{C.length=0,F.value="",A.innerHTML="",P.innerHTML="",document.getElementById("files-uploaded-message").textContent=""});const y=document.getElementById("submit-btn"),b=[];function ce(t,e,o){o.innerHTML="";const l=document.createElement("div");l.className="relative overflow-x-auto shadow-md sm:rounded-lg my-4 w-full";const s=document.createElement("table");s.className="w-full text-sm text-left text-gray-500";const i=document.createElement("thead");i.className="text-xs text-white uppercase bg-green-900";const d=document.createElement("tr");t.forEach(c=>{const m=document.createElement("th");m.scope="col",m.className="px-6 py-3",m.textContent=c,d.appendChild(m)}),i.appendChild(d),s.appendChild(i);const u=document.createElement("tbody");e.forEach(c=>{const m=document.createElement("tr");m.className="bg-white border-b hover:bg-green-50",t.forEach(h=>{const f=document.createElement("td");f.className="px-4 py-2",f.textContent=c[h]??"-",m.appendChild(f)}),u.appendChild(m)}),s.appendChild(u),l.appendChild(s),o.appendChild(l)}function me(t,e,o,l){l.innerHTML="";const s=document.createElement("div");s.className="relative overflow-x-auto shadow-md sm:rounded-lg my-4 w-full";const i=document.createElement("table");i.className="w-full text-sm text-left text-lime-500 underline";const d=document.createElement("thead");d.className="text-xs text-lime-300 uppercase underline bg-green-900";const u=document.createElement("tr"),c=["snomed","custom"],m=a=>{const[n,r]=a.split(":");return o[n]+r},h=(a,n)=>a[n]["@id"]?c.some(r=>a[n]["@id"].includes(r))?m(a[n]["@id"]):a[n]["@id"]:a[n]?c.some(r=>a[n].includes(r))?m(a[n]):a[n]:"#",f=(a,n,r)=>{var p;return r==="-"?"#":n==="id"?`${a[n]["@id"]}${r}`:(p=a[n])!=null&&p["@vocab"]&&a[n]["@vocab"][r]?c.some(g=>a[n]["@vocab"][r].includes(g))?m(a[n]["@vocab"][r]):a[n]["@vocab"][r]:a[n]?c.some(g=>a[n].includes(g))?m(a[n]):a[n]:"#"};t.forEach(a=>{const n=document.createElement("th");n.scope="col",n.className="px-6 py-3";const r=document.createElement("a");r.href=h(o,a),r.textContent=a,r.target="_blank",n.appendChild(r),u.appendChild(n)}),d.appendChild(u),i.appendChild(d);const x=document.createElement("tbody");e.forEach(a=>{const n=document.createElement("tr");n.className="bg-white border-b hover:bg-green-50",t.forEach(r=>{const p=document.createElement("td");p.className="px-4 py-2";const g=a[r]??"-",E=document.createElement("a");E.href=f(o,r,g),E.textContent=g,E.target="_blank",p.appendChild(E),n.appendChild(p)}),x.appendChild(n)}),i.appendChild(x),s.appendChild(i),l.appendChild(s)}y.addEventListener("click",async t=>{const e=y.innerHTML;if(y.innerHTML=`
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                Extracting data...
            `,y.disabled=!0,A.innerHTML="",P.innerHTML="",C.length===0){alert("Please upload at least one file."),y.innerHTML=e,y.disabled=!1;return}b.length=0;let o=[];const l=n=>new Promise(r=>setTimeout(r,n)),s=0,i=async(n,r)=>{await l(r);let p=await L.extractInformation(n.data);const g=n.name.split(".");p={id:g.length>1?g.slice(0,-1).join("."):n.name,...p},b.push(p)};C.forEach((n,r)=>{let p=new Promise(async(g,E)=>{try{await i(n,r*s),g()}catch($){E($)}});o.push(p)}),await Promise.all(o);const d=Object.keys(b[0]);b.sort((n,r)=>n.id.localeCompare(r.id));const u=document.createElement("div");u.className="flex justify-center w-full",ce(d,b,u),A.appendChild(u);const c=document.createElement("div");c.className="flex justify-center w-full my-2";const m=document.createElement("button");m.className="inline-flex justify-center rounded-md border border-transparent bg-green-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",m.textContent="Download as JSON",m.addEventListener("click",n=>{const r="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(b,null,2)),p=document.createElement("a");p.setAttribute("href",r),p.setAttribute("download","extracted_information.json"),p.click()}),c.appendChild(m),A.appendChild(c);const h={"@context":K,"@graph":b},f=document.createElement("div");f.className="flex justify-center w-full",me(Object.keys(h["@graph"][0]),h["@graph"],h["@context"],f),P.appendChild(f);const x=document.createElement("div");x.className="flex justify-center w-full my-2";const a=document.createElement("button");a.className="inline-flex justify-center rounded-md border border-transparent bg-green-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",a.textContent="Download as JSON-LD",a.addEventListener("click",n=>{const r="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(h,null,2)),p=document.createElement("a");p.setAttribute("href",r),p.setAttribute("download","harmonized_data.jsonld"),p.click()}),x.appendChild(a),P.appendChild(x),y.innerHTML=e,y.disabled=!1});
