'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Ritik Gangwar',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-07-12T23:36:17.929Z',
    '2022-07-16T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN', // english-India
};

const account2 = {
  owner: 'Suramya Goswami',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Priya Gangwar',
  movements: [11000, 340, -1500, -190, -3010, 3000, 400, -30],
  interestRate: 2.0,
  pin: 3333,

  movementsDates: [
    '2015-11-11T13:15:33.035Z',
    '2015-11-03T09:48:16.867Z',
    '2015-12-25T06:04:23.907Z',
    '2018-01-25T14:18:46.235Z',
    '2019-02-04T16:33:06.386Z',
    '2021-04-11T14:43:26.374Z',
    '2022-06-23T18:49:59.371Z',
    '2022-07-12T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'en-EU',
};

const account4 = {
  owner: 'Uditanshu Goswami',
  movements: [10000, -340, 4500, 1990, -3000, 300, 450, -130],
  interestRate: 1.2,
  pin: 4444,

  movementsDates: [
    '2019-11-11T13:15:33.035Z',
    '2019-11-03T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-04T16:33:06.386Z',
    '2021-04-11T14:43:26.374Z',
    '2021-06-23T18:49:59.371Z',
    '2022-07-12T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // //getYear returns Year-1900 so we have added 1900 explicitly
    // const year = date.getYear() + 1900;

    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurr(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCurr(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurr(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When time expires(reach 0 seconds), stop timer and log the user out
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in  to get started`;
      containerApp.style.opacity = 0;
    }

    //Decrease 1
    time--;
  };
  //Set time to 5 minutes
  let time = 600;

  //This is for calling the function immediately i.e at 0 secons as timer will start at 1 second
  tick();
  //Call the timer every second
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// //FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(account1);
// containerApp.style.opacity = 100;

//Format in day-month-year

//EXPERIMENTING API

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Current date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    //Way of taking the language from the browser
    // const locale = navigator.language;
    //Intl is namespace for Internationalisation API
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    //We are using template literal so that we could convert the date into string as the function of padding is only applicable to strings
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getYear() + 1900;
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //For logging in for the first time, there will be no timer variable, however if first person has logged in, and the second person logs in, the timer already exists so we need to clear the timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //Reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //We approve loan after 2.5 seconds
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      //Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);

      //Reset the timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(23 === 23.0);

// //Base 10- 0 to 9
// //Base 2- 0 1

// console.log(0.1 + 0.2);
// // (3/10) is rounded off to something that is not exactly 0.3 in JS
// console.log(0.1 + 0.2 === 0.3);
// //Gives false

// //Conversion from string to number
// console.log(Number('23'));
// console.log(+'23');
// //Work eactly the same way

// //Number.parseInt() is used to extract integer from a string
// //The string needs to start with number for this to work
// console.log(Number.parseInt('30px'));
// //Gives 30
// console.log(Number.parseInt('e23'));
// //Gives NaN
// //The second parameter is the base
// console.log(Number.parseInt('30px', 10));

// console.log(Number.parseFloat('2.5rem'));
// //Parses the float-2.5
// console.log(Number.parseInt('2.5rem'));
// //Parses the int-2
// console.log(parseInt('2.5rem'));
// //Works exactly the same

// //Check for value not a number
// console.log(Number.isNaN(20));
// //False
// console.log(Number.isNaN('20'));
// //False
// console.log(Number.isNaN(+'20X'));
// //True
// console.log(Number.isNaN(23 / 0));
// //False

// //Check if somethinf is a number
// console.log(Number.isFinite(20));
// //true
// console.log(Number.isFinite('20'));
// //This is a much better way to find if something is a number or not
// console.log(Number.isFinite(+'20X'));
// console.log(Number.isFinite(20 / 0));

// //isInteger
// console.log(Number.isInteger(23));
// //true
// console.log(Number.isInteger(23.0));
// //true
// console.log(Number.isInteger(23 / 0));

//square root function

// console.log(Math.sqrt(25));
// //5
// console.log(25 ** (1 / 2));
// //5
// console.log(8 ** (1 / 3));
// //2
// console.log(Math.max(5, 18, 7, 90, 34));
// //Returns the max
// console.log(Math.min(5, 18, 7, 90, 34));
// //min

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;

// //the result comes out between min and max
// console.log(randomInt(10, 20));

// //Round Integers

// //Trunc
// console.log(Math.trunc(23.3));
// //23
// console.log(Math.trunc(23.9));
// //23

// //Round
// console.log(Math.round(23.3));
// //23
// console.log(Math.round(23.9));
// //24

// //ceil
// console.log(Math.ceil(23.3));
// //24
// console.log(Math.ceil(23.9));
// //24

// //floor
// console.log(Math.floor(23.3));
// //23
// console.log(Math.floor(23.9));
// //23

// //Floor and trunc are similar while dealing with positive numbers

// //Rounding decimals
// //toFixed returns a string
// console.log((2.7).toFixed(0));
// //0 decimal places (3)
// console.log((2.7).toFixed(2));
// //2 decimal places (2.70)
// console.log((2.7).toFixed(3));
// //3 decimal places(2.700)

//Remainder operator-Returns the remainder of a division

// console.log(5 % 2);

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

//Destructing the array

//Numeric separators
//We can use underscore as a separator just to increase the readability . They are ignored by the engine
// const diameter = 287_460_000_000;
// console.log(diameter);
// //Underscore can be used to give meanings
// const transfer = 15_00;
// //cents
// const transfer1 = 15_000;
// //thousands
// const PI = 3.14_15;

// //Converting strings to numbers that contain underscore , it will not work as expected

// console.log(Number('23000'));
// console.log(Number('23_000'));
// //Gives NaN

//(2 ** 53) -1 is the biggest number that JS can store\
// console.log(Number.MAX_SAFE_INTEGER);

// //BigInt() is used to store very large numbers
// // n signifies bigInt
// console.log(10000n + 1000n);
// console.log(27837928272625443256278292272725527282n);
// //constructor function for bigInt
// console.log(BigInt(23));
// console.log(typeof 20n);
//bigint datatype
//Math. methods don't work on bigint

// //Create a date- Multiple ways

// const now = new Date();
// console.log(now);

// console.log(new Date('Sun Jul 17 2022 19:13:29'));

// console.log(new Date('December 24, 2020'));

// console.log(new Date(account1.movementsDates[0]));

// //We can pass the values such as year,month,date
// //Here we are passing the information in the format year-month-date-hour-minute-second

// console.log(new Date(2037, 10, 19, 15, 23, 5));
// //months are 0 based so 10 is November
// console.log(new Date(0));
// //0 corresponds to unix start time i.e Jan 1 1970
// console.log(new Date(3 * 24 * 60 * 60 * 1000));
// //Converted to milliseconds corresponding to 3 days

//Working with dates

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);

// console.log(future.getFullYear());
// //year
// console.log(future.getMonth());
// //month
// console.log(future.getDate());
// //date of the month
// console.log(future.getDay());
// //day of the week
// console.log(future.getHours());
// //hour
// console.log(future.getMinutes());
// //minutes
// console.log(future.getSeconds());
// //seconds

// console.log(future.toISOString());
// //International Format of dates

// console.log(future.getTime());
// //Gives timestamp
// //Time passed since 1970 beginning in ms

// console.log(Date.now());
// //Gives the timestamp for present

// future.setFullYear(2040);
// console.log(future);

// const future = new Date(2037, 10, 19, 15, 23);
// //Operations on dates return timestamps in ms which we can convert back to dates
// // console.log(+future);

// //conversion of ms into days

// const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 4));
// console.log(days1);

//INTERNATIONALISING NUMBERS
// const num = 3884764.23;

// const options = {
//   style: 'currency',
//   // unit:'celcius',
//   currency: 'EUR',
//   useGrouping: false,
//   //Removes the commas in the number
//   //unit can be anything such as celcius , mile-per-hour , etc.
// };

// console.log('US:', new Intl.NumberFormat('en-US', options).format(num));
// //Formatting the number for US format
// console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(num));
// //Germany
// console.log('Syria:', new Intl.NumberFormat('ar-SY', options).format(num));
// console.log('India:', new Intl.NumberFormat('hi-IN', options).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );

// //Just the number in country format
// console.log('Germany:', new Intl.NumberFormat('de-DE').format(num));

// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language).format(num)
// );

//TIMERS

//~Asynchronous JS

// //setTimeout-callback function runs only once
// const ingridients = ['olives', 'spinach'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
//   3000,
//   ...ingridients
// );
// //Second argument is the amount of ms after which we want the function to be called
// //After the second argument we can pass(matter of choice) the argumens that we want to pass to the function
// console.log('Waiting');
// //This will be logged first as above statement is logged after 3 seconds
// if (ingridients.includes('spinach')) clearTimeout(pizzaTimer);
// //clearTimeout can be used to delete the timer

//setInterval
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 1000);
//Will display date after every 1 second
