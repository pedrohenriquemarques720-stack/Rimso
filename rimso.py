import streamlit as st
import requests
from streamlit.components.v1 import html
import time
from datetime import datetime
import os
import base64

# Configuração da página
st.set_page_config(
    page_title="RIMSO - Marketplace Regional",
    page_icon="👕",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# URL do seu index.html no GitHub
GITHUB_HTML_URL = "https://raw.githubusercontent.com/pedrohenriquemarques720-stack/Rimso/refs/heads/main/index.html"

# ==================== FUNÇÃO PARA CARREGAR ARQUIVOS JS DA PASTA STATIC ====================
def carregar_arquivo_js(nome_arquivo):
    """Tenta carregar um arquivo JS da pasta static"""
    try:
        # Caminhos possíveis
        caminhos = [
            f"static/{nome_arquivo}",
            f"./static/{nome_arquivo}",
            f"/static/{nome_arquivo}"
        ]
        
        for caminho in caminhos:
            if os.path.exists(caminho):
                with open(caminho, 'r', encoding='utf-8') as f:
                    conteudo = f.read()
                    print(f"✅ Arquivo {nome_arquivo} carregado de {caminho}")
                    return conteudo
        
        print(f"❌ Arquivo {nome_arquivo} não encontrado")
        return ""
    except Exception as e:
        print(f"❌ Erro ao carregar {nome_arquivo}: {e}")
        return ""

# ==================== CARREGAR TODOS OS ARQUIVOS JS ====================
def carregar_todos_scripts():
    """Carrega todos os arquivos JS da pasta static"""
    arquivos_js = [
        "avaliaçoes.js",
        "feed.js",
        "favoritos.js",
        "rotas.js",
        "filtrosavan.js",
        "notificaçoes.js",
        "estatisticas.js",
        "promoçoes.js",
        "compartilhar.js",
        "adminadv.js"
    ]
    
    scripts = ""
    for arquivo in arquivos_js:
        conteudo = carregar_arquivo_js(arquivo)
        if conteudo:
            scripts += f"\n// ====== {arquivo} ======\n{conteudo}\n"
    
    return scripts

# ==================== FUNÇÃO PARA CARREGAR HTML DO GITHUB ====================
def carregar_html_github():
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
        
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

# ==================== CSS PARA REMOVER PADDING ====================
st.markdown("""
<style>
    .main .block-container {
        padding: 0 !important;
        max-width: 100% !important;
    }
    
    #MainMenu, footer, header {
        display: none;
    }
    
    iframe {
        width: 100%;
        border: none;
        margin: 0;
        padding: 0;
        min-height: 100vh;
    }
    
    .stApp {
        padding: 0 !important;
    }
    
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

# ==================== SIDEBAR ====================
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
    
    st.divider()
    
    # Informações de debug
    with st.expander("🔧 Debug Info"):
        st.write(f"**URL:** {GITHUB_HTML_URL}")
        st.write(f"**Timestamp:** {datetime.now().strftime('%H:%M:%S')}")
        
        # Verificar arquivos na pasta static
        if os.path.exists('static'):
            arquivos = os.listdir('static')
            arquivos_js = [f for f in arquivos if f.endswith('.js')]
            st.write(f"**Arquivos JS encontrados:** {len(arquivos_js)}")
            for js in arquivos_js:
                st.write(f"  - {js}")
        else:
            st.write("**Pasta 'static' NÃO encontrada!**")
    
    st.caption("📁 Os arquivos .js devem estar na pasta 'static/'")

# ==================== ÁREA PRINCIPAL ====================
status_placeholder.info("⏳ Carregando RIMSO...")

with st.spinner("🔄 Carregando interface..."):
    # Carregar HTML do GitHub
    html_content = carregar_html_github()
    
    if html_content:
        # Carregar todos os scripts JS
        todos_scripts = carregar_todos_scripts()
        
        # Modificar o HTML - remover tags <script src> e injetar scripts diretamente
        import re
        
        # Remover todas as tags <script src="..."> (evita tentar carregar arquivos externos)
        html_content = re.sub(r'<script\s+src="[^"]+\.js"[^>]*>\s*</script>', '', html_content)
        html_content = re.sub(r'<script\s+src="[^"]+\.js"[^>]*>', '', html_content)
        
        # Injetar todos os scripts antes do fechamento do body
        if todos_scripts:
            # Envolver os scripts em uma tag script única
            script_tag = f'<script>\n// ====== TODOS OS SCRIPTS CARREGADOS DA PASTA STATIC ======\n{todos_scripts}\nconsole.log("✅ Todos os scripts carregados via Python!");\n</script>'
            html_content = html_content.replace('</body>', f'{script_tag}</body>')
            
            status_success = f"✅ {len(todos_scripts)} caracteres de scripts injetados"
        else:
            status_success = "⚠️ Nenhum script carregado da pasta static"
            # Injetar um script de fallback
            fallback_script = '<script>console.warn("⚠️ Nenhum script carregado da pasta static");</script>'
            html_content = html_content.replace('</body>', f'{fallback_script}</body>')
        
        # Injetar o HTML
        html(html_content, height=1000, scrolling=True)
        
        # Atualizar status
        status_placeholder.success(status_success)
        
        # Mostrar informações na sidebar
        with st.sidebar:
            if todos_scripts:
                st.success(f"✅ Scripts injetados: {len(todos_scripts)} caracteres")
            else:
                st.error("❌ Nenhum script carregado! Verifique a pasta static.")
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
        </div>
        """, unsafe_allow_html=True)
