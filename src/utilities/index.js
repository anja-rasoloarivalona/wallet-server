import { v4 as uuid } from 'uuid'
import { setDate } from './date.js'

const generateId = () => {
    const id = uuid()
    return id.replace(/-/g, '').toUpperCase();
}

export {
    generateId,
    setDate
}
