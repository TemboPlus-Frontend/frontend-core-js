# @temboplus/frontend-core

A robust and versatile JavaScript/TypeScript library designed to streamline the development of TemboPlus front-end applications. This library provides a comprehensive suite of utilities, standardized data models, and services to ensure consistency, efficiency, and maintainability across all TemboPlus projects.

## Core Features

* **Utility Functions:** A collection of pre-built helper functions to simplify common development tasks.
* **Standardized Data Models:** Consistent and reliable data structures for managing essential data types, including phone numbers, amounts, currencies, countries, and bank details.
* **Comprehensive Report Management:** A powerful `ReportManager` for generating and downloading reports in various formats across different TemboPlus projects.
* **Centralized Configuration Service:** A flexible `ConfigService` for managing application settings and environment configurations.

## Data Models

This library offers a set of meticulously crafted data models, each designed to handle specific data types with precision:

* **PhoneNumber:** Robust international phone number validation and formatting.
* **TZPhoneNumber:** Specialized phone number handling for Tanzania, including network operator identification.
* **Amount:** Precise currency value management, with support for formatting and conversion.
* **Currency:** Detailed currency information, including symbols, formatting rules, and validation.
* **Country:** Enhanced country data handling with ISO-2 and ISO-3 codes, official names, flag emojis, and strongly-typed geographical categorization.
* **Bank:** Consistent bank account information management.

## Report Management with `ReportManager`

The `ReportManager` simplifies the process of generating and downloading reports across various TemboPlus projects.

```typescript
import { ReportManager, FileFormat, ReportType, ProjectType } from '@temboplus/frontend-core';

// Download a report
async function downloadMerchantDisbursementReport() {
    await ReportManager.instance.downloadReport({
        token: "your-auth-token",
        projectType: ProjectType.DASHBOARD,
        reportType: ReportType.MERCHANT_DISBURSEMENT_REPORT,
        fileFormat: FileFormat.PDF,
        query: {
            startDate: "2023-01-01T00:00:00.000Z",
            endDate: "2023-01-31T00:00:00.000Z"
        }
    });
}

// Get all reports for a specific project
import { getReportsByProject } from '@temboplus/frontend-core';
function getAllDashboardReports(){
  const dashboardReports = getReportsByProject(ProjectType.DASHBOARD);
  return dashboardReports;
}
```

### Supported Report Types

* **Dashboard Reports:**
    * `MERCHANT_DISBURSEMENT_REPORT`: Detailed merchant disbursement reports.
    * `TRANSACTION_REVENUE_SUMMARY`: Revenue transaction summaries.
* **Afloat Reports:**
    * `CUSTOMER_WALLET_ACTIVITY`: Customer wallet activity logs.
    * `CUSTOMER_PROFILE_SNAPSHOT`: Customer profile snapshots.
* **VertoX Reports:**
    * `GATEWAY_TRANSACTION_LOG`: Payment gateway transaction logs.

## Configuration Service with `ConfigService`

The `ConfigService` provides a centralized mechanism for managing application configurations.

```typescript
import { ConfigService } from '@temboplus/frontend-core';

// Initialize configuration at application startup
ConfigService.instance.initialize({
    pdfMakerBaseUrl: 'http://localhost:3000' // Optional: Override default PDF maker base URL.
});
```

## Data Model Validation

Each data model includes validation methods to ensure data integrity:

* **`is(object)`:** Checks if an object is a valid instance of the data model.
* **`canConstruct(input)`:** Validates input data before constructing a new instance.
* **`validate()`:** Verifies the validity of an existing data model instance.

```typescript
import { PhoneNumber, Amount } from '@temboplus/frontend-core';

// Using is()
if (PhoneNumber.is(someObject)) {
    console.log(someObject.label);
}

// Using canConstruct()
if (Amount.canConstruct(userInput)) {
    const amount = Amount.from(userInput);
}

// Using validate()
const phoneNumber = PhoneNumber.from("+1234567890");
if (phoneNumber.validate()) {
    // Process the valid phone number.
}
```

## Type-Safe String Literals

This library provides strongly-typed string literals for standardized codes:

* **Country Codes:**
  * `ISO2CountryCode`: Two-letter country codes (e.g., "US", "GB", "DE")
  * `ISO3CountryCode`: Three-letter country codes (e.g., "USA", "GBR", "DEU")
  * `CountryCode`: A union type that accepts either ISO-2 or ISO-3 formats

* **Currency Codes:**
  * `CurrencyCode`: Three-letter currency codes (e.g., "USD", "EUR", "JPY")

These types provide compile-time validation and auto-completion while having zero runtime overhead:

```typescript
import { 
  ISO2CountryCode, 
  ISO3CountryCode, 
  CountryCode, 
  CurrencyCode 
} from '@temboplus/frontend-core';

// Type-safe function parameters
function processTransaction(
  amount: number,
  currency: CurrencyCode,
  country: CountryCode
) {
  // Implementation
}

// Valid calls - compile-time checking ensures only valid codes are accepted
processTransaction(100, "USD", "US");   // ISO-2 country code
processTransaction(200, "EUR", "DEU");  // ISO-3 country code

// Invalid calls - caught by TypeScript at compile time
processTransaction(300, "XYZ", "US");   // Error: "XYZ" is not a valid CurrencyCode
processTransaction(400, "USD", "ZZZ");  // Error: "ZZZ" is not a valid CountryCode
```

## Static Data Access

Convenient static properties are available for accessing common data:

```typescript
import { Country, Currency, Bank, CONTINENT, SUB_REGION } from '@temboplus/frontend-core';

// Country access with enhanced features
const tanzania = Country.TZ;
console.log(tanzania.flagEmoji); // 🇹🇿
console.log(tanzania.continent); // CONTINENT.AFRICA
console.log(tanzania.region); // SUB_REGION.EASTERN_AFRICA

// Regional country grouping with type-safe enums
const africanCountries = Country.getByContinent(CONTINENT.AFRICA);
const caribbeanCountries = Country.getByRegion(SUB_REGION.CARIBBEAN);

// Currency access
const usd = Currency.USD;
const tzs = Currency.TANZANIAN_SHILLING;

// Access country's currency
const japan = Country.JP;
const yen = japan.getCurrency();
console.log(yen?.code); // "JPY"

// Find countries using a specific currency
const euroCountries = Country.getByCurrencyCode("EUR");
console.log(`${euroCountries.length} countries use the Euro`);

// Bank access
const crdb = Bank.CRDB;
const nmb = Bank.NMB;
```

## Phone Number Usage

```typescript
import { PhoneNumber, TZPhoneNumber, PhoneNumberFormat } from '@temboplus/frontend-core';

// International phone numbers
const internationalPhone = PhoneNumber.from("+1 (202) 555-0123");
console.log(internationalPhone.getWithFormat(PhoneNumberFormat.INTERNATIONAL)); // +12025550123

// Tanzania phone numbers
const tanzaniaPhone = TZPhoneNumber.from("0712345678");
console.log(tanzaniaPhone.getWithFormat(PhoneNumberFormat.INTERNATIONAL)); // +255 712 345 678
console.log(tanzaniaPhone.networkOperator.name); // "Yas"
```

## Detailed Model Documentation

* [PhoneNumber](./docs/phone_number.md)
* [Amount](./docs/amount.md)
* [Bank](./docs/bank.md)
* [Currency](./docs/currency.md)
* [Country](./docs/country.md)

## Installation

```bash
npm install @temboplus/frontend-core
```