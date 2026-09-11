import { supabase } from '../lib/supabase';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const ALLOWED_DOC_TYPES = ['application/pdf'];
const MAX_SIZE_MB = 5;

function validateFile(file, types) {
  if (!types.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${types.join(', ')}`);
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`File too large. Max size: ${MAX_SIZE_MB}MB`);
  }
}

export const storageService = {
  async uploadAvatar(file) {
    validateFile(file, ALLOWED_IMAGE_TYPES);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `avatar_${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, cacheControl: '60' });
    if (error) throw error;
    return storageService.getPublicUrl('avatars', data.path);
  },

  async uploadProjectImage(file, projectId) {
    validateFile(file, ALLOWED_IMAGE_TYPES);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${projectId || 'project'}_${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from('projects')
      .upload(path, file, { upsert: true, cacheControl: '60' });
    if (error) throw error;
    return storageService.getPublicUrl('projects', data.path);
  },

  async uploadCertification(file, certId) {
    validateFile(file, ALLOWED_IMAGE_TYPES);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${certId || 'cert'}_${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from('certifications')
      .upload(path, file, { upsert: true, cacheControl: '60' });
    if (error) throw error;
    return storageService.getPublicUrl('certifications', data.path);
  },

  async uploadResume(file) {
    validateFile(file, ALLOWED_DOC_TYPES);
    const path = `resume_${Date.now()}.pdf`;
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(path, file, { upsert: true, cacheControl: '60' });
    if (error) throw error;
    return storageService.getPublicUrl('resumes', data.path);
  },

  getPublicUrl(bucket, path) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  async deleteFile(bucket, path) {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  },
};
