import axios from 'axios'
import { BASE_URL } from '../constants.js'
import { generate } from 'gerador-validador-cpf'

const cpf = generate()
const email = `marta${Date.now()}${Math.floor(Math.random() * 10000)}@teste.com`
let token

beforeAll(async () => {
    try {
        const response = await axios.post(`${BASE_URL}/cadastro`, {
            "cpf": cpf,
            "full_name": "Marta Santos",
            "email": email,
            "password": "Senha@347",
            "confirmPassword": "Senha@347"
        })

        token = response.data.confirmToken
    } catch (error) {
        console.error(error.response.data.error)
        throw error
    }
})
describe('Casos de testes para "Excluir conta"', () => {
    test('Dado que o usuário está autenticado, Quando enviar senha inválida, Então deve sinalizar que a senha é inválida e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.delete(`${BASE_URL}/account`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    "password": 'Senha@347888'
                }
            })
        } catch (error) {
            console.error(error.status)
            console.error(error.response.data.error)
            expect(error.status).toBe(400)
            expect(error.response.data.error).toBe('Senha inválida')
        }
    })
    test('Dado que o usuário está autenticado, Quando enviar senha válida, Então deve sinalizar que a conta foi deletada e status 200', async () => {
        expect.assertions(2)

        try {
            const response = await axios.delete(`${BASE_URL}/account`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    "password": 'Senha@347'
                }
            })

            console.log(response.status)
            console.log(response.data.message)
            expect(response.status).toBe(200)
            expect(response.data.message).toBe('Conta marcada como deletada.')
        } catch (error) {
            console.error(error.response.data.error)
            throw error
        }
    })
})