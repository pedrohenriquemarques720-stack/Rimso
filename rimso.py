import streamlit as st
import requests
import os
from streamlit.components.v1 import html
import time

# Configuração da página
st.set_page_config(
    page_title="RIMSO - Marketplace Regional",
    page_icon="👕",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Configuração via variável de ambiente ou hardcoded
GITHUB_HTML_URL = os.getenv(
    "RIMSO_HTML_URL",
    "https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPOSITORIO/main/index.html"
)

# Cache com TTL configurável
CACHE_TTL = int(os.getenv("RIMSO_CACHE_TTL", "3600"))  # 1 hora default

@st.cache_data(ttl=CACHE_TTL)
def carregar_html_github():
    """Carrega o HTML do GitHub com cache"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (RIMSO-App)'
        }
        response = requests.get(GITHUB_HTML_URL, headers=headers, timeout=10)
        if response.status_code == 200:
            return response.text
        else:
            st.error(f"Erro {response.status_code}: {response.reason}")
            return None
    except requests.exceptions.Timeout:
        st.error("⏰ Timeout ao conectar com GitHub")
        return None
    except Exception as e:
        st.error(f"Erro inesperado: {e}")
        return None

def carregar_html_local():
    """Fallback para arquivo local"""
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return None

# Sidebar
with st.sidebar:
    st.markdown("""
    <div style="text-align: center; padding: 20px 0;">
        <div style="font-size: 48px; margin-bottom: 10px;">👕</div>
        <div style="font-size: 24px; font-weight: 800;">
            RIM<span style="color: #DD0000;">SO</span>
        </div>
        <div style="color: #6B7280; font-size: 12px;">
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
                js = f"window.open('{GITHUB_HTML_URL.replace('raw.githubusercontent', 'github').replace('/main/', '/blob/main/')}')"
                st.components.v1.html(f"<script>{js}</script>", height=0)
    
    else:
        st.info("Arquivo: `index.html` (pasta local)")
    
    st.divider()
    
    # Status
    st.subheader("📊 Status")
    status = st.empty()
    status.info("⏳ Aguardando...")
    
    # Métricas
    st.divider()
    st.caption("💡 Dica: Para atualizar o HTML, edite o arquivo no GitHub e clique em 'Atualizar'")

# CSS para remover padding do Streamlit
st.markdown("""
<style>
    /* Remove padding do container principal */
    .main .block-container {
        padding: 0 !important;
        max-width: 100% !important;
    }
    
    /* Esconde elementos desnecessários */
    #MainMenu, footer, header {
        visibility: hidden;
    }
    
    /* Ajusta a altura do iframe */
    iframe {
        width: 100%;
        border: none;
        margin: 0;
        padding: 0;
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
</style>
""", unsafe_allow_html=True)

# Container principal
main_container = st.container()

with main_container:
    # Placeholder para o HTML
    html_placeholder = st.empty()
    
    # Mostrar loading
    with html_placeholder.container():
        st.markdown("""
        <div class="custom-spinner">
            <div class="spinner"></div>
            <h3>Carregando RIMSO...</h3>
            <p style="color: #6B7280;">Aguarde enquanto carregamos a interface</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Carregar HTML
    html_content = None
    
    if fonte == "GitHub":
        if not usar_cache:
            st.cache_data.clear()
        html_content = carregar_html_github()
    else:
        html_content = carregar_html_local()
    
    if html_content:
        # Substituir loading pelo HTML
        html_placeholder.components.v1.html(
            html_content,
            height=1000,
            scrolling=True
        )
        
        # Atualizar status
        status.success(f"✅ RIMSO carregado ({len(html_content):,} bytes)")
        
        if modo_debug:
            with st.expander("🔍 Debug Info"):
                st.json({
                    "fonte": fonte,
                    "tamanho": len(html_content),
                    "cache": "ativo" if usar_cache else "inativo",
                    "url": GITHUB_HTML_URL if fonte == "GitHub" else "local"
                })
    else:
        status.error("❌ Falha ao carregar")
        html_placeholder.error("""
        # 😕 Não foi possível carregar o RIMSO
        
        **Possíveis causas:**
        1. Arquivo não encontrado no GitHub
        2. URL incorreta
        3. Problema de conexão
        4. Arquivo local não existe
        
        **Verifique:**
        - URL do GitHub: `{}`
        - Se o arquivo `index.html` existe na pasta
        - Sua conexão com internet
        
        Para corrigir, edite a variável `GITHUB_HTML_URL` no código.
        """.format(GITHUB_HTML_URL))
