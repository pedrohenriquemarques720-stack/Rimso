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

# ==================== LISTA DOS ARQUIVOS JS ====================
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
    
    caminhos_possiveis = [
        f"static/{nome_arquivo}",
        f"./static/{nome_arquivo}",
        f"/mount/src/rimso/static/{nome_arquivo}",
    ]
    
    for caminho in caminhos_possiveis:
        if os.path.exists(caminho):
            try:
                with open(caminho, 'r', encoding='utf-8') as f:
                    return f.read(), caminho
            except:
                pass
    return None, None

# ==================== CARREGAR TODOS OS SCRIPTS COM PROTEÇÃO ====================
def carregar_todos_scripts():
    """Carrega todos os arquivos JS e adiciona proteção contra erros"""
    
    scripts = []
    todos_conteudos = []
    
    for arquivo in ARQUIVOS_JS:
        conteudo, caminho = ler_arquivo_js(arquivo)
        
        if conteudo:
            # Adicionar proteção para evitar declarações duplicadas
            if 'avaliacoes' in arquivo:
                conteudo = re.sub(r'(let|const|var)\s+avaliacoes\s*=', '// REMOVIDO: variável avaliacoes já declarada', conteudo)
            
            script_bloco = f"""
// ========== {arquivo} ==========
console.log('✅ Carregando: {arquivo}');
try {{
{conteudo}
}} catch(e) {{
    console.warn('⚠️ Erro em {arquivo}:', e.message);
}}
console.log('✅ {arquivo} processado');
"""
            scripts.append(script_bloco)
            todos_conteudos.append(arquivo)
    
    return "\n\n".join(scripts), todos_conteudos

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
            st.error(f"Erro {response.status_code}")
            return None
    except Exception as e:
        st.error(f"Erro: {e}")
        return None

# ==================== CSS ====================
st.markdown("""
<style>
    .main .block-container { padding: 0 !important; max-width: 100% !important; }
    #MainMenu, footer, header { display: none; }
    iframe { width: 100%; border: none; min-height: 100vh; }
    .stApp { padding: 0 !important; }
</style>
""", unsafe_allow_html=True)

# ==================== SIDEBAR ====================
with st.sidebar:
    st.markdown("""
    <div style="text-align: center; padding: 20px 0;">
        <div style="font-size: 48px;">👕</div>
        <div style="font-size: 24px; font-weight: 800;">RIM<span style="color: #DD0000;">SO</span></div>
    </div>
    """, unsafe_allow_html=True)
    
    status_placeholder = st.empty()
    
    if st.button("🔄 Recarregar", use_container_width=True):
        st.cache_data.clear()
        st.rerun()

# ==================== ÁREA PRINCIPAL ====================
status_placeholder.info("⏳ Carregando RIMSO...")

with st.spinner("🔄 Carregando..."):
    html_content = carregar_html_github()
    
    if html_content:
        # Carregar scripts
        todos_scripts, encontrados = carregar_todos_scripts()
        
        # Remover tags script do HTML
        html_content = re.sub(r'<script\s+src="[^"]*\.js"[^>]*>.*?</script>', '', html_content, flags=re.DOTALL)
        
        # Script de inicialização com proteções
        script_inicializacao = """
<script>
// ===== SISTEMA DE INICIALIZAÇÃO RIMSO =====
console.log('🚀 Inicializando RIMSO...');

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('📦 DOM carregado, iniciando módulos...');
    
    setTimeout(() => {
        try {
            // Inicializar cada módulo com proteção
            if (typeof inicializarAvaliacoes === 'function') {
                inicializarAvaliacoes();
                console.log('✅ Avaliações OK');
            }
            
            if (typeof inicializarFeed === 'function') {
                inicializarFeed();
                console.log('✅ Feed OK');
            }
            
            if (typeof inicializarFavoritos === 'function') {
                inicializarFavoritos();
                console.log('✅ Favoritos OK');
            }
            
            if (typeof inicializarNotificacoes === 'function') {
                inicializarNotificacoes();
                console.log('✅ Notificações OK');
            }
            
            console.log('🎉 RIMSO inicializado com sucesso!');
        } catch(e) {
            console.warn('⚠️ Erro na inicialização:', e);
        }
    }, 500);
});
</script>
"""
        
        # Injetar scripts
        html_content = html_content.replace('</head>', f'{script_inicializacao}</head>')
        html_content = html_content.replace('</body>', f'<script>{todos_scripts}</script></body>')
        
        # Mostrar resultado
        html(html_content, height=1000, scrolling=True)
        
        status_placeholder.success(f"✅ {len(encontrados)} arquivos carregados")
    else:
        status_placeholder.error("❌ Falha ao carregar")
