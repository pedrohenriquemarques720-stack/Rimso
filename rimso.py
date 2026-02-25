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

URL = "https://raw.githubusercontent.com/pedrohenriquemarques720-stack/Rimso/refs/heads/main/index.html"

st.markdown("""
<style>
    .main .block-container { padding: 0 !important; max-width: 100% !important; }
    iframe { width: 100%; border: none; min-height: 100vh; }
</style>
""", unsafe_allow_html=True)

with st.spinner("🔄 Carregando..."):
    try:
        r = requests.get(f"{URL}?t={int(time.time())}", timeout=10)
        html_content = r.text if r.status_code == 200 else None
        
        if html_content:
            # Remover tags que causam erro
            import re
            html_content = re.sub(r'<script\s+src="[^"]*\.js"[^>]*>.*?</script>', '', html_content, flags=re.DOTALL)
            
            # Adicionar script que CRIA os botões
            script = """
<script>
// ===== CRIAR BOTÕES =====
setTimeout(function() {
    const cards = document.querySelectorAll('.loja-card');
    console.log('📍 Encontradas ' + cards.length + ' lojas');
    
    cards.forEach((card, i) => {
        // Não duplicar
        if (card.querySelector('.btn-novo')) return;
        
        // Container
        const div = document.createElement('div');
        div.className = 'btn-novo';
        div.style.cssText = 'display:flex; gap:10px; margin-top:10px;';
        
        // Botão Avaliar
        const btn1 = document.createElement('button');
        btn1.innerHTML = '⭐ Avaliar';
        btn1.style.cssText = 'background:#FFCE00; color:black; border:none; padding:8px; border-radius:20px; flex:1; cursor:pointer;';
        btn1.onclick = () => alert('Avaliar loja');
        
        // Botão Compartilhar
        const btn2 = document.createElement('button');
        btn2.innerHTML = '📤';
        btn2.style.cssText = 'background:#FFCE00; color:black; border:none; width:40px; border-radius:20px; cursor:pointer;';
        btn2.onclick = () => {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado!');
        };
        
        div.appendChild(btn1);
        div.appendChild(btn2);
        card.appendChild(div);
    });
}, 1500);
</script>
"""
            
            html_content = html_content.replace('</body>', script + '</body>')
            html(html_content, height=1000, scrolling=True)
            st.sidebar.success("✅ Funcionando!")
        else:
            st.error("❌ Erro")
    except Exception as e:
        st.error(f"❌ {e}")
