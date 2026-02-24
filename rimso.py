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

# URL do seu index.html no GitHub (CORRETA)
GITHUB_HTML_URL = "https://raw.githubusercontent.com/pedrohenriquemarques720-stack/Rimso/refs/heads/main/index.html"

# Função para carregar o HTML do GitHub
@st.cache_data(ttl=3600)  # Cache de 1 hora
def carregar_html_github():
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(GITHUB_HTML_URL, headers=headers, timeout=10)
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

# CSS para remover padding do Streamlit
st.markdown("""
<style>
    /* Remove padding do container principal */
    .main .block-container {
        padding: 0 !important;
        max-width: 100% !important;
    }
    
    /* Esconde elementos desnecessários do Streamlit */
    #MainMenu, footer, header {
        display: none;
    }
    
    /* Ajusta o iframe */
    iframe {
        width: 100%;
        border: none;
        margin: 0;
        padding: 0;
        min-height: 100vh;
    }
    
    /* Remove padding do app */
    .stApp {
        padding: 0 !important;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar minimalista
with st.sidebar:
    st.markdown("""
    <div style="text-align: center; padding: 10px 0;">
        <div style="font-size: 32px; margin-bottom: 5px;">👕</div>
        <div style="font-size: 18px; font-weight: 800;">
            RIM<span style="color: #DD0000;">SO</span>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    st.divider()
    
    if st.button("🔄 Recarregar página", use_container_width=True):
        st.cache_data.clear()
        st.rerun()
    
    if st.button("🌐 Abrir no GitHub", use_container_width=True):
        url_github = GITHUB_HTML_URL.replace('raw.githubusercontent.com', 'github.com').replace('/refs/heads/', '/blob/')
        js = f"window.open('{url_github}')"
        st.components.v1.html(f"<script>{js}</script>", height=0)
    
    st.divider()
    st.caption("Versão 1.0 - Interface Desktop")

# Área principal - Carregar o HTML
with st.spinner("🔄 Carregando RIMSO..."):
    html_content = carregar_html_github()
    
    if html_content:
        # Injetar o HTML diretamente
        html(html_content, height=1000, scrolling=True)
        
        # Mostrar status na sidebar
        with st.sidebar:
            st.success(f"✅ Carregado!")
    else:
        st.error("""
        ### ❌ Erro ao carregar o RIMSO
        
        **Verifique:**
        1. Se o arquivo existe no GitHub
        2. Sua conexão com internet
        3. Se a URL está correta
        
        **URL:** `https://raw.githubusercontent.com/pedrohenriquemarques720-stack/Rimso/refs/heads/main/index.html`
        """)
