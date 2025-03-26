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
* **Country:** Standardized country data with ISO codes and comprehensive validation.
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
    pdfMakerBaseUrl: 'https://api.temboplus.com/pdf-maker' // Optional: Override default PDF maker base URL.
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

## Static Data Access

Convenient static properties are available for accessing common data:

```typescript
import { Country, Currency, Bank } from '@temboplus/frontend-core';

// Country access
const tanzania = Country.TZ;
const usa = Country.UNITED_STATES;

// Currency access
const usd = Currency.USD;
const tzs = Currency.TANZANIAN_SHILLING;

// Bank access
const crdb = Bank.CRDB;
const nmb = Bank.NMB;
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
