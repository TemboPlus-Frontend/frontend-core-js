import FileSaver from "file-saver";
import { ConfigService } from "@config/index.ts";

/**
 * Available file formats for reports
 */
export enum FileFormat {
  /** PDF file format */
  PDF = "pdf",
  /** Excel file format */
  EXCEL = "excel",
}

/**
 * Available project types
 */
export enum ProjectType {
  /** Tembo Dashboard project */
  DASHBOARD = "dashboard",
  /** Afloat project */
  AFLOAT = "afloat",
  /** VertoX project */
  VERTO_X = "verto_x",
}

/**
 * Available report types with improved naming
 */
export enum ReportType {
  /** Merchant payout statement (Dashboard) */
  MERCHANT_DISBURSEMENT_REPORT = "merchant_disbursement_report",
  /** Transaction revenue summary (Dashboard) */
  TRANSACTION_REVENUE_SUMMARY = "transaction_revenue_summary",
  /** Customer wallet activity (Afloat) */
  CUSTOMER_WALLET_ACTIVITY = "customer_wallet_activity",
  /** Customer profile information (Afloat) */
  CUSTOMER_PROFILE_SNAPSHOT = "customer_profile_snapshot",
  /** Gateway transaction log (VertoX) */
  GATEWAY_TRANSACTION_LOG = "gateway_transaction_log",
}

/**
 * Report definition interface
 */
export interface ReportDefinition {
  /** Unique identifier for the report */
  id: string;
  /** Human-readable report name for UI display */
  displayName: string;
  /** API endpoint path for the report */
  endpoint: string;
  /** Available file formats for the report */
  availableFormats: FileFormat[];
  /** Optional description of the report */
  description?: string;
  /** Project the report belongs to */
  projectType: ProjectType;
  /** Type of the report */
  reportType: ReportType;
}

/**
 * Registry of all available reports
 */
export const REPORTS = {
  // Dashboard Reports
  [ReportType.MERCHANT_DISBURSEMENT_REPORT]: {
    id: "merchant_disbursement_report",
    displayName: "Merchant Disbursement Report",
    endpoint: "/dashboard/merchant_disbursements",
    availableFormats: [FileFormat.PDF, FileFormat.EXCEL],
    projectType: ProjectType.DASHBOARD,
    reportType: ReportType.MERCHANT_DISBURSEMENT_REPORT,
    description: "Detailed breakdown of payments made to merchants",
  } as ReportDefinition,

  [ReportType.TRANSACTION_REVENUE_SUMMARY]: {
    id: "transaction_revenue_summary",
    displayName: "Transaction Revenue Summary",
    endpoint: "/dashboard/revenue_summary",
    availableFormats: [FileFormat.PDF, FileFormat.EXCEL],
    projectType: ProjectType.DASHBOARD,
    reportType: ReportType.TRANSACTION_REVENUE_SUMMARY,
    description: "Summary of all revenue transactions by period",
  } as ReportDefinition,

  // Afloat Reports
  [ReportType.CUSTOMER_WALLET_ACTIVITY]: {
    id: "customer_wallet_activity",
    displayName: "Customer Wallet Activity",
    endpoint: "/afloat/wallet_activity",
    availableFormats: [FileFormat.PDF, FileFormat.EXCEL],
    projectType: ProjectType.AFLOAT,
    reportType: ReportType.CUSTOMER_WALLET_ACTIVITY,
    description: "Detailed record of all customer wallet transactions",
  } as ReportDefinition,

  [ReportType.CUSTOMER_PROFILE_SNAPSHOT]: {
    id: "customer_profile_snapshot",
    displayName: "Customer Profile Snapshot",
    endpoint: "/afloat/profile_snapshot",
    availableFormats: [FileFormat.PDF],
    projectType: ProjectType.AFLOAT,
    reportType: ReportType.CUSTOMER_PROFILE_SNAPSHOT,
    description: "Current account information and status",
  } as ReportDefinition,

  // VertoX Reports
  [ReportType.GATEWAY_TRANSACTION_LOG]: {
    id: "gateway_transaction_log",
    displayName: "Gateway Transaction Log",
    endpoint: "/vertox/gateway_transactions",
    availableFormats: [FileFormat.EXCEL],
    projectType: ProjectType.VERTO_X,
    reportType: ReportType.GATEWAY_TRANSACTION_LOG,
    description: "Log of all payment gateway API transactions",
  } as ReportDefinition,
};

/**
 * Get all reports for a specific project
 * @param projectType The project type to filter by
 * @returns Array of report definitions for the project
 */
export function getReportsByProject(
  projectType: ProjectType,
): ReportDefinition[] {
  return Object.values(REPORTS).filter((report) =>
    report.projectType === projectType
  );
}

/**
 * Get a report by its type
 * @param reportType The report type to retrieve
 * @returns The report definition or undefined if not found
 */
export function getReportByType(reportType: ReportType): ReportDefinition {
  return REPORTS[reportType];
}

/**
 * Validates if a report type is available for a project
 * @param projectType The project type
 * @param reportType The report type
 * @returns True if the report is available for the project, false otherwise
 */
export function isReportAvailableForProject(
  projectType: ProjectType,
  reportType: ReportType,
): boolean {
  const report = REPORTS[reportType];
  return report !== undefined && report.projectType === projectType;
}

