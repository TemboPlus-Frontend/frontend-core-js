import {
  MobileNumberFormat,
  type Telecom,
  telecomDetails,
  type TransactionType,
} from "@models/phone_number/types.ts";

export class PhoneNumber {
  compactNumber: string;

  constructor(compactNumber: string) {
    this.compactNumber = compactNumber;
  }

  getNumberWithFormat(format: MobileNumberFormat): string {
    return `${format}${this.compactNumber}`;
  }

  get255Number(): string {
    return this.getNumberWithFormat(MobileNumberFormat.s255);
  }

  get label(): string {
    return this.getNumberWithFormat(MobileNumberFormat.s255);
  }

  get telecom(): Telecom {
    const id = this.compactNumber.substring(0, 2);
    const result = Object.values(telecomDetails).find((e) =>
      e.prefixes.includes(id)
    )!;
    return result;
  }

  getPayoutChannel(type: TransactionType): string {
    const company = this.telecom.label.toUpperCase();
    return `TZ-${company}-${type}`;
  }

  static from(s: string): PhoneNumber | undefined {
    try {
      const number = s.trim();
      let compactNumber: string;

      if (number.startsWith("+255")) {
        compactNumber = number.substring(4);
      } else if (number.startsWith("255")) {
        compactNumber = number.substring(3);
      } else if (number.startsWith("0")) {
        compactNumber = number.substring(1);
      } else {
        compactNumber = number;
      }

      if (compactNumber.length !== 9) return;

      const id: string = compactNumber.substring(0, 2);
      const telecom = Object.values(telecomDetails).find((e) =>
        e.prefixes.includes(id)
      );
      if (!telecom) return;

      return new PhoneNumber(compactNumber);
    } catch (_) {
      return;
    }
  }
}
