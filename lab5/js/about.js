// Данные образования для mock-json-server
const EDUCATION_ENDPOINT = 'http://localhost:8000/education';

// Функция загрузки данных
async function loadEducationData() {
  try {
    console.log('Загрузка данных об образовании...');
    
    const response = await fetch(EDUCATION_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    updateEducationTable(result.data);
    
  } catch (error) {
    console.error('Ошибка загрузки:', error.message);
    updateEducationTable(null, error.message);
  }
}

// Обновление таблицы
function updateEducationTable(data, error = null) {
  const tbody = document.querySelector('#education-table tbody');
  
  if (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; color: #e74c3c;">
          Ошибка: ${error}<br>
          <small>Проверьте mock-json-server</small>
        </td>
      </tr>
    `;
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; color: #f39c12;">Данные не найдены</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${item.institution || ''}</td>
      <td>${item.type || ''}</td>
      <td>${item.years || ''}</td>
    </tr>
  `).join('');
}

// Периодическая загрузка каждые 30 секунд
function startPeriodicLoading() {
  loadEducationData(); // Первая загрузка
  
  setInterval(() => {
    console.log('Периодическая загрузка...');
    loadEducationData();
  }, 30 * 1000); // 30 секунд
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', startPeriodicLoading);