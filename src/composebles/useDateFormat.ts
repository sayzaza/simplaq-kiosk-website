export interface FormatDateType {
  formattedDate: string
  day: string
  month: string
  year: string
  formattedTime: string
}
export function useFormatDate(data: Record<string, any> | null, dateName: string) {
  if (!Array.isArray(data)) {
    data = data ? [data] : []
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  if (dateName === 'publish_at') {
    return data.map((newsItem: any) => {
      if (newsItem.publish_at) {
        const [datePart, timePart] = newsItem.publish_at.split(' ')
        const [year, month, day] = datePart.split('-')
        const formattedDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`

        const rawTime = timePart.substring(0, 5) // Extract the first 5 characters for time (HH:mm)
        const [hour, minute] = rawTime.split(':')
        const ampm = parseInt(hour) >= 12 ? 'PM' : 'AM'
        const formattedHour = (parseInt(hour) % 12).toString().padStart(2, '0') || '12'
        const formattedMinute = minute.padStart(2, '0')
        const formattedTime = `${formattedHour}:${formattedMinute} ${ampm}`

        return { formattedDate, day, month: monthNames[parseInt(month) - 1], year, formattedTime }
      }

      return { formattedDate: '', day: '', month: '', year: '', formattedTime: '' }
    })
  }
  if (dateName === 'start') {
    return data.map((newsItem: any) => {
      if (newsItem.start) {
        const [datePart, timePart] = newsItem.start.split(' ')
        const [year, month, day] = datePart.split('-')
        const formattedDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`

        const rawTime = timePart.substring(0, 5) // Extract the first 5 characters for time (HH:mm)
        const [hour, minute] = rawTime.split(':')
        const ampm = parseInt(hour) >= 12 ? 'PM' : 'AM'
        const formattedHour = (parseInt(hour) % 12).toString().padStart(2, '0') || '12'
        const formattedMinute = minute.padStart(2, '0')
        const formattedTime = `${formattedHour}:${formattedMinute} ${ampm}`

        return { formattedDate, day, month: monthNames[parseInt(month) - 1], year, formattedTime }
      }
      return { formattedDate: '', day: '', month: '', year: '', formattedTime: '' }
    })
  }
}