export function createIpcProxy<T>(): T {
  return new Proxy({} as T, {
    get: (_target, _groupName) =>
      new Proxy(
        {},
        {
          get: (_t, methodName) =>
            async (..._args: unknown[]) => {
              throw new Error(`IPC not available: ${String(_groupName)}.${String(methodName)}`)
            }
        }
      )
  })
}
