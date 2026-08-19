import { redirect } from 'next/navigation'

interface SignInPageProps {
  searchParams: Promise<{ error?: string | string[] }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const error = (await searchParams).error
  const errorCode = Array.isArray(error) ? error[0] : error
  const params = new URLSearchParams({ backUrl: '/admin' })
  if (errorCode) params.set('error', errorCode)
  redirect(`/sign-in?${params}`)
}
