import './style.css'
import pieLogo from './pie.svg';
import githubLogo from './github.svg';

import {manageOpenAIApiKey, InformationExtractor, jsonldContext} from './pathologyInformationExtractor.js';


function ui(divID) {
    let divUI = divID ? document.getElementById(divID) : document.createElement('div');

    divUI.innerHTML = `
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
`
}


ui('app');

// Pathology information extractor
let pie = null;

// Check LLM configuration
const baseURLInput = document.getElementById('baseURL');
const apiKeyInput = document.getElementById('apiKey');
const forgetApiKeyBtn = document.getElementById('forget-api-key');
const submitApiKeyBtn = document.getElementById('submit-api-key');
const modelsListDropdown = document.getElementById('llmModel');
const llmConfigMessageContainer = document.getElementById('api-key-message-container');

forgetApiKeyBtn.addEventListener('click', function () {
    apiKeyInput.value = '';
    while (llmConfigMessageContainer.firstChild) {
        llmConfigMessageContainer.removeChild(llmConfigMessageContainer.firstChild);
    }
    displayDefaultModelsList();
    manageOpenAIApiKey.deleteKey();
});


modelsListDropdown.addEventListener('change', function () {
    if (pie !== null) {
        pie.setModel(this.value);
    }
});


// Click event listener for the submit button
submitApiKeyBtn.addEventListener('click', async function () {
    const apiKeyInput = document.getElementById('apiKey');
    const baseURL = baseURLInput.value;
    const apiKey = apiKeyInput.value;
    const isValid = await manageOpenAIApiKey.validateApiKey(baseURL, apiKey);

    // Clear any existing message within the container
    while (llmConfigMessageContainer.firstChild) {
        llmConfigMessageContainer.removeChild(llmConfigMessageContainer.firstChild);
    }

    if (isValid) {  // API key is valid
        // Save the API key
        manageOpenAIApiKey.setKey(apiKey);

        // Populate models list
        pie = await InformationExtractor.instantiate({baseURL, apiKey});
        const modelsList = pie.getModelsList();
        modelsListDropdown.innerHTML = '';
        modelsListDropdown.disabled = false;
        modelsList.forEach(function (model, index) {
            const option = document.createElement('option');
            option.value = model;
            option.text = model;
            modelsListDropdown.appendChild(option);

            if (index === 0) {  // by default select the first model
                modelsListDropdown.value = model;
                pie.setModel(modelsListDropdown.value);
            }
        });

        // Display success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('bg-green-50', 'border', 'border-green-300', 'text-green-800', 'px-4', 'py-3', 'rounded', 'relative', 'mt-4');
        successMessage.innerHTML = '<strong class="font-bold">Success!</strong> API key validation was successful.';
        llmConfigMessageContainer.appendChild(successMessage);
    } else {  // API key is invalid
        // Display default models list
        displayDefaultModelsList();

        // Display error message
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('bg-red-50', 'border', 'border-red-300', 'text-red-800', 'px-4', 'py-3', 'rounded', 'relative', 'mt-4');
        errorMessage.innerHTML = '<strong class="font-bold">Error!</strong> The input LLM API URL or API key was invalid.';
        llmConfigMessageContainer.appendChild(errorMessage);
    }
});


function displayDefaultModelsList() {
    modelsListDropdown.innerHTML = `<option value="" disabled selected>Set URL/API key above to see models list</option>`;
}


(async () => {
    const apiKey = manageOpenAIApiKey.getKey();
    if (apiKey) {
        apiKeyInput.value = apiKey;
        submitApiKeyBtn.click();
    }
})();


const resultsDiv = document.getElementById("info-extraction");
const standardizationDiv = document.getElementById("standardization");

// File drop area events
const fileData = [];

