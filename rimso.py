import streamlit as st
import requests
from streamlit.components.v1 import html
import time
from datetime import datetime
import os
import re

# Configuração da página
st.set_page_config(
    page_title="RIMSO - Marketplace Regional",
    page_icon="👕",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# URL do seu index.html no GitHub
GITHUB_HTML_URL = "https://raw.githubusercontent.com/pedrohenriquemarques720-stack/Rimso/refs/heads/main/index.html"

# ==================== FUNÇÃO PARA LER ARQUIVOS JS DIRETAMENTE ====================
def ler_arquivo_js(nome_arquivo):
    """Lê um arquivo JS da pasta static"""
    try:
        # Tentar diferentes caminhos
        caminhos_possiveis = [
            f"static/{nome_arquivo}",
            f"./static/{nome_arquivo}",
            f"/mount/src/rimso/static/{nome_arquivo}",  # Caminho absoluto no Streamlit Cloud
        ]
        
        for caminho in caminhos_possiveis:
            if os.path.exists(caminho):
                with open(caminho, 'r', encoding='utf-8') as f:
                    conteudo = f.read()
                    print(f"✅ Arquivo {nome_arquivo} encontrado em: {caminho}")
                    return conteudo
        
        print(f"❌ Arquivo {nome_arquivo} NÃO encontrado")
        return None
    except Exception as e:
        print(f"❌ Erro ao ler {nome_arquivo}: {e}")
        return None

# ==================== CARREGAR TODOS OS SCRIPTS ====================
def carregar_todos_scripts():
    """Carrega todos os arquivos JS e retorna como string única"""
    
    # Lista de arquivos para carregar (COM ACENTOS)
    arquivos = [
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
    
    scripts = []
    
    for arquivo in arquivos:
        conteudo = ler_arquivo_js(arquivo)
        if conteudo:
            # Envolver cada script em um bloco com console.log para debug
            script_bloco = f"""
// ========== INÍCIO DO ARQUIVO: {arquivo} ==========
console.log('✅ Carregando: {arquivo}');
{conteudo}
console.log('✅ Arquivo {arquivo} carregado com sucesso!');
// ========== FIM DO ARQUIVO: {arquivo} ==========
"""
            scripts.append(script_bloco)
        else:
            # Criar um script vazio com aviso
            scripts.append(f"""
// ========== ARQUIVO NÃO ENCONTRADO: {arquivo} ==========
console.warn('⚠️ Arquivo {arquivo} não encontrado na pasta static');
// ========== FIM ==========
""")
    
    return "\n\n".join(scripts)

# ==================== FUNÇÃO PARA CARREGAR HTML ====================
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
    except Exception as e:
        st.error(f"Erro inesperado: {e}")
        return None

# ==================== CSS ====================
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
    
    if st.button("🔄 Recarregar", use_container_width=True):
        st.cache_data.clear()
        st.rerun()
    
    st.divider()
    
    # Informações de debug
    with st.expander("🔧 Debug Info", expanded=True):
        st.write(f"**URL:** {GITHUB_HTML_URL}")
        st.write(f"**Timestamp:** {datetime.now().strftime('%H:%M:%S')}")
        
        # Verificar se a pasta static existe
        if os.path.exists('static'):
            arquivos = os.listdir('static')
            arquivos_js = [f for f in arquivos if f.endswith('.js')]
            st.write(f"**Arquivos JS encontrados:** {len(arquivos_js)}")
            for js in arquivos_js:
                st.write(f"  - {js}")
        else:
            st.write("**Pasta 'static' NÃO encontrada!**")
            st.write("**Diretório atual:**", os.getcwd())
            st.write("**Conteúdo do diretório:**", os.listdir('.'))

# ==================== ÁREA PRINCIPAL ====================
status_placeholder.info("⏳ Carregando RIMSO...")

with st.spinner("🔄 Carregando interface..."):
    # Carregar HTML
    html_content = carregar_html_github()
    
    if html_content:
        # Carregar todos os scripts
        todos_scripts = carregar_todos_scripts()
        
        # REMOVER todas as tags <script src="..."> do HTML original
        # Isso evita que o navegador tente baixar arquivos que não existem
        html_content = re.sub(r'<script\s+src="[^"]*\.js"[^>]*>\s*</script>', '', html_content)
        html_content = re.sub(r'<script\s+src="[^"]*\.js"[^>]*>', '', html_content)
        
        # REMOVER também tags com caminhos errados
        html_content = re.sub(r'<link[^>]*href="[^"]*\.css"[^>]*>', '', html_content)
        
        # Injetar TODOS os scripts antes do fechamento do body
        script_completo = f"""
<script>
// ===== TODOS OS SCRIPTS CARREGADOS DIRETAMENTE =====
console.log('🚀 Iniciando carregamento dos scripts RIMSO...');
{todos_scripts}
console.log('✅ Todos os scripts RIMSO carregados com sucesso!');
</script>
"""
        
        html_content = html_content.replace('</body>', f'{script_completo}</body>')
        
        # Injetar o HTML modificado
        html(html_content, height=1000, scrolling=True)
        
        # Atualizar status
        status_placeholder.success(f"✅ RIMSO carregado com {len(todos_scripts)} caracteres de scripts!")
        
        # Mostrar na sidebar
        with st.sidebar:
            st.success(f"✅ Scripts injetados: {len(todos_scripts)} caracteres")
    else:
        status_placeholder.error("❌ Falha ao carregar")
        st.markdown("""
        <div style="text-align: center; padding: 50px;">
            <h1 style="color: #DD0000;">😕 Erro ao carregar</h1>
            <p style="color: #6B7280;">Não foi possível carregar o RIMSO do GitHub</p>
        </div>
        """, unsafe_allow_html=True)
