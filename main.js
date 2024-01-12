import './style.css'
import pieLogo from './pie.svg';
import githubLogo from './github.svg';

import { manageOpenAIApiKey, InformationExtractor, jsonlnContext } from './pathologyInformationExtractor.js';


function ui(divID) {
    let divUI = divID ? document.getElementById(divID) : document.createElement('div');

    divUI.innerHTML = `
    <!-- Modal container -->
    <div id="api-key-prompt" class="relative z-10" aria-labelledby="api-key-prompt" role="dialog" aria-modal="true">
      <!--
        Modal - background backdrop, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100"
          To: "opacity-0"
      -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <!-- Modal - content container -->
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <!-- Modal - content alignment -->
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <!--
            Modal - panel, show/hide based on modal state.
    
            Entering: "ease-out duration-300"
              From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100 translate-y-0 sm:scale-100"
              To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          -->
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-2/3 md:w-2/3 lg:w-2/3 xl:w-2/3 2xl:w-2/3 sm:p-6">
            <!-- Model - content icon and message -->
            <div>
            <!-- Modal - content icon -->
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
              <!-- Modal - content message -->
              <div class="mt-3 text-center sm:mt-5">
                <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">OpenAI API key not found</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Please generate an OpenAI API key from your OpenAI account at <span class="text-green-600"><a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer">https://platform.openai.com/account/api-keys</a></span>, enter it below, and click 'Submit'.</p>
                </div>
              </div>
            </div>
            <!-- Model - content buttons -->
            <div class="mt-5 sm:mt-6 flex">
              <input type="password" id="input-api-key" class="flex-grow-0 flex-shrink-0 w-4/5 mr-2 rounded-md px-3 py-2 text-sm border border-green-800 text-gray-700 shadow-sm focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600" placeholder="Enter your OpenAI API key here" autocomplete="off"/>
              <button type="button" id="submit-api-key" class="flex flex-grow-0 flex-shrink-0 w-1/5 items-center justify-center rounded-md bg-green-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Header -->
    <div id="header" class="mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-4 lg:px-8 bg-green-900 rounded-b-lg">
      <div class="flex items-center justify-between">
        <div class="flex justify-start gap-2">
          <div class="flex items-center">
            <img src="${pieLogo}" class="h-12 w-12 sm:h-16 sm:w-16 gap-2 logo vanilla" alt="pie logo" />
          </div>
          <div class="min-w-0 pl-3 flex-1">
            <h2 class="text-2xl font-bold leading-7 text-white sm:text-3xl sm:tracking-tight">Generations</h2>
            <p class="py-1 pr-2 text-sm sm:text-base text-white">Pathology information extractor</p>
          </div>
        </div>
          
        <div class="flex md:mt-0 md:ml-4 shrink-0">
          <a title="Source code" href="https://github.com/jeyabbalas/generations-pathology-information-extractor">
            <img src="${githubLogo}" class="h-10 w-10 sm:h-12 sm:w-12 fill-current" alt="github logo" />
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
    
    <!-- A centered button that says: "Forget API key" -->
    <div class="flex justify-center my-4">
      <button id="forget-api-key" class="inline-flex justify-center rounded-md border border-transparent bg-green-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Forget API key</button>
    </div>
  
  <!-- File upload -->
  <div id="file-upload-container" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border rounded-lg">
    <div class="space-y-6 sm:space-y-5 pt-2 sm:pt-4">
      <div class="col-span-full">
        <h2 class="text-base font-semibold leading-7 text-gray-900">Upload pathology reports</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">Only TXT files are supported. Please ensure that the data is completely deidentified if the data use agreement requires it.</p>
        <div id="file-drop-area" class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div class="text-center">
            <svg class="mx-auto h-14 w-14 text-gray-300" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.956 6h.05a2.99 2.99 0 0 1 2.117.879 3.003 3.003 0 0 1 0 4.242 2.99 2.99 0 0 1-2.117.879h-1.995v-1h1.995a2.002 2.002 0 0 0 0-4h-.914l-.123-.857a2.49 2.49 0 0 0-2.126-2.122A2.478 2.478 0 0 0 6.23 5.5l-.333.762-.809-.189A2.49 2.49 0 0 0 4.523 6c-.662 0-1.297.263-1.764.732A2.503 2.503 0 0 0 4.523 11h2.494v1H4.523a3.486 3.486 0 0 1-2.628-1.16 3.502 3.502 0 0 1-.4-4.137A3.497 3.497 0 0 1 3.853 5.06c.486-.09.987-.077 1.468.041a3.486 3.486 0 0 1 3.657-2.06A3.479 3.479 0 0 1 11.956 6zm-1.663 3.853L8.979 8.54v5.436h-.994v-5.4L6.707 9.854 6 9.146 8.146 7h.708L11 9.146l-.707.707z"/>
            </svg>
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
        <span class="bg-white px-2 text-lg text-gray-500">Information extracted by ChatGPT</span>
      </div>
    </div>
  </div>
  
  <!-- Information extraction -->
  <div class="mx-auto max-w-7xl mt-4 px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 lg:mb-8 border rounded-lg">
    <div id="info-extraction" class="w-full mt-4 px-4 sm:px-6 lg:px-8"></div>
  </div>
  
  <div id="extraction-harmonization-divider" class="pt-4">
    <div  class="relative">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-gray-300 mx-4 sm:mx-6 lg:mx-8"></div>
      </div>
      <div class="relative flex justify-center">
        <span class="bg-white px-2 text-lg text-gray-500">Data standardization to SNOMED-CT</span>
      </div>
    </div>
  </div>
  
  <!-- Data standardization -->
  <div class="mx-auto max-w-7xl mt-4 px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 lg:mb-8 border rounded-lg">
    <div id="standardization" class="w-full mt-4 px-4 sm:px-6 lg:px-8"></div>
  </div>
`
}


