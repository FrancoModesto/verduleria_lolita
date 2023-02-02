let prods = []
let carrito = []

const local = JSON.parse(localStorage.getItem("carrito"))
if (local != null && local != "" && local != false && local != undefined) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
}

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
function comparacionPorPrecio(a, b) {
    return ((inputPrices.options[inputPrices.selectedIndex].value === "0") ? (a.price - b.price) : (b.price - a.price))
}

function ordenarPorNombre(a, b) {
    return ((a.name > b.name) ? 1 : -1)
}

function darEventosAProds(array) {
    const prodsBtns = document.querySelectorAll(".btn-add")

    prodsBtns.forEach((prodHTML, i) => {
        prodHTML.addEventListener("click", () => {
            agregarACarrito(array[i])
            Toastify({
                text: "Agregado al Carrito!",
                duration: 3000,
                style: {
                    background: "linear-gradient(to right, rgb(45, 125, 255), rgb(15, 80, 175))",
                }
            }).showToast();
        })
    })
}

function renderizarProductos(array) {
    listado.innerHTML = ""
    array.sort(comparacionPorPrecio)
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


//CARRITO
carritoBtn.addEventListener("click", () => {
    (carritoSlide.style.top == "-1em") ? (carritoSlide.style.top) = "-100%" : (carritoSlide.style.top = "-1em")
})

function removerDeCarrito(i) {
    carrito.splice(i, 1)
    renderizarCarrito(carrito)
}

function darEventosAProdsCarrito(array) {
    const prodsCarritoBtns = document.querySelectorAll(".btn-rem")

    prodsCarritoBtns.forEach((prodHTML, i) => {
        prodHTML.addEventListener("click", () => {
            removerDeCarrito(i)
            Toastify({
                text: "Eliminado del Carrito",
                duration: 3000,
                style: {
                    background: "linear-gradient(to right, rgb(200, 0, 0), rgb(120, 0, 0))",
                }
            }).showToast();
        })
    })
}

function calcularTotal(array) {
    const total = (array.map(prod => prod.price)).reduce((a, b) => a + b)
    carritoPrice.innerHTML = `$${total}`
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


//CARRITO - BTNS
function vaciarCarrito() {
    carrito = []
    renderizarCarrito(carrito)
}

carritoBtnEmpty.addEventListener("click", () => {
    vaciarCarrito()
    Toastify({
        text: "Carrito Vaciado",
        duration: 3000,
        style: {
            background: "linear-gradient(to right, rgb(200, 0, 0), rgb(120, 0, 0))",
        }
    }).showToast();
})

carritoBtnBuy.addEventListener("click", () => {
    Toastify({
        text: `Compra Realizada por un Total de ${carritoPrice.textContent}!`,
        duration: 5000,
        style: {
            background: "linear-gradient(to right, rgb(51, 130, 51), rgb(0, 90, 0))",
        }
    }).showToast();
    vaciarCarrito()
})


//FILTRADO
function filtrarProductos() {
    const tipo = inputFilters.options[inputFilters.selectedIndex].value
    const parametro = inputSearch.value.trim().toUpperCase()

    const filtrados = prods.filter(prod => prod.type.includes(tipo))
    const resultado = filtrados.filter(prod => prod.name.includes(parametro))

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

let oldValue = ""
inputSearch.addEventListener("input", () => {
    if (inputSearch.value.length > 20) {
        inputSearch.value = oldValue
    }
    oldValue = inputSearch.value
    filtrarProductos()
})


//ON RUN
obtenerProductos()
renderizarCarrito(carrito)