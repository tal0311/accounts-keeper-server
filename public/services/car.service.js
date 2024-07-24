
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'



export const codeService = {
    query,
    getById,
    save,
    remove,
    getEmptyCar,
    addCarMsg
}
window.cs = codeService


async function query(filterBy = { txt: '', price: 0 }) {
    return httpService.get('code', filterBy)
}
function getById(codeId) {
    return httpService.get(`code/${codeId}`)
}

async function remove(codeId) {
    return httpService.delete(`code/${codeId}`)
}
async function save(code) {
    var savedCar
    if (code._id) {
        savedCar = await httpService.put(`code/${code._id}`, code)

    } else {
        savedCar = await httpService.post('code', code)
    }
    return savedCar
}

async function addCarMsg(codeId, txt) {
    const savedMsg = await httpService.post(`code/${codeId}/msg`, {txt})
    return savedMsg
}


function getEmptyCar() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}





