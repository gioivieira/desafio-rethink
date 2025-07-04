import axios from 'axios'
import { BASE_URL } from '../constants.js'
import { generate } from 'gerador-validador-cpf'

const cpf = generate()
const email = `julia${Date.now()}${Math.floor(Math.random() * 10000)}@teste.com`
const password = 'Senha@0506'
let token

beforeAll(async () => {
    try {
        const response = await axios.post(`${BASE_URL}/cadastro`, {
            "cpf": cpf,
            "full_name": "Júlia Coelho",
            "email": email,
            "password": password,
            "confirmPassword": password
        })

        token = response.data.confirmToken

        await axios.post(`${BASE_URL}/caixinha/deposit`, {
            "amount": 80
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error) {
        console.error(error.response.data.error)
        throw error
    }
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
        throw error
    }
})
describe('Casos de testes para "Caixinha de Pontos - Depósito"', () => {
    test('Dado que o usuário está autenticado, Quando enviar valor válido, Então deve sinalizar que o depósito foi realizado e status 200', async () => {
        expect.assertions(2)

        try {
            const response = await axios.post(`${BASE_URL}/caixinha/deposit`, {
                "amount": 50
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(response.status)
            console.log(response.data.message)
            expect(response.status).toBe(200)
            expect(response.data.message).toBe('Depósito na caixinha realizado.')
        } catch (error) {
            console.error(error.response.data.error)
            throw error
        }
    })

    test('Dado que o usuário está autenticado, Quando enviar valor de depósito insuficiente, Então deve sinalizar que o saldo é insuficiente e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/caixinha/deposit`, {
                "amount": 101
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            console.error(error.status)
            console.error(error.response.data.error)
            expect(error.status).toBe(400)
            expect(error.response.data.error).toBe('Saldo insuficiente')
        }
    })

    // Esse teste falhará propositalmente. Deixei no README o bug que ele acusa. 
    test('Dado que o usuário está autenticado, Quando enviar valor inválido, Então deve sinalizar que o valor do depósito é inválido e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/caixinha/deposit`, {
                "amount": "Cem"
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            console.error(error.status)
            console.error(error.response.data.error)
            expect(error.status).toBe(400)
            expect(error.response.data.error).toBe('Valor inválido')
        }
    })
})

describe('Casos de testes para "Caixinha de Pontos - Retirar"', () => {

    // Esse teste falhará propositalmente. Deixei no README o bug que ele acusa.
    test('Dado que o usuário está autenticado, Quando enviar valor válido, Então deve sinalizar que o resgate foi realizado e status 200', async () => {
        expect.assertions(2)

        try {
            const response = await axios.post(`${BASE_URL}/caixinha/withdraw`, {
                "amount": 10
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(response.status)
            console.log(response.data.message)
            expect(response.status).toBe(200)
            expect(response.data.message).toBe('Resgate da caixinha realizado.')
        } catch (error) {
            console.error(error.response.data.error)
            throw error
        }
    })

    test('Dado que o usuário está autenticado, Quando enviar valor de resgate insuficiente, Então deve sinalizar que o saldo é insuficiente e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/caixinha/withdraw`, {
                "amount": 400
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            console.error(error.status)
            console.error(error.response.data.error)
            expect(error.status).toBe(400)
            expect(error.response.data.error).toBe('Saldo na caixinha insuficiente')
        }
    })

    // Esse teste falhará propositalmente. Deixei no README o bug que ele acusa. 
    test('Dado que o usuário está autenticado, Quando enviar valor inválido, Então deve sinalizar que o valor do resgate é inválido e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/caixinha/withdraw`, {
                "amount": "Cem"
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            console.error(error.status)
            console.error(error.response.data.error)
            expect(error.status).toBe(400)
            expect(error.response.data.error).toBe('Valor inválido')
        }
    })
})

describe('Casos de testes para "Caixinha de Pontos - Extrato"', () => {

    // Esse teste falhará propositalmente. Deixei no README o bug que ele acusa.
    test('Dado que o usuário está autenticado, Quando enviar a autenticação, Então deve receber uma lista com 2 objetos com campos específicos e status 200', async () => {
        expect.assertions(4)

        try {
            const response = await axios.get(`${BASE_URL}/caixinha/extrato`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(response.status)
            console.log(response)
            expect(response.status).toBe(200)
            expect(response.data.length).toBe(2)
            expect(response.data[0]).toMatchObject({
                "id": expect.any(String),
                "user_id": expect.any(String),
                "type": expect.any(String),
                "amount": 50,
                "created_at": expect.any(String)
            })
            expect(response.data[1]).toMatchObject({
                "id": expect.any(String),
                "user_id": expect.any(String),
                "type": expect.any(String),
                "amount": 50,
                "created_at": expect.any(String)
            })
        } catch (error) {
            console.error(error.response.data.error)
            throw error
        }
    })
})