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
        return response.text if response.status_code == 200 else None
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
        # Adicionar script da interface
        interface_script = """
<script src="static/interface.js"></script>
"""
        html_content = html_content.replace('</head>', f'{interface_script}</head>')
        
        html(html_content, height=1000, scrolling=True)
        st.sidebar.success("✅ RIMSO funcionando!")
    else:
        st.error("❌ Erro ao carregar")
