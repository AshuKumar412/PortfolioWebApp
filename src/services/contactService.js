import { supabase } from '../lib/supabase';

export const contactService = {
  async submit(message) {
    const { error } = await supabase
      .from('contact_messages')
      .insert(message);
    if (error) throw error;
    return true;
  },

  async getAll({ page = 1, limit = 20 } = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) throw error;
    return { data: data || [], count };
  },

  async markRead(id) {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async markUnread(id) {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_read: false })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
  },

  async getUnreadCount() {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);
    if (error) throw error;
    return count || 0;
  },
};
