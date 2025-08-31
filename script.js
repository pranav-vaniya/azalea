// Register service worker
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("./sw.js");
}

const userInputPriceLocalStorageKey = "user-input-price";
const userWeightInputLocalStorageKey = "user-weight-input";
const userOchInputLocalStorageKey = "user-och-input";
const userMcxRateLocalStorageKey = "user-mcx-rate";
const userMcxDiffLocalStorageKey = "user-mcx-diff";

const userInputPriceElementId = "gold-price-user-input";
const errorMessageContainerElementId = "error-message-container";
const errorMessageElementId = "error-message";
const weightOchRateTableBodyElementId = "weight-och-rate-table-body";
const userWeightInputElementId = "user-weight-input";
const userOchInputElementId = "user-och-input";
const userRateOutputElementId = "user-rate-output";
const userMcxRateInputElementId = "user-mcx-rate-input";
const userMcxDiffInputElementId = "user-mcx-diff-input";
const userMcxOutputElementId = "user-mcx-output";

const fineWeightOchSet = [
	{ weight: 1, och: 650 },
	{ weight: 2, och: 750 },
	{ weight: 5, och: 850 },
	{ weight: 10, och: 950 },
	{ weight: 20, och: 1000 },
	{ weight: 50, och: 1250 },
	{ weight: 100, och: 1500 },
];

document.addEventListener("DOMContentLoaded", function () {
	GetAndSetUserInputGoldPrice();
	SetOnBlurEventForUserInputGoldPrice();
	FillWeightOchRateTable();
	GetAndSetMcxValues();
	GetAndSetMcxEvents();
	SetAllInputsToSelectAllOnFocus();
});

function GetAndSetUserInputGoldPrice() {
	const userInputPrice = parseFloat(GetLocalStorage(userInputPriceLocalStorageKey) ?? 0);
	const userInputElement = document.getElementById(userInputPriceElementId);

	if (userInputElement != null) {
		userInputElement.value = userInputPrice;
	}
}

function SetOnBlurEventForUserInputGoldPrice() {
	const userInputElement = document.getElementById(userInputPriceElementId);

	userInputElement.addEventListener("blur", function () {
		const insertedValue = this.value;

		if (insertedValue == null || insertedValue.length < 6 || insertedValue.length > 7) {
			SetAndDisplayErrorMessage("Gold price can only be a 6 or 7 digit long number.");
			GetAndSetUserInputGoldPrice();
			return;
		}

		HideErrorMessage();
		SetLocalStorage(userInputPriceLocalStorageKey, parseFloat(insertedValue));
		FillWeightOchRateTable();
		0;
	});
}

function GetLocalStorage(key) {
	return localStorage.getItem(key);
}

function SetLocalStorage(key, value) {
	localStorage.setItem(key, value);
}

function SetAllInputsToSelectAllOnFocus() {
	document.querySelectorAll("input[type='number']").forEach((el) => {
		el.addEventListener("focus", function () {
			this.select();
		});
	});
}

function HideErrorMessage() {
	const errorContainer = document.getElementById(errorMessageContainerElementId);

	if (errorContainer != null) {
		errorContainer.style.display = "none";
	}
}

function ShowErrorMessage() {
	const errorContainer = document.getElementById(errorMessageContainerElementId);

	if (errorContainer != null) {
		errorContainer.style.display = "flex";
	}

	setTimeout(() => {
		HideErrorMessage();
	}, 5000);
}

function SetAndDisplayErrorMessage(errorMessage) {
	const errorMessageSpan = document.getElementById(errorMessageElementId);

	if (errorMessageSpan != null) {
		errorMessageSpan.innerHTML = errorMessage;
	}

	ShowErrorMessage();
}

function FillWeightOchRateTable() {
	const tableBody = document.getElementById(weightOchRateTableBodyElementId);

	if (tableBody != null) {
		tableBody.innerHTML = "";
		const userInputPrice = parseFloat(GetLocalStorage(userInputPriceLocalStorageKey) ?? 0);
		const weight = parseFloat(GetLocalStorage(userWeightInputLocalStorageKey) ?? 0);
		const och = parseFloat(GetLocalStorage(userOchInputLocalStorageKey) ?? 0);

		fineWeightOchSet.forEach((element) => {
			const row = document.createElement("tr");

			row.innerHTML = `
				<td>${element.weight}</td>
				<td>${element.och}</td>
				<td>${FormatNumber((userInputPrice / 100) * element.weight + element.och)}</td>
			`;

			tableBody.appendChild(row);
		});

		const row = document.createElement("tr");

		row.classList.add("weight-och-rate-input-row");
		row.innerHTML = `
			<td class="weight-och-rate-left-cell">
				<input class="form-control border-0 text-center p-0" type="number" id="${userWeightInputElementId}" placeholder="0" value="${weight}" />
			</td>
			<td>
				<input class="form-control border-0 text-center p-0" type="number" id="${userOchInputElementId}" placeholder="0" value="${och}" />
			</td>
			<td id="user-rate-output" class="weight-och-rate-right-cell">
				${FormatNumber((userInputPrice / 100) * weight + och)}
			</td>
		`;

		tableBody.appendChild(row);
		SetWeightOchInputEvents();
		SetAllInputsToSelectAllOnFocus();
	}
}

