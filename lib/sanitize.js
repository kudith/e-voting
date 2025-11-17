/**
 * Security utilities for sanitizing user input and preventing XSS
 */

/**
 * Escape HTML special characters to prevent XSS
 * React already does this automatically for JSX expressions,
 * but this can be used for additional security in API responses
 */
export function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Remove potentially dangerous HTML tags and attributes
 */
export function sanitizeHtml(html) {
  if (typeof html !== 'string') return html;
  
  // Remove script tags
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers (onclick, onerror, etc.)
  html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  html = html.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocol
  html = html.replace(/javascript:/gi, '');
  
  // Remove data: protocol (can be used for XSS)
  html = html.replace(/data:text\/html/gi, '');
  
  return html;
}

/**
 * Validate and sanitize election data
 */
export function sanitizeElectionData(election) {
  if (!election) return election;
  
  return {
    ...election,
    title: sanitizeHtml(election.title || ''),
    description: sanitizeHtml(election.description || ''),
  };
}

/**
 * Validate and sanitize candidate data
 */
export function sanitizeCandidateData(candidate) {
  if (!candidate) return candidate;
  
  return {
    ...candidate,
    name: sanitizeHtml(candidate.name || ''),
    visionMission: sanitizeHtml(candidate.visionMission || ''),
  };
}

/**
 * Validate and sanitize voter data
 */
export function sanitizeVoterData(voter) {
  if (!voter) return voter;
  
  return {
    ...voter,
    name: sanitizeHtml(voter.name || ''),
    email: sanitizeHtml(voter.email || ''),
    nim: sanitizeHtml(voter.nim || ''),
  };
}

/**
 * Validate SQL query parameters to prevent SQL injection
 */
export function validateSqlParam(param) {
  if (typeof param !== 'string') return param;
  
  // Check for common SQL injection patterns
  const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)|(-{2})|\/\*|\*\/|;/gi;
  
  if (sqlInjectionPattern.test(param)) {
    throw new Error('Invalid input detected');
  }
  
  return param;
}

/**
 * Sanitize object recursively
 */
export function deepSanitize(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeHtml(obj) : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  }
  
  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = deepSanitize(obj[key]);
    }
  }
  
  return sanitized;
}

/**
 * Content Security Policy headers
 */
export const cspHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline & unsafe-eval
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://adty.kinde.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