ui('app');


// Manage modal
const modal = document.getElementById('api-key-prompt');
const modalInput = document.getElementById('input-api-key');
const modalSubmit = document.getElementById('submit-api-key');
const forgetApiKeyBtn = document.getElementById('forget-api-key');

function showModal() {
    modal.classList.remove('hidden');
    modal.classList.add('block');

    modalInput.focus();
}

function hideModal() {
    modal.classList.remove('block');
    modal.classList.add('hidden');

    modalInput.value = '';
}

async function submitModal() {
    const apiKey = modalInput.value;
    const isValid = await manageOpenAIApiKey.checkValidity(apiKey);

    if (isValid) {
        manageOpenAIApiKey.setKey(apiKey);
        hideModal();
    } else {
        modalInput.value = '';
        modalInput.focus();

        alert('Invalid API key. Please try again.');
    }
}

modalSubmit.addEventListener('click', submitModal);


(async () => {
    const apiKey = manageOpenAIApiKey.getKey();
    const isValid = await manageOpenAIApiKey.checkValidity(apiKey);

    if (!isValid) {
        showModal();
    }
})();


forgetApiKeyBtn.addEventListener('click', (e) => {
    manageOpenAIApiKey.deleteKey();
    showModal();

    e.preventDefault();
});


const resultsDiv = document.getElementById("info-extraction");
const standardizationDiv = document.getElementById("standardization");

// File drop area events
const fileData = [];

async function handleFiles(files) {
    fileData.length = 0;
    let promises = [];

    [...files].forEach(file => {
        const reader = new FileReader();
        let fileReadPromise = new Promise((resolve, reject) => {
            reader.onload = function (e) {
                fileData.push({
                    name: file.name,
                    data: e.target.result
                });
                resolve();
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });

        promises.push(fileReadPromise);
    });

    await Promise.all(promises);

    console.log("Processed " + fileData.length + " files");
}


const fileDropArea = document.getElementById('file-drop-area');
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, preventDefaults, false);
});

function highlight(e) {
    fileDropArea.classList.add('border-green-900', 'border-2');
}

function unhighlight(e) {
    fileDropArea.classList.remove('border-green-900', 'border-2');
}

['dragenter', 'dragover'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, unhighlight, false);
});

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

fileDropArea.addEventListener('drop', handleDrop, false);


// File upload events
const fileUpload = document.getElementById('file-upload');

fileUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFiles(files);
});


// Reset button
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', (e) => {
    fileData.length = 0;
    fileUpload.value = '';
    resultsDiv.innerHTML = '';
    standardizationDiv.innerHTML = '';
});


// Submit button
const submitBtn = document.getElementById('submit-btn');
const extractedInformation = [];


