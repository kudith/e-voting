import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date object to a readable string
 * @param {Date|string} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    if (!date) return "-";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("id-ID", mergedOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(date);
  }
}

// Format date with time (e.g., 10 Jan 2023, 14:30)
export function formatDateTime(date) {
  if (!date) return "-";
  
  const dateOptions = { day: "numeric", month: "short", year: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit" };
  
  try {
    const formattedDate = new Date(date).toLocaleDateString("id-ID", dateOptions);
    const formattedTime = new Date(date).toLocaleTimeString("id-ID", timeOptions);
    return `${formattedDate}, ${formattedTime}`;
  } catch (error) {
    console.error("Error formatting date time:", error);
    return "-";
  }
}

/**
 * Format a number with thousand separators
 * @param {number} number - The number to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted number string
 */
export function formatNumber(number, options = {}) {
  const defaultOptions = {
    maximumFractionDigits: 0,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    if (number === undefined || number === null) return "0";
    return new Intl.NumberFormat("id-ID", mergedOptions).format(number);
  } catch (error) {
    console.error("Error formatting number:", error);
    return String(number);
  }
}

// Calculate time difference between two dates and return in a human-readable format
export function getTimeDifference(startDate, endDate) {
  if (!startDate || !endDate) return "-";
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end - start;
    
    // Convert to days/hours/minutes
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format output based on time difference
    if (days > 0) {
      return `${days} hari${hours > 0 ? `, ${hours} jam` : ""}`;
    } else if (hours > 0) {
      return `${hours} jam${minutes > 0 ? `, ${minutes} menit` : ""}`;
    } else if (minutes > 0) {
      return `${minutes} menit`;
    } else {
      return "Kurang dari 1 menit";
    }
  } catch (error) {
    console.error("Error calculating time difference:", error);
    return "-";
  }
}

/**
 * Calculate time remaining from a future date
 * @param {Date|string} futureDate - The future date
 * @returns {string} Formatted time remaining
 */
export function timeRemaining(futureDate) {
  try {
    if (!futureDate) return "-";
    const dateObj = typeof futureDate === "string" ? new Date(futureDate) : futureDate;
    const now = new Date();
    
    if (dateObj <= now) return "Selesai";
    
    const diffMs = dateObj - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} hari`;
    } else {
      return `${diffHours} jam`;
    }
  } catch (error) {
    console.error("Error calculating time remaining:", error);
    return "-";
  }
}
