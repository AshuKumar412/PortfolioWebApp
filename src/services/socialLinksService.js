import { supabase } from '../lib/supabase';

export const socialLinksService = {
  async getVisible() {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getAll() {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(link) {
    const { data, error } = await supabase.from('social_links').insert(link).select().single();
    if (error) throw error;
    return data;
  },

  async update(id, link) {
    const { data, error } = await supabase
      .from('social_links')
      .update({ ...link })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('social_links').delete().eq('id', id);
    if (error) throw error;
  },
};
