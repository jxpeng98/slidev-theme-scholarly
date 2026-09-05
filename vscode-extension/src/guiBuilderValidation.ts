// Shared by the classic Webview script and the CommonJS generation model.
// This handles the catalog's flat field types, not arbitrary TypeScript syntax.
function scholarlyParseConfigValue(
  input: unknown, type: string, required = false, language = 'en'
): { value: unknown; error: string } {
  const copy = (en: string, zh: string) => language.toLowerCase().startsWith('zh') ? zh : en;
  const missing = copy('This setting is required.', '此设置为必填项。');
  if (input === undefined || (typeof input === 'string' && !input.trim()))
    return { value: undefined, error: required ? missing : '' };

  const branches = type.replace(/\{[^}]*\}/g, 'object').split('|').map(value => value.trim());
  const allowsText = branches.includes('string');
  const structured = /\[\]|Array<|\{/.test(type);
  let value: unknown = typeof input === 'string' ? input.trim() : input;
  if (typeof value === 'string') {
    if (structured && (!allowsText || /^[\[{]/.test(value))) {
      try { value = JSON.parse(value); }
      catch { return { value: input, error: copy('Enter valid JSON.', '请输入有效的 JSON。') }; }
    } else if (type.trim() === 'number') {
      value = Number(value);
    } else if (type.trim() === 'boolean' && /^(true|false)$/i.test(value)) {
      value = value.toLowerCase() === 'true';
    }
  }
  if (required && Array.isArray(value) && !value.length)
    return { value, error: missing };

  function matches(candidate: unknown, declared: string): boolean {
    const array = declared.trim().match(/^Array<\{([^}]*)\}>$/);
    if (array)
      return Array.isArray(candidate) && candidate.every(item => matches(item, `{ ${array[1]} }`));
    const object = declared.match(/\{([^}]*)\}/);
    return declared.replace(/\{[^}]*\}/g, 'object').split('|').some(raw => {
      const branch = raw.trim();
      if (branch === 'string') return typeof candidate === 'string';
      if (branch === 'number') return typeof candidate === 'number' && Number.isFinite(candidate);
      if (branch === 'boolean') return typeof candidate === 'boolean';
      if (branch === 'false') return candidate === false;
      if (branch === 'string[]')
        return Array.isArray(candidate) && candidate.every(item => typeof item === 'string');
      if (/^'[^']*'$/.test(branch)) return candidate === branch.slice(1, -1);
      if (branch !== 'object' || !object || !candidate || typeof candidate !== 'object' || Array.isArray(candidate))
        return false;
      const record = candidate as Record<string, unknown>;
      return object[1].split(';').filter(field => field.trim()).every(field => {
        const entry = field.trim().match(/^(\w+)(\?)?:\s*(.+)$/);
        if (!entry) return false;
        const child = record[entry[1]];
        if (child === undefined) return Boolean(entry[2]);
        if (!entry[2] && typeof child === 'string' && !child.trim()) return false;
        return matches(child, entry[3]);
      });
    });
  }

  if (matches(value, type)) return { value, error: '' };
  const error = type.trim() === 'string[]'
    ? copy('Enter a JSON list containing only text values.', '请输入只包含文本的 JSON 数组。')
    : type.startsWith('Array<')
      ? copy('Enter a JSON list of objects with the required fields.', '请输入对象组成的 JSON 数组，并填写必填字段。')
      : structured
        ? copy('Use a value matching the listed setting type.', '请使用与所列设置类型一致的值。')
        : type.trim() === 'number'
          ? copy('Enter a valid number.', '请输入有效数字。')
          : type.trim() === 'boolean'
            ? copy('Choose true or false.', '请选择 true 或 false。')
            : copy('Use a value matching the listed setting type.', '请使用与所列设置类型一致的值。');
  return { value, error };
}

if (typeof module !== 'undefined')
  module.exports = { parseConfigInput: scholarlyParseConfigValue };
