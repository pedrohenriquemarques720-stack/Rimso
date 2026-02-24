import streamlit as st
import requests
from streamlit.components.v1 import html
import time

# Configuração da página
st.set_page_config(
    page_title="RIMSO - Marketplace Regional",
    page_icon="👕",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# URL CORRETA do seu index.html no GitHub
GITHUB_HTML_URL = "https://raw.githubusercontent.com/pedrohenriquemarques720-stack/Rimso/refs/heads/main/index.html"

# Função para carregar o HTML do GitHub
@st.cache_data(ttl=3600)  # Cache de 1 hora
def carregar_html_github():
    try:
        response = requests.get(GITHUB_HTML_URL, timeout=10)
        if response.status_code == 200:
            return response.text
        else:
            st.error(f"Erro {response.status_code}: Não foi possível acessar o arquivo.")
            return None
    except requests.exceptions.Timeout:
        st.error("⏰ Timeout ao conectar com GitHub")
        return None
    except Exception as e:
        st.error(f"Erro inesperado: {e}")
        return None

# Função para carregar HTML local (fallback)
def carregar_html_local():
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return None

# CSS para remover padding do Streamlit e permitir que o HTML ocupe toda a tela
st.markdown("""
<style>
    /* Remove padding do container principal */
    .main .block-container {
        padding: 0 !important;
        max-width: 100% !important;
    }
    
    /* Esconde elementos desnecessários do Streamlit */
    #MainMenu, footer, header {
        visibility: hidden;
        display: none;
    }
    
    /* Ajusta a altura do iframe */
    iframe {
        width: 100%;
        border: none;
        margin: 0;
        padding: 0;
        min-height: 100vh;
    }
    
    /* Remove qualquer padding adicional */
    .stApp {
        padding: 0 !important;
    }
    
    /* Loading spinner personalizado */
    .custom-spinner {
        text-align: center;
        padding: 50px;
    }
    
    .custom-spinner .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #DD0000;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin: 20px auto;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Estilo para mensagem de erro */
    .error-container {
        text-align: center;
        padding: 50px;
        max-width: 600px;
        margin: 0 auto;
    }
    
    .error-container h1 {
        font-size: 24px;
        margin-bottom: 20px;
        color: #DD0000;
    }
    
    .error-container p {
        color: #6B7280;
        margin-bottom: 10px;
    }
    
    .error-container .code {
        background: #F3F4F6;
        padding: 10px;
        border-radius: 8px;
        font-family: monospace;
        margin: 20px 0;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar com informações e controle
with st.sidebar:
    st.markdown("""
    <div style="text-align: center; padding: 20px 0;">
        <div style="font-size: 48px; margin-bottom: 10px;">👕</div>
        <div style="font-size: 24px; font-weight: 800;">
            RIM<span style="color: #DD0000;">SO</span>
        </div>
        <div style="color: #6B7280; font-size: 12px; margin-top: 5px;">
            Painel de Controle
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    st.divider()
    
    # Configurações de carregamento
    with st.expander("⚙️ Configurações", expanded=True):
        usar_cache = st.toggle("Usar cache", value=True)
        modo_debug = st.toggle("Modo debug", value=False)
    
    # Fonte do HTML
    fonte = st.radio(
        "📁 Fonte do HTML:",
        ["GitHub", "Arquivo Local"],
        help="Escolha de onde carregar a interface"
    )
    
    if fonte == "GitHub":
        st.info(f"URL: `{GITHUB_HTML_URL}`")
        
        col1, col2 = st.columns(2)
        with col1:
            if st.button("🔄 Atualizar"):
                if not usar_cache:
                    st.cache_data.clear()
                st.rerun()
        with col2:
            if st.button("🌐 Abrir GitHub"):
                url_github = GITHUB_HTML_URL.replace('raw.githubusercontent.com', 'github.com').replace('/refs/heads/', '/blob/')
                js = f"window.open('{url_github}')"
                st.components.v1.html(f"<script>{js}</script>", height=0)
    
    else:
        st.info("Arquivo: `index.html` (pasta local)")
    
    st.divider()
    
    # Status
    st.subheader("📊 Status")
    status_placeholder = st.empty()
    status_placeholder.info("⏳ Aguardando...")

# Área principal - Carregar o HTML
with st.container():
    # Mostrar loading
    with st.spinner("🔄 Carregando interface do RIMSO..."):
        html_content = None
        
        if fonte == "GitHub":
            if not usar_cache:
                st.cache_data.clear()
            html_content = carregar_html_github()
        else:
            html_content = carregar_html_local()
        
        if html_content:
            # Injetar o HTML no Streamlit usando components.html diretamente
            html(html_content, height=1000, scrolling=True)
            
            # Atualizar status
            status_placeholder.success(f"✅ RIMSO carregado ({len(html_content):,} bytes)")
            
            if modo_debug:
                with st.expander("🔍 Debug Info"):
                    st.json({
                        "fonte": fonte,
                        "tamanho": len(html_content),
                        "cache": "ativo" if usar_cache else "inativo",
                        "url": GITHUB_HTML_URL if fonte == "GitHub" else "local",
                        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                    })
        else:
            status_placeholder.error("❌ Falha ao carregar")
            
            # Mensagem de erro detalhada
            st.markdown(f"""
            <div class="error-container">
                <h1>😕 Não foi possível carregar o RIMSO</h1>
                
                <p><strong>Possíveis causas:</strong></p>
                <p>• Arquivo não encontrado no GitHub</p>
                <p>• URL incorreta</p>
                <p>• Problema de conexão</p>
                <p>• Arquivo local não existe</p>
                
                <p><strong>Verifique:</strong></p>
                <div class="code">
                    URL do GitHub: {GITHUB_HTML_URL}
                </div>
                <p>• Se o arquivo <code>index.html</code> existe no repositório</p>
                <p>• Sua conexão com internet</p>
                
                <p style="margin-top: 30px;">
                    <strong>URL Raw Correta:</strong><br>
                    <code>https://raw.githubusercontent.com/pedrohenriquemarques720-stack/Rimso/refs/heads/main/index.html</code>
                </p>
            </div>
            """, unsafe_allow_html=True)
