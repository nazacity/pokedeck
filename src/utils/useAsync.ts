import { useState, useCallback, useRef, useEffect } from 'react';

export type PendingStatus = 'idle' | 'loading' | 'successed' | 'failed';
interface useAsyncProps {
  immediate?: boolean;
  args?: any;
  onSuccess?: (res: any | null) => void;
  onFailed?: (err: any | null) => void;
  onFinal?: () => void;
  onFinish?: (res: any | null) => void;
}

const useAsync = <DataType>(
  promise: (args?: any) => Promise<DataType>,
  {
    immediate = false,
    args,
    onSuccess,
    onFailed,
    onFinal,
    onFinish,
  }: useAsyncProps
) => {
  const [data, setValue] = useState<DataType | null | undefined>(null);
  const [error, setError] = useState<any | null>(null);
  const [status, setStatus] = useState<PendingStatus>('idle');

  const reset = useCallback(() => {
    setStatus('idle');
    setValue(null);
    setError(null);
  }, []);

  const _onSuccess = useRef(onSuccess);
  const _onFailed = useRef(onFailed);
  const _savedPromiseFunction = useRef(promise);
  const _onFinal = useRef(onFinal);
  const _onFinish = useRef(onFinish);

  const _setLoadState = useCallback((status: PendingStatus) => {
    setStatus(status);
  }, []);

  const execute = useCallback(
    (args?: any) => {
      _setLoadState('loading');
      setValue(undefined);

      // Note: IE(old) browser not support async/await feature you can use only promise/then
      _savedPromiseFunction
        .current(args)
        .then((res: any) => {
          if (_onSuccess.current) {
            _onSuccess.current(res);
          }
          _setLoadState('successed');
          setValue(res);
          return res;
        })
        .then((res: any) => {
          if (_onFinish.current) {
            _onFinish.current(res);
          }
          return res;
        })
        .catch((error: any) => {
          if (_onFailed.current) {
            _onFailed.current(error.message);
          }
          _setLoadState('failed');
          setError(error.message);
          setValue(null);
        })
        .finally(() => {
          if (_onFinal.current) {
            _onFinal.current();
          }
        });
    },
    [_setLoadState]
  );

  useEffect(() => {
    if (immediate) {
      if (args) {
        execute(args);
      } else {
        execute();
      }
    }
  }, [execute, immediate]);

  // return { execute, status: 'loading', data, error, reset };
  return { execute, status, data, error, reset };
};

export default useAsync;
