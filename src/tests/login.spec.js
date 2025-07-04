import axios from 'axios'
import { BASE_URL } from '../constants.js'
import { generate } from 'gerador-validador-cpf'

const cpf = generate()
const email = `giovana${Date.now()}${Math.floor(Math.random() * 10000)}@teste.com`
const password = 'Senha@789'
let token

beforeAll(async () => {
    const response = await axios.post(`${BASE_URL}/cadastro`, {
        "cpf": cpf,
        "full_name": "Giovana Vieira",
        "email": email,
        "password": password,
        "confirmPassword": password
    })

    token = response.data.confirmToken

    await axios.get(`${BASE_URL}/confirm-email?token=${token}`)
})
afterAll(async () => {
    await axios.delete(`${BASE_URL}/account`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            "password": password
        }
    })
})
describe('Casos de testes para "Login"', () => {
    test('Dado que o usuário existe, Quando enviar valores válidos, Então deve informar o token e status 200', async () => {
        const response = await axios.post(`${BASE_URL}/login`, {
            "email": email,
            "password": password
        })

        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty('token')
    })
    test('Dado que o usuário não existe, Quando enviar valores inválidos, Então deve sinalizar que credenciais são inválidas e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/login`, {
                "email": "ha@teste.com",
                "password": "Senha@1234"
            })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Credenciais inválidas')
        }
    })

    test('Dado que o usuário existe, Quando enviar e-mail não confirmado, Então deve sinalizar que e-mail não foi confirmado e status 403', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/login`, {
                "email": "maria@teste.com",
                "password": "Senha@1234"
            })
        } catch (error) {
            expect(error?.status).toBe(403)
            expect(error?.response?.data?.error).toBe('E-mail não confirmado')
        }
    })
})