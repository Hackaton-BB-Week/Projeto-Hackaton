// Validação do formulário de boas-vindas. Retorna a mensagem de erro ou null.

export function validateName(name: string): string | null {
  return name.trim().length < 2 ? 'Conta pra gente como te chamar.' : null;
}

export function validateEmail(email: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? null : 'Digite um e-mail válido.';
}
