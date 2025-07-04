import axios from 'axios'
import { BASE_URL } from '../constants.js'
import { generate } from 'gerador-validador-cpf'

const cpf = generate()
const email = `joao${Date.now()}${Math.floor(Math.random() * 10000)}@teste.com`
const password = 'Senha@456'
let token

beforeAll(async () => {
    const response = await axios.post(`${BASE_URL}/cadastro`, {
        "cpf": cpf,
        "full_name": "João Silva",
        "email": email,
        "password": password,
        "confirmPassword": password
    })

    token = response.data.confirmToken
})
afterAll(async () => {
    try {
        await axios.delete(`${BASE_URL}/account`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                password: password
            }
        })
    } catch (error) {
        console.error(error.response.data.error)
    }
})

describe('Casos de testes para "Confirmação de E-mail"', () => {
    test('Dado que o token do usuário é válido, Quando enviar o token, Então deve sinalizar confirmação do e-mail e status 200', async () => {
        expect.assertions(2)

        try {
            console.log(email)
            console.log(token)
            const response = await axios.get(`${BASE_URL}/confirm-email?token=${token}`)

            console.log(response.status)
            console.log(response.data)
            expect(response.status).toBe(200)
            expect(response.data).toBe('E-mail confirmado com sucesso.')
        } catch (error) {
            console.error(error.response.data.error)
            throw error
        }
    })
    test('Dado que o token do usuário é inválido ou está expirado, Quando enviar o token, Então deve sinalizar token inválido ou expirado e status 400', async () => {
        expect.assertions(2)
        
        try {
            token = 'eyJhbGcip_IgcNxkCzcdKt_KLw0'

            await axios.get(`${BASE_URL}/confirm-email?token=${token}`)
        } catch (error) {
            console.error(error.status)
            console.error(error.response.data)
            expect(error.status).toBe(400)
            expect(error.response.data).toBe('Token inválido ou expirado.')
        }
    })
})