const yesButton = document.querySelector('#yes-button');
const noButton = document.querySelector('#no-button');
const response = document.querySelector('#response');
const card = document.querySelector('.invite-card');
const title = document.querySelector('#invitation-title');
const choices = document.querySelector('.choices');
const datePicker = document.querySelector('#date-picker');
const eventDate = document.querySelector('#event-date');
const drinkChoice = document.querySelector('#drink-choice');
const otherDrinkField = document.querySelector('#other-drink-field');
const otherDrink = document.querySelector('#other-drink');
const venueChoice = document.querySelector('#venue-choice');
const foodChoice = document.querySelector('#food-choice');
const extraNote = document.querySelector('#extra-note');
const confirmButton = document.querySelector('.confirm-button');
const eventDetails = document.querySelector('#event-details');
let noClickCount = 0;

const today = new Date();
eventDate.min = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0')
].join('-');

yesButton.addEventListener('click', () => {
  title.innerHTML = 'Yay!<br>Anong date?';
  choices.hidden = true;
  datePicker.hidden = false;
  response.textContent = 'Pili ka ng petsang bagay sa’yo para ma-set natin ang lakad.';
  eventDate.focus();
});

noButton.addEventListener('click', () => {
  noClickCount += 1;

  const yesScale = 1 + (noClickCount * 0.12);
  const noScale = Math.max(0.62, 1 - (noClickCount * 0.08));

  yesButton.style.transform = `scale(${yesScale})`;
  yesButton.style.transition = 'transform 180ms ease';
  noButton.style.transform = `scale(${noScale})`;
  noButton.style.transition = 'transform 180ms ease';

  if (noClickCount >= 5) {
    yesButton.style.transform = 'scale(1.6)';
    noButton.style.transform = 'scale(0.62)';
  }

  response.textContent = 'Ay, No? Sige lang—kung magbago isip mo, nandito lang ang Yes. 😊';
  noButton.classList.remove('reconsider');
  window.requestAnimationFrame(() => noButton.classList.add('reconsider'));
});

eventDate.addEventListener('change', () => {
  updateConfirmButton();
});

drinkChoice.addEventListener('change', () => {
  const isOtherDrink = drinkChoice.value === 'other';
  otherDrinkField.hidden = !isOtherDrink;
  otherDrink.required = isOtherDrink;
  updateConfirmButton();
});

venueChoice.addEventListener('change', updateConfirmButton);
otherDrink.addEventListener('input', updateConfirmButton);

function updateConfirmButton() {
  confirmButton.disabled = !datePicker.checkValidity();
}

datePicker.addEventListener('submit', event => {
  event.preventDefault();
  if (!datePicker.reportValidity()) return;

  const [year, month, day] = eventDate.value.split('-').map(Number);
  const selectedDate = new Date(year, month - 1, day);
  const formattedDate = new Intl.DateTimeFormat('fil-PH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(selectedDate);

  const selectedDrink = drinkChoice.value === 'other'
    ? otherDrink.value.trim()
    : drinkChoice.options[drinkChoice.selectedIndex].textContent;
  const summary = [
    `${formattedDate} · 7:00 PM`,
    `Inumin: ${selectedDrink}`,
    `Lugar: ${venueChoice.value}`,
    `Pulutan: ${foodChoice.value}`
  ];
  if (extraNote.value.trim()) summary.push(`Request: ${extraNote.value.trim()}`);

  title.innerHTML = 'Confirmed!<br>Kita tayo!';
  eventDetails.textContent = summary.join('\n');
  response.textContent = 'Ayos! Ito ang mga pinili mo para sa lakad.';
  card.classList.add('accepted');
  datePicker.hidden = true;
});
