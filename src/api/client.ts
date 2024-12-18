import axios, { AxiosInstance, AxiosResponse } from "axios";
// import decamelizeKeys from "decamelize-keys";
// import camelcaseKeys from "camelcase-keys";

const ONE_MINUTE = 1000 * 60; // 1 minute
interface CredentialsLoginParams {
  csrfToken: string;
  email: string;
  password: string;
}

interface GithubLoginParams {
  csrfToken: string;
  redirectUri: string;
}
export class Client {
  public api: AxiosInstance;
  public baseUrl: string;
  public logger: any;

  constructor(options: {
    baseUrl: string;
    accessToken?: string;
    logger?: any;
    locale?: "en" | "zh-CN";
  }) {
    const { baseUrl, accessToken, logger, locale = "en" } = options;
    this.baseUrl = baseUrl;
    this.logger = logger || console;

    this.api = axios.create({
      baseURL: baseUrl,
      timeout: ONE_MINUTE,
      //需要跨域携带cookie
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.api.interceptors.request.use((config) => {
      // config.headers.Authorization = `Bearer ${accessToken}`;
      // config.headers["Accept-Language"] = locale;

      this.logger.debug(
        config.method.toUpperCase(),
        config.baseURL + config.url,
        config.data,
        config.params
      );
      return config;
    });
    this.api.interceptors.response.use(
      (response) => {
        this.logger.debug(
          response.status,
          response.config.method.toUpperCase(),
          response.config.baseURL + response.config.url
        );
        return response.data;
      },
      (err) => {
        if (err.response) {
          this.logger.error(
            err.response.status,
            err.response.config.method.toUpperCase(),
            err.response.config.baseURL + err.response.config.url
          );
          this.logger.error(err.response.data);
          return Promise.reject(new Error(err.response.data));
        }

        if (err.request) {
          this.logger.error(err.request);
        } else {
          this.logger.error(err.message);
        }

        return Promise.reject(err);
      }
    );
  }

  async getProviders () {
    return this.api.get("/api/auth/providers")
  }

  async getCsrfToken (): Promise<{csrfToken: string}> {
    return this.api.get("/api/auth/csrf")
  }

  async login(data: CredentialsLoginParams): Promise<{
    error: string;
    code: string;
    status: number
  }> {
    const formData = new URLSearchParams({
      ...data,
      redirect: "false"
    });
    const res: {url: string} = await this.api.post("/api/auth/callback/credentials",formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Auth-Return-Redirect": "1",
      }
    })
    const error = new URL(res?.url).searchParams.get("error")
    const code = new URL(res?.url).searchParams.get("code")
    return {
      error,
      code
    } as any
  }

  async getGithubOauthAddr(data: GithubLoginParams) {
    const formData = new URLSearchParams({
      ...data,
      redirect: "false"
    });
    const res: {url: string} = await this.api.post("/api/auth/signin/github", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Auth-Return-Redirect": "1",
      }
    })
    const redirectUri = data.redirectUri;
    const updatedUrl = res.url.replace(/redirect_uri=.*?&/, `redirect_uri=${redirectUri}&`);
    return updatedUrl;
  }

  async githubOauth(data: string) {
    const res: {url: string} = await this.api.get(`/api/auth/callback/github?code=${data}`, {
      headers: {
        "X-Auth-Return-Redirect": "1"
      }
    })
    const error = new URL(res?.url).searchParams.get("error")
    const code = new URL(res?.url).searchParams.get("code")
    return {
      error,
      code
    } as any
  }

  logout() {

  }

  user(): Promise<UserType> {
    return this.api.get("/api/auth/session");
  }

}
