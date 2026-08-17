// @ts-ignore
import * as XLSX from "xlsx";
import { unparse } from "papaparse";
import { useEffect, useState } from "react";
import { useFranchisee } from "../ContextProvider/FranchiseeContext";

export const disableSymbols = (e: KeyboardEvent) => {
  const prohibitedSymbols = /[,.\/\\|'"`;:{}[\]()*&^%$?#@!`~+=<>_-]/;
  if (
    !e.ctrlKey &&
    !e.altKey &&
    !e.metaKey &&
    e.key.length === 1 &&
    prohibitedSymbols.test(e.key)
  ) {
    e.preventDefault();
  }
};

export const onlyNumbers = (e: KeyboardEvent) => {
  const prohibitedSymbolsAndLetters =
    /[a-zA-Z,.\/\\|'"`;:{}[\]()*&^%$?#@!`~+=<>_-]/;
  if (
    !e.ctrlKey &&
    !e.altKey &&
    !e.metaKey &&
    e.key.length === 1 &&
    prohibitedSymbolsAndLetters.test(e.key)
  ) {
    e.preventDefault();
  }
};

export const formatDate = (dateString: any) => {
  if (!dateString) {
    return "-";
  }

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const date = new Date(dateString);
  let formattedDate = date.toLocaleDateString("en-GB", options);
  formattedDate = formattedDate.replace("am", "AM").replace("pm", "PM");
  return formattedDate;
};

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
};

export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[today.getMonth()];
  const day = String(today.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
}

// export const get30DaysBeforeDate = () => {
//   const today = new Date();
//   const before30Days = new Date(today);
//   before30Days.setDate(today.getDate() - 30);

//   const year = before30Days.getFullYear();
//   let month = before30Days.getMonth() + 1;
//   let day = before30Days.getDate();

//   month = month < 10 ? `0${month}` : month;
//   day = day < 10 ? `0${day}` : day;

//   return `${year}-${month}-${day}`;
// }

export const get90DaysBeforeDate = () => {
  const today = new Date();
  const before90Days = new Date(today);
  before90Days.setDate(today.getDate() - 90);

  const year = before90Days.getFullYear();
  let month = before90Days.getMonth() + 1;
  let day = before90Days.getDate();

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
};

export const isValidHsn = (inputString: string) => {
  const invalidStrings = [
    "00000000",
    "11111111",
    "22222222",
    "33333333",
    "44444444",
    "55555555",
    "66666666",
    "77777777",
    "88888888",
    "99999999",
    "01234567",
    "12345678",
    "23456789",
    "34567890",
    "45678901",
    "56789012",
    "67890123",
    "78901234",
    "89012345",
    "90123456",
  ];

  if (inputString.length >= 6) {
    if (/^[0-9]+$/.test(inputString)) {
      if (invalidStrings.includes(inputString)) {
        // console.log("Invalid HSN Code");
        return false;
      } else {
        // console.log("Valid HSN Code");
        return true;
      }
    } else {
      // console.log("Invalid HSN Code");
      return false;
    }
  } else {
    // console.log("Invalid HSN Code");
    return false;
  }
};

export const convertJSONtoCSV = async (data: any = [], fileName: string) => {
  if (!(data?.length > 0)) {
    return;
  }
  try {
    const csv = unparse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.removeChild(link);
  } catch (error: any) {
    console.log(error.message);
  }
};

export const convertJSONtoXLSX = async (data: any = [], fileName: string) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  } catch (error: any) {
    console.log(error.message);
  }
};

