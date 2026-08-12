import { fetchApi } from "@/lib/apiClient";

export interface UserDto {
  id: string;
  email: string;
  name: string;
  provider?: string;
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

export interface SocialProviderDto {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const fetchSocialProvidersApi = async (): Promise<SocialProviderDto[]> => {
  return fetchApi<SocialProviderDto[]>("/api/auth/social/providers");
};

export const socialLoginApi = async (
  provider: string,
  code?: string,
  redirectUri?: string,
  email?: string,
  name?: string,
  providerId?: string
): Promise<AuthResponseDto> => {
  return fetchApi<AuthResponseDto>("/api/auth/social/login", {
    method: "POST",
    body: JSON.stringify({
      provider,
      code,
      redirectUri,
      email,
      name,
      providerId,
    }),
  });
};
