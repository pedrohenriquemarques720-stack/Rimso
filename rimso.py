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

# ==================== CARREGAR TODOS OS SCRIPTS ====================
def carregar_todos_scripts():
    """Carrega todos os arquivos JS"""
    
    scripts = []
    todos_conteudos = []
    
    for arquivo in ARQUIVOS_JS:
        conteudo, caminho = ler_arquivo_js(arquivo)
        
        if conteudo:
            script_bloco = f"""
// ========== {arquivo} ==========
console.log('✅ Carregando: {arquivo}');
{conteudo}
console.log('✅ {arquivo} carregado');
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
        
        # Remover tags script do HTML original (para não duplicar)
        html_content = re.sub(r'<script\s+src="[^"]*\.js"[^>]*>.*?</script>', '', html_content, flags=re.DOTALL)
        
        # ===== SCRIPT DE INICIALIZAÇÃO QUE REALMENTE CHAMA AS FUNÇÕES =====
        script_inicializacao = """
<script>
// ===== INICIALIZAÇÃO DAS FUNÇÕES =====
console.log('🚀 Inicializando módulos do RIMSO...');

function inicializarTodosModulos() {
    console.log('📦 Iniciando criação dos elementos na interface...');
    
    // Aguardar um pouco para o DOM estar pronto
    setTimeout(() => {
        try {
            // ===== 1. CRIAR MODAIS =====
            if (typeof criarModalAvaliacao === 'function') {
                criarModalAvaliacao();
                console.log('✅ Modal de avaliação criado');
            }
            
            if (typeof criarModalListas === 'function') {
                criarModalListas();
                console.log('✅ Modal de listas criado');
            }
            
            if (typeof criarPainelNotificacoes === 'function') {
                criarPainelNotificacoes();
                console.log('✅ Painel de notificações criado');
            }
            
            if (typeof criarModalPromocao === 'function') {
                criarModalPromocao();
                console.log('✅ Modal de promoções criado');
            }
            
            // ===== 2. ADICIONAR ELEMENTOS NA INTERFACE =====
            if (typeof adicionarBotoesAvaliacao === 'function') {
                adicionarBotoesAvaliacao();
                console.log('✅ Botões de avaliação adicionados');
            }
            
            if (typeof adicionarBotaoCompartilhar === 'function') {
                adicionarBotaoCompartilhar();
                console.log('✅ Botões de compartilhar adicionados');
            }
            
            if (typeof modificarBotoesFavorito === 'function') {
                modificarBotoesFavorito();
                console.log('✅ Botões de favorito modificados');
            }
            
            if (typeof adicionarItemMenuFeed === 'function') {
                adicionarItemMenuFeed();
                console.log('✅ Item Feed adicionado ao menu');
            }
            
            if (typeof adicionarBotaoPromocoes === 'function') {
                adicionarBotaoPromocoes();
                console.log('✅ Botão de promoções adicionado');
            }
            
            // ===== 3. INICIALIZAR DADOS =====
            if (typeof criarFeedInicial === 'function') {
                criarFeedInicial();
                console.log('✅ Feed inicializado');
            }
            
            console.log('🎉 TODOS os módulos foram inicializados com sucesso!');
            
        } catch(e) {
            console.warn('⚠️ Erro durante inicialização:', e);
        }
    }, 1000); // Aguardar 1 segundo para o DOM estar pronto
}

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM carregado, iniciando módulos...');
    inicializarTodosModulos();
});

// Também tentar quando o iframe estiver pronto
window.onload = function() {
    console.log('🖼️ Janela carregada, verificando módulos...');
    inicializarTodosModulos();
};
</script>
"""
        
        # Injetar scripts no HTML
        html_content = html_content.replace('</head>', f'{script_inicializacao}</head>')
        html_content = html_content.replace('</body>', f'<script>{todos_scripts}</script></body>')
        
        # Injetar o HTML modificado
        html(html_content, height=1000, scrolling=True)
        
        status_placeholder.success(f"✅ {len(encontrados)} arquivos carregados e funções inicializadas!")
        
        # Mostrar quais arquivos foram encontrados
        with st.sidebar:
            st.success(f"✅ Arquivos carregados: {', '.join(encontrados)}")
    else:
        status_placeholder.error("❌ Falha ao carregar")
