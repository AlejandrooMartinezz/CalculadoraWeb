 // Referencia a la pantalla
const pantalla = document.getElementById('pantalla');

// Variables de estado
let nuevoNumero = true;
let botonDecimal = false;
let operando1 = 0;
let operador = "";

//funciones auxiliares
function actualizarPantalla(valor) {
    pantalla.innerText = valor;
}

function obtenerTexto() {
    return pantalla.innerText;
}

function insertarNumero(numero) {
    const MAX_DIGITOS = 12; // Puedes ajustar este límite (12 a 15 es ideal)
    
    if (nuevoNumero) {
        actualizarPantalla(numero);
        nuevoNumero = false;
    } else {
        // Solo añade el número si no hemos superado el límite de la pantalla
        if (obtenerTexto().length < MAX_DIGITOS) {
            actualizarPantalla(obtenerTexto() + numero);
        }
    }
}

function hacerOperacion(op) {
    let actual = parseFloat(obtenerTexto());
    let resultado = 0;
    
    switch (op) {
        case "+": resultado = operando1 + actual; break;
        case "-": resultado = operando1 - actual; break;
        case "*": resultado = operando1 * actual; break;
        case "/": resultado = operando1 / actual; break;
    }
    
    //convertir a string y evitar decimales innecesarios
    actualizarPantalla(parseFloat(resultado.toFixed(10)).toString());
}

//event Listener global para el teclado (Event Delegation)
document.getElementById('teclado').addEventListener('click', function(e) {
    // Si no se hizo clic en un botón, ignorar
    if (!e.target.matches('button')) return;
    
    const btn = e.target;
    const action = btn.dataset.action;
    const number = btn.dataset.number;

    // Si es un número
    if (number !== undefined) {
        insertarNumero(number);
        return;
    }

    // Lógica para el resto de botones
    switch (action) {
        case "add":
        case "subtract":
        case "multiply":
        case "divide":
            nuevoNumero = true;
            botonDecimal = false;
            
            //si ya había un operador en cola, resolverlo primero (operaciones encadenadas)
            if (operador !== "") hacerOperacion(operador);
            
            operando1 = parseFloat(obtenerTexto());
            
            const ops = { add: "+", subtract: "-", multiply: "*", divide: "/" };
            operador = ops[action];
            break;
            
        case "equals":
            if (operador !== "") {
                hacerOperacion(operador);
                nuevoNumero = true;
                botonDecimal = false;
                operando1 = 0;
                operador = "";
            }
            break;
            
        case "clear":
            actualizarPantalla("0");
            nuevoNumero = true;
            botonDecimal = false;
            operando1 = 0;
            operador = "";
            break;
            
        case "delete":
            let texto = obtenerTexto();
            if (texto.length <= 1 || (texto.length == 2 && texto.startsWith("-"))) {
                actualizarPantalla("0");
                nuevoNumero = true;
                botonDecimal = false;
            } else {
                if (texto.endsWith(".")) botonDecimal = false;
                actualizarPantalla(texto.slice(0, -1));
            }
            break;
            
        case "square":
            actualizarPantalla(Math.pow(parseFloat(obtenerTexto()), 2).toString());
            nuevoNumero = true;
            botonDecimal = false;
            break;
            
        case "sqrt":
            let valor = parseFloat(obtenerTexto());
            if (valor >= 0) {
                actualizarPantalla(Math.sqrt(valor).toString());
            } else {
                actualizarPantalla("Error");
            }
            nuevoNumero = true;
            botonDecimal = false;
            break;
            
        case "decimal":
            if (!botonDecimal) {
                actualizarPantalla(obtenerTexto() + ".");
                botonDecimal = true;
                nuevoNumero = false;
            }
            break;
            
        case "sign":
            let actualStr = obtenerTexto();
            if (actualStr === "0" || actualStr === "Error") return;
            
            if (actualStr.startsWith("-")) {
                actualizarPantalla(actualStr.substring(1));
            } else {
                actualizarPantalla("-" + actualStr);
            }
            break;
    }
});