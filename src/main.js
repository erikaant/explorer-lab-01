import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

console.log(ccLogo);

function setCardType(type) {
    const colors = {
        "visa": ["#436D99", "#2D57F2"],
        "mastercard": ["#DF6F29", "C69347"],
        "default": ["black", "gray"]
    };

    ccBgColor01.setAttribute("fill", colors[type][0]);
    ccBgColor02.setAttribute("fill", colors[type][1]);
    ccLogo.setAttribute("src", `cc-${type}.svg`);

}

setCardType("default");
//globalThis.setCardType = setCardType;

const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
    mask:"0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
    //mask: Date,
    mask: "MM{/}YY",
    //pattern: 'MM-`YY',
    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
            maxLength: 2,
        },
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 20).slice(2),
        }
    }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardtype: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard",
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default",
        }
    ],
    dispatch: function(appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g,"");
        //dá replace em tudo que não for dígito por vazio
        const foundMask = dynamicMasked.compiledMasks.find(function(item){
            return number.match(item.regex)
        });
        //== .find(({regex}) => number.match(regex))
        
        console.log(foundMask);

        return foundMask;
    },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

//REGEX! Expressões Regulares
/*
- Da esquerda pra direita
- Um caractere por vez, na sequência
- Existem caracteres reservados

    const regex = /foo/;
    ou
    const regex = new RegExp(/foo/);

// Quero agrupar os padrões em um array
    const matches = "aBC".match(/[A-Z]/g);
    //output: Array [B, C]
// Quero pesquisar se existe ou não o padrão em um array
    const index = "aBC".search(/A-Z/);
    //output: 1
// Quero substituir os padrões por um novo valor
    const next = "aBC".replace(/a/, "A");
    //output: ABC

*/

const addButton = document.querySelector("#add-card")

addButton.addEventListener("click", () => {
    console.log("clicou")
});

document.querySelector("form").addEventListener("submit", (event => {
    event.preventDefault();
}));

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value");
    ccHolder.innerText = cardHolder.value.length === 0 ? "Fulano da Silva" : cardHolder.value;
})

securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value);
})

function updateSecurityCode(code) {
    const ccSecurity = document.querySelector(".cc-security .value")
    ccSecurity.innerText = code.length === 0 ? "123" : code;
}

cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype;
    setCardType(cardType);
    updateCardNumber(cardNumberMasked.value);
})

function updateCardNumber(number) {
    const ccNumber = document.querySelector(".cc-number");
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}

expirationDateMasked.on("accept", () => {
    updateExpirationDate(expirationDateMasked.value);
})

function updateExpirationDate(date) {
    const ccDate = document.querySelector(".cc-extra .value");
    ccDate.innerText = date.length === 0 ? "02/32" : date;
}
