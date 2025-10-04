const remoteModuleCache = new Map<string, Promise<any>>()

export const preloadRemoteModule = (
  moduleName: string,
  importFn: () => Promise<any>
) => {
  if (!remoteModuleCache.has(moduleName)) {
    remoteModuleCache.set(moduleName, importFn())
  }
  return remoteModuleCache.get(moduleName)!
}

export const createPreloadedLazy = (
  moduleName: string,
  importFn: () => Promise<any>
) => {
  return () => preloadRemoteModule(moduleName, importFn)
}
