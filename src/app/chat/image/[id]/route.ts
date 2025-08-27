import { BASE_TG_URL, TG_FILE_URL } from '@/constants'

interface ChatImageParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: ChatImageParams) {
  const { id } = await params
  const file_id = id.split('.').at(0)
  const imgFile = await fetch(`${BASE_TG_URL}/getFile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_id }),
    next: { revalidate: 30 }, // 30 sec revalidation
  }).then((r) => r.json())

  const response = new Response(
    await fetch(`${TG_FILE_URL}/${imgFile.result.file_path}`).then(
      (r) => r.body,
    ),
  )
  response.headers.set('Content-Type', 'image/jpeg')
  return response
}
