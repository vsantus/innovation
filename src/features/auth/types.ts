export type UserData = {
  codigo_usuario: string;
  nome_usuario: string;
  codigo_grupo: string;
  nome_grupo: string;
};

export type LoginApiResponse = {
  status: number;
  message: string;
  token_de_acesso?: string;
  dados_usuario?: UserData;
};

export type LoginRequest = {
  email: string;
  senha: string;
  manterLogado: boolean;
};

export type LoginResponse = LoginApiResponse;
