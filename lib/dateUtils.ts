/**
 * Utilidades para manejar fechas en zona horaria de Buenos Aires (America/Argentina/Buenos_Aires)
 * Buenos Aires está en UTC-3 (Argentina Time)
 */

/**
 * Obtiene la fecha actual en zona horaria de Buenos Aires
 */
export function getBuenosAiresDate(): Date {
  const now = new Date()
  // Obtener la fecha en formato ISO para Buenos Aires
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  
  const parts = formatter.formatToParts(now)
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0')
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0')
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0')
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0')
  const second = parseInt(parts.find(p => p.type === 'second')?.value || '0')
  
  // Crear fecha en UTC pero con los valores de Buenos Aires
  // Luego ajustar para que represente correctamente la hora local de Buenos Aires
  return new Date(Date.UTC(year, month, day, hour, minute, second))
}

/**
 * Formatea una fecha a string en formato YYYY-MM-DD en zona horaria de Buenos Aires
 */
export function formatDateForInput(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  // Usar Intl para obtener la fecha en zona horaria de Buenos Aires
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  
  return formatter.format(d)
}

/**
 * Convierte un string de fecha (YYYY-MM-DD) a Date interpretándolo como fecha en Buenos Aires
 */
export function parseDateFromInput(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  // Crear fecha en UTC a medianoche de Buenos Aires
  // Buenos Aires es UTC-3, así que medianoche en BA es 03:00 UTC
  return new Date(Date.UTC(year, month - 1, day, 3, 0, 0))
}

/**
 * Formatea una fecha para mostrar en la UI (dd/MM/yyyy HH:mm) en zona horaria de Buenos Aires
 */
export function formatDateForDisplay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  const formatter = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  
  return formatter.format(d).replace(',', '')
}

/**
 * Formatea una fecha para mostrar solo la fecha (dd/MM/yyyy) en zona horaria de Buenos Aires
 */
export function formatDateOnly(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  const formatter = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  
  return formatter.format(d)
}

