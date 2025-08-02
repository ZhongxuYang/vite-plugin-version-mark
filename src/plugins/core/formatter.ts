/**
 * Result formatter - combines multiple command results according to specified format
 */

import type {CommandResult} from '../types'

// Format options
export interface FormatOptions {
  /** Format template, e.g. "{branch}-{sha}" */
  template?: string;
  /** Default separator when no template provided */
  separator?: string;
}

// Format error
export class FormatError extends Error {
  constructor(message: string, public template?: string) {
    super(message)
    this.name = 'FormatError'
  }
}

export class ResultFormatter {
  /**
   * Format multiple command results
   */
  format(
    results: Map<string, CommandResult>,
    template?: string,
    separator = '-',
  ): string {
    if (results.size === 0) {
      return ''
    }

    if (template) {
      return this.formatWithTemplate(results, template)
    }

    return this.formatWithSeparator(results, separator)
  }

  /**
   * Parse placeholders from format template
   */
  private parseTemplate(template: string): string[] {
    const regex = /\{([^}]+)\}/g
    const placeholders: string[] = []
    let match

    while ((match = regex.exec(template)) !== null) {
      placeholders.push(match[1])
    }

    return placeholders
  }

  /**
   * Validate template placeholders against available results
   */
  private validateTemplate(
    template: string,
    results: Map<string, CommandResult>,
  ): { valid: boolean; missingPlaceholders: string[] } {
    const placeholders = this.parseTemplate(template)
    const availableAliases = new Set(results.keys())
    const missingPlaceholders: string[] = []

    for (const placeholder of placeholders) {
      if (!availableAliases.has(placeholder)) {
        missingPlaceholders.push(placeholder)
      }
    }

    return {
      valid: missingPlaceholders.length === 0,
      missingPlaceholders,
    }
  }

  /**
   * Format results using template
   */
  private formatWithTemplate(
    results: Map<string, CommandResult>,
    template: string,
  ): string {
    const validation = this.validateTemplate(template, results)
    if (!validation.valid) {
      throw new FormatError(
        `Template contains undefined placeholders: ${validation.missingPlaceholders.join(
          ', ',
        )}`,
        template,
      )
    }
    let formatted = template
    const regex = /\{([^}]+)\}/g

    formatted = formatted.replace(regex, (match, placeholder) => {
      const result = results.get(placeholder)

      if (!result!.success && !result!.result) {
        return ''
      }

      return result!.result || ''
    })

    return formatted
  }

  /**
   * Format results using separator
   */
  private formatWithSeparator(
    results: Map<string, CommandResult>,
    separator: string,
  ): string {
    const values: string[] = []

    for (const [, result] of results) {
      if (result?.result) {
        values.push(result.result)
      }
    }

    return values.join(separator)
  }
}
