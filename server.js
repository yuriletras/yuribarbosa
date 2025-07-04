// server.js

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para analisar o corpo das requisições JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura o CORS
app.use(cors({
    origin: '*' // Lembre-se de mudar para o domínio do seu portfólio em produção!
}));

// --- CONFIGURAÇÃO CORRETA DO NODEMAILER PARA YAHOO MAIL ---
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com', // **Este deve ser o host do Yahoo**
    port: 587,                   // **Porta 587 para STARTTLS**
    secure: false,               // **Sempre 'false' para porta 587**
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    },
    tls: {
        rejectUnauthorized: false // Importante para compatibilidade com certificados, caso necessário
    }
});

// Rota para lidar com o envio do formulário de contato
app.post('/send-email', async (req, res) => {
    const { nome, email, telefone, assunto, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
        return res.status(400).json({ msg: 'Por favor, preencha todos os campos obrigatórios: Nome, Email e Mensagem.' });
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // O remetente deve ser o seu e-mail do Yahoo
            to: process.env.EMAIL_USER,   // O destinatário também (você mesmo)
            subject: `Novo Contato do Portfólio: ${assunto || 'Sem Assunto'}`,
            html: `
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${telefone || 'Não informado'}</p>
                <p><strong>Assunto:</strong> ${assunto || 'N/A'}</p>
                <p><strong>Mensagem:</strong><br>${mensagem}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: 'Mensagem enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        // Não inclua o 'error.response' diretamente na mensagem para o usuário por segurança
        res.status(500).json({ msg: 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});