import { useState, useEffect } from 'react';
import * as catalogApi from '../api/catalog';
import type { Sector, Acabado } from '../api/catalog';
import type { ApiError } from '../api/client';

export function useSectors(): {
  sectors: Sector[];
  loading: boolean;
  error: ApiError | null;
} {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    catalogApi.fetchSectors().then((res) => {
      if (res.error) setError(res.error);
      else if (res.data) setSectors(res.data);
      setLoading(false);
    });
  }, []);

  return { sectors, loading, error };
}

export function useFinishes(type?: 'piso' | 'cocina' | 'bano'): {
  finishes: Acabado[];
  loading: boolean;
  error: ApiError | null;
} {
  const [finishes, setFinishes] = useState<Acabado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    catalogApi.fetchFinishes(type).then((res) => {
      if (res.error) setError(res.error);
      else if (res.data) setFinishes(res.data);
      setLoading(false);
    });
  }, [type]);

  return { finishes, loading, error };
}
