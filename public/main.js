import { codeService } from './services/code.service.js'
import { userService } from './services/user.service.js'
import { utilService } from './services/util.service.js'

console.log('Simple driver to test some API calls')

window.onLoadCars = onLoadCars
window.onLoadUsers = onLoadUsers
window.onAddCar = onAddCar
window.onGetCarById = onGetCarById
window.onRemoveCar = onRemoveCar
window.onAddCarMsg = onAddCarMsg

async function onLoadCars() {
    const codes = await codeService.query()
    render('Cars', codes)
}
async function onLoadUsers() {
    const users = await userService.query()
    render('Users', users)
}

async function onGetCarById() {
    const id = prompt('Car id?')
    if (!id) return
    const code = await codeService.getById(id)
    render('Car', code)
}

async function onRemoveCar() {
    const id = prompt('Car id?')
    if (!id) return
    await codeService.remove(id)
    render('Removed Car')
}

async function onAddCar() {
    await userService.login({ username: 'puki', password: '123' })
    const savedCar = await codeService.save(codeService.getEmptyCar())
    render('Saved Car', savedCar)
}

async function onAddCarMsg() {
    await userService.login({ username: 'puki', password: '123' })
    const id = prompt('Car id?')
    if (!id) return

    const savedMsg = await codeService.addCarMsg(id, 'some msg')
    render('Saved Msg', savedMsg)
}

function render(title, mix = '') {
    console.log(title, mix)
    const output = utilService.prettyJSON(mix)
    document.querySelector('h2').innerText = title
    document.querySelector('pre').innerHTML = output
}

