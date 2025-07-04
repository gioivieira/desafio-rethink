import axios from 'axios'
import { BASE_URL } from '../constants.js'
import { generate } from 'gerador-validador-cpf'

const cpf = generate()
const email = `maria${Date.now()}${Math.floor(Math.random() * 10000)}@teste.com`
const password = 'Senha@123'
let token

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
describe('Casos de testes para "Cadastro de Usuário"', () => {
    test('Dado que o usuário ainda não existe, Quando enviar valores válidos, Então deve sinalizar cadastro realizado com sucesso, trazer token e status 201', async () => {
        const response = await axios.post(`${BASE_URL}/cadastro`, {
            "cpf": cpf,
            "full_name": "Maria Silva",
            "email": email,
            "password": password,
            "confirmPassword": password
        })

        token = response.data.confirmToken

        expect(response.status).toBe(201)
        expect(response.data.message).toBe('Cadastro realizado com sucesso.')
        expect(response.data).toHaveProperty('confirmToken')
    })
    test('Dado que o usuário ainda não existe, Quando enviar senha e confirmação de senha diferentes, Então deve sinalizar que senhas não conferem e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/cadastro`, {
                "cpf": "62985573009",
                "full_name": "Maria Silva",
                "email": "maria1@teste.com",
                "password": "Senha@123",
                "confirmPassword": "Senha@123456"
            })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Senhas não conferem')
        }
    })
    test('Dado que o usuário existe, Quando enviar email, Então deve sinalizar email já existente e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/cadastro`, {
                "cpf": "62985573009",
                "full_name": "Maria Silva",
                "email": "maria@teste.com",
                "password": "Senha@123",
                "confirmPassword": "Senha@123"
            })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('duplicate key value violates unique constraint \"users_email_key\"')
        }
    })
    test('Dado que o usuário existe, Quando enviar cpf, Então deve sinalizar cpj já existente e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/cadastro`, {
                "cpf": "84824649064",
                "full_name": "Maria Silva",
                "email": "maria2@teste.com",
                "password": "Senha@123",
                "confirmPassword": "Senha@123"
            })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('duplicate key value violates unique constraint \"users_cpf_key\"')
        }
    })
    test('Dado que o usuário ainda não existe, Quando enviar senha fraca, Então deve sinalizar senha fraca e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/cadastro`, {
                "cpf": "62985573009",
                "full_name": "Maria Silva",
                "email": "maria3@teste.com",
                "password": "SenhaFraca",
                "confirmPassword": "SenhaFraca"
            })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Senha fraca')
        }
    })
    test('Dado que o usuário ainda não existe, Quando enviar cpf inválido, Então deve sinalizar CPF inválido e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/cadastro`, {
                "cpf": "6298557300",
                "full_name": "Maria Silva",
                "email": "maria4@teste.com",
                "password": "Teste@123",
                "confirmPassword": "Teste@123"
            })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('CPF inválido')
        }
    })
    test('Dado que o usuário ainda não existe, Quando enviar nome incompleto, Então deve sinalizar obrigatoriedade de nome completo e status 400', async () => {
        expect.assertions(2)

        try {
            await axios.post(`${BASE_URL}/cadastro`, {
                "cpf": "62985573009",
                "full_name": "Maria",
                "email": "maria5@teste.com",
                "password": "Teste@123",
                "confirmPassword": "Teste@123"
            })
        } catch (error) {
            expect(error?.status).toBe(400)
            expect(error?.response?.data?.error).toBe('Nome completo obrigatório')
        }
    })
})