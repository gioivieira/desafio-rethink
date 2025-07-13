import axios from 'axios'
import dotenv from 'dotenv'
import { createUser, user, sendPoints } from '../utils/testUtils'

dotenv.config()

let token
let headers
const BASE_URL = process.env.BASE_URL

describe('Casos de testes para "Cadastro de Usuário"', () => {
    test('Dado que o usuário ainda não existe, Quando enviar valores válidos, Então deve sinalizar cadastro realizado com sucesso, trazer token e status 201', async () => {
        const response = await axios.post(`${BASE_URL}/cadastro`, createUser())

        token = response.data.confirmToken
        headers = {
            Authorization: `Bearer ${token}`
        }

        expect(response.status).toBe(201)
        expect(response.data.message).toBe('Cadastro realizado com sucesso.')
        expect(response.data).toHaveProperty('confirmToken')
    })
    test('Dado que o usuário ainda não existe, Quando enviar senha e confirmação de senha diferentes, Então deve sinalizar que senhas não conferem e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/cadastro`, createUser({
                cpf: process.env.NOT_REGISTERED_CPF,
                email: process.env.NOT_REGISTERED_EMAIL,
                confirmPassword: 'SenhaDiferente@123'
            }))
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Senhas não conferem')
        }
    })
    test('Dado que o usuário existe, Quando enviar email, Então deve sinalizar email já existente e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/cadastro`, createUser({
                cpf: process.env.NOT_REGISTERED_CPF
            }))
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('duplicate key value violates unique constraint \"users_email_key\"')
        }
    })
    test('Dado que o usuário existe, Quando enviar cpf, Então deve sinalizar cpj já existente e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/cadastro`, createUser())
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('duplicate key value violates unique constraint \"users_cpf_key\"')
        }
    })
    test('Dado que o usuário ainda não existe, Quando enviar senha fraca, Então deve sinalizar senha fraca e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/cadastro`, createUser({
                cpf: process.env.NOT_REGISTERED_CPF,
                email: process.env.NOT_REGISTERED_EMAIL,
                password: 'SenhaFraca',
                confirmPassword: 'SenhaFraca'
            }))
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Senha fraca')
        }
    })
    test('Dado que o usuário ainda não existe, Quando enviar cpf inválido, Então deve sinalizar CPF inválido e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/cadastro`, createUser({
                cpf: '6298557300',
                email: process.env.NOT_REGISTERED_EMAIL
            }))
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('CPF inválido')
        }
    })
    test('Dado que o usuário ainda não existe, Quando enviar nome incompleto, Então deve sinalizar obrigatoriedade de nome completo e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/cadastro`, createUser({
                cpf: process.env.NOT_REGISTERED_CPF,
                email: process.env.NOT_REGISTERED_EMAIL,
                full_name: 'Giovana'
            }))
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Nome completo obrigatório')
        }
    })
})

describe('Casos de testes para "Confirmação de E-mail"', () => {
    test('Dado que o token do usuário é válido, Quando enviar o token, Então deve sinalizar confirmação do e-mail e status 200', async () => {
        const response = await axios.get(`${BASE_URL}/confirm-email?token=${token}`)

        expect(response.status).toBe(200)
        expect(response.data).toBe('E-mail confirmado com sucesso.')
    })
    test('Dado que o token do usuário é inválido ou está expirado, Quando enviar o token, Então deve sinalizar token inválido ou expirado e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.get(`${BASE_URL}/confirm-email?token=eyJhbGcip_IgcNxkCzcdKt_KLw0`)
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data).toBe('Token inválido ou expirado.')
        }
    })
})

