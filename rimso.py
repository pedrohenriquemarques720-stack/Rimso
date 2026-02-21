from flask import Flask, render_template_string, request, redirect, url_for, session, jsonify
from functools import wraps
import sqlite3
import hashlib
import os
from datetime import datetime
import random

app = Flask(__name__)
app.secret_key = 'rimso_secret_key_2025'

# Banco de dados SQLite
def init_db():
    conn = sqlite3.connect('rimso.db')
    c = conn.cursor()
    
    # Tabela de usuários (pessoa física)
    c.execute('''CREATE TABLE IF NOT EXISTS usuarios_pf
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  nome TEXT NOT NULL,
                  email TEXT UNIQUE NOT NULL,
                  senha TEXT NOT NULL,
                  cidade TEXT,
                  bairro TEXT,
                  data_cadastro TIMESTAMP)''')
    
    # Tabela de lojas (pessoa jurídica)
    c.execute('''CREATE TABLE IF NOT EXISTS lojas
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  nome_loja TEXT NOT NULL,
                  email TEXT UNIQUE NOT NULL,
                  senha TEXT NOT NULL,
                  cidade TEXT,
                  bairro TEXT,
                  categoria TEXT,
                  pagamento_confirmado BOOLEAN DEFAULT 0,
                  data_cadastro TIMESTAMP)''')
    
    # Tabela de parceiros (para exibir na aba início)
    c.execute('''CREATE TABLE IF NOT EXISTS parceiros
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  nome TEXT,
                  descricao TEXT,
                  imagem_url TEXT,
                  ativo BOOLEAN DEFAULT 1)''')
    
    # Inserir alguns parceiros de exemplo
    c.execute("SELECT COUNT(*) FROM parceiros")
    if c.fetchone()[0] == 0:
        parceiros_exemplo = [
            ('UrbanStyle', 'Moda urbana e streetwear', 'https://via.placeholder.com/150'),
            ('StreetWearBR', 'As melhores marcas de rua', 'https://via.placeholder.com/150'),
            ('Sioostas', 'Estilo autêntico', 'https://via.placeholder.com/150'),
            ('Bairro Modas', 'Moda casual', 'https://via.placeholder.com/150')
        ]
        c.executemany("INSERT INTO parceiros (nome, descricao, imagem_url) VALUES (?,?,?)", parceiros_exemplo)
    
    conn.commit()
    conn.close()

init_db()

# Decorator para login obrigatório
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

