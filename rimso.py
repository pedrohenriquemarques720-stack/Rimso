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

# ==================== LISTA CORRETA DOS ARQUIVOS (COM OS NOVOS NOMES) ====================
ARQUIVOS_JS = [
    "avaliacoes.js",
    "feed.js",
    "favoritos.js",
    "rotas.js",
    "filtrosavan.js",
    "notificacoes.js",
    "estatisticas.js",
    "promocoes.js",
    "compartilhar.js",
    "adminadv.js"
]

# ==================== FUNÇÃO PARA LER ARQUIVOS JS ====================
def ler_arquivo_js(nome_arquivo):
    """Lê um arquivo JS da pasta static"""
    
    # Tentar diferentes caminhos possíveis no Streamlit Cloud
    caminhos_possiveis = [
        f"static/{nome_arquivo}",
        f"./static/{nome_arquivo}",
        f"/mount/src/rimso/static/{nome_arquivo}",  # Caminho absoluto no Streamlit Cloud
        f"/app/static/{nome_arquivo}",              # Outro caminho possível
    ]
    
    for caminho in caminhos_possiveis:
        if os.path.exists(caminho):
            try:
                with open(caminho, 'r', encoding='utf-8') as f:
                    conteudo = f.read()
                    print(f"✅ Arquivo encontrado: {caminho}")
                    return conteudo, caminho
            except Exception as e:
                print(f"⚠️ Erro ao ler {caminho}: {e}")
    
    # Se não encontrar, procurar em qualquer lugar
    for root, dirs, files in os.walk('.'):
        if nome_arquivo in files:
            caminho = os.path.join(root, nome_arquivo)
            try:
                with open(caminho, 'r', encoding='utf-8') as f:
                    conteudo = f.read()
                    print(f"✅ Arquivo encontrado em: {caminho}")
                    return conteudo, caminho
            except:
                pass
    
    return None, None

# ==================== CARREGAR TODOS OS SCRIPTS ====================
def carregar_todos_scripts():
    """Carrega todos os arquivos JS e retorna como string única"""
    
    scripts = []
    arquivos_encontrados = []
    arquivos_nao_encontrados = []
    
    for arquivo in ARQUIVOS_JS:
        conteudo, caminho = ler_arquivo_js(arquivo)
        
        if conteudo:
            arquivos_encontrados.append(arquivo)
            script_bloco = f"""
// ========== INÍCIO: {arquivo} ==========
console.log('✅ Carregando: {arquivo}');
{conteudo}
console.log('✅ Arquivo {arquivo} carregado!');
// ========== FIM: {arquivo} ==========
"""
            scripts.append(script_bloco)
        else:
            arquivos_nao_encontrados.append(arquivo)
            scripts.append(f"""
// ========== ARQUIVO NÃO ENCONTRADO: {arquivo} ==========
console.warn('⚠️ Arquivo {arquivo} não encontrado');
// ========== FIM ==========
""")
    
    return "\n\n".join(scripts), arquivos_encontrados, arquivos_nao_encontrados

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
        
        # Mostrar diretório atual
        st.write(f"**Diretório atual:** {os.getcwd()}")
        
        # Listar arquivos no diretório atual
        try:
            arquivos_raiz = os.listdir('.')
            st.write(f"**Arquivos na raiz:** {len(arquivos_raiz)}")
            for arquivo in arquivos_raiz[:10]:
                st.write(f"  - {arquivo}")
        except:
            st.write("  Erro ao listar arquivos")
        
        # Verificar pasta static
        if os.path.exists('static'):
            arquivos_static = os.listdir('static')
            st.write(f"**Arquivos na pasta static:** {len(arquivos_static)}")
            for arquivo in arquivos_static:
                st.write(f"  - {arquivo}")
        else:
            st.write("**Pasta 'static' NÃO encontrada!**")
            # Tentar encontrar a pasta static
            for root, dirs, files in os.walk('.'):
                if 'static' in dirs:
                    st.write(f"**Pasta static encontrada em:** {root}")

# ==================== ÁREA PRINCIPAL ====================
status_placeholder.info("⏳ Carregando RIMSO...")

with st.spinner("🔄 Carregando interface..."):
    # Carregar HTML
    html_content = carregar_html_github()
    
    if html_content:
        # Carregar todos os scripts
        todos_scripts, encontrados, nao_encontrados = carregar_todos_scripts()
        
        # REMOVER todas as tags <script src="..."> do HTML original
        html_content = re.sub(r'<script\s+src="[^"]*\.js"[^>]*>\s*</script>', '', html_content)
        html_content = re.sub(r'<script\s+src="[^"]*\.js"[^>]*>', '', html_content)
        
        # Injetar TODOS os scripts
        script_completo = f"""
<script>
// ===== TODOS OS SCRIPTS RIMSO =====
console.log('🚀 Iniciando carregamento dos scripts...');
console.log('📊 Arquivos encontrados: {len(encontrados)}');
console.log('📊 Arquivos não encontrados: {len(nao_encontrados)}');
{todos_scripts}
console.log('✅ Todos os scripts processados!');
</script>
"""
        
        html_content = html_content.replace('</body>', f'{script_completo}</body>')
        
        # Injetar o HTML
        html(html_content, height=1000, scrolling=True)
        
        # Atualizar status
        if len(encontrados) > 0:
            status_placeholder.success(f"✅ {len(encontrados)} arquivos carregados, {len(nao_encontrados)} não encontrados")
        else:
            status_placeholder.error("❌ Nenhum arquivo JS encontrado!")
        
        # Mostrar na sidebar
        with st.sidebar:
            if encontrados:
                st.success(f"✅ Encontrados: {', '.join(encontrados)}")
            if nao_encontrados:
                st.error(f"❌ Não encontrados: {', '.join(nao_encontrados)}")
    else:
        status_placeholder.error("❌ Falha ao carregar")
