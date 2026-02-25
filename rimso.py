import streamlit as st
from streamlit.components.v1 import html
import time

st.set_page_config(
    page_title="RIMSO - Moda em Piracicaba",
    page_icon="👕",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# CSS para remover padding do Streamlit
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

# Sidebar simples
with st.sidebar:
    st.markdown("""
    <div style="text-align: center; padding: 20px 0;">
        <div style="font-size: 48px;">👕</div>
        <div style="font-size: 24px; font-weight: 800;">RIM<span style="color: #FF6B35;">SO</span></div>
        <div style="color: #6B7280; font-size: 12px;">Moda em Piracicaba</div>
    </div>
    """, unsafe_allow_html=True)
    
    if st.button("🔄 Recarregar", use_container_width=True):
        st.cache_data.clear()
        st.rerun()
    
    st.divider()
    st.caption("Versão 2.0 - Site Completo")

# Carregar o HTML local
try:
    with open('index.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Adicionar timestamp para evitar cache
    html_content = html_content.replace('</head>', f'<meta http-equiv="refresh" content="0"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>')
    
    # Mostrar o HTML
    html(html_content, height=1000, scrolling=True)
    st.sidebar.success("✅ RIMSO funcionando!")
    
except FileNotFoundError:
    st.error("❌ Arquivo index.html não encontrado!")
    st.info("Certifique-se de que o arquivo 'index.html' está na mesma pasta que este script.")