describe('Casos de testes para "Login"', () => {
    test('Dado que o usuário existe, Quando enviar valores válidos, Então deve informar o token e status 200', async () => {
        const response = await axios.post(`${BASE_URL}/login`, user())

        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty('token')
    })
    test('Dado que o usuário não existe, Quando enviar valores inválidos, Então deve sinalizar que credenciais são inválidas e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/login`, user({
                email: process.env.NOT_REGISTERED_EMAIL,
                password: process.env.NOT_REGISTERED_CPF
            }))
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Credenciais inválidas')
        }
    })

    test('Dado que o usuário existe, Quando enviar e-mail não confirmado, Então deve sinalizar que e-mail não foi confirmado e status 403', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/login`, user({
                email: 'maria@teste.com'
            }))
        } catch (error) {
            expect(error?.status).toBe(403)
            expect(error?.response?.data?.error).toBe('E-mail não confirmado')
        }
    })
})

describe('Casos de testes para "Enviar pontos"', () => {
    test('Dado que o usuário está autenticado, Quando enviar saldo insuficiente, Então deve sinalizar que o saldo é insuficiente e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/points/send`, sendPoints({
                amount: 101
            }), { headers })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Saldo insuficiente')
        }
    })
    test('Dado que o usuário está autenticado, Quando enviar valores válidos, Então deve sinalizar que os pontos foram enviados e status 200', async () => {
        const response = await axios.post(`${BASE_URL}/points/send`, sendPoints(), { headers })

        expect(response.status).toBe(200)
        expect(response.data.message).toBe('Pontos enviados com sucesso.')
    })
    test('Dado que o usuário está autenticado, Quando enviar saldo inválido, Então deve sinalizar que o valor é inválido e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/points/send`, sendPoints({
                amount: 'Cem'
            }), { headers })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Valor inválido')
        }
    })
    test('Dado que o usuário está autenticado, Quando enviar saldo negativo, Então deve sinalizar que o valor é inválido e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/points/send`, sendPoints({
                amount: -100
            }), { headers })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Valor inválido')
        }
    })
    test('Dado que o usuário está autenticado, Quando enviar usuário inexistente, Então deve sinalizar que o usuário não foi encontrado e status 404', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/points/send`, sendPoints({
                recipientCpf: process.env.NOT_REGISTERED_CPF
            }), { headers })
        } catch (error) {
            expect(error?.status).toBe(404)
            expect(error?.response?.data?.error).toBe('Usuário destino não encontrado')
        }
    })
})

describe('Casos de testes para "Extrato de pontos"', () => {
    test('Dado que o usuário está autenticado, Quando enviar token válido, Então deve retornar uma lista com 1 objeto com campos específicos e status 200', async () => {
        const response = await axios.get(`${BASE_URL}/points/extrato`, { headers })

        expect(response.status).toBe(200)
        expect(response.data.length).toBe(1)
        expect(response.data[0]).toMatchObject({
            "id": expect.any(String),
            "from_user": expect.any(String),
            "to_user": expect.any(String),
            "amount": 50,
            "created_at": expect.any(String)
        })
    })
})

describe('Casos de testes para "Caixinha de Pontos - Depósito"', () => {
    test('Dado que o usuário está autenticado, Quando enviar valor válido, Então deve sinalizar que o depósito foi realizado e status 200', async () => {
        const response = await axios.post(`${BASE_URL}/caixinha/deposit`, {
            "amount": 50
        }, { headers })

        expect(response.status).toBe(200)
        expect(response.data.message).toBe('Depósito na caixinha realizado.')
    })

    test('Dado que o usuário está autenticado, Quando enviar valor de depósito insuficiente, Então deve sinalizar que o saldo é insuficiente e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/caixinha/deposit`, {
                "amount": 101
            }, { headers })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Saldo insuficiente')
        }
    })

    test('Dado que o usuário está autenticado, Quando enviar valor inválido, Então deve sinalizar que o valor do depósito é inválido e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/caixinha/deposit`, {
                "amount": "Cem"
            }, { headers })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Valor inválido')
        }
    })
})

describe('Casos de testes para "Caixinha de Pontos - Retirar"', () => {
    test('Dado que o usuário está autenticado, Quando enviar valor válido, Então deve sinalizar que o resgate foi realizado e status 200', async () => {
        const response = await axios.post(`${BASE_URL}/caixinha/withdraw`, {
            "amount": 10
        }, { headers })

        expect(response.status).toBe(200)
        expect(response.data.message).toBe('Resgate da caixinha realizado.')
    })

    test('Dado que o usuário está autenticado, Quando enviar valor de resgate insuficiente, Então deve sinalizar que o saldo é insuficiente e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/caixinha/withdraw`, {
                "amount": 400
            }, { headers })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Saldo na caixinha insuficiente')
        }
    })

    test('Dado que o usuário está autenticado, Quando enviar valor inválido, Então deve sinalizar que o valor do resgate é inválido e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/caixinha/withdraw`, {
                "amount": "Cem"
            }, { headers })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Valor inválido')
        }
    })
})

describe('Casos de testes para "Caixinha de Pontos - Extrato"', () => {
    test('Dado que o usuário está autenticado, Quando enviar a autenticação, Então deve receber uma lista com 2 objetos com campos específicos e status 200', async () => {
        const response = await axios.get(`${BASE_URL}/caixinha/extrato`, { headers })

        expect(response.status).toBe(200)
        expect(response.data.length).toBe(1)
        expect(response.data[0]).toMatchObject({
            "id": expect.any(String),
            "user_id": expect.any(String),
            "type": expect.any(String),
            "amount": 50,
            "created_at": expect.any(String)
        })
    })
})

describe('Casos de testes para "Saldo Geral"', () => {
    test('Dado que o usuário está autenticado, Quando enviar a autenticação, Então deve trazer um objeto com campos específicos e status 200', async () => {
        const response = await axios.get(`${BASE_URL}/points/saldo`, { headers })

        expect(response.status).toBe(200)
        expect(response.data).toMatchObject({
            "normal_balance": expect.any(Number),
            "piggy_bank_balance": expect.any(Number)
        })
    })
})

describe('Casos de testes para "Excluir conta"', () => {
    test('Dado que o usuário está autenticado, Quando enviar senha inválida, Então deve sinalizar que a senha é inválida e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.delete(`${BASE_URL}/account`, {
                headers,
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
            headers,
            data: {
                "password": process.env.PASSWORD
            }
        })

        expect(response.status).toBe(200)
        expect(response.data.message).toBe('Conta marcada como deletada.')
    })
})