import { supabase } from '../lib/supabase';

const ALLOWED_PROFILE_COLS = [
  'name', 'title', 'tagline', 'bio', 'bio_extended',
  'email', 'location', 'github_url', 'linkedin_url',
  'avatar_url', 'resume_url', 'years_experience',
  'projects_count', 'clients_count', 'coffee_count', 'is_available'
];

function sanitizeProfile(data) {
  const sanitized = {};
  for (const col of ALLOWED_PROFILE_COLS) {
    if (col in data) {
      sanitized[col] = data[col];
    }
  }

  // Ensure integer columns are integers or null, never empty strings or NaN
  const intCols = ['years_experience', 'projects_count', 'clients_count'];
  for (const col of intCols) {
    if (col in sanitized) {
      if (sanitized[col] === '' || sanitized[col] == null) {
        sanitized[col] = null;
      } else {
        const parsed = parseInt(sanitized[col], 10);
        sanitized[col] = Number.isNaN(parsed) ? null : parsed;
      }
    }
  }

  // Ensure boolean is true/false
  if ('is_available' in sanitized) {
    sanitized.is_available = Boolean(sanitized.is_available);
  }

  sanitized.updated_at = new Date().toISOString();
  return sanitized;
}

export const profileService = {
  async get() {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async upsert(profileData) {
    const payload = sanitizeProfile(profileData);
    const existingId = profileData.id;

    if (existingId) {
      const { data, error } = await supabase
        .from('profile')
        .update(payload)
        .eq('id', existingId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Check if any row exists
    const { data: existing } = await supabase
      .from('profile')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { data, error } = await supabase
        .from('profile')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // No row exists, insert fresh
    const { data, error } = await supabase
      .from('profile')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
