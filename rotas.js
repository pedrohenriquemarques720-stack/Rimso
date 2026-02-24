// ==================== ROTAS NO MAPA ====================
// Integração com Google Maps para rotas e navegação

// Variáveis globais
let mapa = null;
let marcadores = [];
let rotaAtual = null;

// Inicializar mapa
function inicializarMapa(elementId, latitude = -22.7243, longitude = -47.6475) {
    const mapElement = document.getElementById(elementId);
    if (!mapElement) return;
    
    mapa = new google.maps.Map(mapElement, {
        center: { lat: latitude, lng: longitude },
        zoom: 13,
        styles: [
            {
                featureType: 'poi.business',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }]
            }
        ]
    });
    
    return mapa;
}

// Adicionar marcador de loja
function adicionarMarcadorLoja(loja) {
    if (!mapa || !loja.latitude || !loja.longitude) return;
    
    const marker = new google.maps.Marker({
        position: { lat: loja.latitude, lng: loja.longitude },
        map: mapa,
        title: loja.nome,
        icon: {
            url: loja.tipo === 'loja' 
                ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        },
        animation: google.maps.Animation.DROP
    });
    
    // Info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px; max-width: 200px;">
                <h4 style="margin: 0 0 5px 0;">${loja.nome}</h4>
                <p style="margin: 0 0 5px 0;">📍 ${loja.bairro}</p>
                <p style="margin: 0 0 5px 0;">⭐ ${loja.avaliacaoMedia || 'Novo'}</p>
                <button onclick="verLoja(${loja.id})" style="background: var(--red); color: white; border: none; padding: 5px 10px; border-radius: 20px; cursor: pointer;">
                    Ver loja
                </button>
                <button onclick="calcularRota(${loja.latitude}, ${loja.longitude})" style="background: var(--gold); color: black; border: none; padding: 5px 10px; border-radius: 20px; cursor: pointer; margin-top: 5px;">
                    Como chegar
                </button>
            </div>
        `
    });
    
    marker.addListener('click', () => {
        infoWindow.open(mapa, marker);
    });
    
    marcadores.push(marker);
    return marker;
}

// Calcular rota até a loja
function calcularRota(destLat, destLng) {
    if (!navigator.geolocation) {
        mostrarToast('Geolocalização não suportada', 'error');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const origin = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            const destination = {
                lat: destLat,
                lng: destLng
            };
            
            desenharRota(origin, destination);
        },
        (error) => {
            mostrarToast('Erro ao obter localização', 'error');
        }
    );
}

// Desenhar rota no mapa
function desenharRota(origin, destination) {
    if (!mapa) return;
    
    // Remover rota anterior
    if (rotaAtual) {
        rotaAtual.setMap(null);
    }
    
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        map: mapa,
        suppressMarkers: false,
        polylineOptions: {
            strokeColor: '#DD0000',
            strokeWeight: 5,
            strokeOpacity: 0.8
        }
    });
    
    directionsService.route(
        {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        },
        (response, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
                rotaAtual = directionsRenderer;
                
                // Mostrar informações da rota
                const rota = response.routes[0].legs[0];
                mostrarToast(`Distância: ${rota.distance.text} • Duração: ${rota.duration.text}`);
            } else {
                mostrarToast('Erro ao calcular rota', 'error');
            }
        }
    );
}

// Limpar marcadores
function limparMarcadores() {
    marcadores.forEach(marker => marker.setMap(null));
    marcadores = [];
}

// Filtrar lojas no mapa
function filtrarMapa(categoria, bairro) {
    limparMarcadores();
    
    const lojasFiltradas = lojasExemplo?.filter(loja => {
        if (categoria && loja.categoria !== categoria) return false;
        if (bairro && loja.bairro !== bairro) return false;
        return true;
    });
    
    lojasFiltradas?.forEach(loja => adicionarMarcadorLoja(loja));
}

// Geolocalização do usuário
function localizarUsuario() {
    if (!navigator.geolocation) {
        mostrarToast('Geolocalização não suportada', 'error');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            mapa.setCenter(userLocation);
            mapa.setZoom(15);
            
            // Marcador do usuário
            new google.maps.Marker({
                position: userLocation,
                map: mapa,
                title: 'Você está aqui',
                icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    scaledSize: new google.maps.Size(40, 40)
                }
            });
            
            mostrarToast('Localização encontrada!');
            
            // Buscar lojas próximas
            buscarLojasProximas(userLocation);
        },
        (error) => {
            mostrarToast('Erro ao obter localização', 'error');
        }
    );
}

// Buscar lojas próximas (simulado)
function buscarLojasProximas(userLocation) {
    // Em produção, isso seria uma chamada à API
    const lojasProximas = lojasExemplo?.filter(loja => loja.latitude && loja.longitude);
    
    const container = document.getElementById('lojasProximas');
    if (!container) return;
    
    container.innerHTML = '<h3>Lojas próximas</h3>';
    
    lojasProximas?.forEach(loja => {
        const distancia = calcularDistancia(
            userLocation.lat, userLocation.lng,
            loja.latitude, loja.longitude
        );
        
        container.innerHTML += `
            <div class="loja-card" onclick="verLoja(${loja.id})" style="margin: 10px 0; padding: 15px;">
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <h4>${loja.nome}</h4>
                        <p>📍 ${loja.bairro}</p>
                    </div>
                    <div style="text-align: right;">
                        <p><strong>${distancia.toFixed(1)} km</strong></p>
                        <button class="btn btn-small" onclick="calcularRota(${loja.latitude}, ${loja.longitude})">Rota</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Calcular distância entre dois pontos (fórmula de Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Exportar funções
window.inicializarMapa = inicializarMapa;
window.calcularRota = calcularRota;
window.localizarUsuario = localizarUsuario;
window.filtrarMapa = filtrarMapa;