const dateInput1 = document.querySelector(".date1_input");
const dateInput2 = document.querySelector(".date2_input");
const submitDateBtn = document.querySelector(".submit_date");
const balanceInput = document.querySelector(".balance_input");
const chargesForPeriod = document.querySelector(".charges");
const accruedDays = document.querySelector(".accrued_days");
const readInput1 = document.querySelector(".read1_input");
const readInput2 = document.querySelector(".read2_input");
const submitReadBtn = document.querySelector(".submit_read");
const adu = document.querySelector(".adu");
const aduInput = document.querySelector(".adu_input");
const servicesInput = document.querySelector("#services");
const swdInput = document.querySelector("#swd");
const hwdInput = document.querySelector("#hwd");
const submitChargeBtn = document.querySelector(".submit_annual_charge");
const annualCharge = document.querySelector(".annual_charge");

// CALCULATE DAYS BETWEEN TWO DATES
const calcDaysBetweenDates = (date1, date2) => {
  const dateA = new Date(date1.value);
  const dateB = new Date(date2.value);
  const aDayInMS = 24 * 60 * 60 * 1000;
  const diffInTime = dateB.getTime() - dateA.getTime();
  const diffInDays = diffInTime / aDayInMS;
  return diffInDays;
};

// CALCULATE MONTHS TO SET A PP OVER
const calcMonthsBetweenDates = (dateA, dateB) => {
  const startDate = new Date(dateA.value);
  const endDate = new Date(dateB.value);
  let months;

  months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  months -= startDate.getMonth();
  months += endDate.getMonth();
  if (endDate.getDate() - startDate.getDate() >= 0) {
    months++;
  } else {
    months;
  }
  return months;
};

// DISPLAY DAYS BETWEEN TWO DATES
accruedDays.textContent = `${calcDaysBetweenDates(
  dateInput1,
  dateInput2
)} days between dates (${Math.floor(calcDaysBetweenDates(dateInput1, dateInput2) / 7)} weeks)`;

document.addEventListener("change", () => {
  accruedDays.textContent = `${calcDaysBetweenDates(
    dateInput1,
    dateInput2
  )} days between dates (${Math.floor(calcDaysBetweenDates(dateInput1, dateInput2) / 7)} weeks)`;
});

// DISPLAY CHARGES FOR DATE PERIOD BASED ON DAILY CHARGE
submitDateBtn.addEventListener("click", () => {
  chargesForPeriod.textContent = `Charge for date period: £${(
    calcDaysBetweenDates(dateInput1, dateInput2) * balanceInput.value
  ).toFixed(2)}`;
});

// DISPLAY ADU BASED ON METER READS AND DATES ENTERED
submitReadBtn.addEventListener("click", () => {
  const usage = readInput2.value - readInput1.value;
  const avgUse = usage / calcDaysBetweenDates(dateInput1, dateInput2);
  const litres = (avgUse * 1000).toFixed(0);
  const avgUseFixed = avgUse.toFixed(3);

  adu.textContent = `Average daily usage: ${avgUseFixed} (${litres} litres a day)`;
});

// CALCULATE ESTIMATED CHARGES FROM ADU
const dailyChargeFresh = 1.8195;
const dailyChargeWaste = 1.3008;
const dailyChargeFull = dailyChargeFresh + dailyChargeWaste;
const freshStanding = 37.31;
const wasteStanding = 26.6;
const fullStanding = freshStanding + wasteStanding;
const swdBand1 = 24.78;
const swdBand2 = 49.55;
const swdBand3 = 74.33;
const hwdCharge = 17.09;

const calcAnnualCharges = () => {
  let charges;

  switch (servicesInput.value) {
    case "full":
      charges = dailyChargeFull * aduInput.value * 365 + fullStanding;
      break;
    case "fresh_only":
      charges = dailyChargeFresh * aduInput.value * 365 + freshStanding;
      break;
    case "waste_only":
      charges = dailyChargeWaste * aduInput.value * 365 + wasteStanding;
      break;
    default:
      charges = dailyChargeFull * aduInput.value * 365;
      break;
  }

  switch (swdInput.value) {
    case "flat_terrace":
      charges += swdBand1;
      break;
    case "semi_detatched":
      charges += swdBand2;
      break;
    case "detatched":
      charges += swdBand3;
      break;
    default:
      charges;
      break;
  }

  switch (hwdInput.value) {
    case "yes":
      charges += hwdCharge;
      break;
    default:
      charges;
      break;
  }
  return charges;
};

// DISPLAY ANNUAL AND DAILY ESTIMATED CHARGES
submitChargeBtn.addEventListener("click", () => {
  annualCharge.textContent = `Estimated annual charge: £${calcAnnualCharges().toFixed(
    2
  )} (Daily £${(calcAnnualCharges() / 365).toFixed(2)})`;
});
