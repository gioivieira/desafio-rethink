import axios from 'axios'
import { BASE_URL } from '../constants.js'
import { generate } from 'gerador-validador-cpf'

const cpf = generate()
const email = `marta${Date.now()}${Math.floor(Math.random() * 10000)}@teste.com`
let token

beforeAll(async () => {
    const response = await axios.post(`${BASE_URL}/cadastro`, {
        "cpf": cpf,
        "full_name": "Marta Santos",
        "email": email,
        "password": "Senha@347",
        "confirmPassword": "Senha@347"
    })

    token = response.data.confirmToken
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
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Senha inválida')
        }
    })
    test('Dado que o usuário está autenticado, Quando enviar senha válida, Então deve sinalizar que a conta foi deletada e status 200', async () => {

        const response = await axios.delete(`${BASE_URL}/account`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                "password": 'Senha@347'
            }
        })

        expect(response.status).toBe(200)
        expect(response.data.message).toBe('Conta marcada como deletada.')
    })
})