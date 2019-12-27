import axios, { AxiosInstance } from "axios";

export default class RequestHandler {
  instance: AxiosInstance;
  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL
    });
  }

  get = async (url: string) => {
    return await this.instance.get(url, {});
  };

  post = async (url: string, data: any) => {
    return await axios.post(url, data);
  };
}
