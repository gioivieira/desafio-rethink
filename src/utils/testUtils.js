import dotenv from 'dotenv'

dotenv.config()

export const createUser = (overrides = {}) => ({
    cpf: process.env.CPF,
    full_name: process.env.FULL_NAME,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    confirmPassword: process.env.PASSWORD,
    ...overrides
})
export const user = (overrides = {}) => ({
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    ...overrides
})
export const sendPoints = (overrides = {}) => ({
    recipientCpf: process.env.RECIPIENT_CPF,
    amount: 50,
    ...overrides
})