/**
 * Report Manager class for handling report downloads
 */
export class ReportManager {
  private static _instance: ReportManager;

  private constructor() {}

  /**
   * Get the singleton instance of ReportManager
   */
  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  /**
   * Get the base URL for the report API
   * @returns The base URL
   */
  private getBaseURL = () => {
    let url = ConfigService.instance.pdfMakerBaseUrl;
    if (url.trim().length === 0) {
      url = "https://api.afloat.money/pdf-maker";
    }
    if (url.endsWith("/")) return url.slice(0, -1);
    return url;
  };

  /**
   * Downloads a report based on project type and report type
   * @param args Arguments for the report download
   * @returns Promise that resolves when download is complete
   */
  public async downloadReport(args: {
    token: string;
    projectType: ProjectType;
    reportType: ReportType;
    fileFormat: FileFormat;
    // deno-lint-ignore no-explicit-any
    query?: Record<string, any>;
  }): Promise<void> {
    try {
      // Get the report from the registry
      const report = REPORTS[args.reportType];
      if (!report) {
        throw new Error(
          `Report type ${args.reportType} not configured`,
        );
      }

      // Validate that the report belongs to the specified project
      if (report.projectType !== args.projectType) {
        throw new Error(
          `Report type ${args.reportType} does not belong to project ${args.projectType}`,
        );
      }

      // Check if requested format is supported
      if (!report.availableFormats.includes(args.fileFormat)) {
        throw new Error(
          `File format ${args.fileFormat} not supported for ${report.displayName}`,
        );
      }

      // Build URL using the report's endpoint
      let url = `${this.getBaseURL()}${report.endpoint}`;

      // Create a properly typed query parameters object
      // deno-lint-ignore no-explicit-any
      const queryParams: Record<string, any> = {
        ...(args.query || {}),
        fileFormat: args.fileFormat,
      };

      // Build the query string
      const searchParams = new URLSearchParams();

      for (const key in queryParams) {
        if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
          const value = queryParams[key];

          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach((item) => {
                searchParams.append(
                  key + "[]",
                  String(item),
                );
              });
            } else {
              searchParams.append(key, String(value));
            }
          }
        }
      }

      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      // Make the request
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${args.token}`,
        },
      });

      if (response.status !== 200) {
        await this.handleErrorResponse(response);
      }

      // Process the download
      await this.processDownload(response, report, args.fileFormat);
    } catch (error) {
      console.error("Report download failed:", error);
      throw error;
    }
  }

  /**
   * Process the download
   * @param response The response from the API
   * @param report The report definition
   * @param fileFormat The requested file format
   */
  private async processDownload(
    response: Response,
    report: ReportDefinition,
    fileFormat: FileFormat,
  ): Promise<void> {
    const contentDisposition = response.headers.get("Content-Disposition");

    // Get default filename based on report and file format
    const defaultFilename = this.getDefaultFilename(report, fileFormat);

    // Try to get filename from Content-Disposition, fall back to default
    const fileName =
      this.extractFilenameFromContentDisposition(contentDisposition) ||
      defaultFilename;

    // Handle the response based on content type
    // deno-lint-ignore no-explicit-any
    const blob = await this.b64toBlob(await response.text() as any);
    FileSaver.saveAs(blob, fileName);
  }

  /**
   * Handle error responses from the API
   * @param response The response from the API
   * @throws Error with appropriate message
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = "Encountered an error while generating report";

    try {
      // Try to parse as JSON first
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error ||
          errorMessage;
      } else {
        // Try to get error as text
        const textError = await response.text();
        if (textError) {
          errorMessage = textError;
        }
      }
    } catch (parseError) {
      console.error("Error parsing error response:", parseError);
    }

    throw new Error(errorMessage);
  }

  /**
   * Generates a default filename based on report and file format
   * @param report The report definition
   * @param fileFormat The requested file format
   * @returns A suitable default filename with proper extension
   */
  private getDefaultFilename(
    report: ReportDefinition,
    fileFormat: FileFormat,
  ): string {
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

    // Build the filename with project, report type, and date
    const baseFilename = `${report.id}_${date}`;

    // Add the extension based on the file format
    return fileFormat === FileFormat.PDF
      ? `${baseFilename}.pdf`
      : `${baseFilename}.xlsx`;
  }

  /**
   * Extracts the filename from the Content-Disposition header
   * @param contentDisposition The Content-Disposition header value
   * @returns The extracted filename or null if not found
   */
  private extractFilenameFromContentDisposition(
    contentDisposition?: string | null,
  ): string | null {
    // Check if the header exists
    if (!contentDisposition) {
      return null;
    }

    // Try to match the filename pattern
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDisposition);

    if (matches && matches[1]) {
      // Clean up the filename by removing quotes if present
      let filename = matches[1].trim();

      // Remove surrounding quotes if they exist
      if (filename.startsWith('"') && filename.endsWith('"')) {
        filename = filename.substring(1, filename.length - 1);
      } else if (filename.startsWith("'") && filename.endsWith("'")) {
        filename = filename.substring(1, filename.length - 1);
      }

      return filename;
    }

    return null;
  }

  /**
   * Converts a base64 string to a Blob
   * @param base64 The base64 string
   * @returns A Blob
   */
  private b64toBlob = (base64: string) =>
    fetch(base64).then((res) => res.blob());
}
