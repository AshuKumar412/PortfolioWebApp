import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for Supabase CRUD operations in admin pages.
 */
export function useCrud(service) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.getAll();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = async (data) => {
    const item = await service.create(data);
    setItems(prev => [...prev, item]);
    return item;
  };

  const update = async (id, data) => {
    const item = await service.update(id, data);
    setItems(prev => prev.map(i => (i.id === id ? item : i)));
    return item;
  };

  const remove = async (id) => {
    await service.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return { items, loading, error, refetch: fetchAll, create, update, remove };
}
