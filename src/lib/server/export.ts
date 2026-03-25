import "server-only"

type CsvRow = Record<string, string | number | boolean | null | undefined>

export function toCsv(rows: CsvRow[], columns?: string[]): string {
  if (rows.length === 0) return ""

  const headers = columns ?? Object.keys(rows[0])

  const escape = (value: unknown): string => {
    const str = value === null || value === undefined ? "" : String(value)
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const headerRow = headers.map(escape).join(",")
  const dataRows = rows.map((row) =>
    headers.map((h) => escape(row[h])).join(",")
  )

  return [headerRow, ...dataRows].join("\n")
}

export function csvResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
