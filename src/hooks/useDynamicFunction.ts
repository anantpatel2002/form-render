import { callFormFunction } from '@/lib/dynamicFunctionLoader';
import React, { useCallback, useEffect, useState } from 'react';

export function useDynamicOptions({ functionName, args = [], context = {}, enabled = true }: { functionName: string; args?: any[]; context?: any; enabled?: boolean }) {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await callFormFunction(functionName, args, { formValues: context });
      setOptions(Array.isArray(res) ? res : []);
    } catch (e) {
      setError(e);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [functionName, JSON.stringify(args), JSON.stringify(context), enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { options, loading, error, reload: load };
}