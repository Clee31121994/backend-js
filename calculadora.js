'use strict'


let params = process.argv.slice(2);

let numero1 = parseFloat(params[0]);
let numero2 = parseFloat(params[1]);  



let plantilla = `
La Suma es: ${numero1 + numero2}
La Resta es: ${numero1 - numero2}
La Multiplicacion es: ${numero1 * numero2}
La Division es: ${numero1 / numero2}
`

console.log(plantilla);
console.log("Hola mundo con NodeJS");