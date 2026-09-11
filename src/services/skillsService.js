import { supabase } from '../lib/supabase';

export const skillsService = {
  async getPublished() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getAll() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(skill) {
    const { data, error } = await supabase.from('skills').insert(skill).select().single();
    if (error) throw error;
    return data;
  },

  async update(id, skill) {
    const { data, error } = await supabase
      .from('skills')
      .update(skill)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
  },
};
