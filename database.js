const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const path = require('path');

async function openDb() {
    return open({
        filename: path.join(__dirname, 'rimso.db'),
        driver: sqlite3.Database
    });
}

async function initDatabase() {
    const db = await openDb();

    // Tabela de usuários (unificada com tipo)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT NOT NULL CHECK(tipo IN ('admin', 'cliente', 'lojista')),
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            telefone TEXT,
            data_nascimento TEXT,
            bairro TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de lojas (apenas para lojistas)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS lojas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER UNIQUE NOT NULL,
            nome_loja TEXT NOT NULL,
            cnpj TEXT,
            endereco TEXT NOT NULL,
            bairro TEXT NOT NULL,
            categoria TEXT NOT NULL,
            plano TEXT NOT NULL CHECK(plano IN ('basico', 'profissional', 'premium')),
            status TEXT DEFAULT 'pendente' CHECK(status IN ('ativo', 'pendente', 'inativo')),
            avaliacao_media REAL DEFAULT 0,
            total_avaliacoes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `);

    // Tabela de produtos
    await db.exec(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            loja_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco REAL NOT NULL,
            categoria TEXT NOT NULL,
            estoque INTEGER DEFAULT 0,
            imagem TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE CASCADE
        )
    `);

    // Tabela de favoritos (relacionamento cliente-loja)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS favoritos (
            cliente_id INTEGER NOT NULL,
            loja_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (cliente_id, loja_id),
            FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE CASCADE
        )
    `);

    // Tabela de avaliações
    await db.exec(`
        CREATE TABLE IF NOT EXISTS avaliacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER NOT NULL,
            loja_id INTEGER NOT NULL,
            nota INTEGER NOT NULL CHECK(nota >= 1 AND nota <= 5),
            comentario TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE CASCADE
        )
    `);

    // Tabela de vendas (para lojistas)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            loja_id INTEGER NOT NULL,
            cliente_nome TEXT NOT NULL,
            produto_nome TEXT NOT NULL,
            valor REAL NOT NULL,
            status TEXT DEFAULT 'pendente' CHECK(status IN ('pago', 'pendente', 'cancelado')),
            data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE CASCADE
        )
    `);

    // Criar usuário administrador padrão
    const adminExists = await db.get('SELECT id FROM usuarios WHERE email = ?', ['contatorimso@outlook.com']);
    
    if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('rimso#17', salt);
        
        await db.run(
            'INSERT INTO usuarios (tipo, nome, email, senha) VALUES (?, ?, ?, ?)',
            ['admin', 'Administrador RIMSO', 'contatorimso@outlook.com', hash]
        );
        console.log('✅ Usuário administrador criado!');
    }

    console.log('✅ Banco de dados inicializado!');
    return db;
}

module.exports = { openDb, initDatabase };