// Массив с ID серверов
const SERVERS = [{
        id: '6777421'
    },
    {
        id: '6907955'
    },
    {
        id: '6793742'
    },
    {
        id: '3045426'
    },
    {
        id: '814348'
    },
    {
        id: '439393'
    },
    {
        id: '814470'
    },
    {
        id: '6966122'
    },
    {
        id: '6691219'
    }
];

async function fetchServerInfo(serverId) {
    try {
        const response = await fetch(`https://api.gamemonitoring.net/servers/${serverId}`);
        const data = await response.json();

        if (data && data.response) {
            return data.response;
        } else {
            console.error('Неверная структура данных:', data);
            return null;
        }
    } catch (error) {
        console.error(`Ошибка при получении данных сервера ${serverId}:`, error);
        return null;
    }
}

function createServerCard(serverData) {
    return `
        <div class="server-card" data-server-id="${serverData.id}">
            <h3>${serverData.name}</h3>
            <div class="server-info">
                <p class="server-connect" onclick="copyToClipboard('${serverData.connect}', this)">
                    connect: ${serverData.connect}
                    <span class="copy-tooltip">Нажмите, чтобы скопировать</span>
                </p>
                <div class="server-status">
                    <span class="online-status ${serverData.status ? 'online' : 'offline'}">
                        ${serverData.status ? 'Онлайн' : 'Офлайн'}
                    </span>
                    <span class="players">
                        <i class="fas fa-users"></i> <span class="players-count">${serverData.numplayers}/${serverData.maxplayers}</span>
                    </span>
                </div>
                <div class="server-details">
                    <span class="map">
                        <i class="fas fa-map"></i> Карта: <span class="map-name">${serverData.map || 'Неизвестно'}</span>
                    </span>
                </div>
            </div>
        </div>
    `;
}

function updateServerCardData(card, serverData) {
    // Обновляем только изменяемые данные
    card.querySelector('.online-status').className =
        `online-status ${serverData.status ? 'online' : 'offline'}`;
    card.querySelector('.online-status').textContent =
        serverData.status ? 'Онлайн' : 'Офлайн';
    card.querySelector('.players-count').textContent =
        `${serverData.numplayers}/${serverData.maxplayers}`;
    card.querySelector('.map-name').textContent =
        serverData.map || 'Неизвестно';
}

async function updateAllServers() {
    for (const server of SERVERS) {
        const serverData = await fetchServerInfo(server.id);
        if (serverData) {

            const existingCard = document.querySelector(`[data-server-id="${server.id}"]`);
            if (existingCard) {

                updateServerCardData(existingCard, serverData);
            } else {

                const serverCard = createServerCard(serverData);
                document.getElementById('serversContainer').innerHTML += serverCard;
            }
        }
    }
}

async function copyToClipboard(text, element) {
    try {
        await navigator.clipboard.writeText(text);

        const tooltip = element.querySelector('.copy-tooltip');
        tooltip.textContent = 'Скопировано!';
        tooltip.classList.add('show');

        setTimeout(() => {
            tooltip.textContent = 'Нажмите, чтобы скопировать';
            tooltip.classList.remove('show');
        }, 2000);
    } catch (err) {
        console.error('Ошибка при копировании:', err);
    }
}

setInterval(updateAllServers, 60000);

document.addEventListener('DOMContentLoaded', updateAllServers);