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
}
