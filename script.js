const peopleContainer = document.getElementById("people");

const translations = {
  es: {
    title: "División de Gastos",
    add: "Agregar Persona",
    calc: "Pagar/Dividir",
    lang: "🌐 Português",
    total: "Total",
    share: "Cada uno debe pagar",
    owes: "debe pagar",
    to: "a",
    summaryOwes: "debe en total",
    summaryReceives: "recibe en total",
    placeholderName: "Nombre",
    placeholderPaid: "Pago"
  },
  pt: {
    title: "Divisão de Despesas",
    add: "Adicionar Pessoa",
    calc: "Pagar/Dividir",
    lang: "🌐 Español",
    total: "Total",
    share: "Cada um deve pagar",
    owes: "deve pagar",
    to: "a",
    summaryOwes: "deve no total",
    summaryReceives: "recebe no total",
    placeholderName: "Nome",
    placeholderPaid: "Pagamento"
  }
};

let currentLang = "es";

function toggleLanguage() {
  currentLang = currentLang === "es" ? "pt" : "es";
  document.getElementById("title").innerText = translations[currentLang].title;
  document.getElementById("addBtn").innerText = translations[currentLang].add;
  document.getElementById("calcBtn").innerText = translations[currentLang].calc;
  document.getElementById("langBtn").innerText = translations[currentLang].lang;

  // actualizar placeholders existentes
  document.querySelectorAll(".person").forEach(p => {
    p.querySelector("input[type=text]").placeholder = translations[currentLang].placeholderName;
    p.querySelector("input[type=number]").placeholder = translations[currentLang].placeholderPaid;
  });
}

function addPerson() {
  const div = document.createElement("div");
  div.classList.add("person");
  div.innerHTML = `
    <input type="text" placeholder="${translations[currentLang].placeholderName}">
    <input type="number" placeholder="${translations[currentLang].placeholderPaid}" min="0">
  `;
  peopleContainer.appendChild(div);
}

function calculate() {
  const persons = [...document.querySelectorAll(".person")].map(p => {
    return {
      name: p.querySelector("input[type=text]").value || "Anon",
      paid: parseFloat(p.querySelector("input[type=number]").value) || 0,
      owesTotal: 0,
      receivesTotal: 0
    };
  });

  const total = persons.reduce((sum, p) => sum + p.paid, 0);
  const equalShare = total / persons.length;

  let debtors = persons.filter(p => p.paid < equalShare);
  let creditors = persons.filter(p => p.paid > equalShare);

  let result = `<h3>${translations[currentLang].total}: $${total.toFixed(2)}</h3>`;
  result += `<p>${translations[currentLang].share}: $${equalShare.toFixed(2)}</p>`;

  debtors.forEach(d => {
    let debt = equalShare - d.paid;
    creditors.forEach(c => {
      if (debt > 0 && c.paid > equalShare) {
        let credit = c.paid - equalShare;
        let transfer = Math.min(debt, credit);
        debt -= transfer;
        c.paid -= transfer;
        d.owesTotal += transfer;
        c.receivesTotal += transfer;
        result += `<p>${d.name} ${translations[currentLang].owes} $${transfer.toFixed(2)} ${translations[currentLang].to} ${c.name}</p>`;
      }
    });
  });

  result += `<h3>Resumen</h3>`;
  persons.forEach(p => {
    if (p.owesTotal > 0) {
      result += `<p>${p.name} ${translations[currentLang].summaryOwes} $${p.owesTotal.toFixed(2)}</p>`;
    } else if (p.receivesTotal > 0) {
      result += `<p>${p.name} ${translations[currentLang].summaryReceives} $${p.receivesTotal.toFixed(2)}</p>`;
    }
  });

  document.getElementById("result").innerHTML = result;
}
