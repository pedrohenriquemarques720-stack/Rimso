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

# LER O ARQUIVO JS ÚNICO
def ler_js():
    try:
        with open('tudo.js', 'r', encoding='utf-8') as f:
            return f.read()
    except:
        return "console.log('Arquivo JS não encontrado');"

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
            # Ler o JS
            js_content = ler_js()
            
            # Remover tags src antigas
            import re
            html_content = re.sub(r'<script\s+src="[^"]*\.js"[^>]*>\s*</script>', '', html_content)
            
            # Injetar o JS único
            html_content = html_content.replace('</body>', f'<script>{js_content}</script></body>')
            
            html(html_content, height=1000, scrolling=True)
            st.sidebar.success("✅ RIMSO funcionando!")
        else:
            st.error("❌ Erro ao carregar HTML")
    except Exception as e:
        st.error(f"❌ Erro: {e}")