function SetWeightOchInputEvents() {
	const userWeightElement = document.getElementById(userWeightInputElementId);
	const userOchElement = document.getElementById(userOchInputElementId);

	userWeightElement.addEventListener("blur", function () {
		const insertedValue = this.value;

		if (insertedValue == null || insertedValue.length < 1 || insertedValue.length > 7) {
			SetAndDisplayErrorMessage("Weight can only be a 1 - 7 digit long number.");
			GetAndSetUserWeightInput();
			return;
		}

		HideErrorMessage();
		SetLocalStorage(userWeightInputLocalStorageKey, parseFloat(insertedValue));
		UpdateUserOutputRate();
	});

	userOchElement.addEventListener("blur", function () {
		const insertedValue = this.value;

		if (insertedValue == null || insertedValue.length < 1 || insertedValue.length > 7) {
			SetAndDisplayErrorMessage("OCH can only be a 1 - 7 digit long number.");
			GetAndSetUserOchInput();
			return;
		}

		HideErrorMessage();
		SetLocalStorage(userOchInputLocalStorageKey, parseFloat(insertedValue));
		UpdateUserOutputRate();
	});
}

function GetAndSetUserWeightInput() {
	const userWeightInput = parseFloat(GetLocalStorage(userWeightInputLocalStorageKey) ?? 0);
	const userWeightElement = document.getElementById(userWeightInputElementId);

	if (userWeightElement != null) {
		userInputElement.value = userWeightInput;
	}
}

function GetAndSetUserOchInput() {
	const userOchInput = parseFloat(GetLocalStorage(userOchInputLocalStorageKey) ?? 0);
	const userOchElement = document.getElementById(userOchInputElementId);

	if (userOchElement != null) {
		userOchElement.value = userOchInput;
	}
}

function UpdateUserOutputRate() {
	const userRateOutputElement = document.getElementById(userRateOutputElementId);

	if (userRateOutputElement != null) {
		const userInputPrice = parseFloat(GetLocalStorage(userInputPriceLocalStorageKey) ?? 0);
		const weight = parseFloat(GetLocalStorage(userWeightInputLocalStorageKey) ?? 0);
		const och = parseFloat(GetLocalStorage(userOchInputLocalStorageKey) ?? 0);

		userRateOutputElement.innerHTML = FormatNumber((userInputPrice / 100) * weight + och);
	}
}

function GetAndSetMcxValues() {
	const rate = parseFloat(GetLocalStorage(userMcxRateLocalStorageKey) ?? 0);
	const diff = parseFloat(GetLocalStorage(userMcxDiffLocalStorageKey) ?? 0);

	const userMcxRateElement = document.getElementById(userMcxRateInputElementId);
	const userMcxDiffElement = document.getElementById(userMcxDiffInputElementId);
	const userMcxOutputElement = document.getElementById(userMcxOutputElementId);

	if (userMcxRateElement != null && userMcxDiffElement != null && userMcxOutputElement != null) {
		userMcxRateElement.value = rate;
		userMcxDiffElement.value = diff;
		userMcxOutputElement.innerHTML = FormatNumber((rate + diff) * 10);
	}
}

function GetAndSetMcxEvents() {
	const userMcxRateElement = document.getElementById(userMcxRateInputElementId);
	const userMcxDiffElement = document.getElementById(userMcxDiffInputElementId);

	userMcxRateElement.addEventListener("blur", function () {
		const insertedValue = this.value;

		if (insertedValue == null || insertedValue.length < 1 || insertedValue.length > 7) {
			SetAndDisplayErrorMessage("Rate can only be a 1 - 7 digit long number.");
			GetAndSetUserRateInput();
			return;
		}

		HideErrorMessage();
		SetLocalStorage(userMcxRateLocalStorageKey, parseFloat(insertedValue));
		GetAndSetMcxValues();
	});

	userMcxDiffElement.addEventListener("blur", function () {
		const insertedValue = this.value;

		if (insertedValue == null || insertedValue.length < 1 || insertedValue.length > 7) {
			SetAndDisplayErrorMessage("Diff can only be a 1 - 7 digit long number.");
			GetAndSetUserDiffInput();
			return;
		}

		HideErrorMessage();
		SetLocalStorage(userMcxDiffLocalStorageKey, parseFloat(insertedValue));
		GetAndSetMcxValues();
	});
}

function GetAndSetUserRateInput() {
	const userMcxRateInput = parseFloat(GetLocalStorage(userMcxRateLocalStorageKey) ?? 0);
	const userMcxRateElement = document.getElementById(userMcxRateInputElementId);

	if (userMcxRateElement != null) {
		userMcxRateElement.value = userMcxRateInput;
	}
}

function GetAndSetUserDiffInput() {
	const userMcxDiffInput = parseFloat(GetLocalStorage(userMcxDiffLocalStorageKey) ?? 0);
	const userMcxDiffElement = document.getElementById(userMcxDiffInputElementId);

	if (userMcxDiffElement != null) {
		userMcxDiffElement.value = userMcxDiffInput;
	}
}

function FormatNumber(num) {
	if (isNaN(num)) return "";

	let [integerPart, decimalPart] = num.toString().split(".");

	let isNegative = false;
	if (integerPart.startsWith("-")) {
		isNegative = true;
		integerPart = integerPart.slice(1);
	}

	let lastThree = integerPart.slice(-3);
	let otherNumbers = integerPart.slice(0, -3);

	if (otherNumbers !== "") {
		lastThree = "," + lastThree;
	}

	let formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

	if (decimalPart) {
		formatted += "." + decimalPart;
	}

	return isNegative ? "-" + formatted : formatted;
}
