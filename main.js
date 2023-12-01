import './style.css'

function ui(divID) {
    let divUI = divID ? document.getElementById(divID) : document.createElement('div');

    let h1 = document.createElement('h1');
    h1.innerHTML = 'Hello world!';
    h1.className = 'text-3xl font-bold underline';

    divUI.appendChild(h1);
}


ui('app');