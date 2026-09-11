import { supabase } from '../lib/supabase';

const crudService = (table) => ({
  async getPublished() {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getAll() {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(record) {
    const { data, error } = await supabase.from(table).insert(record).select().single();
    if (error) throw error;
    return data;
  },

  async update(id, record) {
    const { data, error } = await supabase
      .from(table)
      .update(record)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  },
});

export const educationService = crudService('education');
