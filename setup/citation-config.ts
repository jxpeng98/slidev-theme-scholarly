import path from 'node:path'

export interface ScholarlyCitationConfig {
  bibFile: string
  bibStyle: string
  showNum: boolean
}

export function resolveBibFilePath(bibFile: string, entry?: string): string {
  if (!bibFile)
    return 'references.bib'

  if (!entry || path.isAbsolute(bibFile))
    return bibFile

  return path.resolve(path.dirname(entry), bibFile)
}

export function resolveScholarlyCitationConfig(
  headmatter: Record<string, unknown>,
  entry?: string,
): ScholarlyCitationConfig {
  const bibFile = resolveBibFilePath((headmatter.bibFile as string) || 'references.bib', entry)
  const bibStyle = (headmatter.bibStyle as string) || 'apa'
  const showNum = (headmatter.bibShowNum as boolean) ?? false

  return { bibFile, bibStyle, showNum }
}
