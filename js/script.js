const zadaniaDiv = document.getElementById("zadania");
const opcjeDiv = document.getElementById("opcje");
const dodajZadanieP = document.getElementById("dodaj-zadanie");

getZadania().forEach(zadanie => {
    const zadanieElement = stworzZadanie(zadanie.id, zadanie.tresc, zadanie.dataZakoncz);
    zadaniaDiv.appendChild(zadanieElement); 
});

dodajZadanieP.addEventListener("click", () => dodajZadanie());

function getZadania(){
    return JSON.parse(localStorage.getItem("zadania-tresci") || "[]");
}

function zapiszZadania( zadania ){
    localStorage.setItem("zadania-tresci", JSON.stringify( zadania ));
}

function stworzZadanie(id, tresc, dataZakoncz) {
    const zadanie = document.createElement("div");
    zadanie.classList.add("zadanie");

    const poleTekstowe = document.createElement("textarea");
    poleTekstowe.classList.add("zadanie-tresc");
    poleTekstowe.value = tresc;
    poleTekstowe.placeholder = "Nowe zadanie";
    poleTekstowe.maxLength = "128";

    const usunZadanieP = document.createElement("button");
    usunZadanieP.classList.add("zadanie-usun");
    usunZadanieP.innerText = "X";

    const ukonczZadanieP = document.createElement("button");
    ukonczZadanieP.classList.add("zadanie-ukoncz");
    ukonczZadanieP.innerText = "✔";

    const data = document.createElement("span");
    data.classList.add("data-zakoncz");
    data.innerText = dataZakoncz;

    poleTekstowe.addEventListener("change", () => {
        aktualizujZadanie(id, poleTekstowe.value);
    });

    poleTekstowe.addEventListener("click", () => {
        console.log("Kliknięto pole tekstowe");
    });

    usunZadanieP.addEventListener("click", () => {
        console.log("Kliknięto usunąć");

        const czyUsunac = confirm("Napewno usunąć?");

        if (czyUsunac) {
            usunNotatke(id, zadanie);
        }
    });

    ukonczZadanieP.addEventListener("click", () => {
        console.log("Kliknięto ukonczyć");
    });

    zadanie.appendChild(poleTekstowe);
    zadanie.appendChild(data);
    zadanie.appendChild(ukonczZadanieP);
    zadanie.appendChild(usunZadanieP);

    return zadanie;
}

function dodajZadanie(){
    const istniejaceZadania = getZadania();

    const dzisiaj = new Date();
    const rok = dzisiaj.getFullYear();
    const miesiac = dzisiaj.getMonth() < 10 ? "0" + (dzisiaj.getMonth() + 1) : dzisiaj.getMonth() + 1;
    const dzien = dzisiaj.getDate() < 10 ? "0" + dzisiaj.getDate() : dzisiaj.getDate();
    const dataZakoncz = dzien + "." + miesiac + "." + rok;

    const zadanieObiekt = {
        id: Math.floor(Math.random() * 10000),
        tresc: "",
        dataZakoncz: dataZakoncz
    };

    const zadanieElement = stworzZadanie( zadanieObiekt.id, zadanieObiekt.tresc, zadanieObiekt.dataZakoncz );
    zadaniaDiv.appendChild(zadanieElement); 

    istniejaceZadania.push( zadanieObiekt );
    zapiszZadania( istniejaceZadania );
}

function aktualizujZadanie( id, nowaTresc ){
    const zadania = getZadania();
    const zadanieTarget = zadania.filter(zadania => zadania.id == id)[0];

    zadanieTarget.tresc = nowaTresc;
    zapiszZadania(zadania);
}

function usunNotatke( id, zadanie ){
    const zadania = getZadania().filter(zadanie => zadanie.id != id);

    zapiszZadania(zadania);
    zadaniaDiv.removeChild(zadanie);
}