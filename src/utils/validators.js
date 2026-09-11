/**
 * Validators for forms and file uploads
 */

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRequired(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateFileType(file, allowedTypes) {
  return allowedTypes.includes(file.type);
}

export function validateFileSize(file, maxMB = 5) {
  return file.size <= maxMB * 1024 * 1024;
}

export function validateContactForm(data) {
  const errors = {};
  if (!validateRequired(data.name)) errors.name = 'Name is required';
  if (!validateRequired(data.email)) errors.email = 'Email is required';
  else if (!validateEmail(data.email)) errors.email = 'Please enter a valid email';
  if (!validateRequired(data.subject)) errors.subject = 'Subject is required';
  if (!validateRequired(data.message)) errors.message = 'Message is required';
  else if (data.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
  return errors;
}
