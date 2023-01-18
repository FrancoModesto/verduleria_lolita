let prods = []
let carrito = []

const listado = document.querySelector(".listado-prod")

const inputSearch = document.querySelector("#search")
const inputFilters = document.querySelector("#filters")
const inputPrices = document.querySelector("#prices")

const carritoBtn = document.querySelector(".carrito-btn")
const carritoNumber = document.querySelector(".carrito-number")
const carritoSlide = document.querySelector(".carrito")
const listadoCarrito = document.querySelector(".listado-carrito")


//LISTADO DE PRODUCTOS
function comparacion(a, b) {
    if (inputPrices.options[inputPrices.selectedIndex].value === "0") {
        return (a.price - b.price)
    } else {
        return (b.price - a.price)
    }
}

function ordenarPorNombre(a, b) {
    if (a.name > b.name) {
        return 1
    } else {
        return -1
    }
}

function darEventosAProds(array) {
    const prodsBtns = document.querySelectorAll(".btn")

    prodsBtns.forEach((prodHTML, i) => {
        prodHTML.addEventListener("click", () => {
            agregarACarrito(array[i])
        })
    })
}

function renderizarProductos(array) {
    listado.innerHTML = ""
    array.sort(comparacion)
    array.forEach(prod => {
        const div = document.createElement("div")
        div.className = "producto"
        div.innerHTML = `<div class="img">${prod.img}</div>
                        <h3>${prod.name}</h3>
                        <h4>$${prod.price}</h4>
                        <div class="btn">Agregar al Carrito</div>`
        listado.append(div)
    })
    darEventosAProds(array)
}

async function obtenerProductos() {
    const res = await fetch("./src/js/prods.json")
    prods = await res.json()
    renderizarProductos(prods)
}

obtenerProductos()


//FILTRADO
function filtrarProductos() {
    const tipo = inputFilters.options[inputFilters.selectedIndex].value
    const parametro = inputSearch.value.trim().toUpperCase()

    let filtrados = prods.filter(prod => prod.type.includes(tipo))
    let resultado = filtrados.filter(prod => prod.name.includes(parametro))

    if (resultado.length > 0) {
        renderizarProductos(resultado)
    } else {
        listado.innerHTML = `<h3>No se encontraron productos que contengan "${parametro}"</h3>`
    }
}

inputFilters.addEventListener("change", () => {
    filtrarProductos()
})

inputPrices.addEventListener("change", () => {
    filtrarProductos()
})

inputSearch.addEventListener("input", () => {
    filtrarProductos()
})


//CARRITO
carritoBtn.addEventListener("click", () => {
    if (carritoSlide.style.top == "-1em") {
        carritoSlide.style.top = "-100%"
    } else {
        carritoSlide.style.top = "-1em"
    }
})

function removerDeCarrito(i, prodHTML) {
    carrito.splice(i, 1)
    renderizarCarrito(carrito)
}

function darEventosAProdsCarrito(array) {
    const prodsCarritoBtns = document.querySelectorAll(".btn-rem")

    prodsCarritoBtns.forEach((prodHTML, i) => {
        prodHTML.addEventListener("click", () => {
            removerDeCarrito(i, prodHTML)
        })
    })
}

function renderizarCarrito(array) {
    carritoNumber.innerHTML = `${carrito.length}`
    if (carrito.length > 0) {
        listadoCarrito.innerHTML = ""
        array.sort(ordenarPorNombre)
        array.forEach(prod => {
            const div = document.createElement("div")
            div.className = "producto-carrito"
            div.innerHTML = `<div class="img">${prod.img}</div>
                            <h3>${prod.name}</h3>
                            <h4>$${prod.price}</h4>
                            <div class="btn-rem">X</div>`
            listadoCarrito.append(div)
        })
        darEventosAProdsCarrito(array)
    } else {
        listadoCarrito.innerHTML = `<h3 class="empty-text">EL CARRITO SE ENCUENTRA VACÍO</h3>`
    }
}

renderizarCarrito(carrito)

function agregarACarrito(prod) {
    carrito.push(prod)
    renderizarCarrito(carrito)
}