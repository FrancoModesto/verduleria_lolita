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

const carritoBtnEmpty = document.querySelector(".btn-empty")
const carritoBtnBuy = document.querySelector(".btn-buy")
const carritoPrice = document.querySelector(".total-price")


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
    const prodsBtns = document.querySelectorAll(".btn-add")

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
                        <div class="default-btn btn-add">Agregar al Carrito</div>`
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

function calcularTotal(array) {
    if (array.length === 1) {
        carritoPrice.innerHTML = `$${parseInt(array[0].price)}`
    } else {
        let total = 0
        array.forEach(prod => {
            total += Number(prod.price)
        })
        carritoPrice.innerHTML = `$${total}`
    }
}

function renderizarCarrito(array) {
    localStorage.setItem("carrito", JSON.stringify(array))
    carritoNumber.innerHTML = `${array.length}`

    if (array.length > 0) {
        calcularTotal(array)
        listadoCarrito.innerHTML = ""
        array.sort(ordenarPorNombre)
        array.forEach(prod => {
            const div = document.createElement("div")
            div.className = "producto-carrito"
            div.innerHTML = `<div class="img">${prod.img}</div>
                            <h3>${prod.name}</h3>
                            <h4>$${prod.price}</h4>
                            <div class="default-btn btn-rem">X</div>`
            listadoCarrito.append(div)
        })
        darEventosAProdsCarrito(array)
    } else {
        carritoPrice.innerHTML = "$0"
        listadoCarrito.innerHTML = `<h3 class="empty-text">EL CARRITO SE ENCUENTRA VACÍO</h3>`
    }
}

function agregarACarrito(prod) {
    carrito.push(prod)
    renderizarCarrito(carrito)
}

carrito = JSON.parse(localStorage.getItem("carrito"))
renderizarCarrito(carrito)


//CARRITO - BTNS
function vaciarCarrito() {
    carrito = []
    renderizarCarrito(carrito)
}

carritoBtnEmpty.addEventListener("click", () => {
    vaciarCarrito()
})

carritoBtnBuy.addEventListener("click", () => {
    vaciarCarrito()
})


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