async function handleFiles(files) {
    fileData.length = 0;
    let promises = [];

    const fileUploadIcon = document.getElementById('file-upload-icon');
    const progressRing = document.getElementById('progress-ring');
    const progressRingText = progressRing.querySelector('.progress-ring-text');
    const filesUploadedMessage = document.getElementById('files-uploaded-message');

    fileUploadIcon.classList.add('hidden');
    progressRing.classList.remove('hidden');
    filesUploadedMessage.textContent = '';

    [...files].forEach((file, index) => {
        const reader = new FileReader();
        let fileReadPromise = new Promise((resolve, reject) => {
            reader.onload = function (e) {
                fileData.push({
                    name: file.name,
                    data: e.target.result
                });
                progressRingText.textContent = `${index + 1}/${files.length}`;
                resolve();
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });

        promises.push(fileReadPromise);
    });

    await Promise.all(promises);

    progressRing.classList.add('hidden');
    fileUploadIcon.classList.remove('hidden');
    filesUploadedMessage.textContent = `${fileData.length} files uploaded successfully.`;
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

async function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    try {
        await handleFiles(files);
    } catch (error) {
        console.error('Error uploading files:', error);
    }
}

fileDropArea.addEventListener('drop', handleDrop, false);


// File upload events
const fileUpload = document.getElementById('file-upload');

fileUpload.addEventListener('change', async (e) => {
    const files = e.target.files;
    try {
        await handleFiles(files);
    } catch (error) {
        console.error('Error uploading files:', error);
    }
});


// Reset button
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', (e) => {
    fileData.length = 0;
    fileUpload.value = '';
    resultsDiv.innerHTML = '';
    standardizationDiv.innerHTML = '';
    document.getElementById('files-uploaded-message').textContent = '';
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
    table.className = 'w-full text-sm text-left text-lime-500';

    // Table header
    const thead = document.createElement('thead');
    thead.className = 'text-xs text-lime-300 uppercase underline bg-green-900';
    const theadRow = document.createElement('tr');

    const curies = ['snomed', 'ncim', 'custom'];
    const resolveCurie = (curie) => {
        const [prefix, suffix] = curie.split(':');
        return context[prefix] + suffix;
    };

    const getResolvedHeaderLink = (context, header) => {
        if (context[header]['@id']) {
            if (curies.some(curie => context[header]['@id'].startsWith(curie))) {
                return resolveCurie(context[header]['@id']);
            }
            return context[header]['@id'];
        }
        if (context[header]) {
            if (curies.some(curie => context[header].startsWith(curie))) {
                return resolveCurie(context[header]);
            }
            return context[header];
        }
        return 'javascript:;';
    }

    const getResolvedCellValueLink = (context, header, value) => {
        if (value === '-') {
            return 'javascript:;';
        }
        if (header === 'id') {
            return `${context[header]['@id']}${value}`;
        }
        if (context[header]?.['@vocab']) {
            if (context[header]['@vocab'][value]) {
                if (curies.some(curie => context[header]['@vocab'][value].startsWith(curie))) {
                    return resolveCurie(context[header]['@vocab'][value]);
                }
                return context[header]['@vocab'][value];
            } else {
                return 'javascript:;';
            }
        }
        if (context[header]) {
            if (curies.some(curie => context[header].startsWith(curie))) {
                return resolveCurie(context[header]);
            }
            return context[header];
        }
        return 'javascript:;';
    }

    const appendLink = (td, context, header, value) => {
        const cellLink = document.createElement('a');
        cellLink.href = getResolvedCellValueLink(context, header, value);
        cellLink.textContent = value;
        cellLink.target = '_blank';
        if (cellLink.href === 'javascript:;') {
            cellLink.removeAttribute('href');
            cellLink.className = 'text-gray-500';
        } else {
            cellLink.className = 'underline';
        }
        td.appendChild(cellLink);
    }

    headers.forEach(header => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.className = 'px-6 py-3';
        const headerLink = document.createElement('a');
        headerLink.href = getResolvedHeaderLink(context, header);
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

            if (Array.isArray(cellValue)) {
                const openBracket = document.createTextNode('[');
                const spanOpenBracket = document.createElement('span');
                spanOpenBracket.className = 'text-gray-500';
                spanOpenBracket.appendChild(openBracket);
                td.appendChild(spanOpenBracket);

                cellValue.forEach(value => {
                    appendLink(td, context, header, value);
                    const separator = document.createTextNode(', ');
                    const spanSeparator = document.createElement('span');
                    spanSeparator.className = 'text-gray-500';
                    spanSeparator.appendChild(separator);
                    td.appendChild(spanSeparator);
                });

                if (td.lastChild) {
                    td.removeChild(td.lastChild);  // remove the last separator
                    const closeBracket = document.createTextNode(']');
                    const spanCloseBracket = document.createElement('span');
                    spanCloseBracket.className = 'text-gray-500';
                    spanCloseBracket.appendChild(closeBracket);
                    td.appendChild(spanCloseBracket);
                }
            } else {
                appendLink(td, context, header, cellValue);
            }

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    targetDiv.appendChild(tableWrapper);
}


submitBtn.addEventListener('click', async (e) => {
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                Extracting data...
            `;
    submitBtn.disabled = true;

    resultsDiv.innerHTML = '';
    standardizationDiv.innerHTML = '';

    if (fileData.length === 0) {
        alert('Please upload at least one file.');
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        return;
    }

    extractedInformation.length = 0;
    let promises = [];

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const delayTime = 0;

    const processFileWithDelay = async (file, delayTime) => {
        await delay(delayTime);
        let extraction = await pie.extractInformation(file.data);
        const fileNameParts = file.name.split('.');
        extraction = {
            ['id']: fileNameParts.length > 1 ? fileNameParts.slice(0, -1).join('.') : file.name,
            ...extraction
        };
        extractedInformation.push(extraction);
    };

    fileData.forEach((file, index) => {
        let extractPromise = new Promise(async (resolve, reject) => {
            try {
                await processFileWithDelay(file, index * delayTime);
                resolve();
            } catch (error) {
                reject(error);
            }
        });

        promises.push(extractPromise);
    });

    await Promise.all(promises);

    const header = Object.keys(extractedInformation[0]);

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
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(extractedInformation, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "extracted_information.json");
        dlAnchorElem.click();
    });

    btnContainer.appendChild(downloadBtn);
    resultsDiv.appendChild(btnContainer);

    // Harmonization
    const harmonizedData = {
        "@context": jsonldContext,
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
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(harmonizedData, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "harmonized_data.jsonld");
        dlAnchorElem.click();
    });

    harmonizedBtnContainer.appendChild(harmonizedDownloadBtn);
    standardizationDiv.appendChild(harmonizedBtnContainer);

    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
});

