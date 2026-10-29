// No celular a foto já vem leve (quality 0.6) e é copiada para a pasta do app:
// nada a fazer. A versão web fica em shrinkPhoto.web.ts.
export async function shrinkPhoto(uri: string): Promise<string> {
  return uri;
}
