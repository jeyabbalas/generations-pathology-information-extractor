import './style.css'
import pieLogo from './pie.svg';
import githubLogo from './github.svg';


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
          <button id="submit-btn" type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-green-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Submit</button>
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

const resultsDiv = document.getElementById("info-extraction");
const standardizationDiv = document.getElementById("standardization");

// File drop area events
const fileData = [];

function handleFiles(files) {
    fileData.length = 0;

    [...files].forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            fileData.push({
                name: file.name,
                data: e.target.result
            });
        };
        reader.readAsText(file);
    });
    console.log(fileData);
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


// const tableWrapper = document.createElement('div');
// tableWrapper.className = 'flex justify-center w-full';
// generateTable(header, data, tableWrapper);
// resultsDiv.appendChild(tableWrapper);