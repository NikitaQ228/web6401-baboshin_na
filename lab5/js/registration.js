class RegistrationData {
  constructor(name, email, password, gender) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.gender = gender;
  }

  printToConsole() {
    console.log("----- Registration Data -----");
    console.log(`Name: ${this.name}`);
    console.log(`Email: ${this.email}`);
    console.log(`Password: ${'*'.repeat(this.password.length)}`);
    console.log(`Gender: ${this.gender}`);
    console.log("----------------------------");
  }
}

const validators = {
  name: value => {
    if (!value) return 'Имя обязательно.';
    if (value.length < 2) return 'Имя должно быть не короче 2 символов.';
    if (!/^[а-яА-ЯёЁa-zA-Z\s]+$/.test(value)) return 'Имя может содержать только буквы и пробелы.';
    return null;
  },
  email: value => {
    if (!value) return 'Email обязателен.';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return 'Некорректный формат email.';
    return null;
  },
  password: value => {
    if (!value) return 'Пароль обязателен.';
    if (value.length < 6) return 'Пароль должен быть не короче 6 символов.';
    if (!/\d/.test(value)) return 'Пароль должен содержать хотя бы одну цифру.';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) 
      return 'Пароль должен содержать хотя бы один спецсимвол.';
    return null;
  }
};

const form = document.querySelector('.reg-form');
const nameInput = form.name;
const emailInput = form.email;
const passwordInput = form.password;

const hints = {
  name: document.getElementById('name-hint'),
  email: document.getElementById('email-hint'),
  password: document.getElementById('password-hint')
};

function updateHint(field, message = '', type = '') {
  const hint = hints[field];
  if (!hint) return;
  hint.textContent = message;
  hint.className = 'hint';
  if (type) hint.classList.add(type);
}

function validateField(field, value) {
  const error = validators[field]?.(value);
  const input = form[field];

  if (error) {
    updateHint(field, error, 'error');
    if (input) input.setCustomValidity(error);
  } else {
    updateHint(field, '✓ OK', 'success');
    if (input) input.setCustomValidity('');
  }
  return !error;
}

nameInput.addEventListener('input', () => validateField('name', nameInput.value.trim()));
emailInput.addEventListener('input', () => validateField('email', emailInput.value.trim()));
passwordInput.addEventListener('input', () => validateField('password', passwordInput.value));

form.addEventListener('submit', async function(event) {
  event.preventDefault();

  // Проверяем все поля перед отправкой
  const isNameValid = validateField('name', nameInput.value.trim());
  const isEmailValid = validateField('email', emailInput.value.trim());
  const isPasswordValid = validateField('password', passwordInput.value);

  if (!isNameValid || !isEmailValid || !isPasswordValid) {
    updateHint('name', 'Исправьте ошибки в форме', 'error');
    return;
  }

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const gender = form.gender.value;

  const data = new RegistrationData(name, email, password, gender);
  data.printToConsole();

  try {
    const response = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        gender
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Данные успешно отправлены:', result);
      alert('Регистрация успешна!');
      form.reset();
      Object.values(hints).forEach(hint => {
        hint.textContent = '';
        hint.className = 'hint';
      });
    } else {
      console.error('Ошибка сервера:', response.status);
      alert('Ошибка при отправке данных');
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
    alert('Ошибка подключения к серверу. Запустите mock-json-server.');
  }
});