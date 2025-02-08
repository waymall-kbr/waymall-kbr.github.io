document.addEventListener('DOMContentLoaded', () => {
    fetchVersionAndRelease();
    loadNews();
});

// Функция для получения информации о релизе и версии
async function fetchVersionAndRelease() {
    try {
        // Получаем информацию о релизе с GitHub
        const githubResponse = await fetch('https://api.github.com/repos/publicrust/rust-launcher/releases/latest', {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'RustLauncher'
            }
        });

        if (githubResponse.ok) {
            const data = await githubResponse.json();

            // Находим .exe файл
            const exeAsset = data.assets.find(asset =>
                asset.name.toLowerCase().includes('launcher') &&
                asset.name.toLowerCase().endsWith('.exe')
            );

            if (exeAsset) {
                // Обновляем размер и версию
                const sizeElement = document.getElementById('size');
                const versionElement = document.getElementById('version');
                const downloadButton = document.getElementById('downloadButton');

                if (sizeElement) {
                    const sizeInMB = (exeAsset.size / (1024 * 1024)).toFixed(1);
                    sizeElement.textContent = `Размер: ${sizeInMB} МБ`;
                }

                if (versionElement) {
                    versionElement.textContent = `Версия: ${data.tag_name}`;
                }

                if (downloadButton) {
                    downloadButton.href = exeAsset.browser_download_url;
                }
            }
        }
    } catch (error) {
        console.error('Ошибка при получении информации:', error);
        // Значения по умолчанию
        const sizeElement = document.getElementById('size');
        const versionElement = document.getElementById('version');
        const downloadButton = document.getElementById('downloadButton');

        if (sizeElement) sizeElement.textContent = 'Размер: 64.3 МБ';
        if (versionElement) versionElement.textContent = 'Версия: 1.0.0';
        if (downloadButton) downloadButton.href = 'https://github.com/publicrust/rust-launcher/releases/latest';
    }
}

// Функция для загрузки новостей из GitHub Releases
async function loadNews() {
    try {
        const response = await fetch('https://api.github.com/repos/publicrust/rust-launcher/releases', {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'RustLauncher'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch news');

        const releases = await response.json();
        const newsContainer = document.getElementById('news-container');

        if (newsContainer) {
            // Очищаем контейнер
            newsContainer.innerHTML = '';

            // Берем последние 2 релиза (как в дизайне)
            releases.slice(0, 2).forEach(release => {
                const newsCard = document.createElement('div');
                newsCard.className = 'news-card';

                // Форматируем дату
                const date = new Date(release.published_at);
                const formattedDate = date.toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                newsCard.innerHTML = `
                    <div class="news-image">
                        <img src="images/update.jpg" alt="News">
                    </div>
                    <div class="news-content">
                        <span class="news-date">${formattedDate}</span>
                        <h3>${release.name || release.tag_name}</h3>
                        <p>${release.body ? release.body.split('\n')[0] : 'Нет описания'}</p>
                        <a href="${release.html_url}" class="read-more" target="_blank">Читать далее</a>
                    </div>
                `;

                newsContainer.appendChild(newsCard);
            });
        }
    } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
        const newsContainer = document.getElementById('news-container');
        if (newsContainer) {
            newsContainer.innerHTML = '<div class="news-error">Не удалось загрузить новости</div>';
        }
    }
}