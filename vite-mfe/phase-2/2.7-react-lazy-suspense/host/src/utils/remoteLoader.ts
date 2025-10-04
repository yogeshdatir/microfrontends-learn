export const createRemoteLoader = (
  importFn: () => Promise<any>,
  maxRetries = 3,
  baseDelay = 1000
) => {
  let retryCount = 0

  const loadWithRetry = async (): Promise<any> => {
    try {
      return await importFn()
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++
        const delay = baseDelay * Math.pow(2, retryCount - 1)

        console.warn(
          `Remote load failed, retrying in ${delay}ms... (${retryCount}/${maxRetries})`
        )

        await new Promise((resolve) => setTimeout(resolve, delay))
        return loadWithRetry()
      }

      throw new Error(
        `Failed to load remote after ${maxRetries} attempts: ${(error as Error).message}`
      )
    }
  }

  return loadWithRetry
}
