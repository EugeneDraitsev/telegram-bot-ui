import {
  getChatPhotoFileId,
  getTelegramFile,
  getTelegramFileUrl,
  TELEGRAM_REVALIDATE_SECONDS,
} from '@/lib/telegram'

export const runtime = 'nodejs'

interface ChatImageParams {
  params: Promise<{ id: string }>
}

const getImageContentType = (
  filePath: string,
  upstreamContentType: string,
): string => {
  if (upstreamContentType && upstreamContentType !== 'application/octet-stream')
    return upstreamContentType
  if (filePath.endsWith('.webp')) return 'image/webp'
  if (filePath.endsWith('.png')) return 'image/png'
  return 'image/jpeg'
}

const fallback = (request: Request) =>
  Response.redirect(new URL('/favicon.png', request.url))

// Keyed by chat ID rather than by Telegram file ID on purpose. A file-ID route
// would proxy *any* file the bot can reach, including media users posted in
// chats; resolving the photo here means this can only ever serve chat avatars.
export async function GET(request: Request, { params }: ChatImageParams) {
  const { id } = await params
  if (!/^-?[1-9]\d*$/.test(id)) return fallback(request)

  const photoFileId = await getChatPhotoFileId(id)
  if (!photoFileId) return fallback(request)

  const imgFile = await getTelegramFile(photoFileId)
  const fileUrl = imgFile?.file_path
    ? getTelegramFileUrl(imgFile.file_path)
    : undefined
  if (!imgFile?.file_path || !fileUrl) return fallback(request)

  const imageResponse = await fetch(fileUrl, {
    next: { revalidate: TELEGRAM_REVALIDATE_SECONDS },
  })
  if (!imageResponse.ok || !imageResponse.body) return fallback(request)

  return new Response(imageResponse.body, {
    headers: {
      'Content-Type': getImageContentType(
        imgFile.file_path,
        imageResponse.headers.get('Content-Type') || '',
      ),
      'Cache-Control': `public, max-age=${TELEGRAM_REVALIDATE_SECONDS}`,
    },
  })
}
