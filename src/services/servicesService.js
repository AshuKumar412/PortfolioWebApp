import { supabase } from '../lib/supabase';

export const servicesService = {
  async getPublished() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getAll() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(record) {
    const { data, error } = await supabase.from('services').insert(record).select().single();
    if (error) throw error;
    return data;
  },

  async update(id, record) {
    const { data, error } = await supabase
      .from('services')
      .update({ ...record })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
  },
};
