import streamlit as st
import requests
from streamlit.components.v1 import html
import time
from datetime import datetime

# Configuração da página
st.set_page_config(
    page_title="RIMSO - Marketplace Regional",
    page_icon="👕",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# URL do seu index.html no GitHub (CORRETA)
GITHUB_HTML_URL = "https://raw.githubusercontent.com/pedrohenriquemarques720-stack/Rimso/refs/heads/main/index.html"

# Função para carregar o HTML do GitHub SEM CACHE
def carregar_html_github():
    try:
        # Forçar bypass do cache com headers
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
        
        # Adicionar timestamp para evitar cache
        url_com_timestamp = f"{GITHUB_HTML_URL}?t={int(time.time())}"
        
        response = requests.get(url_com_timestamp, headers=headers, timeout=10)
        
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
    
    /* Loading spinner */
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

# Sidebar com informações
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
    
    st.subheader("📊 Status")
    status_placeholder = st.empty()
    
    st.divider()
    
    col1, col2 = st.columns(2)
    with col1:
        if st.button("🔄 Recarregar", use_container_width=True):
            st.cache_data.clear()
            st.rerun()
    
    with col2:
        if st.button("🌐 GitHub", use_container_width=True):
            url_github = GITHUB_HTML_URL.replace('raw.githubusercontent.com', 'github.com').replace('/refs/heads/', '/blob/')
            js = f"window.open('{url_github}')"
            st.components.v1.html(f"<script>{js}</script>", height=0)
    
    st.divider()
    
    # Informações de debug
    with st.expander("🔧 Debug Info"):
        st.write(f"**URL:** {GITHUB_HTML_URL}")
        st.write(f"**Timestamp:** {datetime.now().strftime('%H:%M:%S')}")
    
    st.caption("⚠️ Para atualizar o HTML, edite o arquivo no GitHub e clique em 'Recarregar'")

# Área principal - Carregar o HTML
status_placeholder.info("⏳ Carregando RIMSO...")

with st.spinner("🔄 Carregando interface..."):
    html_content = carregar_html_github()
    
    if html_content:
        # Verificar se o HTML carregado é o correto (procurar por características do HTML antigo)
        if 'RIMSO - Plataforma SaaS de Marketplace Regional' in html_content:
            status_placeholder.success(f"✅ HTML correto carregado!")
            
            # Injetar o HTML
            html(html_content, height=1000, scrolling=True)
            
            # Mostrar informações
            with st.sidebar:
                st.success(f"✅ Versão: Marketplace Regional")
                st.caption(f"Tamanho: {len(html_content):,} bytes")
        else:
            status_placeholder.warning("⚠️ HTML carregado, mas pode ser a versão antiga")
            html(html_content, height=1000, scrolling=True)
    else:
        status_placeholder.error("❌ Falha ao carregar")
        st.markdown("""
        <div style="text-align: center; padding: 50px;">
            <h1 style="color: #DD0000;">😕 Erro ao carregar</h1>
            <p style="color: #6B7280;">Não foi possível carregar o RIMSO do GitHub</p>
            <p style="margin-top: 20px;">
                <strong>URL:</strong><br>
                <code>https://raw.githubusercontent.com/pedrohenriquemarques720-stack/Rimso/refs/heads/main/index.html</code>
            </p>
            <p style="margin-top: 20px;">
                <button onclick="window.location.reload()" style="background: #DD0000; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    Tentar novamente
                </button>
            </p>
        </div>
        """, unsafe_allow_html=True)
