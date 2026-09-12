// src/utils/supabaseSanitizer.js

/**
 * Sanitizes payload before sending to Supabase.
 * Converts empty strings to null for optional date, integer, numeric, uuid fields.
 * Ensures booleans are proper booleans.
 */
export function sanitizePayload(table, payload) {
  const columnTypes = {
    profile: { years_experience: 'integer', projects_count: 'integer', clients_count: 'integer', is_available: 'boolean' },
    certifications: { issue_date: 'date', expiry_date: 'date' },
    projects: { display_order: 'integer', is_featured: 'boolean', is_published: 'boolean' },
    skills: { proficiency: 'integer', display_order: 'integer', is_published: 'boolean' },
    education: { start_date: 'date', end_date: 'date', is_current: 'boolean' },
    experience: { start_date: 'date', end_date: 'date', is_current: 'boolean' },
    social_links: { is_visible: 'boolean' },
    services: { is_published: 'boolean' },
    contact_messages: { is_read: 'boolean' }
  };

  const types = columnTypes[table] || {};
  const sanitized = {};
  for (const [k, v] of Object.entries(payload)) {
    const type = types[k];
    if (type === 'date') {
      sanitized[k] = v === '' ? null : v;
    } else if (type === 'integer' || type === 'numeric') {
      sanitized[k] = v === '' || v == null ? null : (parseInt(v, 10) || null);
    } else if (type === 'boolean') {
      sanitized[k] = Boolean(v);
    } else if (type === 'uuid') {
      sanitized[k] = v === '' ? null : v;
    } else {
      sanitized[k] = v;
    }
  }
  return sanitized;
}
