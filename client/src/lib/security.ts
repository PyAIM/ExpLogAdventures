/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Removes potentially dangerous characters and HTML tags
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove script-related content
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Validate player name
 * Returns error message if invalid, null if valid
 */
export function validatePlayerName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Please enter your name';
  }
  
  const sanitized = sanitizeInput(name);
  
  if (sanitized.length === 0) {
    return 'Name contains invalid characters';
  }
  
  if (sanitized.length > 50) {
    return 'Name must be 50 characters or less';
  }
  
  if (sanitized.length < 2) {
    return 'Name must be at least 2 characters';
  }
  
  // Check for only special characters
  if (!/[a-zA-Z0-9]/.test(sanitized)) {
    return 'Name must contain at least one letter or number';
  }
  
  return null;
}

/**
 * Sanitize numeric input for calculations
 * Returns a safe number or default value
 */
export function sanitizeNumber(input: string | number, defaultValue: number = 0): number {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  
  if (isNaN(num) || !isFinite(num)) {
    return defaultValue;
  }
  
  return num;
}

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Validate and sanitize localStorage data
 */
export function sanitizeStorageData(key: string, data: any): any {
  try {
    // Ensure data is not too large (prevent localStorage overflow attacks)
    const serialized = JSON.stringify(data);
    if (serialized.length > 1024 * 100) { // 100KB limit
      console.warn(`Storage data for ${key} exceeds size limit`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error sanitizing storage data for ${key}:`, error);
    return null;
  }
}
