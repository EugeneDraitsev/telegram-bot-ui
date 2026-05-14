import {
  getTelegramFile,
  getTelegramFileUrl,
  stripImageExtension,
} from '@/lib/telegram'

interface ChatImageParams {
  params: Promise<{ id: string }>
}

const getImageContentType = (filePath: string, upstreamContentType: string) => {
  if (upstreamContentType && upstreamContentType !== 'application/octet-stream') {
    return upstreamContentType
  }

  if (filePath.endsWith('.webp')) {
    return 'image/webp'
  }

  if (filePath.endsWith('.png')) {
    return 'image/png'
  }

  return 'image/jpeg'
}

export async function GET(request: Request, { params }: ChatImageParams) {
  const { id } = await params
  const fileId = stripImageExtension(id)
  const imgFile = await getTelegramFile(fileId)

  if (!imgFile?.file_path) {
    return Response.redirect(new URL('/favicon.png', request.url))
  }

  const imageResponse = await fetch(getTelegramFileUrl(imgFile.file_path), {
    next: { revalidate: 30 },
  })

  if (!imageResponse.ok || !imageResponse.body) {
    return Response.redirect(new URL('/favicon.png', request.url))
  }

  return new Response(imageResponse.body, {
    headers: {
      'Content-Type': getImageContentType(
        imgFile.file_path,
        imageResponse.headers.get('Content-Type') || '',
      ),
    },
  })
}
