import streamlit as st
import requests
from datetime import datetime
import hashlib
import json

# Configuração da página
st.set_page_config(
    page_title="RIMSO - Lojas do bairro",
    page_icon="🏪",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Inicializar session state
if 'user_logado' not in st.session_state:
    st.session_state.user_logado = False
    st.session_state.user_nome = 'Visitante'
    st.session_state.user_tipo = ''
    st.session_state.user_email = ''
    st.session_state.aba_ativa = 'inicio'
    st.session_state.modal_cadastro = False
    st.session_state.form_ativa = 'pf'

# CSS personalizado
st.markdown("""
<style>
    /* Reset e estilos gerais */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    .stApp {
        background: #f5f5f3;
    }
    
    /* Container principal */
    .main-container {
        max-width: 1280px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 40px;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        padding: 0;
    }
    
    /* Top bar */
    .top-bar {
        background: #ffffff;
        padding: 20px 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #efefec;
    }
    
    .logo {
        font-size: 32px;
        font-weight: 800;
        color: #121212;
        display: inline-block;
    }
    
    .logo span {
        background: #d9ffb2;
        padding: 6px 12px;
        border-radius: 60px;
        font-size: 14px;
        color: #1e3a2f;
        margin-left: 8px;
    }
    
    .tagline {
        color: #6b6b69;
        font-size: 15px;
        border-left: 1px solid #d9d9d6;
        padding-left: 20px;
        margin-left: 8px;
        display: inline-block;
    }
    
    .user-menu {
        display: flex;
        align-items: center;
        gap: 20px;
        background: #f4f4f2;
        padding: 10px 20px;
        border-radius: 60px;
    }
    
    /* Abas */
    .tabs-container {
        display: flex;
        gap: 8px;
        padding: 0 32px;
        background: white;
        border-bottom: 1px solid #efefec;
    }
    
    .tab-button {
        padding: 16px 24px;
        font-weight: 600;
        color: #6b6b69;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        background: none;
        border: none;
        font-size: 16px;
    }
    
    .tab-button.active {
        color: #121212;
        border-bottom: 3px solid #121212;
    }
    
    /* Cards */
    .card {
        background: white;
        border-radius: 24px;
        padding: 20px;
        border: 1px solid #efefec;
        margin-bottom: 16px;
        transition: 0.1s;
    }
    
    .card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    
    .rating {
        background: #f3f9e6;
        padding: 4px 12px;
        border-radius: 40px;
        font-weight: 600;
        color: #1f4f3d;
        display: inline-block;
        font-size: 14px;
    }
    
    /* Filtro local */
    .filtro-local {
        background: white;
        padding: 24px;
        border-radius: 28px;
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
        border: 1px solid #efefec;
        align-items: center;
    }
    
    /* Botões */
    .btn-primary {
        background: #121212;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 60px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        font-size: 16px;
    }
    
    .btn-secondary {
        background: #f1f1ee;
        color: #121212;
        border: none;
        padding: 12px 24px;
        border-radius: 60px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        font-size: 16px;
    }
    
    .price-tag {
        background: #d9ffb2;
        padding: 8px 20px;
        border-radius: 60px;
        font-weight: 700;
        display: inline-block;
        margin: 10px 0;
    }
    
    /* Modal */
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
        border-radius: 40px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    /* Inputs */
    .stTextInput > div > div > input {
        border-radius: 60px !important;
        border: 1.5px solid #e3e3df !important;
        padding: 12px 20px !important;
        font-size: 15px !important;
    }
    
    .stTextInput > div > div > input:focus {
        border-color: #121212 !important;
    }
    
    .stSelectbox > div > div > div {
        border-radius: 60px !important;
        border: 1.5px solid #e3e3df !important;
        padding: 8px 16px !important;
    }
    
    /* Grid */
    .parceiros-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 20px;
        margin: 24px 0;
    }
    
    .func-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: 20px;
    }
    
    .map-container {
        border-radius: 28px;
        overflow: hidden;
        border: 1px solid #efefec;
        margin: 20px 0 30px;
        height: 400px;
    }
    
    .loja-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: white;
        border-radius: 20px;
        border: 1px solid #efefec;
        margin-bottom: 12px;
    }
    
    .faq-item {
        background: white;
        border-radius: 20px;
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
    
    .contato-card {
        background: white;
        border-radius: 28px;
        padding: 40px 30px;
        text-align: center;
        border: 1px solid #efefec;
        height: 100%;
    }
    
    .contato-icon {
        font-size: 56px;
        margin-bottom: 20px;
    }
    
    .contato-email, .contato-instagram {
        font-size: 22px;
        font-weight: 700;
        color: #121212;
        text-decoration: none;
        display: block;
        margin-top: 16px;
    }
    
    iframe {
        border: none;
        width: 100%;
        height: 100%;
    }
    
    @media (max-width: 768px) {
        .func-grid {
            grid-template-columns: 1fr;
        }
        .tabs-container {
            overflow-x: auto;
            padding: 0 16px;
        }
    }
</style>

<!-- Leaflet CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
""", unsafe_allow_html=True)

# JavaScript para o mapa
mapa_js = """
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
    let map;
    let markers = [];
    
    function initMap(lat, lon) {
        if (map) {
            map.remove();
        }
        
        map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
        
        // Limpar markers antigos
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        
        // Adicionar lojas de exemplo
        const lojas = [
            {nome: 'StreetWearBR', lat: lat - 0.01, lng: lon - 0.01, end: 'Rua Principal, 123', rating: 4.5},
            {nome: 'UrbanStyle', lat: lat + 0.01, lng: lon + 0.01, end: 'Av. Central, 1500', rating: 4.8},
            {nome: 'Sioostas', lat: lat, lng: lon + 0.02, end: 'Rua Comercial, 350', rating: 4.3}
        ];
        
        lojas.forEach(loja => {
            const marker = L.marker([loja.lat, loja.lng])
                .addTo(map)
                .bindPopup(`<b>${loja.nome}</b><br>${loja.end}<br>⭐ ${loja.rating}`);
            markers.push(marker);
        });
    }
    
    function buscarLocal(local) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(local)}&limit=1&countrycodes=br`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    initMap(lat, lon);
                    document.getElementById('status').innerHTML = '📍 Localização encontrada: ' + data[0].display_name.split(',')[0];
                } else {
                    document.getElementById('status').innerHTML = '❌ Localização não encontrada';
                }
            })
            .catch(error => {
                document.getElementById('status').innerHTML = '❌ Erro na busca';
            });
    }
</script>
"""

# Funções auxiliares
def toggle_aba(aba):
    st.session_state.aba_ativa = aba

def fazer_login(email, senha, tipo):
    # Simulação de login
    st.session_state.user_logado = True
    st.session_state.user_nome = email.split('@')[0]
    st.session_state.user_tipo = tipo
    st.session_state.user_email = email
    st.session_state.modal_cadastro = False
    st.rerun()

def fazer_cadastro(nome, email, tipo, cidade, bairro, loja_nome=None, categoria=None):
    # Simulação de cadastro
    if tipo == 'pf':
        st.session_state.user_nome = nome
    else:
        st.session_state.user_nome = loja_nome
    
    st.session_state.user_logado = True
    st.session_state.user_tipo = tipo
    st.session_state.user_email = email
    st.session_state.modal_cadastro = False
    st.rerun()

def logout():
    st.session_state.user_logado = False
    st.session_state.user_nome = 'Visitante'
    st.session_state.user_tipo = ''
    st.session_state.user_email = ''
    st.rerun()

def buscar_localizacao(local):
    try:
        url = f"https://nominatim.openstreetmap.org/search"
        params = {
            'q': local,
            'format': 'json',
            'limit': 1,
            'countrycodes': 'br'
        }
        headers = {
            'User-Agent': 'RIMSO App/1.0'
        }
        response = requests.get(url, params=params, headers=headers, timeout=5)
        data = response.json()
        
        if data and len(data) > 0:
            lat = float(data[0]['lat'])
            lon = float(data[0]['lon'])
            display_name = data[0]['display_name']
            return lat, lon, display_name
    except Exception as e:
        st.error(f"Erro na busca: {e}")
    return None, None, None

# Layout principal
st.markdown('<div class="main-container">', unsafe_allow_html=True)

# Top bar
col1, col2, col3 = st.columns([2, 4, 2])
with col1:
    st.markdown('<div class="logo">RIMSO <span>beta</span></div>', unsafe_allow_html=True)
with col2:
    st.markdown('<div class="tagline">Conectando suas lojas ao seu bairro</div>', unsafe_allow_html=True)
with col3:
    if st.session_state.user_logado:
        st.markdown(f"""
        <div class="user-menu">
            <span>{"👤" if st.session_state.user_tipo == 'pf' else '🏪'} {st.session_state.user_nome}</span>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Sair", key="logout_btn", use_container_width=True):
            logout()
    else:
        if st.button("Entrar", key="entrar_btn", use_container_width=True):
            st.session_state.modal_cadastro = True

# Abas
st.markdown('<div class="tabs-container">', unsafe_allow_html=True)
col1, col2, col3, col4 = st.columns(4)
with col1:
    if st.button("🏠 Início", key="tab_inicio", use_container_width=True):
        toggle_aba('inicio')
with col2:
    if st.button("🗺️ Descubra lojas", key="tab_descubra", use_container_width=True):
        toggle_aba('descubra')
with col3:
    if st.button("❓ FAQ", key="tab_faq", use_container_width=True):
        toggle_aba('faq')
with col4:
    if st.button("📞 Contato", key="tab_contato", use_container_width=True):
        toggle_aba('contato')
st.markdown('</div>', unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# Conteúdo das abas
if st.session_state.aba_ativa == 'inicio':
    st.markdown(f"## Olá, {st.session_state.user_nome}!")
    st.markdown("Descubra lojas parceiras perto de você")
    
    st.markdown("### Nossos parceiros")
    
    parceiros = [
        {"nome": "UrbanStyle", "desc": "Moda urbana e streetwear", "cor": "#1e3a2f"},
        {"nome": "StreetWearBR", "desc": "As melhores marcas de rua", "cor": "#121212"},
        {"nome": "Sioostas", "desc": "Estilo autêntico", "cor": "#4b4b48"},
        {"nome": "Bairro Modas", "desc": "Moda casual", "cor": "#d9ffb2"}
    ]
    
    cols = st.columns(4)
    for i, parceiro in enumerate(parceiros):
        with cols[i]:
            st.markdown(f"""
            <div class="card">
                <div style="width:80px;height:80px;border-radius:40px;background:{parceiro['cor']};margin-bottom:16px;"></div>
                <h3>{parceiro['nome']}</h3>
                <p style="color:#6b6b69;">{parceiro['desc']}</p>
            </div>
            """, unsafe_allow_html=True)
            if st.button("Ver loja", key=f"ver_{i}"):
                toggle_aba('descubra')
    
    st.markdown("### Funcionalidades do app")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown("""
        <div class="card" style="text-align:center;">
            <div style="font-size:28px; margin-bottom:12px;">📍</div>
            <h3>Lojas próximas</h3>
            <p style="color:#6b6b69;">Encontre lojas no seu bairro</p>
        </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown("""
        <div class="card" style="text-align:center;">
            <div style="font-size:28px; margin-bottom:12px;">🏷️</div>
            <h3>Ofertas exclusivas</h3>
            <p style="color:#6b6b69;">Descontos especiais</p>
        </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown("""
        <div class="card" style="text-align:center;">
            <div style="font-size:28px; margin-bottom:12px;">💳</div>
            <h3>Pagamento fácil</h3>
            <p style="color:#6b6b69;">Taxa única de R$20 para lojas</p>
        </div>
        """, unsafe_allow_html=True)

elif st.session_state.aba_ativa == 'descubra':
    st.markdown("## Descubra lojas perto de você")
    
    # Incluir JavaScript
    st.components.v1.html(mapa_js, height=0)
    
    # Filtro de localização
    col1, col2 = st.columns([3, 1])
    with col1:
        local = st.text_input("", placeholder="Digite cidade, bairro ou rua (ex: Piracicaba, São Paulo)", 
                             value="Piracicaba - São Paulo", label_visibility="collapsed", key="busca_local")
    with col2:
        buscar = st.button("🔍 Buscar", key="buscar_btn", use_container_width=True)
    
    # Status da busca
    status_placeholder = st.empty()
    
    # Mapa
    if 'mapa_lat' not in st.session_state:
        st.session_state.mapa_lat = -23.5505
        st.session_state.mapa_lon = -46.6333
    
    # Buscar localização
    if buscar and local:
        with st.spinner("Buscando localização..."):
            lat, lon, display = buscar_localizacao(local)
            if lat and lon:
                st.session_state.mapa_lat = lat
                st.session_state.mapa_lon = lon
                status_placeholder.success(f"📍 Localização encontrada: {display.split(',')[0]}")
            else:
                status_placeholder.error("Localização não encontrada. Tente novamente.")
    
    # Criar mapa com HTML/JavaScript
    mapa_html = f"""
    <div class="map-container" id="map"></div>
    <script>
        setTimeout(function() {{
            initMap({st.session_state.mapa_lat}, {st.session_state.mapa_lon});
        }}, 100);
    </script>
    """
    
    st.components.v1.html(mapa_html, height=400)
    
    # Lista de lojas
    st.markdown("### Lojas encontradas")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="loja-item">
            <div>
                <h3>StreetWearBR</h3>
                <p style="color:#6b6b69;">📍 Rua da Consolação, 123</p>
                <span class="rating">4.5 ⭐</span>
            </div>
            <button class="btn-secondary" style="width:auto;" onclick="alert('Loja selecionada')">Ver loja</button>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("""
        <div class="loja-item">
            <div>
                <h3>Sioostas</h3>
                <p style="color:#6b6b69;">📍 Rua dos Pinheiros, 350</p>
                <span class="rating">4.3 ⭐</span>
            </div>
            <button class="btn-secondary" style="width:auto;" onclick="alert('Loja selecionada')">Ver loja</button>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="loja-item">
            <div>
                <h3>UrbanStyle</h3>
                <p style="color:#6b6b69;">📍 Av. Faria Lima, 1500</p>
                <span class="rating">4.8 ⭐</span>
            </div>
            <button class="btn-secondary" style="width:auto;" onclick="alert('Loja selecionada')">Ver loja</button>
        </div>
        """, unsafe_allow_html=True)

elif st.session_state.aba_ativa == 'faq':
    st.markdown("## Perguntas frequentes")
    
    faqs = [
        ("Como faço para me cadastrar como cliente?",
         "É gratuito e rápido! Basta clicar em 'Entrar' no canto superior direito, escolher 'Sou Cliente', preencher seus dados e clicar em 'Cadastrar grátis'."),
        
        ("Quanto custa cadastrar minha loja no RIMSO?",
         "O cadastro para lojistas tem uma taxa única de R$20,00. Com isso sua loja aparece para clientes no seu bairro e região."),
        
        ("Como funciona a localização das lojas?",
         "Usamos sua localização atual (com sua permissão) ou o filtro de busca para mostrar as lojas mais próximas. Você pode buscar por cidade, bairro ou rua na aba 'Descubra lojas'."),
        
        ("Posso comprar direto pelo app?",
         "No momento você encontra as lojas e vê os produtos, mas as compras são redirecionadas para o contato da loja. Em breve teremos checkout integrado."),
        
        ("Como atualizar os dados da minha loja?",
         "Acesse sua conta de lojista e faça login. Após logado, aparecerá a opção 'Meu Perfil' para editar informações."),
        
        ("O pagamento da taxa é seguro?",
         "Sim! Utilizamos integração com gateways de pagamento. Por enquanto é uma simulação, mas em breve teremos pagamento real via Pix e cartão."),
        
        ("Quais cidades estão disponíveis?",
         "Começamos por São Paulo (capital e grande SP), mas estamos expandindo. Em breve todo estado de São Paulo terá cobertura.")
    ]
    
    for pergunta, resposta in faqs:
        with st.expander(pergunta):
            st.markdown(resposta)

elif st.session_state.aba_ativa == 'contato':
    st.markdown("## Fale com a gente")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="contato-card">
            <div class="contato-icon">📧</div>
            <h3>E-mail</h3>
            <a href="mailto:contato@rimso.com.br" class="contato-email">
                contato@rimso.com.br
            </a>
            <p style="color:#6b6b69; margin-top:12px;">Respondemos em até 24h</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="contato-card">
            <div class="contato-icon">📱</div>
            <h3>Instagram</h3>
            <a href="https://instagram.com/rimsoapp" target="_blank" class="contato-instagram">
                @rimsoapp
            </a>
            <p style="color:#6b6b69; margin-top:12px;">Siga para novidades e promoções</p>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("""
    <div class="card" style="padding:30px; margin-top:24px;">
        <h3 style="margin-bottom:16px;">🕒 Horário de atendimento</h3>
        <p style="font-size:18px;">Segunda a sexta: 9h às 18h<br>Sábado: 9h às 13h</p>
        <p style="color:#6b6b69; margin-top:12px;">Estamos sempre prontos para ajudar!</p>
    </div>
    """, unsafe_allow_html=True)

st.markdown('</div>', unsafe_allow_html=True)  # Fecha main-container

# Modal de cadastro/login
if st.session_state.modal_cadastro:
    st.markdown("""
    <div class="modal-overlay">
        <div class="modal">
    """, unsafe_allow_html=True)
    
    # Botão fechar
    if st.button("✕", key="fechar_modal"):
        st.session_state.modal_cadastro = False
        st.rerun()
    
    st.markdown("""
    <div style="text-align:center; margin-bottom:20px;">
        <div class="logo">RIMSO <span>beta</span></div>
        <h2>Bem-vindo!</h2>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    with col1:
        if st.button("👤 Sou Cliente", key="btn_pf", use_container_width=True):
            st.session_state.form_ativa = 'pf'
    with col2:
        if st.button("🏪 Sou Lojista", key="btn_pj", use_container_width=True, type="primary"):
            st.session_state.form_ativa = 'pj'
    
    if st.session_state.form_ativa == 'pf':
        st.markdown("### Cadastro Cliente (grátis)")
        nome = st.text_input("Nome completo", value="Ana Oliveira", key="pf_nome")
        email = st.text_input("Email", value="ana@email.com", key="pf_email")
        senha = st.text_input("Senha", type="password", value="123456", key="pf_senha")
        cidade = st.text_input("Cidade", value="São Paulo", key="pf_cidade")
        bairro = st.text_input("Bairro", value="Pinheiros", key="pf_bairro")
        
        if st.button("Cadastrar grátis", key="cadastrar_pf", use_container_width=True, type="primary"):
            fazer_cadastro(nome, email, 'pf', cidade, bairro)
        
        st.markdown("---")
        st.markdown("### Já tem conta? Faça login")
        login_email = st.text_input("Email", value="ana@email.com", key="login_email")
        login_senha = st.text_input("Senha", type="password", value="123456", key="login_senha")
        
        if st.button("Entrar", key="login_pf", use_container_width=True):
            fazer_login(login_email, login_senha, 'pf')
    
    else:
        st.markdown("### Cadastro Lojista")
        st.markdown('<div class="price-tag">💰 Taxa única R$20</div>', unsafe_allow_html=True)
        
        loja_nome = st.text_input("Nome da Loja", value="StreetWearBR", key="loja_nome")
        email = st.text_input("Email", value="loja@street.com", key="loja_email")
        senha = st.text_input("Senha", type="password", value="123456", key="loja_senha")
        cidade = st.text_input("Cidade", value="São Paulo", key="loja_cidade")
        bairro = st.text_input("Bairro", value="Pinheiros", key="loja_bairro")
        categoria = st.selectbox("Categoria", ["Streetwear", "Sportwear", "Casual", "Moda feminina", "Moda masculina"], key="loja_categoria")
        
        if st.button("💳 Pagar R$20 e cadastrar", key="cadastrar_pj", use_container_width=True, type="primary"):
            fazer_cadastro(None, email, 'pj', cidade, bairro, loja_nome, categoria)
        
        st.markdown("---")
        st.markdown("### Já tem loja? Login")
        login_email = st.text_input("Email", value="loja@street.com", key="login_loja_email")
        login_senha = st.text_input("Senha", type="password", value="123456", key="login_loja_senha")
        
        if st.button("Entrar como lojista", key="login_pj", use_container_width=True):
            fazer_login(login_email, login_senha, 'pj')
    
    st.markdown("</div></div>", unsafe_allow_html=True)
