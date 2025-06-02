
// Seleccionar elementos del DOM
const mesaLista = document.getElementById('mesa-lista');
const btnAgregar = document.getElementById('btn-agregar');

// Contador para las mesas
let contadorMesas = 0;

// Evento para agregar mesas
btnAgregar.addEventListener('click', () => {
  contadorMesas++; // Incrementar el contador

  // Crear un nuevo botón para la mesa
  const nuevaMesa = document.createElement('button');
  nuevaMesa.classList.add('btn-mesa');
  nuevaMesa.textContent = `Mesa ${contadorMesas}`;

  // Agregar el botón a la lista de mesas
  mesaLista.appendChild(nuevaMesa);
});