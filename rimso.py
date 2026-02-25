import streamlit as st
import requests
from streamlit.components.v1 import html
import time
from datetime import datetime
import os

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

# Função para ler arquivo local (fallback)
def carregar_html_local():
    try:
        # Tentar ler o arquivo index.html local
        if os.path.exists('index.html'):
            with open('index.html', 'r', encoding='utf-8') as f:
                return f.read()
        else:
            return None
    except Exception as e:
        st.error(f"Erro ao ler arquivo local: {e}")
        return None

# CSS para remover padding do Streamlit e configurar caminhos dos arquivos estáticos
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
    
    # Opção de fonte do HTML
    fonte = st.radio(
        "📁 Fonte do HTML:",
        ["GitHub", "Arquivo Local"],
        index=0
    )
    
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
        # Verificar se a pasta static existe
        if os.path.exists('static'):
            arquivos_js = [f for f in os.listdir('static') if f.endswith('.js')]
            st.write(f"**Arquivos JS na pasta static:** {len(arquivos_js)}")
            for js_file in arquivos_js[:5]:  # Mostrar apenas os 5 primeiros
                st.write(f"  - {js_file}")
        else:
            st.write("**Pasta 'static' não encontrada**")
    
    st.caption("⚠️ Os arquivos .js devem estar na pasta 'static/'")

# Área principal - Carregar o HTML
status_placeholder.info("⏳ Carregando RIMSO...")

with st.spinner("🔄 Carregando interface..."):
    html_content = None
    
    if fonte == "GitHub":
        html_content = carregar_html_github()
    else:
        html_content = carregar_html_local()
    
    if html_content:
        # Modificar os caminhos dos scripts no HTML para apontar para a pasta static
        # Isso é importante se o HTML estiver referenciando os scripts diretamente
        modified_html = html_content.replace('src="avaliaçoes.js"', 'src="static/avaliaçoes.js"')
        modified_html = modified_html.replace('src="feed.js"', 'src="static/feed.js"')
        modified_html = modified_html.replace('src="favoritos.js"', 'src="static/favoritos.js"')
        modified_html = modified_html.replace('src="rotas.js"', 'src="static/rotas.js"')
        modified_html = modified_html.replace('src="filtrosavan.js"', 'src="static/filtrosavan.js"')
        modified_html = modified_html.replace('src="notificaçoes.js"', 'src="static/notificaçoes.js"')
        modified_html = modified_html.replace('src="estatisticas.js"', 'src="static/estatisticas.js"')
        modified_html = modified_html.replace('src="promoçoes.js"', 'src="static/promoçoes.js"')
        modified_html = modified_html.replace('src="compartilhar.js"', 'src="static/compartilhar.js"')
        modified_html = modified_html.replace('src="adminadv.js"', 'src="static/adminadv.js"')
        
        # Também substituir versões com caminho js/ se existirem
        modified_html = modified_html.replace('src="js/', 'src="static/')
        
        # Verificar se o HTML carregado é o correto
        if 'RIMSO - Plataforma SaaS de Marketplace Regional' in modified_html or 'RIMSO Piracicaba' in modified_html:
            status_placeholder.success(f"✅ HTML carregado com sucesso!")
            
            # Injetar o HTML modificado
            html(modified_html, height=1000, scrolling=True)
            
            # Mostrar informações
            with st.sidebar:
                st.success(f"✅ Versão atualizada")
                st.caption(f"Tamanho: {len(modified_html):,} bytes")
                
                # Verificar se a pasta static existe e tem arquivos
                if os.path.exists('static'):
                    arquivos_js = [f for f in os.listdir('static') if f.endswith('.js')]
                    st.info(f"📁 Pasta static: {len(arquivos_js)} arquivos .js encontrados")
                else:
                    st.error("❌ Pasta 'static' não encontrada! Crie a pasta e coloque os arquivos .js nela.")
        else:
            status_placeholder.warning("⚠️ HTML carregado")
            html(modified_html, height=1000, scrolling=True)
    else:
        status_placeholder.error("❌ Falha ao carregar")
        st.markdown("""
        <div style="text-align: center; padding: 50px;">
            <h1 style="color: #DD0000;">😕 Erro ao carregar</h1>
            <p style="color: #6B7280;">Não foi possível carregar o RIMSO</p>
            <p style="margin-top: 20px;">
                <strong>URL:</strong><br>
                <code>https://raw.githubusercontent.com/pedrohenriquemarques720-stack/Rimso/refs/heads/main/index.html</code>
            </p>
            <p style="margin-top: 20px;">
                <strong>Instruções:</strong><br>
                1. Crie uma pasta chamada <code>static</code> no seu repositório<br>
                2. Coloque todos os arquivos .js dentro da pasta <code>static</code><br>
                3. Verifique se o arquivo index.html existe
            </p>
            <p style="margin-top: 20px;">
                <button onclick="window.location.reload()" style="background: #DD0000; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    Tentar novamente
                </button>
            </p>
        </div>
        """, unsafe_allow_html=True)
