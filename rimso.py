<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>RIMSO App</title>
<style>
body {
  font-family: Arial, sans-serif;
  background: #f5f5f5;
  margin: 0;
}
.screen {
  display: none;
  padding: 20px;
}
.active {
  display: block;
}
button {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: none;
  border-radius: 8px;
  font-size: 16px;
}
.blue { background: #1E90FF; color: white; }
.green { background: #00FF99; color: black; }
.card {
  background: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
}
input, select {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
}
h2 { color: #1E90FF; }
</style>
</head>
<body>

<!-- Tela Inicial -->
<div id="home" class="screen active">
  <h2>RIMSO</h2>
  <p>Conectando sua loja ao seu bairro</p>
  <button class="blue" onclick="showScreen('cliente')">Sou Cliente</button>
  <button class="green" onclick="showScreen('lojistaLogin')">Sou Lojista</button>
</div>

<!-- Cliente -->
<div id="cliente" class="screen">
  <h2>Onde você está?</h2>
  <select id="cidade">
    <option>São Paulo</option>
    <option>Rio de Janeiro</option>
  </select>
  <select id="bairro">
    <option>Centro</option>
    <option>Pinheiros</option>
  </select>
  <button class="green" onclick="showScreen('lojas')">Buscar lojas</button>
</div>

<!-- Lista de Lojas -->
<div id="lojas" class="screen">
  <h2>Lojas</h2>
  <div class="card" onclick="showScreen('perfilLoja')">
    <h3>StreetWearBR</h3>
    <p>Pinheiros</p>
    <p>3 produtos</p>
  </div>
  <div class="card" onclick="showScreen('perfilLoja')">
    <h3>UrbanStyle</h3>
    <p>Pinheiros</p>
    <p>5 produtos</p>
  </div>
</div>

<!-- Perfil Loja -->
<div id="perfilLoja" class="screen">
  <h2>StreetWearBR</h2>
  <p>Rua da Consolação - Pinheiros</p>
  <div class="card">Camiseta - R$79</div>
  <div class="card">Jaqueta - R$179</div>
  <div class="card">Boné - R$59</div>
  <button class="green">Falar no WhatsApp</button>
</div>

<!-- Login Lojista -->
<div id="lojistaLogin" class="screen">
  <h2>Cadastro Lojista</h2>
  <input placeholder="Nome da Loja">
  <input placeholder="Email">
  <input placeholder="Senha" type="password">
  <input placeholder="Cidade">
  <input placeholder="Bairro">
  <button class="blue" onclick="showScreen('dashboard')">Criar Conta</button>
</div>

<!-- Dashboard -->
<div id="dashboard" class="screen">
  <h2>Painel da Loja</h2>
  <button class="green" onclick="showScreen('produto')">Cadastrar Produto</button>
  <button class="blue" onclick="showScreen('planos')">Meu Plano</button>
</div>

<!-- Cadastro Produto -->
<div id="produto" class="screen">
  <h2>Cadastrar Produto</h2>
  <input placeholder="Nome do produto">
  <input placeholder="Preço">
  <input placeholder="Descrição">
  <button class="green">Salvar</button>
</div>

<!-- Planos -->
<div id="planos" class="screen">
  <h2>Planos</h2>
  <div class="card">Básico - R$49</div>
  <div class="card">Profissional - R$89</div>
  <div class="card">Premium - R$149</div>
</div>

<script>
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
</script>

</body>
</html>
