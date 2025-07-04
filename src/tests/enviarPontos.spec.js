import axios from 'axios'
import { BASE_URL } from '../constants.js'
import { generate } from 'gerador-validador-cpf'

const cpf = generate()
const email = `gloria${Date.now()}${Math.floor(Math.random() * 10000)}@teste.com`
const password = 'Senha@137'
let token

beforeAll(async () => {
    const response = await axios.post(`${BASE_URL}/cadastro`, {
        "cpf": cpf,
        "full_name": "Gloria Santos",
        "email": email,
        "password": password,
        "confirmPassword": password
    })

    token = response.data.confirmToken
})
afterAll(async () => {
    await axios.delete(`${BASE_URL}/account`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            password: password
        }
    })
})
describe('Casos de testes para "Enviar pontos"', () => {
    test('Dado que o usuário está autenticado, Quando enviar saldo insuficiente, Então deve sinalizar que o saldo é insuficiente e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/points/send`, {
                "recipientCpf": "85997408060",
                "amount": 101
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Saldo insuficiente')
        }
    })
    test('Dado que o usuário está autenticado, Quando enviar valores válidos, Então deve sinalizar que os pontos foram enviados e status 200', async () => {
        const response = await axios.post(`${BASE_URL}/points/send`, {
            "recipientCpf": "85997408060",
            "amount": 50
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        expect(response.status).toBe(200)
        expect(response.data.message).toBe('Pontos enviados com sucesso.')
    })
    test('Dado que o usuário está autenticado, Quando enviar saldo inválido, Então deve sinalizar que o valor é inválido e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/points/send`, {
                "recipientCpf": "85997408060",
                "amount": "Cem"
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Valor inválido')
        }
    })
    test('Dado que o usuário está autenticado, Quando enviar saldo negativo, Então deve sinalizar que o valor é inválido e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/points/send`, {
                "recipientCpf": "85997408060",
                "amount": -100
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Valor inválido')
        }
    })
    test('Dado que o usuário está autenticado, Quando enviar usuário inexistente, Então deve sinalizar que o usuário não foi encontrado e status 404', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/points/send`, {
                "recipientCpf": "56874896587",
                "amount": 50
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            expect(error?.status).toBe(404)
            expect(error?.response?.data?.error).toBe('Usuário destino não encontrado')
        }
    })
})