function generateTable(headers, data, targetDiv) {
    targetDiv.innerHTML = '';
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'relative overflow-x-auto shadow-md sm:rounded-lg my-4 w-full';

    const table = document.createElement('table');
    table.className = 'w-full text-sm text-left text-gray-500';

    // Table header
    const thead = document.createElement('thead');
    thead.className = 'text-xs text-white uppercase bg-green-900';
    const theadRow = document.createElement('tr');

    headers.forEach(header => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.className = 'px-6 py-3';
        th.textContent = header;
        theadRow.appendChild(th);
    });

    thead.appendChild(theadRow);
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');

    data.forEach(rowData => {
        const tr = document.createElement('tr');
        tr.className = 'bg-white border-b hover:bg-green-50';

        headers.forEach(header => {
            const td = document.createElement('td');
            td.className = 'px-4 py-2';
            td.textContent = rowData[header] ?? '-';
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    targetDiv.appendChild(tableWrapper);
}

function generateLinkedTable(headers, data, context, targetDiv) {
    targetDiv.innerHTML = '';
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'relative overflow-x-auto shadow-md sm:rounded-lg my-4 w-full';

    const table = document.createElement('table');
    table.className = 'w-full text-sm text-left text-lime-500 underline';

    // Table header
    const thead = document.createElement('thead');
    thead.className = 'text-xs text-lime-300 uppercase underline bg-green-900';
    const theadRow = document.createElement('tr');

    headers.forEach(header => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.className = 'px-6 py-3';
        const headerLink = document.createElement('a');
        headerLink.href = context[header]['@id'] ?? '#';
        headerLink.textContent = header;
        headerLink.target = '_blank';
        th.appendChild(headerLink);
        theadRow.appendChild(th);
    });

    thead.appendChild(theadRow);
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');

    data.forEach(rowData => {
        const tr = document.createElement('tr');
        tr.className = 'bg-white border-b hover:bg-green-50';

        headers.forEach(header => {
            const td = document.createElement('td');
            td.className = 'px-4 py-2';

            const cellValue = rowData[header] ?? '-';
            const cellLink = document.createElement('a');
            if (header === 'SpecimenWeight') {
                // Link the same URI as the header for SpecimenWeight
                cellLink.href = context[header]['@id'];
            } else if (header === 'id') {
                cellLink.href = `${context['id']['@id']}${cellValue}`;
            } else {
                cellLink.href = (context[header]['@vocab'] && context[header]['@vocab'][cellValue]) ?
                                context[header]['@vocab'][cellValue] : '#';
            }
            cellLink.textContent = cellValue;
            cellLink.target = '_blank';
            td.appendChild(cellLink);

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    targetDiv.appendChild(tableWrapper);
}


submitBtn.addEventListener('click', async (e) => {
    if (fileData.length === 0) {
        alert('Please upload at least one file.');
        return;
    }

    const ie = new InformationExtractor(manageOpenAIApiKey.getKey());
    const header = ['id', 'Side', 'ScreenDetected', 'SpecimenType', 'SpecimenWeight', 'AxillaryProcedure', 'PostNeoadjuvantChemo'];

    extractedInformation.length = 0;
    let promises = [];

    fileData.forEach(file => {
        let extractPromise = new Promise(async (resolve, reject) => {
            let extraction = await ie.extractInformation(file.data);
            extraction = {
                ['id']: file.name.endsWith('.txt') ? file.name.slice(0, -4) : file.name,
                ...extraction
            }
            extractedInformation.push(extraction);
            resolve();
        });

        promises.push(extractPromise);
    });

    await Promise.all(promises);

    console.log("Extracted information from " + extractedInformation.length + " files");
    // sort extractedInformation by id
    extractedInformation.sort((a, b) => a.id.localeCompare(b.id));

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'flex justify-center w-full';
    generateTable(header, extractedInformation, tableWrapper);
    resultsDiv.appendChild(tableWrapper);

    // Download button
    const btnContainer = document.createElement('div');
    btnContainer.className = 'flex justify-center w-full my-2';

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'inline-flex justify-center rounded-md border border-transparent bg-green-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2';
    downloadBtn.textContent = 'Download as JSON';
    downloadBtn.addEventListener('click', (e) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(extractedInformation));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "extracted_information.json");
        dlAnchorElem.click();
    });

    btnContainer.appendChild(downloadBtn);
    resultsDiv.appendChild(btnContainer);

    // Harmonization
    const harmonizedData = {
        "@context": jsonlnContext,
        "@graph": extractedInformation
    };

    const harmonizedTableWrapper = document.createElement('div');
    harmonizedTableWrapper.className = 'flex justify-center w-full';
    generateLinkedTable(
        Object.keys(harmonizedData["@graph"][0]),
        harmonizedData["@graph"],
        harmonizedData["@context"],
        harmonizedTableWrapper
    );
    standardizationDiv.appendChild(harmonizedTableWrapper);

    // Download JSON-LD button
    const harmonizedBtnContainer = document.createElement('div');
    harmonizedBtnContainer.className = 'flex justify-center w-full my-2';

    const harmonizedDownloadBtn = document.createElement('button');
    harmonizedDownloadBtn.className = 'inline-flex justify-center rounded-md border border-transparent bg-green-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2';
    harmonizedDownloadBtn.textContent = 'Download as JSON-LD';
    harmonizedDownloadBtn.addEventListener('click', (e) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(harmonizedData));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "harmonized_data.jsonld");
        dlAnchorElem.click();
    });

    harmonizedBtnContainer.appendChild(harmonizedDownloadBtn);
    standardizationDiv.appendChild(harmonizedBtnContainer);
});

