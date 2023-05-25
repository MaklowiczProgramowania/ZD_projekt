const zadaniaDiv = document.getElementById("zadania");
const opcjeDiv = document.getElementById("opcje");
const dodajZadanieP = document.getElementById("dodaj-zadanie");

getZadanie().forEach(zadanie => {
    const zadanieElement = stworzZadanie( zadanie.id, zadanie.content, zadanie.dataZakoncz );
    zadaniaDiv.insertAdjacentHTML("beforeEnd", zadanieElement.outerHTML);
});

dodajZadanieP.addEventListener("click", () => dodajZadanie());

function getZadanie(){
    return JSON.parse(localStorage.getItem("zadania-tresci") || "[]");
}

function zapiszZadania( zadania ){
    localStorage.setItem("zadania-tresci", JSON.stringify( zadania ));
}

function stworzZadanie( id, tresc, dataZakoncz ){
    const zadanie = document.createElement("div");
    zadanie.classList.add("zadanie");

    const poleTesktowe = document.createElement("textarea");
    poleTesktowe.classList.add("zadanie-tresc");
    poleTesktowe.value = tresc;
    poleTesktowe.placeholder = "Nowa zadanie";
    poleTesktowe.maxLength = "128";

    const usunZadanieP = document.createElement("button");
    usunZadanieP.classList.add("zadanie-usun");
    usunZadanieP.innerText = "X";

    const ukonczZadanieP = document.createElement("button");
    ukonczZadanieP.classList.add("zadanie-ukoncz");
    ukonczZadanieP.innerText = "✔";

    const data = document.createElement("span");
    data.classList.add("data-zakoncz");
    data.innerText = dataZakoncz;

    zadanie.appendChild(poleTesktowe);
    zadanie.appendChild(usunZadanieP);
    zadanie.appendChild(ukonczZadanieP);
    zadanie.appendChild(data);

    poleTesktowe.addEventListener("change", () => {
        aktualizujZadanie( id, poleTesktowe.value );
    });

    usunZadanieP.addEventListener("click", () => {
        const czyUsunac = confirm("Napewno usunąć?");

        if ( czyUsunac ){
            usunNotatke( id, zadanie );
        }
    })

    return zadanie;
}

function dodajZadanie(){
    const istniejaceZadania = getZadanie();

    const dzisiaj = new Date();
    const rok = dzisiaj.getFullYear();
    const miesiac = dzisiaj.getMonth() < 10 ? "0" + (dzisiaj.getMonth() + 1) : dzisiaj.getMonth() + 1;
    const dzien = dzisiaj.getDate() < 10 ? "0" + dzisiaj.getDate() : dzisiaj.getDate();
    const dataZakoncz = dzien + "." + miesiac + "." + rok;

    const zadanieObiekt = {
        id: Math.floor(Math.random() * 10000),
        content: "",
        dataZakoncz: dataZakoncz
    };

    const zadanieElement = stworzZadanie( zadanieObiekt.id, zadanieObiekt.content, zadanieObiekt.dataZakoncz );
    zadaniaDiv.insertAdjacentHTML("beforeEnd", zadanieElement.outerHTML);

    istniejaceZadania.push( zadanieObiekt );
    zapiszZadania( istniejaceZadania );
}

function aktualizujZadanie( id, nowaTresc ){
    const zadania = getZadanie();
    const zadanieTarget = zadania.filter(zadania => zadania.id == id)[0];

    zadanieTarget.content = nowaTresc;
    zapiszZadania(zadania);
}

function usunNotatke( id, zadanie ){
    const zadania = getZadanie().filter(zadanie => zadanie.id != id);

    zapiszZadania(zadania);
    zadaniaDiv.removeChild(zadanie);
}