export function downloadAttachment(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = `${url}?${Math.random()}`;
  anchor.download = filename;
  anchor.target = "_blank";
  anchor.click();
  anchor.remove();
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function daysLeft(targetDate: string) {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const today = new Date();
  const target = new Date(targetDate);

  const diffInTime = target.getTime() - today.getTime();
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;
}

export const handlePaste = (value: any, e: any, maxLength: number) => {
  const pastedData = value + e.clipboardData.getData("Text");
  return pastedData.slice(0, maxLength);
};

export function convertUTCtoIST(
  dateString: string,
  locale: string = navigator.language,
): string {
  let utcDate: Date;

  if (dateString.includes(" ") && !dateString.includes("T")) {
    // Manually parse: "YYYY-MM-DD HH:mm:ss"
    const [datePart, timePart] = dateString.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    // Create UTC date safely
    utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  } else {
    utcDate = new Date(dateString);
  }

  if (isNaN(utcDate.getTime())) {
    throw new Error("Invalid date string");
  }

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const options: Intl.DateTimeFormatOptions = {
    timeZone: tz,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return utcDate.toLocaleString(locale, options);
}

export function arraysEqual(arr1: any, arr2: any) {
  if (arr1.length !== arr2.length) return false;

  return arr1.every((item) => arr2.includes(item));
}

export function indianFormat(number: any) {
  const { isOverseas } = useFranchisee();

  const num = Number(number);
  if (isNaN(num)) return "";

  // Truncate to 2 decimal places (no rounding)
  const fixedNum = Math.floor(num * 100) / 100;

  // Always keep 2 decimals
  const [integerPart, decimalPart] = fixedNum.toFixed(2).split(".");

  if (isOverseas == 1) {
    // Overseas format: 1,234,567.89
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedInteger}.${decimalPart}`;
  } else {
    // Indian format: 12,34,567.89
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);

    const formattedInteger =
      (otherDigits
        ? otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ","
        : "") + lastThreeDigits;

    return `${formattedInteger}.${decimalPart}`;
  }
}
export function indianFormat2(number: any, isOverseas: any = 0) {

  const num = Number(number);
  if (isNaN(num)) return "";

  // Truncate to 2 decimal places (no rounding)
  const fixedNum = Math.floor(num * 100) / 100;

  // Always keep 2 decimals
  const [integerPart, decimalPart] = fixedNum.toFixed(2).split(".");

  if (isOverseas == 1) {
    // Overseas format: 1,234,567.89
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedInteger}.${decimalPart}`;
  } else {
    // Indian format: 12,34,567.89
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);

    const formattedInteger =
      (otherDigits
        ? otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ","
        : "") + lastThreeDigits;

    return `${formattedInteger}.${decimalPart}`;
  }
}

export function getDeviceType() {
  const userAgent = window.navigator.userAgent;
  if (/mobile/i.test(userAgent)) {
    return "Mobile";
  }
  if (/tablet/i.test(userAgent)) {
    return "Tablet";
  }
  return "Desktop";
}

export const formatOnlyDate = (dateString: any) => {
  if (!dateString) {
    return "-";
  }

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const date = new Date(dateString);
  let formattedDate = date.toLocaleDateString("en-GB", options);

  const [day, month, year] = formattedDate.split(" ");
  formattedDate = `${day} ${month}, ${year}`;

  return formattedDate;
};

export const getDaysDifference = (targetDateStr: any) => {
  if (!targetDateStr) {
    return "-";
  }

  const targetDate = new Date(targetDateStr);
  const today = new Date();

  const timeDifference = today - targetDate;

  const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

  return daysDifference;
};

export const getChargeableWeight = (value?: any) => {
  const total = value.reduce((acc: any, item: any) => {
    return (
      acc +
      Math.max(
        item?.weight,
        (Number(item?.height) *
          Number(item?.breadth) *
          Number(item?.length) *
          Number(item?.quantity)) /
        5000,
      )
    );
  }, 0);
  return total || 0;
};

// Format Date
export const formatDateDDMMYYYY = (dateString: any) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};
export const checkObjLength = (obj: any = {}) => {
  return Object.keys(obj).length;
};

export const beautify = (text: any) => {
  return text.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
};


export const getCourierMaxLength = (courierCode: any) => {
  if (!courierCode) return 60;

  if (courierCode.includes("dhl")) return 45;
  if (courierCode.includes("widect")) return 40;
  if (courierCode.includes("fedex")) return 35;

  return 60;
};


type HandleConditionalPasteParams = {
  key: string;
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
  event: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>;
  courierCode?: string;
};

export const handleConditionalPaste = ({
  key,
  state,
  setState,
  event,
  courierCode,
}: HandleConditionalPasteParams) => {
  if (!courierCode) return;

  let maxLength = 60;

  if (courierCode.includes("dhl")) {
    maxLength = 45;
  } else if (courierCode.includes("widect")) {
    maxLength = 40;
  } else if (courierCode.includes("fedex")) {
    maxLength = 35;
  }

  event.preventDefault();

  const data = handlePaste(state?.[key], event, maxLength);

  setState((prev: any) => ({
    ...prev,
    [key]: data,
  }));
};