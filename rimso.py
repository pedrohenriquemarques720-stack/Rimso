import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime
import random

# Configuração da página
st.set_page_config(
    page_title="RIMSO - Marketplace Regional",
    page_icon="👕",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Estilos CSS personalizados
st.markdown("""
<style>
    /* Cores da bandeira da Alemanha */
    :root {
        --black: #000000;
        --red: #DD0000;
        --gold: #FFCE00;
    }
    
    /* Cards */
    .stat-card {
        background: white;
        border-radius: 24px;
        padding: 25px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.02);
        border: 2px solid #E5E7EB;
        transition: transform 0.2s;
        position: relative;
        overflow: hidden;
        margin-bottom: 20px;
    }
    
    .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(145deg, #DD0000, #FFCE00);
    }
    
    .stat-card:hover {
        transform: translateY(-5px);
        border-color: #FFCE00;
        box-shadow: 0 15px 30px rgba(221, 0, 0, 0.1);
    }
    
    .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 16px;
        background: linear-gradient(145deg, #DD0000, #FFCE00);
        display: flex;
        align-items: center;
        justify-content: center;
        color: black;
        font-size: 24px;
        margin-bottom: 15px;
    }
    
    .stat-value {
        font-size: 32px;
        font-weight: 800;
        color: #1A1A1A;
        margin-bottom: 5px;
    }
    
    .stat-label {
        color: #6B7280;
        font-size: 14px;
    }
    
    /* Tabelas */
    .dataframe {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 24px;
        overflow: hidden;
        border: 2px solid #E5E7EB;
    }
    
    .dataframe th {
        background: linear-gradient(145deg, #DD0000, #FFCE00);
        color: black;
        padding: 15px;
        text-align: left;
        font-weight: 600;
    }
    
    .dataframe td {
        padding: 15px;
        border-bottom: 1px solid #E5E7EB;
        color: #1A1A1A;
    }
    
    .dataframe tr:hover {
        background: #F9FAFB;
    }
    
    /* Badges */
    .status-badge {
        padding: 6px 12px;
        border-radius: 60px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
    }
    
    .status-active {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
    }
    
    .status-pending {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
    }
    
    .status-inactive {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
    }
    
    /* Cards de plano */
    .plan-card {
        background: white;
        border-radius: 24px;
        padding: 30px;
        border: 2px solid #E5E7EB;
        position: relative;
        transition: all 0.3s;
        height: 100%;
    }
    
    .plan-card:hover {
        border-color: #FFCE00;
        transform: translateY(-5px);
    }
    
    .plan-card.popular {
        border: 3px solid #FFCE00;
        transform: scale(1.02);
        box-shadow: 0 20px 40px rgba(221, 0, 0, 0.2);
        z-index: 2;
    }
    
    .plan-badge {
        position: absolute;
        top: -12px;
        right: 20px;
        background: linear-gradient(145deg, #DD0000, #FFCE00);
        color: black;
        padding: 6px 16px;
        border-radius: 60px;
        font-size: 12px;
        font-weight: 700;
        border: 2px solid #FFCE00;
    }
    
    .plan-name {
        font-size: 24px;
        font-weight: 800;
        margin-bottom: 15px;
        color: #1A1A1A;
    }
    
    .plan-price {
        font-size: 48px;
        font-weight: 800;
        color: #DD0000;
        margin-bottom: 20px;
    }
    
    .plan-price span {
        font-size: 16px;
        color: #6B7280;
        font-weight: 400;
    }
    
    .plan-features {
        list-style: none;
        margin-bottom: 30px;
        padding: 0;
    }
    
    .plan-features li {
        padding: 10px 0;
        color: #6B7280;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .plan-features i {
        color: #10b981;
    }
    
    .plan-btn {
        width: 100%;
        padding: 16px;
        border-radius: 60px;
        border: 2px solid #DD0000;
        background: transparent;
        color: #DD0000;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        text-align: center;
    }
    
    .plan-btn:hover {
        background: #DD0000;
        color: white;
        border-color: #DD0000;
    }
    
    /* Product cards */
    .product-card {
        background: white;
        border-radius: 20px;
        overflow: hidden;
        border: 2px solid #E5E7EB;
        transition: all 0.3s;
        margin-bottom: 20px;
    }
    
    .product-card:hover {
        border-color: #FFCE00;
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(221, 0, 0, 0.1);
    }
    
    .product-image {
        height: 150px;
        background: linear-gradient(145deg, rgba(221, 0, 0, 0.1), rgba(255, 206, 0, 0.1));
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
    }
    
    .product-info {
        padding: 20px;
    }
    
    .product-name {
        font-weight: 700;
        margin-bottom: 8px;
        color: #1A1A1A;
    }
    
    .product-price {
        font-size: 20px;
        font-weight: 800;
        color: #DD0000;
        margin-bottom: 5px;
    }
    
    .product-store {
        color: #6B7280;
        font-size: 13px;
    }
    
    /* Botões */
    .btn-primary {
        background: linear-gradient(145deg, #DD0000, #FFCE00);
        color: black;
        border: none;
        padding: 12px 24px;
        border-radius: 60px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(221, 0, 0, 0.3);
    }
    
    .btn-outline {
        background: transparent;
        border: 2px solid #DD0000;
        color: #DD0000;
        padding: 12px 24px;
        border-radius: 60px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .btn-outline:hover {
        background: #DD0000;
        color: white;
    }
    
    /* Métricas */
    .metric-card {
        background: white;
        border-radius: 16px;
        padding: 20px;
        border: 2px solid #E5E7EB;
        margin-bottom: 15px;
    }
    
    .metric-value {
        font-size: 28px;
        font-weight: 800;
        color: #DD0000;
        margin-top: 10px;
    }
    
    /* Loading */
    .stSpinner > div {
        border-color: #DD0000 !important;
    }
</style>
""", unsafe_allow_html=True)

# Inicialização do estado da sessão
if 'secao_atual' not in st.session_state:
    st.session_state.secao_atual = 'dashboard'
if 'notificacoes' not in st.session_state:
    st.session_state.notificacoes = 3

# Dados simulados
@st.cache_data
def carregar_dados():
    # Dados de lojas
    lojas = pd.DataFrame({
        'ID': ['#001', '#002', '#003', '#004'],
        'Loja': ['StreetWearBR', 'Urban Style', 'Fashion Hub', 'Moda & Cia'],
        'Proprietário': ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira'],
        'Cidade': ['São Paulo', 'São Paulo', 'Rio de Janeiro', 'Belo Horizonte'],
        'Bairro': ['Pinheiros', 'Vila Madalena', 'Ipanema', 'Savassi'],
        'Plano': ['Premium', 'Profissional', 'Básico', 'Profissional'],
        'Status': ['Ativo', 'Ativo', 'Pendente', 'Ativo'],
        'Produtos': [47, 32, 15, 28],
        'Receita': [12450, 8320, 3890, 6750]
    })
    
    # Dados de produtos
    produtos = pd.DataFrame({
        'Produto': ['Camiseta Oversized', 'Calça Cargo', 'Jaqueta Jeans', 'Boné Snapback', 'Vestido Floral', 'Tênis Casual'],
        'Preço': [89.90, 159.90, 199.90, 59.90, 129.90, 189.90],
        'Loja': ['StreetWearBR', 'Urban Style', 'Fashion Hub', 'StreetWearBR', 'Moda & Cia', 'Urban Style'],
        'Status': ['Em estoque', 'Em estoque', 'Últimas peças', 'Em estoque', 'Em estoque', 'Em estoque']
    })
    
    # Dados de clientes
    clientes = pd.DataFrame({
        'Cliente': ['Ana Maria Silva', 'João Pedro Santos', 'Maria Oliveira', 'Carlos Souza'],
        'Email': ['ana.silva@email.com', 'joao.santos@email.com', 'maria.o@email.com', 'carlos@email.com'],
        'Cidade': ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba'],
        'Última visita': ['Hoje 10:30', 'Ontem 15:45', '20/02/2026', '18/02/2026'],
        'Favoritos': [8, 5, 12, 3],
        'Avaliações': [12, 8, 23, 2],
        'Status': ['Ativo', 'Ativo', 'Ativo', 'Inativo']
    })
    
    return lojas, produtos, clientes

lojas_df, produtos_df, clientes_df = carregar_dados()

# Sidebar
with st.sidebar:
    # Logo
    st.markdown("""
    <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #FFCE00; margin-bottom: 30px;">
        <div style="font-size: 48px; margin-bottom: 10px;">👕</div>
        <div style="font-size: 32px; font-weight: 800; color: #1A1A1A;">
            RIM<span style="color: #DD0000;">SO</span>
        </div>
        <div style="color: #6B7280; font-size: 12px; margin-top: 5px;">
            Conectando sua loja ao seu bairro
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Menu
    menu_options = {
        'dashboard': '📊 Dashboard',
        'lojas': '🏬 Lojas',
        'produtos': '👕 Produtos',
        'assinaturas': '💳 Assinaturas',
        'clientes': '👥 Clientes',
        'analytics': '📈 Analytics',
        'relatorios': '📋 Relatórios',
        'configuracoes': '⚙️ Configurações'
    }
    
    for key, label in menu_options.items():
        if st.sidebar.button(label, key=f"menu_{key}", use_container_width=True):
            st.session_state.secao_atual = key
    
    # Informações do usuário
    st.sidebar.markdown("---")
    st.sidebar.markdown("""
    <div style="background: #F9FAFB; border-radius: 20px; padding: 20px; margin-top: 20px;">
        <div style="display: flex; align-items: center; gap: 15px;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(145deg, #DD0000, #FFCE00); display: flex; align-items: center; justify-content: center; color: black; font-weight: 700;">JD</div>
            <div>
                <h4 style="margin: 0;">João Dono</h4>
                <span style="color: #6B7280; font-size: 12px;">StreetWearBR · Premium</span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# Top Bar
col1, col2 = st.columns([2, 1])
with col1:
    st.markdown(f"""
    <div style="margin-bottom: 20px;">
        <h1 style="font-size: 24px; color: #1A1A1A;">{menu_options[st.session_state.secao_atual]}</h1>
        <p style="color: #DD0000; font-size: 14px;">visão geral do marketplace</p>
    </div>
    """, unsafe_allow_html=True)

with col2:
    col_search, col_notif = st.columns([3, 1])
    with col_search:
        busca = st.text_input("🔍", placeholder="Buscar...", label_visibility="collapsed")
    with col_notif:
        if st.button(f"🔔 {st.session_state.notificacoes}", use_container_width=True):
            st.session_state.notificacoes = 0
            st.success("Notificações lidas!")

# Conteúdo principal baseado na seção
if st.session_state.secao_atual == 'dashboard':
    # Stats Cards
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown("""
        <div class="stat-card">
            <div class="stat-icon">🏬</div>
            <div class="stat-value">156</div>
            <div class="stat-label">Lojas ativas</div>
            <div style="color: #DD0000; font-size: 14px; margin-top: 10px;">+12%</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="stat-card">
            <div class="stat-icon">👕</div>
            <div class="stat-value">3.247</div>
            <div class="stat-label">Produtos</div>
            <div style="color: #DD0000; font-size: 14px; margin-top: 10px;">+23%</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-value">8.723</div>
            <div class="stat-label">Clientes</div>
            <div style="color: #DD0000; font-size: 14px; margin-top: 10px;">+8%</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown("""
        <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-value">R$ 84.3k</div>
            <div class="stat-label">Receita mensal</div>
            <div style="color: #DD0000; font-size: 14px; margin-top: 10px;">+32%</div>
        </div>
        """, unsafe_allow_html=True)
    
    # Gráficos
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div style="background: white; border-radius: 24px; padding: 25px; border: 2px solid #E5E7EB; margin-bottom: 20px;">
            <h3 style="margin-bottom: 20px;">Crescimento de Lojas</h3>
        </div>
        """, unsafe_allow_html=True)
        
        # Dados para o gráfico
        semanas = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5', 'Semana 6']
        novas_lojas = [12, 19, 15, 22, 28, 32]
        
        chart_data = pd.DataFrame({
            'semanas': semanas,
            'novas_lojas': novas_lojas
        })
        
        st.line_chart(chart_data.set_index('semanas'), color='#DD0000')
    
    with col2:
        st.markdown("""
        <div style="background: white; border-radius: 24px; padding: 25px; border: 2px solid #E5E7EB; margin-bottom: 20px;">
            <h3 style="margin-bottom: 20px;">Distribuição de Planos</h3>
        </div>
        """, unsafe_allow_html=True)
        
        # Dados para o gráfico de pizza
        planos = pd.DataFrame({
            'Plano': ['Básico', 'Profissional', 'Premium'],
            'Quantidade': [65, 45, 25]
        })
        
        st.bar_chart(planos.set_index('Plano'), color='#DD0000')
    
    # Últimas lojas
    st.markdown("""
    <div style="background: white; border-radius: 24px; padding: 25px; border: 2px solid #E5E7EB; margin-bottom: 20px;">
        <h3 style="margin-bottom: 20px;">Últimas lojas cadastradas</h3>
    </div>
    """, unsafe_allow_html=True)
    
    st.dataframe(
        lojas_df[['Loja', 'Cidade', 'Bairro', 'Plano', 'Status']].head(3),
        use_container_width=True,
        hide_index=True
    )
    
    # Produtos em destaque
    st.markdown("""
    <div style="background: white; border-radius: 24px; padding: 25px; border: 2px solid #E5E7EB; margin-top: 20px;">
        <h3 style="margin-bottom: 20px;">Produtos mais visualizados</h3>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown("""
        <div class="product-card">
            <div class="product-image">👕</div>
            <div class="product-info">
                <div class="product-name">Camiseta Oversized</div>
                <div class="product-price">R$ 89,90</div>
                <div class="product-store">StreetWearBR</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="product-card">
            <div class="product-image">👖</div>
            <div class="product-info">
                <div class="product-name">Calça Cargo</div>
                <div class="product-price">R$ 159,90</div>
                <div class="product-store">Urban Style</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class="product-card">
            <div class="product-image">🧥</div>
            <div class="product-info">
                <div class="product-name">Jaqueta Jeans</div>
                <div class="product-price">R$ 199,90</div>
                <div class="product-store">Fashion Hub</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown("""
        <div class="product-card">
            <div class="product-image">🧢</div>
            <div class="product-info">
                <div class="product-name">Boné Snapback</div>
                <div class="product-price">R$ 59,90</div>
                <div class="product-store">StreetWearBR</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

elif st.session_state.secao_atual == 'lojas':
    st.markdown("""
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Todas as Lojas</h2>
    </div>
    """, unsafe_allow_html=True)
    
    # Filtros
    col1, col2, col3 = st.columns(3)
    with col1:
        cidade_filtro = st.selectbox("Cidade", ["Todas", "São Paulo", "Rio de Janeiro", "Belo Horizonte"])
    with col2:
        status_filtro = st.selectbox("Status", ["Todos", "Ativo", "Pendente", "Inativo"])
    with col3:
        plano_filtro = st.selectbox("Plano", ["Todos", "Básico", "Profissional", "Premium"])
    
    # Tabela
    st.dataframe(
        lojas_df,
        use_container_width=True,
        hide_index=True,
        column_config={
            "Status": st.column_config.Column(
                "Status",
                help="Status da loja",
                width="small"
            )
        }
    )
    
    # Botão de ação
    if st.button("➕ Nova Loja", type="primary"):
        st.info("Formulário de cadastro de loja em desenvolvimento!")

elif st.session_state.secao_atual == 'produtos':
    st.markdown("""
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Catálogo de Produtos</h2>
    </div>
    """, unsafe_allow_html=True)
    
    # Filtros
    col1, col2 = st.columns(2)
    with col1:
        loja_filtro = st.selectbox("Loja", ["Todas"] + list(produtos_df['Loja'].unique()))
    with col2:
        status_filtro = st.selectbox("Status do produto", ["Todos", "Em estoque", "Últimas peças"])
    
    # Grid de produtos
    cols = st.columns(3)
    for idx, row in produtos_df.iterrows():
        with cols[idx % 3]:
            status_color = "#10b981" if row['Status'] == "Em estoque" else "#f59e0b"
            st.markdown(f"""
            <div class="product-card">
                <div class="product-image">{['👕','👖','🧥','🧢','👗','👟'][idx]}</div>
                <div class="product-info">
                    <div class="product-name">{row['Produto']}</div>
                    <div class="product-price">R$ {row['Preço']:.2f}</div>
                    <div class="product-store">{row['Loja']}</div>
                    <div style="margin-top: 10px;">
                        <span class="status-badge" style="background: {status_color}20; color: {status_color};">{row['Status']}</span>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)

elif st.session_state.secao_atual == 'assinaturas':
    st.markdown("<h2>Planos de Assinatura</h2>", unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        <div class="plan-card">
            <div class="plan-name">Básico</div>
            <div class="plan-price">R$49 <span>/mês</span></div>
            <ul class="plan-features">
                <li>✅ Até 50 produtos</li>
                <li>✅ Fotos ilimitadas</li>
                <li>✅ Suporte por email</li>
                <li>✅ Estatísticas básicas</li>
                <li>✅ 1 cidade</li>
            </ul>
            <div class="plan-btn">Assinar agora</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="plan-card popular">
            <div class="plan-badge">Mais escolhido</div>
            <div class="plan-name">Profissional</div>
            <div class="plan-price">R$89 <span>/mês</span></div>
            <ul class="plan-features">
                <li>✅ Até 200 produtos</li>
                <li>✅ Fotos ilimitadas</li>
                <li>✅ Suporte prioritário</li>
                <li>✅ Estatísticas avançadas</li>
                <li>✅ Até 3 cidades</li>
                <li>✅ Destaque na busca</li>
            </ul>
            <div class="plan-btn">Assinar agora</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class="plan-card">
            <div class="plan-name">Premium</div>
            <div class="plan-price">R$149 <span>/mês</span></div>
            <ul class="plan-features">
                <li>✅ Produtos ilimitados</li>
                <li>✅ Fotos ilimitadas</li>
                <li>✅ Suporte 24/7</li>
                <li>✅ Relatórios em tempo real</li>
                <li>✅ Cidades ilimitadas</li>
                <li>✅ Destaque máximo</li>
                <li>✅ API exclusiva</li>
            </ul>
            <div class="plan-btn">Assinar agora</div>
        </div>
        """, unsafe_allow_html=True)
    
    # Histórico de assinaturas
    st.markdown("<h3 style='margin-top: 40px;'>Histórico de Assinaturas</h3>", unsafe_allow_html=True)
    
    assinaturas = pd.DataFrame({
        'Loja': ['StreetWearBR', 'Urban Style', 'Fashion Hub'],
        'Plano': ['Premium', 'Profissional', 'Básico'],
        'Início': ['15/01/2026', '20/01/2026', '01/02/2026'],
        'Próxima cobrança': ['15/02/2026', '20/02/2026', '01/03/2026'],
        'Status': ['Ativo', 'Ativo', 'Ativo'],
        'Valor': ['R$ 149,00', 'R$ 89,00', 'R$ 49,00']
    })
    
    st.dataframe(assinaturas, use_container_width=True, hide_index=True)

elif st.session_state.secao_atual == 'clientes':
    st.markdown("<h2>Clientes</h2>", unsafe_allow_html=True)
    
    # Stats
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown("""
        <div class="metric-card">
            <div class="stat-label">Total de clientes</div>
            <div class="metric-value">8.723</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="metric-card">
            <div class="stat-label">Ativos este mês</div>
            <div class="metric-value">1.247</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class="metric-card">
            <div class="stat-label">Novos (7 dias)</div>
            <div class="metric-value">342</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown("""
        <div class="metric-card">
            <div class="stat-label">Avaliação média</div>
            <div class="metric-value">4.8</div>
        </div>
        """, unsafe_allow_html=True)
    
    # Tabela de clientes
    st.markdown("<h3 style='margin-top: 30px;'>Todos os Clientes</h3>", unsafe_allow_html=True)
    
    st.dataframe(
        clientes_df,
        use_container_width=True,
        hide_index=True,
        column_config={
            "Status": st.column_config.Column(
                "Status",
                help="Status do cliente",
                width="small"
            )
        }
    )

elif st.session_state.secao_atual == 'analytics':
    st.markdown("<h2>Analytics</h2>", unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="metric-card">
            <h4>Visualizações</h4>
            <div class="metric-value">45.678</div>
            <p>últimos 30 dias</p>
            <div style="background: #F9FAFB; height: 10px; border-radius: 10px; margin: 15px 0;">
                <div style="width: 75%; height: 100%; background: linear-gradient(145deg, #DD0000, #FFCE00); border-radius: 10px;"></div>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Meta: 60k</span>
                <span>75%</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="metric-card">
            <h4>Cliques</h4>
            <div class="metric-value">12.345</div>
            <p>taxa de clique: 27%</p>
            <div style="background: #F9FAFB; height: 10px; border-radius: 10px; margin: 15px 0;">
                <div style="width: 62%; height: 100%; background: linear-gradient(145deg, #DD0000, #FFCE00); border-radius: 10px;"></div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    # Gráficos
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("<h4>Tráfego por Horário</h4>", unsafe_allow_html=True)
        horas = ['0h', '3h', '6h', '9h', '12h', '15h', '18h', '21h']
        acessos = [120, 80, 150, 450, 890, 1200, 980, 560]
        
        df_trafego = pd.DataFrame({
            'hora': horas,
            'acessos': acessos
        })
        
        st.line_chart(df_trafego.set_index('hora'), color='#DD0000')
    
    with col2:
        st.markdown("<h4>Dispositivos</h4>", unsafe_allow_html=True)
        dispositivos = pd.DataFrame({
            'Dispositivo': ['Mobile', 'Desktop', 'Tablet'],
            'Acessos': [65, 25, 10]
        })
        
        st.bar_chart(dispositivos.set_index('Dispositivo'), color='#DD0000')

elif st.session_state.secao_atual == 'relatorios':
    st.markdown("<h2>Relatórios</h2>", unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    
    relatorios = [
        {"icon": "📊", "title": "Relatório de Vendas", "desc": "Análise completa de vendas por loja, produto e período", "time": "5min", "format": "PDF"},
        {"icon": "👥", "title": "Relatório de Clientes", "desc": "Comportamento, preferências e engajamento dos clientes", "time": "15min", "format": "Excel"},
        {"icon": "💰", "title": "Relatório Financeiro", "desc": "Receitas, assinaturas e projeções financeiras", "time": "1h", "format": "PDF"},
        {"icon": "👕", "title": "Relatório de Produtos", "desc": "Desempenho, estoque e tendências de produtos", "time": "30min", "format": "CSV"},
        {"icon": "📢", "title": "Relatório de Marketing", "desc": "Campanhas, conversões e ROI", "time": "2h", "format": "PDF"},
        {"icon": "⚡", "title": "Relatório de Performance", "desc": "Métricas de sistema e desempenho da plataforma", "time": "Tempo real", "format": "JSON"}
    ]
    
    for idx, rel in enumerate(relatorios):
        with [col1, col2, col3][idx % 3]:
            st.markdown(f"""
            <div class="product-card" style="padding: 25px;">
                <div style="font-size: 40px; color: #DD0000; margin-bottom: 15px;">{rel['icon']}</div>
                <h4>{rel['title']}</h4>
                <p style="color: #6B7280; font-size: 14px; margin: 10px 0;">{rel['desc']}</p>
                <div style="display: flex; justify-content: space-between; color: #6B7280; font-size: 12px; border-top: 1px solid #E5E7EB; padding-top: 15px;">
                    <span>🕐 {rel['time']}</span>
                    <span>📥 {rel['format']}</span>
                </div>
            </div>
            """, unsafe_allow_html=True)

elif st.session_state.secao_atual == 'configuracoes':
    st.markdown("<h2>Configurações</h2>", unsafe_allow_html=True)
    
    tab1, tab2, tab3, tab4 = st.tabs(["Geral", "Personalização", "Notificações", "Segurança"])
    
    with tab1:
        st.markdown("### Configurações Gerais")
        
        col1, col2 = st.columns(2)
        with col1:
            st.text_input("Nome da empresa", value="RIMSO Marketplace")
            st.text_input("Email de contato", value="contato@rimso.com")
            st.text_input("Telefone", value="(11) 99999-9999")
        
        with col2:
            st.selectbox("Moeda padrão", ["BRL (R$)", "USD ($)", "EUR (€)"])
            st.selectbox("Fuso horário", ["America/Sao_Paulo", "America/New_York", "Europe/London"])
    
    with tab2:
        st.markdown("### Personalização")
        
        col1, col2 = st.columns(2)
        with col1:
            st.selectbox("Tema", ["Claro", "Escuro", "Automático"])
            st.selectbox("Idioma", ["Português", "English", "Español"])
        
        with col2:
            st.toggle("Modo escuro", value=False)
            st.toggle("Animações", value=True)
    
    with tab3:
        st.markdown("### Notificações")
        
        st.toggle("Email", value=True)
        st.toggle("Push notifications", value=True)
        st.toggle("SMS", value=False)
        st.toggle("WhatsApp", value=False)
    
    with tab4:
        st.markdown("### Segurança")
        
        col1, col2 = st.columns(2)
        with col1:
            st.toggle("Autenticação 2 fatores", value=False)
            st.selectbox("Sessão expirar em", ["30 minutos", "1 hora", "2 horas", "8 horas"])
        
        with col2:
            st.markdown("Último acesso: 23/02/2026 14:30")
            if st.button("Alterar senha"):
                st.info("Função de alteração de senha em desenvolvimento!")

# Footer
st.markdown("---")
st.markdown(
    """
    <div style="text-align: center; color: #6B7280; padding: 20px;">
        RIMSO © 2026 - Conectando sua loja ao seu bairro
    </div>
    """,
    unsafe_allow_html=True
)
