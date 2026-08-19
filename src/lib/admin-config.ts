import 'server-only'

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} is required`)
  return value
}

export function getAdminApiBaseUrl(): string {
  return getRequiredEnvironmentVariable('TELEGRAM_ADMIN_API_URL').replace(
    /\/+$/,
    '',
  )
}

export function getTelegramOidcConfiguration() {
  return {
    clientId: getRequiredEnvironmentVariable('TELEGRAM_OIDC_CLIENT_ID'),
    clientSecret: getRequiredEnvironmentVariable(
      'TELEGRAM_OIDC_CLIENT_SECRET',
    ),
    redirectUri: getRequiredEnvironmentVariable('TELEGRAM_OIDC_REDIRECT_URI'),
  }
}
