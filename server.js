const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { openDb, initDatabase } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'rimso-secret-key-2026';

app.use(cors());
app.use(express.json());

// Inicializar banco de dados
let db;
initDatabase().then(database => {
    db = database;
    console.log('📦 Banco de dados pronto!');
});

// Middleware de autenticação
async function autenticar(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const usuario = await db.get('SELECT id, tipo, nome, email FROM usuarios WHERE id = ?', [decoded.id]);
        
        if (!usuario) {
            return res.status(401).json({ erro: 'Usuário não encontrado' });
        }
        
        req.usuario = usuario;
        next();
    } catch (err) {
        return res.status(401).json({ erro: 'Token inválido' });
    }
}

// Middleware para verificar se é admin
function verificarAdmin(req, res, next) {
    if (req.usuario.tipo !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado - Apenas administradores' });
    }
    next();
}

// ==================== ROTAS PÚBLICAS ====================

// Login
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (!usuario) {
            return res.status(401).json({ erro: 'Email ou senha inválidos' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Email ou senha inválidos' });
        }

        const token = jwt.sign(
            { id: usuario.id, tipo: usuario.tipo, email: usuario.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Se for lojista, buscar dados da loja
        let loja = null;
        if (usuario.tipo === 'lojista') {
            loja = await db.get('SELECT * FROM lojas WHERE usuario_id = ?', [usuario.id]);
        }

        res.json({
            token,
            usuario: {
                id: usuario.id,
                tipo: usuario.tipo,
                nome: usuario.nome,
                email: usuario.email
            },
            loja
        });
    } catch (err) {
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// Cadastro Cliente
app.post('/api/cadastro/cliente', async (req, res) => {
    const { nome, email, senha, telefone, data_nascimento, bairro } = req.body;

    try {
        // Verificar se email já existe
        const existente = await db.get('SELECT id FROM usuarios WHERE email = ?', [email]);
        
        if (existente) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha, salt);

        const result = await db.run(
            `INSERT INTO usuarios (tipo, nome, email, senha, telefone, data_nascimento, bairro) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ['cliente', nome, email, hash, telefone, data_nascimento, bairro]
        );

        const token = jwt.sign(
            { id: result.lastID, tipo: 'cliente', email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            mensagem: 'Cliente cadastrado com sucesso!',
            token,
            usuario: {
                id: result.lastID,
                tipo: 'cliente',
                nome,
                email
            }
        });
    } catch (err) {
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// Cadastro Lojista
app.post('/api/cadastro/lojista', async (req, res) => {
    const { 
        nome, email, senha, telefone,
        nome_loja, cnpj, endereco, bairro, categoria, plano 
    } = req.body;

    try {
        // Verificar se email já existe
        const existente = await db.get('SELECT id FROM usuarios WHERE email = ?', [email]);
        
        if (existente) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha, salt);

        // Inserir usuário
        const usuarioResult = await db.run(
            `INSERT INTO usuarios (tipo, nome, email, senha, telefone, bairro) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            ['lojista', nome, email, hash, telefone, bairro]
        );

        // Inserir loja
        await db.run(
            `INSERT INTO lojas (usuario_id, nome_loja, cnpj, endereco, bairro, categoria, plano, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [usuarioResult.lastID, nome_loja, cnpj, endereco, bairro, categoria, plano, 'pendente']
        );

        const token = jwt.sign(
            { id: usuarioResult.lastID, tipo: 'lojista', email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            mensagem: 'Lojista cadastrado com sucesso! Aguarde aprovação.',
            token,
            usuario: {
                id: usuarioResult.lastID,
                tipo: 'lojista',
                nome,
                email
            }
        });
    } catch (err) {
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// ==================== ROTAS PROTEGIDAS ====================

// Buscar bairros (para qualquer usuário logado)
app.get('/api/bairros', autenticar, async (req, res) => {
    const bairros = [
        'Centro', 'Alto', 'Pauliceia', 'Cidade Alta', 'Cidade Jardim',
        'Clube de Campo', 'Jaraguá', 'Vila Rezende', 'Santa Terezinha',
        'Piracicamirim', 'Água Branca', 'Campestre', 'Cecap', 'Nova Piracicaba',
        'Taquaral', 'São Dimas', 'Jardim América', 'Jardim Europa',
        'Jardim Ibirapuera', 'Jardim Itapuã', 'Jardim Maracanã',
        'Jardim Monte Alegre', 'Jardim Paulista', 'Jardim Planalto',
        'Jardim Primavera', 'Parque Autódromo', 'Parque das Nações',
        'Parque Industrial', 'Vila Industrial', 'Vila Monteiro'
    ].sort();

    res.json(bairros);
});

// Buscar lojas com filtros
app.get('/api/lojas', autenticar, async (req, res) => {
    const { bairro, categoria, busca } = req.query;

    let query = `
        SELECT l.*, u.nome as proprietario,
        (SELECT COUNT(*) FROM favoritos WHERE loja_id = l.id) as total_favoritos
        FROM lojas l
        JOIN usuarios u ON l.usuario_id = u.id
        WHERE l.status = 'ativo'
    `;
    const params = [];

    if (bairro) {
        query += ' AND l.bairro = ?';
        params.push(bairro);
    }

    if (categoria) {
        query += ' AND l.categoria = ?';
        params.push(categoria);
    }

    if (busca) {
        query += ' AND (l.nome_loja LIKE ? OR l.endereco LIKE ?)';
        params.push(`%${busca}%`, `%${busca}%`);
    }

    query += ' ORDER BY l.avaliacao_media DESC';

    const lojas = await db.all(query, params);
    res.json(lojas);
});

// Buscar lojas por bairro específico
app.get('/api/lojas/bairro/:bairro', autenticar, async (req, res) => {
    const { bairro } = req.params;

    const lojas = await db.all(
        `SELECT l.*, u.nome as proprietario,
        (SELECT COUNT(*) FROM favoritos WHERE loja_id = l.id) as total_favoritos
        FROM lojas l
        JOIN usuarios u ON l.usuario_id = u.id
        WHERE l.bairro = ? AND l.status = 'ativo'
        ORDER BY l.avaliacao_media DESC`,
        [bairro]
    );

    res.json(lojas);
});

// Buscar detalhes de uma loja específica
app.get('/api/lojas/:id', autenticar, async (req, res) => {
    const { id } = req.params;

    const loja = await db.get(
        `SELECT l.*, u.nome as proprietario, u.telefone, u.email
        FROM lojas l
        JOIN usuarios u ON l.usuario_id = u.id
        WHERE l.id = ?`,
        [id]
    );

    if (!loja) {
        return res.status(404).json({ erro: 'Loja não encontrada' });
    }

    // Buscar produtos da loja
    const produtos = await db.all(
        'SELECT * FROM produtos WHERE loja_id = ? ORDER BY created_at DESC',
        [id]
    );

    // Buscar avaliações da loja
    const avaliacoes = await db.all(
        `SELECT a.*, u.nome as cliente_nome
        FROM avaliacoes a
        JOIN usuarios u ON a.cliente_id = u.id
        WHERE a.loja_id = ?
        ORDER BY a.created_at DESC`,
        [id]
    );

    res.json({ ...loja, produtos, avaliacoes });
});

// Favoritar/desfavoritar loja
app.post('/api/lojas/:id/favoritar', autenticar, async (req, res) => {
    const { id } = req.params;
    const clienteId = req.usuario.id;

    if (req.usuario.tipo !== 'cliente') {
        return res.status(403).json({ erro: 'Apenas clientes podem favoritar lojas' });
    }

    try {
        // Verificar se já é favorito
        const favorito = await db.get(
            'SELECT * FROM favoritos WHERE cliente_id = ? AND loja_id = ?',
            [clienteId, id]
        );

        if (favorito) {
            // Remover dos favoritos
            await db.run(
                'DELETE FROM favoritos WHERE cliente_id = ? AND loja_id = ?',
                [clienteId, id]
            );
            res.json({ mensagem: 'Loja removida dos favoritos', favoritado: false });
        } else {
            // Adicionar aos favoritos
            await db.run(
                'INSERT INTO favoritos (cliente_id, loja_id) VALUES (?, ?)',
                [clienteId, id]
            );
            res.json({ mensagem: 'Loja adicionada aos favoritos', favoritado: true });
        }
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao processar favorito' });
    }
});

// Buscar favoritos do cliente
app.get('/api/favoritos', autenticar, async (req, res) => {
    if (req.usuario.tipo !== 'cliente') {
        return res.status(403).json({ erro: 'Apenas clientes têm favoritos' });
    }

    const favoritos = await db.all(
        `SELECT l.* 
        FROM lojas l
        JOIN favoritos f ON l.id = f.loja_id
        WHERE f.cliente_id = ? AND l.status = 'ativo'`,
        [req.usuario.id]
    );

    res.json(favoritos);
});

// Avaliar loja
app.post('/api/lojas/:id/avaliar', autenticar, async (req, res) => {
    const { id } = req.params;
    const { nota, comentario } = req.body;
    const clienteId = req.usuario.id;

    if (req.usuario.tipo !== 'cliente') {
        return res.status(403).json({ erro: 'Apenas clientes podem avaliar lojas' });
    }

    try {
        // Verificar se já avaliou
        const avaliacaoExistente = await db.get(
            'SELECT * FROM avaliacoes WHERE cliente_id = ? AND loja_id = ?',
            [clienteId, id]
        );

        if (avaliacaoExistente) {
            return res.status(400).json({ erro: 'Você já avaliou esta loja' });
        }

        await db.run(
            'INSERT INTO avaliacoes (cliente_id, loja_id, nota, comentario) VALUES (?, ?, ?, ?)',
            [clienteId, id, nota, comentario]
        );

        // Atualizar média da loja
        const stats = await db.get(
            'SELECT AVG(nota) as media, COUNT(*) as total FROM avaliacoes WHERE loja_id = ?',
            [id]
        );

        await db.run(
            'UPDATE lojas SET avaliacao_media = ?, total_avaliacoes = ? WHERE id = ?',
            [stats.media, stats.total, id]
        );

        res.json({ mensagem: 'Avaliação registrada com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao registrar avaliação' });
    }
});

// ==================== ROTAS PARA LOJISTAS ====================

// Buscar dados da própria loja (para lojista)
app.get('/api/minha-loja', autenticar, async (req, res) => {
    if (req.usuario.tipo !== 'lojista') {
        return res.status(403).json({ erro: 'Acesso negado' });
    }

    const loja = await db.get(
        'SELECT * FROM lojas WHERE usuario_id = ?',
        [req.usuario.id]
    );

    if (!loja) {
        return res.status(404).json({ erro: 'Loja não encontrada' });
    }

    // Buscar produtos da loja
    const produtos = await db.all(
        'SELECT * FROM produtos WHERE loja_id = ? ORDER BY created_at DESC',
        [loja.id]
    );

    // Buscar vendas da loja
    const vendas = await db.all(
        'SELECT * FROM vendas WHERE loja_id = ? ORDER BY data_venda DESC LIMIT 50',
        [loja.id]
    );

    // Buscar avaliações da loja
    const avaliacoes = await db.all(
        `SELECT a.*, u.nome as cliente_nome 
        FROM avaliacoes a
        JOIN usuarios u ON a.cliente_id = u.id
        WHERE a.loja_id = ?
        ORDER BY a.created_at DESC`,
        [loja.id]
    );

    // Estatísticas
    const stats = {
        total_visualizacoes: Math.floor(Math.random() * 1000) + 500, // Simulado
        total_cliques_whatsapp: Math.floor(Math.random() * 100) + 50, // Simulado
        total_vendas: vendas.length,
        valor_total_vendas: vendas.reduce((acc, v) => acc + v.valor, 0),
        avaliacao_media: loja.avaliacao_media
    };

    res.json({ loja, produtos, vendas, avaliacoes, stats });
});

// Adicionar produto
app.post('/api/produtos', autenticar, async (req, res) => {
    if (req.usuario.tipo !== 'lojista') {
        return res.status(403).json({ erro: 'Acesso negado' });
    }

    const loja = await db.get('SELECT id FROM lojas WHERE usuario_id = ?', [req.usuario.id]);
    
    if (!loja) {
        return res.status(404).json({ erro: 'Loja não encontrada' });
    }

    const { nome, descricao, preco, categoria, estoque, imagem } = req.body;

    const result = await db.run(
        `INSERT INTO produtos (loja_id, nome, descricao, preco, categoria, estoque, imagem) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [loja.id, nome, descricao, preco, categoria, estoque, imagem]
    );

    res.status(201).json({
        mensagem: 'Produto adicionado com sucesso!',
        produto: { id: result.lastID, nome, preco }
    });
});

// Criar venda
app.post('/api/vendas', autenticar, async (req, res) => {
    if (req.usuario.tipo !== 'lojista') {
        return res.status(403).json({ erro: 'Acesso negado' });
    }

    const loja = await db.get('SELECT id FROM lojas WHERE usuario_id = ?', [req.usuario.id]);
    
    if (!loja) {
        return res.status(404).json({ erro: 'Loja não encontrada' });
    }

    const { cliente_nome, produto_nome, valor } = req.body;

    const result = await db.run(
        `INSERT INTO vendas (loja_id, cliente_nome, produto_nome, valor) 
         VALUES (?, ?, ?, ?)`,
        [loja.id, cliente_nome, produto_nome, valor]
    );

    res.status(201).json({
        mensagem: 'Venda registrada com sucesso!',
        venda: { id: result.lastID, cliente_nome, produto_nome, valor }
    });
});

// ==================== ROTAS ADMIN (apenas admin) ====================

// Listar todos os usuários (admin)
app.get('/api/admin/usuarios', autenticar, verificarAdmin, async (req, res) => {
    const usuarios = await db.all(`
        SELECT u.*, 
        CASE 
            WHEN u.tipo = 'lojista' THEN (SELECT nome_loja FROM lojas WHERE usuario_id = u.id)
            ELSE NULL
        END as nome_loja
        FROM usuarios u
        ORDER BY u.created_at DESC
    `);
    res.json(usuarios);
});

// Aprovar lojista (admin)
app.post('/api/admin/lojas/:id/aprovar', autenticar, verificarAdmin, async (req, res) => {
    const { id } = req.params;

    await db.run(
        'UPDATE lojas SET status = ? WHERE id = ?',
        ['ativo', id]
    );

    res.json({ mensagem: 'Loja aprovada com sucesso!' });
});

// Estatísticas gerais (admin)
app.get('/api/admin/estatisticas', autenticar, verificarAdmin, async (req, res) => {
    const totalUsuarios = await db.get('SELECT COUNT(*) as total FROM usuarios');
    const totalClientes = await db.get('SELECT COUNT(*) as total FROM usuarios WHERE tipo = ?', ['cliente']);
    const totalLojistas = await db.get('SELECT COUNT(*) as total FROM usuarios WHERE tipo = ?', ['lojista']);
    const totalLojasAtivas = await db.get('SELECT COUNT(*) as total FROM lojas WHERE status = ?', ['ativo']);
    const totalVendas = await db.get('SELECT COUNT(*) as total FROM vendas');
    const valorTotalVendas = await db.get('SELECT SUM(valor) as total FROM vendas');

    res.json({
        total_usuarios: totalUsuarios.total,
        total_clientes: totalClientes.total,
        total_lojistas: totalLojistas.total,
        total_lojas_ativas: totalLojasAtivas.total,
        total_vendas: totalVendas.total,
        valor_total_vendas: valorTotalVendas.total || 0
    });
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
    console.log(`🚀 Servidor RIMSO rodando na porta ${PORT}`);
});