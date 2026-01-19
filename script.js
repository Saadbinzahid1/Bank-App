"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-10-15T08:23:45.123Z",
    "2019-11-01T10:51:36.790Z",
    "2019-11-25T14:11:59.604Z",
    "2019-12-10T09:15:04.904Z",
    "2020-01-05T16:33:06.386Z",
    "2020-02-14T11:01:17.194Z",
    "2020-03-20T18:49:59.371Z",
    "2020-04-25T12:01:20.894Z",
  ],
  currency: "GBP",
  locale: "en-GB",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-05T13:15:33.035Z",
    "2019-12-12T09:48:16.867Z",
    "2020-01-18T06:04:23.907Z",
    "2020-02-10T14:18:46.235Z",
    "2020-03-15T16:33:06.386Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const displayDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${
          i + 1
        } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

function calcDisplayBalanace(acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
}

function calcDisplaySummary(acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => mov * acc.interestRate)
    .filter((mov) => mov >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

function createUsernames(accs) {
  accs.forEach(function (accs) {
    accs.userName = accs.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}
createUsernames(accounts);

//Update UI
function updateUI(acc) {
  displayMovements(acc);
  calcDisplayBalanace(acc);
  calcDisplaySummary(acc);
}

//Login Event Handler
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  //Date Handling
  const now = new Date();
  labelDate.textContent = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}, ${now.getHours()}:${now.getMinutes()}`;

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value,
  );

  if (+inputLoginPin.value === currentAccount?.pin) {
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;

    updateUI(currentAccount);
  }
});

//Transfer Event Handler
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value,
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.userName !== currentAccount.userName
  ) {
    inputTransferAmount.value = "";
    inputTransferTo.value = "";

    //Add transfer date
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());

    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);

    updateUI(currentAccount);
  } else console.log("Transfer is NOT valid");
});

//Loan Event Handler
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.round(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= 0.1 * amount)
  ) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    updateUI(currentAccount);
    console.log("You requested a loan");
    inputLoanAmount.value = "";
  }
});

//Closing Account Event Handler
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => (acc.userName = currentAccount.userName),
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    console.log("Account is deleted");
    inputCloseUsername.value = inputClosePin.value = "";
  } else console.log("Wrong credentials");
});

// Sort Movements Event Handler
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
