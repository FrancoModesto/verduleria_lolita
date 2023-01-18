//LISTADO DE PRODUCTOS
const listado = document.querySelector(".listado-prod")
let prods = []

function cargarProductos(array) {
    listado.innerHTML = ""
    array.forEach(prod => {
        const div = document.createElement("div")
        div.className = "producto"
        div.innerHTML = `
        <div class="img">${prod.img}</div>
        <h3>${prod.name}</h3>
        <div class="btn">Agregar al Carrito</div>
        `
        listado.append(div)
    });
}

async function obtenerProductos() {
    const res = await fetch("./src/js/prods.json")
    prods = await res.json()
    cargarProductos(prods)
}

obtenerProductos()

//FILTRADO
const inputSearch = document.querySelector("#search")
const inputFilters = document.querySelector("#filters")

function filtrarProductos() {
    const tipo = inputFilters.options[inputFilters.selectedIndex].value
    const parametro = inputSearch.value.trim().toUpperCase()

    let filtrados = prods.filter(prod => prod.type.includes(tipo))
    let resultado = filtrados.filter(prod => prod.name.includes(parametro))

    if (resultado.length > 0) {
        cargarProductos(resultado)
    } else {
        listado.innerHTML = `<h3>No se encontraron productos que contengan "${parametro}"`
    }
}

inputFilters.addEventListener("change", () => {
    filtrarProductos()
})

inputSearch.addEventListener("input", () => {
    filtrarProductos()
})