export const truncateFileName = (
  fileName: string,
  maxLength: number
): string => {
  const ext = fileName.slice(fileName.lastIndexOf('.'))
  const base = fileName.slice(0, fileName.lastIndexOf('.'))

  if (base.length > maxLength) {
    return base.slice(0, maxLength - 3) + '...' + ext
  }
  return `${fileName}${ext}`
}
