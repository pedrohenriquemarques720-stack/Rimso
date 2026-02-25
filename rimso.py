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

st.markdown("""
<style>
    .main .block-container { padding: 0 !important; max-width: 100% !important; }
    iframe { width: 100%; border: none; min-height: 100vh; }
    .stApp { padding: 0 !important; }
</style>
""", unsafe_allow_html=True)

with st.spinner("🔄 Carregando RIMSO..."):
    try:
        response = requests.get(f"{GITHUB_HTML_URL}?t={int(time.time())}", timeout=10)
        html_content = response.text if response.status_code == 200 else None
        
        if html_content:
            # Adicionar script que cria os botões
            script_direto = """
<script>
// ===== INTERFACE RIMSO =====
console.log('🚀 Inicializando interface...');

// Função para adicionar botões quando a página carregar
function inicializar() {
    console.log('📦 DOM carregado');
    
    // Adicionar botões de avaliação
    const lojaCards = document.querySelectorAll('.loja-card');
    lojaCards.forEach((card, index) => {
        // Botão avaliar
        const btnAvaliar = document.createElement('button');
        btnAvaliar.innerHTML = '⭐ Avaliar';
        btnAvaliar.style.cssText = 'background: #FFCE00; color: black; border: none; padding: 5px 10px; border-radius: 20px; margin-top: 10px; cursor: pointer; width: 100%;';
        btnAvaliar.onclick = () => alert('Avaliar loja ' + (index + 1));
        card.appendChild(btnAvaliar);
        
        // Botão compartilhar
        const btnCompartilhar = document.createElement('button');
        btnCompartilhar.innerHTML = '📤';
        btnCompartilhar.style.cssText = 'position: absolute; top: 10px; right: 45px; background: #FFCE00; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer;';
        btnCompartilhar.onclick = () => navigator.clipboard.writeText(window.location.href);
        card.style.position = 'relative';
        card.appendChild(btnCompartilhar);
    });
    
    console.log('✅ Interface inicializada!');
}

document.addEventListener('DOMContentLoaded', inicializar);
</script>
"""
            html_content = html_content.replace('</body>', f'{script_direto}</body>')
            
            html(html_content, height=1000, scrolling=True)
            st.sidebar.success("✅ RIMSO funcionando!")
        else:
            st.error("❌ Erro ao carregar HTML")
    except Exception as e:
        st.error(f"❌ Erro: {e}")
