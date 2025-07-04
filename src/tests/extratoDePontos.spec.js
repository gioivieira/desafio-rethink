import axios from 'axios'
import { BASE_URL } from '../constants.js'
import { generate } from 'gerador-validador-cpf'

const cpf = generate()
const email = `fernanda${Date.now()}${Math.floor(Math.random() * 10000)}@teste.com`
const password = 'Senha@815'
let token

beforeAll(async () => {
    try {
        const response = await axios.post(`${BASE_URL}/cadastro`, {
            "cpf": cpf,
            "full_name": "Fernanda Faria",
            "email": email,
            "password": password,
            "confirmPassword": password
        })

        token = response.data.confirmToken

        await axios.post(`${BASE_URL}/points/send`, {
            "recipientCpf": "85997408060",
            "amount": 50
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
                "password": password
            }
        })
    } catch (error) {
        console.error(error.response.data.error)
        throw error
    }
})
describe('Casos de testes para "Extrato de pontos"', () => {
    test('Dado que o usuário está autenticado, Quando enviar token válido, Então deve retornar uma lista com 1 objeto com campos específicos e status 200', async () => {
        expect.assertions(3)

        try {
            const response = await axios.get(`${BASE_URL}/points/extrato`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(response.status)
            console.log(response.data)
            expect(response.status).toBe(200)
            expect(response.data.length).toBe(1)
            expect(response.data[0]).toMatchObject({
                "id": expect.any(String),
                "from_user": expect.any(String),
                "to_user": expect.any(String),
                "amount": 50,
                "created_at": expect.any(String)
            })
        } catch (error) {
            console.error(error.response.data.error)
            throw error
        }
    })
})