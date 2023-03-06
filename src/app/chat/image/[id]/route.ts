import { BASE_TG_URL, TG_FILE_URL } from '@/constants'

interface ChatImageParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: ChatImageParams) {
  const imgFile = await fetch(`${BASE_TG_URL}/getFile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_id: params.id }),
    next: { revalidate: 30 }, // 30 sec revalidation
  }).then((r) => r.json())

  return fetch(`${TG_FILE_URL}/${imgFile.result.file_path}`)
}
