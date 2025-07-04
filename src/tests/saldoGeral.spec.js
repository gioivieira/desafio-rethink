import axios from 'axios'
import { BASE_URL } from '../constants.js'
import { generate } from 'gerador-validador-cpf'

const cpf = generate()
const email = `tania${Date.now()}${Math.floor(Math.random() * 10000)}@teste.com`
const password = 'Senha@1345'
let token

beforeAll(async () => {
    try {
        const response = await axios.post(`${BASE_URL}/cadastro`, {
            "cpf": cpf,
            "full_name": "Tania Rocha",
            "email": email,
            "password": password,
            "confirmPassword": password
        })

        token = response.data.confirmToken
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
describe('Casos de testes para "Saldo Geral"', () => {
    test('Dado que o usuário está autenticado, Quando enviar a autenticação, Então deve trazer um objeto com campos específicos e status 200', async () => {
        expect.assertions(2)

        try {
            const response = await axios.get(`${BASE_URL}/points/saldo`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(response.status)
            console.log(response.data)
            expect(response.status).toBe(200)
            expect(response.data).toMatchObject({
                "normal_balance": expect.any(Number),
                "piggy_bank_balance": expect.any(Number)
            })
        } catch (error) {
            console.error(error.response.data.error)
            throw error
        }
    })
})