# HTML Base com template completo
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RIMSO · Lojas do bairro</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        body {
            background: #f5f5f3;
            min-height: 100vh;
        }
        
        .app-header {
            background: white;
            border-bottom: 1px solid #efefec;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #121212;
        }
        
        .logo span {
            background: #d9ffb2;
            padding: 4px 10px;
            border-radius: 60px;
            font-size: 14px;
            margin-left: 8px;
        }
        
        .user-menu {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .user-name {
            font-weight: 600;
            color: #2c2c2a;
        }
        
        .logout-btn {
            background: none;
            border: 1px solid #e0e0dd;
            padding: 8px 16px;
            border-radius: 60px;
            cursor: pointer;
            font-weight: 500;
        }
        
        .tabs-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            gap: 8px;
            border-bottom: 1px solid #efefec;
        }
        
        .tab {
            padding: 16px 24px;
            font-weight: 600;
            color: #6b6b69;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            transition: 0.1s;
        }
        
        .tab.active {
            color: #121212;
            border-bottom-color: #121212;
        }
        
        .content-area {
            max-width: 1200px;
            margin: 30px auto;
            padding: 0 24px;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        /* Cards para parceiros */
        .parceiros-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 24px;
            margin-top: 24px;
        }
        
        .parceiro-card {
            background: white;
            border-radius: 20px;
            padding: 20px;
            border: 1px solid #efefec;
        }
        
        .parceiro-card img {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            background: #f0f0ed;
            margin-bottom: 12px;
        }
        
        /* Mapa */
        #map {
            height: 400px;
            border-radius: 24px;
            margin: 20px 0;
            border: 1px solid #efefec;
        }
        
        .filtro-local {
            background: white;
            padding: 20px;
            border-radius: 20px;
            margin-bottom: 20px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        
        .filtro-local input {
            flex: 1;
            min-width: 200px;
            padding: 14px 20px;
            border: 1.5px solid #e3e3df;
            border-radius: 60px;
            font-size: 15px;
        }
        
        .filtro-local button {
            background: #121212;
            color: white;
            border: none;
            padding: 14px 32px;
            border-radius: 60px;
            font-weight: 600;
            cursor: pointer;
        }
        
        /* FAQ */
        .faq-item {
            background: white;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 12px;
            border: 1px solid #efefec;
            cursor: pointer;
        }
        
        .faq-question {
            font-weight: 700;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .faq-answer {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #efefec;
            color: #4b4b48;
            display: none;
        }
        
        .faq-item.open .faq-answer {
            display: block;
        }
        
        /* Contato */
        .contato-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        
        .contato-card {
            background: white;
            border-radius: 24px;
            padding: 30px;
            text-align: center;
            border: 1px solid #efefec;
        }
        
        .contato-icon {
            font-size: 48px;
            color: #121212;
            margin-bottom: 20px;
        }
        
        .contato-email, .contato-instagram {
            font-size: 20px;
            font-weight: 600;
            color: #121212;
            text-decoration: none;
            display: block;
            margin-top: 12px;
        }
        
        /* Lojas próximas */
        .lojas-lista {
            margin-top: 30px;
        }
        
        .loja-item {
            background: white;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #efefec;
        }
        
        .loja-info h3 {
            font-size: 18px;
            margin-bottom: 4px;
        }
        
        .loja-distancia {
            color: #6b6b69;
            font-size: 14px;
        }
        
        .rating {
            background: #f3f9e6;
            padding: 4px 12px;
            border-radius: 40px;
            font-weight: 600;
        }
        
        /* Modal de cadastro */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal {
            background: white;
            border-radius: 32px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .modal h2 {
            margin-bottom: 24px;
        }
        
        .input-group {
            margin-bottom: 16px;
        }
        
        .input-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 6px;
            color: #4b4b48;
        }
        
        .input-group input, .input-group select {
            width: 100%;
            padding: 14px 18px;
            border: 1.5px solid #e3e3df;
            border-radius: 60px;
            font-size: 15px;
        }
        
        .btn-primary {
            background: #121212;
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 60px;
            font-weight: 700;
            width: 100%;
            cursor: pointer;
            margin-top: 10px;
        }
        
        .btn-secondary {
            background: #f1f1ee;
            color: #121212;
            border: none;
            padding: 16px 32px;
            border-radius: 60px;
            font-weight: 600;
            width: 100%;
            cursor: pointer;
            margin-top: 10px;
        }
        
        .price-tag {
            background: #d9ffb2;
            padding: 8px 16px;
            border-radius: 40px;
            font-weight: 700;
            display: inline-block;
            margin: 10px 0;
        }
        
        .hidden {
            display: none;
        }
        
        .flash-message {
            padding: 16px;
            background: #f8f8f6;
            border-radius: 12px;
            margin-bottom: 20px;
            border-left: 4px solid #121212;
        }
    </style>
</head>
<body>
    {% if not session.user_id %}
    <!-- TELA DE CADASTRO/LOGIN INICIAL -->
    <div class="modal-overlay" style="display: flex;">
        <div class="modal">
            <div class="logo" style="text-align: center; margin-bottom: 30px;">RIMSO <span>beta</span></div>
            <h2 style="text-align: center;">Bem-vindo! Escolha como acessar</h2>
            
            {% with messages = get_flashed_messages() %}
                {% if messages %}
                    <div class="flash-message">
                        {% for message in messages %}
                            {{ message }}
                        {% endfor %}
                    </div>
                {% endif %}
            {% endwith %}
            
            <div style="display: flex; gap: 12px; margin-bottom: 30px;">
                <button class="btn-secondary" onclick="showForm('pf')">Sou Cliente (PF)</button>
                <button class="btn-primary" onclick="showForm('pj')">Sou Lojista (PJ)</button>
            </div>
            
            <!-- Formulário Pessoa Física -->
            <div id="form-pf" class="hidden">
                <h3>Cadastro Cliente</h3>
                <form method="POST" action="{{ url_for('cadastrar_pf') }}">
                    <div class="input-group">
                        <label>Nome completo</label>
                        <input type="text" name="nome" required>
                    </div>
                    <div class="input-group">
                        <label>Email</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="input-group">
                        <label>Senha</label>
                        <input type="password" name="senha" required>
                    </div>
                    <div class="input-group">
                        <label>Cidade</label>
                        <input type="text" name="cidade" value="São Paulo">
                    </div>
                    <div class="input-group">
                        <label>Bairro</label>
                        <input type="text" name="bairro" placeholder="Ex: Pinheiros">
                    </div>
                    <button type="submit" class="btn-primary">Cadastrar (grátis)</button>
                </form>
                <p style="text-align: center; margin: 15px 0;">Já tem conta? Faça login</p>
                <form method="POST" action="{{ url_for('login_pf') }}">
                    <div class="input-group">
                        <label>Email</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="input-group">
                        <label>Senha</label>
                        <input type="password" name="senha" required>
                    </div>
                    <button type="submit" class="btn-secondary">Entrar como Cliente</button>
                </form>
            </div>
            
            <!-- Formulário Lojista (com taxa) -->
            <div id="form-pj" class="hidden">
                <h3>Cadastro Lojista</h3>
                <div class="price-tag"><i class="fa-solid fa-brazilian-real-sign"></i> Taxa única de R$20,00</div>
                <form method="POST" action="{{ url_for('cadastrar_loja') }}">
                    <div class="input-group">
                        <label>Nome da Loja</label>
                        <input type="text" name="nome_loja" required>
                    </div>
                    <div class="input-group">
                        <label>Email</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="input-group">
                        <label>Senha</label>
                        <input type="password" name="senha" required>
                    </div>
                    <div class="input-group">
                        <label>Cidade</label>
                        <input type="text" name="cidade" value="São Paulo">
                    </div>
                    <div class="input-group">
                        <label>Bairro</label>
                        <input type="text" name="bairro" required>
                    </div>
                    <div class="input-group">
                        <label>Categoria</label>
                        <select name="categoria">
                            <option>Streetwear</option>
                            <option>Sportwear</option>
                            <option>Casual</option>
                            <option>Moda feminina</option>
                            <option>Moda masculina</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Pagar R$20 e cadastrar</button>
                </form>
                <p style="text-align: center; margin: 15px 0;">Já tem loja? Login</p>
                <form method="POST" action="{{ url_for('login_loja') }}">
                    <div class="input-group">
                        <label>Email</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="input-group">
                        <label>Senha</label>
                        <input type="password" name="senha" required>
                    </div>
                    <button type="submit" class="btn-secondary">Entrar como Lojista</button>
                </form>
            </div>
        </div>
    </div>
    {% else %}
    <!-- HEADER COM ABAS (USUÁRIO LOGADO) -->
    <div class="app-header">
        <div class="header-content">
            <div class="logo">RIMSO <span>beta</span></div>
            <div class="user-menu">
                <span class="user-name"><i class="far fa-user"></i> {{ session.user_nome }}</span>
                <a href="{{ url_for('logout') }}"><button class="logout-btn">Sair</button></a>
            </div>
        </div>
        
        <!-- 4 Abas no topo -->
        <div class="tabs-container" id="tabs">
            <div class="tab active" onclick="showTab('inicio')">Início</div>
            <div class="tab" onclick="showTab('descubra')">Descubra lojas</div>
            <div class="tab" onclick="showTab('faq')">FAQ</div>
            <div class="tab" onclick="showTab('contato')">Contato</div>
        </div>
    </div>
    
    <div class="content-area">
        <!-- ABA INÍCIO (parceiros e funcionalidades) -->
        <div id="tab-inicio" class="tab-content active">
            <h1 style="font-size: 32px; margin-bottom: 16px;">Olá, {{ session.user_nome }}!</h1>
            <p style="color: #6b6b69; margin-bottom: 30px;">Descubra lojas parceiras perto de você</p>
            
            <h2>Nossos parceiros</h2>
            <div class="parceiros-grid">
                {% for p in parceiros %}
                <div class="parceiro-card">
                    <img src="{{ p[3] }}" alt="{{ p[1] }}">
                    <h3>{{ p[1] }}</h3>
                    <p style="color: #6b6b69;">{{ p[2] }}</p>
                    <button class="btn-secondary" style="margin-top: 16px;" onclick="showTab('descubra')">Ver loja</button>
                </div>
                {% endfor %}
            </div>
            
            <div style="margin-top: 40px; background: #f8f8f6; border-radius: 24px; padding: 30px;">
                <h2>Funcionalidades do app</h2>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px;">
                    <div><i class="fas fa-map-marker-alt" style="font-size: 24px;"></i> Lojas próximas</div>
                    <div><i class="fas fa-tags" style="font-size: 24px;"></i> Ofertas exclusivas</div>
                    <div><i class="fas fa-credit-card" style="font-size: 24px;"></i> Pagamento fácil</div>
                </div>
            </div>
        </div>
        
        <!-- ABA DESCOBRIR LOJAS (com mapa e filtro) -->
        <div id="tab-descubra" class="tab-content">
            <h2>Descubra lojas perto de você</h2>
            
            <div class="filtro-local">
                <input type="text" id="localizacao-input" placeholder="Digite município, bairro ou rua (ex: São Paulo, Pinheiros)" value="São Paulo">
                <button onclick="buscarLojas()"><i class="fas fa-search"></i> Buscar</button>
            </div>
            
            <div id="map"></div>
            
            <div class="lojas-lista" id="lojas-lista">
                <h3>Lojas encontradas</h3>
                {% for loja in lojas_proximas %}
                <div class="loja-item">
                    <div class="loja-info">
                        <h3>{{ loja[1] }}</h3>
                        <div>{{ loja[4] }}, {{ loja[5] }} · {{ loja[6] }}</div>
                        <span class="rating">4.5 ⭐</span>
                    </div>
                    <button class="btn-secondary">Ver loja</button>
                </div>
                {% endfor %}
            </div>
        </div>
        
        <!-- ABA FAQ -->
        <div id="tab-faq" class="tab-content">
            <h2>Perguntas frequentes</h2>
            <div style="margin-top: 30px;">
                <div class="faq-item" onclick="toggleFaq(this)">
                    <div class="faq-question">
                        Como faço para me cadastrar como cliente?
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        É gratuito e rápido! Basta clicar em "Sou Cliente" na tela inicial, preencher seus dados e pronto. Você já pode explorar as lojas próximas.
                    </div>
                </div>
                
                <div class="faq-item" onclick="toggleFaq(this)">
                    <div class="faq-question">
                        Quanto custa cadastrar minha loja no RIMSO?
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        O cadastro para lojistas tem uma taxa única de R$20,00. Com isso sua loja aparece para clientes no seu bairro e região.
                    </div>
                </div>
                
                <div class="faq-item" onclick="toggleFaq(this)">
                    <div class="faq-question">
                        Como funciona a localização das lojas?
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        Usamos sua localização atual (com sua permissão) ou o filtro de busca para mostrar as lojas mais próximas. Você pode buscar por cidade, bairro ou rua.
                    </div>
                </div>
                
                <div class="faq-item" onclick="toggleFaq(this)">
                    <div class="faq-question">
                        Posso comprar direto pelo app?
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        No momento você encontra as lojas e vê os produtos, mas as compras são redirecionadas para o contato da loja (WhatsApp ou Instagram). Em breve teremos checkout integrado.
                    </div>
                </div>
                
                <div class="faq-item" onclick="toggleFaq(this)">
                    <div class="faq-question">
                        Como atualizar os dados da minha loja?
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        Acesse sua conta de lojista e vá em "Perfil". Lá você pode editar informações como endereço, categoria e produtos.
                    </div>
                </div>
                
                <div class="faq-item" onclick="toggleFaq(this)">
                    <div class="faq-question">
                        O pagamento da taxa é seguro?
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        Sim! Utilizamos integração com gateways de pagamento. Por enquanto é uma simulação, mas em breve teremos pagamento real via Pix e cartão.
                    </div>
                </div>
                
                <div class="faq-item" onclick="toggleFaq(this)">
                    <div class="faq-question">
                        Quais cidades estão disponíveis?
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        Começamos por São Paulo (capital e grande SP), mas estamos expandindo. Em breve todo estado de São Paulo terá cobertura.
                    </div>
                </div>
            </div>
        </div>
        
        <!-- ABA CONTATO -->
        <div id="tab-contato" class="tab-content">
            <h2>Fale com a gente</h2>
            <div class="contato-container">
                <div class="contato-card">
                    <div class="contato-icon"><i class="far fa-envelope"></i></div>
                    <h3>E-mail</h3>
                    <a href="mailto:contato@rimso.com.br" class="contato-email">contato@rimso.com.br</a>
                    <p style="color: #6b6b69; margin-top: 10px;">Respondemos em até 24h</p>
                </div>
                
                <div class="contato-card">
                    <div class="contato-icon"><i class="fab fa-instagram"></i></div>
                    <h3>Instagram</h3>
                    <a href="https://instagram.com/rimsoapp" target="_blank" class="contato-instagram">@rimsoapp</a>
                    <p style="color: #6b6b69; margin-top: 10px;">Siga para novidades e promoções</p>
                </div>
            </div>
            
            <div style="background: #f8f8f6; border-radius: 24px; padding: 30px; margin-top: 30px;">
                <h3>Horário de atendimento</h3>
                <p style="margin-top: 10px;">Segunda a sexta: 9h às 18h<br>Sábado: 9h às 13h</p>
            </div>
        </div>
    </div>
    {% endif %}
    
    <script>
        // Funções para alternar abas
        function showTab(tabName) {
            // Esconder todos os conteúdos
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            // Desativar todas as abas
            document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
            // Ativar aba clicada
            document.getElementById('tab-' + tabName).classList.add('active');
            event.target.classList.add('active');
            
            // Se for a aba descubra, recarrega o mapa
            if (tabName === 'descubra') {
                setTimeout(initMap, 100);
            }
        }
        
        // Mostrar formulários de cadastro
        function showForm(tipo) {
            document.getElementById('form-pf').classList.add('hidden');
            document.getElementById('form-pj').classList.add('hidden');
            if (tipo === 'pf') {
                document.getElementById('form-pf').classList.remove('hidden');
            } else {
                document.getElementById('form-pj').classList.remove('hidden');
            }
        }
        
        // FAQ toggle
        function toggleFaq(element) {
            element.classList.toggle('open');
        }
        
        // Mapa (Leaflet)
        function initMap() {
            const map = L.map('map').setView([-23.5505, -46.6333], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);
            
            // Adicionar marcadores de lojas (exemplo)
            {% for loja in lojas_proximas %}
            L.marker([-23.5505 + {{ loop.index }} * 0.01, -46.6333 + {{ loop.index }} * 0.01])
                .addTo(map)
                .bindPopup("{{ loja[1] }}<br>{{ loja[4] }}, {{ loja[5] }}");
            {% endfor %}
        }
        
        // Buscar lojas por localização (simulação)
        function buscarLojas() {
            const local = document.getElementById('localizacao-input').value;
            alert('Buscando lojas em: ' + local + ' (funcionalidade em desenvolvimento)');
            // Aqui faria uma chamada AJAX para filtrar lojas
        }
        
        // Inicializar mapa se aba descubra estiver ativa
        window.onload = function() {
            if (document.getElementById('tab-descubra')?.classList.contains('active')) {
                initMap();
            }
        }
    </script>
</body>
</html>
'''

# Rotas da aplicação
@app.route('/')
def index():
    if 'user_id' in session:
        # Buscar parceiros e lojas para exibir
        conn = sqlite3.connect('rimso.db')
        c = conn.cursor()
        c.execute("SELECT * FROM parceiros WHERE ativo=1")
        parceiros = c.fetchall()
        c.execute("SELECT * FROM lojas WHERE pagamento_confirmado=1")
        lojas = c.fetchall()
        conn.close()
        return render_template_string(HTML_TEMPLATE, parceiros=parceiros, lojas_proximas=lojas)
    return render_template_string(HTML_TEMPLATE, parceiros=[], lojas_proximas=[])

@app.route('/cadastrar_pf', methods=['POST'])
def cadastrar_pf():
    nome = request.form['nome']
    email = request.form['email']
    senha = hashlib.sha256(request.form['senha'].encode()).hexdigest()
    cidade = request.form.get('cidade', 'São Paulo')
    bairro = request.form.get('bairro', '')
    
    conn = sqlite3.connect('rimso.db')
    c = conn.cursor()
    try:
        c.execute("INSERT INTO usuarios_pf (nome, email, senha, cidade, bairro, data_cadastro) VALUES (?,?,?,?,?,?)",
                  (nome, email, senha, cidade, bairro, datetime.now()))
        conn.commit()
        
        # Logar automaticamente
        user_id = c.lastrowid
        session['user_id'] = user_id
        session['user_nome'] = nome
        session['user_tipo'] = 'pf'
    except sqlite3.IntegrityError:
        conn.close()
        return "Email já cadastrado"
    conn.close()
    return redirect(url_for('index'))

@app.route('/cadastrar_loja', methods=['POST'])
def cadastrar_loja():
    nome_loja = request.form['nome_loja']
    email = request.form['email']
    senha = hashlib.sha256(request.form['senha'].encode()).hexdigest()
    cidade = request.form.get('cidade', 'São Paulo')
    bairro = request.form['bairro']
    categoria = request.form['categoria']
    
    # Simular pagamento (sempre aprovado para demonstração)
    pagamento_confirmado = True
    
    conn = sqlite3.connect('rimso.db')
    c = conn.cursor()
    try:
        c.execute("""INSERT INTO lojas 
                     (nome_loja, email, senha, cidade, bairro, categoria, pagamento_confirmado, data_cadastro) 
                     VALUES (?,?,?,?,?,?,?,?)""",
                  (nome_loja, email, senha, cidade, bairro, categoria, pagamento_confirmado, datetime.now()))
        conn.commit()
        
        # Logar automaticamente
        user_id = c.lastrowid
        session['user_id'] = user_id
        session['user_nome'] = nome_loja
        session['user_tipo'] = 'pj'
    except sqlite3.IntegrityError:
        conn.close()
        return "Email já cadastrado"
    conn.close()
    return redirect(url_for('index'))

@app.route('/login_pf', methods=['POST'])
def login_pf():
    email = request.form['email']
    senha = hashlib.sha256(request.form['senha'].encode()).hexdigest()
    
    conn = sqlite3.connect('rimso.db')
    c = conn.cursor()
    c.execute("SELECT id, nome FROM usuarios_pf WHERE email = ? AND senha = ?", (email, senha))
    user = c.fetchone()
    conn.close()
    
    if user:
        session['user_id'] = user[0]
        session['user_nome'] = user[1]
        session['user_tipo'] = 'pf'
    return redirect(url_for('index'))

@app.route('/login_loja', methods=['POST'])
def login_loja():
    email = request.form['email']
    senha = hashlib.sha256(request.form['senha'].encode()).hexdigest()
    
    conn = sqlite3.connect('rimso.db')
    c = conn.cursor()
    c.execute("SELECT id, nome_loja FROM lojas WHERE email = ? AND senha = ?", (email, senha))
    user = c.fetchone()
    conn.close()
    
    if user:
        session['user_id'] = user[0]
        session['user_nome'] = user[1]
        session['user_tipo'] = 'pj'
    return redirect(url_for('index'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)