import streamlit as st
import requests
from streamlit.components.v1 import html
import time

st.set_page_config(
    page_title="RIMSO Piracicaba",
    page_icon="👕",
    layout="wide",
    initial_sidebar_state="collapsed"
)

GITHUB_HTML_URL = "https://raw.githubusercontent.com/pedrohenriquemarques720-stack/Rimso/refs/heads/main/index.html"

def carregar_html():
    try:
        response = requests.get(f"{GITHUB_HTML_URL}?t={int(time.time())}", timeout=10)
        if response.status_code == 200:
            return response.text
        return None
    except:
        return None

st.markdown("""
<style>
    .main .block-container { padding: 0 !important; max-width: 100% !important; }
    iframe { width: 100%; border: none; min-height: 100vh; }
    .stApp { padding: 0 !important; }
</style>
""", unsafe_allow_html=True)

with st.spinner("🔄 Carregando RIMSO..."):
    html_content = carregar_html()
    
    if html_content:
        # Script ÚNICO e SIMPLES para adicionar os botões
        script_final = """
<script>
// ===== INTERFACE RIMSO =====
console.log('🚀 Iniciando...');

function adicionarBotoes() {
    const cards = document.querySelectorAll('.loja-card');
    console.log(`📦 Encontradas ${cards.length} lojas`);
    
    cards.forEach((card, i) => {
        if (card.querySelector('.btn-rimso')) return;
        
        // Container dos botões
        const div = document.createElement('div');
        div.className = 'btn-rimso';
        div.style.cssText = 'display:flex; gap:10px; margin-top:10px;';
        
        // Botão Avaliar
        const btn1 = document.createElement('button');
        btn1.innerHTML = '⭐ Avaliar';
        btn1.style.cssText = 'background:#FFCE00; color:#000; border:none; padding:8px; border-radius:20px; flex:1; cursor:pointer;';
        btn1.onclick = () => alert(`Avaliar loja ${i+1}`);
        
        // Botão Compartilhar
        const btn2 = document.createElement('button');
        btn2.innerHTML = '📤';
        btn2.style.cssText = 'background:#FFCE00; color:#000; border:none; width:40px; border-radius:20px; cursor:pointer;';
        btn2.onclick = () => {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado!');
        };
        
        div.appendChild(btn1);
        div.appendChild(btn2);
        card.appendChild(div);
    });
}

// Executar várias vezes para garantir
setTimeout(adicionarBotoes, 1000);
setTimeout(adicionarBotoes, 2000);
setTimeout(adicionarBotoes, 3000);

// Observar mudanças
new MutationObserver(adicionarBotoes).observe(document.body, {
    childList: true,
    subtree: true
});

console.log('✅ Pronto!');
</script>
"""
        
        # Injetar o script
        html_content = html_content.replace('</body>', f'{script_final}</body>')
        
        # Mostrar
        html(html_content, height=1000, scrolling=True)
        st.sidebar.success("✅ RIMSO funcionando!")
        st.sidebar.info("👉 Clique em 'Modo Cliente' para ver os botões")
    else:
        st.error("❌ Erro ao carregar")
