class RegistrationData {
  constructor(name, email, password, gender) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.gender = gender;
  }

  printToConsole() {
    console.log("----- Registration Data -----");
    console.log(`Name:      ${this.name}`);
    console.log(`Email:     ${this.email}`);
    console.log(`Password:  ${this.password}`);
    console.log(`Gender:    ${this.gender}`);
    console.log("----------------------------");
  }
}

document.querySelector('.reg-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const gender = form.gender.value;

  const data = new RegistrationData(name, email, password, gender);

  data.printToConsole();
});