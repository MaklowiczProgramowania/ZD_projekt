const zadaniaDiv = document.getElementById("zadania");
const opcjeDiv = document.getElementById("opcje");
const dodajZadanieP = document.getElementById("dodaj-zadanie-btn");
const poleData = document.getElementById("data");
const trescNoweZadanie = document.getElementById("nowe-zadanie-tresc");
const wagaZadania = document.getElementsByName('kategoria');

// Pobierz aktualną datę i ustaw ją jako minimalną datę, oraz domyślną wartość, w polu wyboru daty
var today = new Date();
var year = today.getFullYear();
var month = (today.getMonth() + 1).toString().padStart(2, '0');
var day = today.getDate().toString().padStart(2, '0');
var minDate = year + '-' + month + '-' + day;
poleData.setAttribute('min', minDate);
poleData.setAttribute('value', minDate);

// Dla każdego zadania w localStorage stwórz element zadania
getZadania().forEach(zadanie => {
    const zadanieElement = stworzZadanie(zadanie.id, zadanie.tresc, zadanie.dataZakoncz, zadanie.waga);
    zadaniaDiv.appendChild(zadanieElement); 
});

// Po kliknięciu w przycisk "dodaj zadanie", dodaj nowe zadanie
dodajZadanieP.addEventListener("click", () => dodajZadanie());

// Pobierz zadania z localStorage
function getZadania(){
    return JSON.parse(localStorage.getItem("zadania-tresci") || "[]");
}

// Zapisz zadania w localStorage
function zapiszZadania( zadania ){
    localStorage.setItem("zadania-tresci", JSON.stringify( zadania ));
}

// Stwórz element zadania z przyciskami oraz polem tekstowym a następnie dodaj do nich event listenery, i zwróć element zadania
function stworzZadanie( id, tresc, dataZakoncz, waga ){

    const zadanie = document.createElement("div");
    zadanie.classList.add("zadanie");

    const poleTekstowe = document.createElement("textarea");
    poleTekstowe.value = tresc;
    poleTekstowe.maxLength = "128";

    
    const usunZadanieP = document.createElement("button");
    usunZadanieP.innerText = "X";
    
    const ukonczZadanieP = document.createElement("button");
    ukonczZadanieP.innerText = "✔";
    
    const data = document.createElement("span");
    const dzisiaj = new Date();
    const dniPomiędzy = Math.ceil((dataZakoncz - dzisiaj.getTime()) / (1000*3600*24));
    data.classList.add("dni-pomiędzy");
    
    // Dodaj odpowiednie klasy do elementów w zależności od wagi zadania
    switch(waga){
        case "bardzo-wazne":
            poleTekstowe.classList.add("zadanie-tresc-bardzo-wazne");
            usunZadanieP.classList.add("zadanie-usun-bardzo-wazne");
            ukonczZadanieP.classList.add("zadanie-ukoncz-bardzo-wazne");
            break;
        case "wazne":
            poleTekstowe.classList.add("zadanie-tresc-wazne");
            usunZadanieP.classList.add("zadanie-usun-wazne");
            ukonczZadanieP.classList.add("zadanie-ukoncz-wazne");
            break;
        case "normalne":
            poleTekstowe.classList.add("zadanie-tresc-normalne");
            usunZadanieP.classList.add("zadanie-usun-normalne");
            ukonczZadanieP.classList.add("zadanie-ukoncz-normalne");
            break;
        default:
            alert("Błąd przy wyświetleniu zadania o id: " + id);
            return;
    }
    
    poleTekstowe.addEventListener("change", () => {
        aktualizujZadanie(id, poleTekstowe.value);
    });
    
    usunZadanieP.addEventListener("click", () => {
        
        const czyUsunac = confirm("Napewno usunąć?");
        
        if (czyUsunac) {
            usunNotatke(id, zadanie);
        }
    });
    
    zadanie.appendChild(poleTekstowe);
    zadanie.appendChild(data);
    zadanie.appendChild(usunZadanieP);
    

    // Jeśli czas się skończył, to poinformuj o tym użytkownika
    if(dniPomiędzy < 0){
        data.innerText = "Nie ukończone";
        poleTekstowe.style.textDecoration = "line-through";
        poleTekstowe.style.textDecorationColor = "red";
        return zadanie;
    }

    zadanie.appendChild(ukonczZadanieP);

    // Jeśli zadanie jest do dziś, to poinformuj o tym użytkownika
    if(dniPomiędzy == 0){
        data.innerText = "Ostatni dzień";
        poleTekstowe.style.textDecoration = "underline";
        poleTekstowe.style.textDecorationColor = "orange";
        return zadanie;
    }
    
    // W zależności od ilości dni, wyświetl odpowiednią informację
    switch(true){
        case ( dniPomiędzy == 1 ):
            data.innerText = "Został " + dniPomiędzy + " dzień";
            break;
        case ( dniPomiędzy < 5 ):
            data.innerText = "Zostały " + dniPomiędzy + " dni";
            break;
        default:
            data.innerText = "Zostało " + dniPomiędzy + " dni";
    }

    return zadanie;
}

function dodajZadanie(){

    if (trescNoweZadanie.value == "") {
        alert("Wpisz treść zadania!");
        return;
    }

    const istniejaceZadania = getZadania();
    const dataZakonczInput = new Date(poleData.value);
    let zaznaczonaWaga = "";

    for (var i = 0; i < wagaZadania.length; i++) {
        if (wagaZadania[i].checked) {
            zaznaczonaWaga = wagaZadania[i].value;
            break;
        }
    }

    const zadanieObiekt = {
        id: Math.floor(Math.random() * 10000),
        tresc: trescNoweZadanie.value,
        dataZakoncz: dataZakonczInput.getTime(),
        waga: zaznaczonaWaga
    };

    const zadanieElement = stworzZadanie( zadanieObiekt.id, zadanieObiekt.tresc, zadanieObiekt.dataZakoncz, zadanieObiekt.waga );
    zadaniaDiv.appendChild(zadanieElement); 

    istniejaceZadania.push( zadanieObiekt );
    zapiszZadania( istniejaceZadania );
}

// Po zmianie treści zadania zaktualizuj zadanie w localStorage
function aktualizujZadanie( id, nowaTresc ){
    const zadania = getZadania();

    // Użyj metody filter aby znaleźć zadania o podanym id i wybierz pierwsze z nich
    const zadanieTarget = zadania.filter(zadania => zadania.id == id)[0];

    zadanieTarget.tresc = nowaTresc;
    zapiszZadania(zadania);
}

// Usuń zadanie z localStorage
function usunNotatke( id, zadanie ){
    const zadania = getZadania().filter(zadanie => zadanie.id != id);

    zapiszZadania(zadania);
    zadaniaDiv.removeChild(zadanie);
}