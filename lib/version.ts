// Application version information
export const APP_VERSION = {
  version: '1.0.5',
  releaseDate: '2025-08-18',
  buildNumber: process.env.NEXT_PUBLIC_BUILD_NUMBER || 'dev',
  environment: process.env.NODE_ENV || 'development'
}

// Version string for display
export const getVersionString = () => {
  const { version, environment } = APP_VERSION
  if (environment === 'production') {
    return `v${version}`
  }
  return `v${version}-${environment}`
}

// Full version info for debugging
export const getFullVersionInfo = () => {
  const { version, releaseDate, buildNumber, environment } = APP_VERSION
  return `Version ${version} (Build ${buildNumber}) - Released ${releaseDate} - ${environment}`
}