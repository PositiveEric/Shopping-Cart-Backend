import { Request, Response } from "express";
import { Config } from "./interfaces";

export let config: Config = {
  servers: [
    {
      name: "alpha",
      errorFrequency: 0
    }
  ]
};

export class ConfigController {
  static getConfig(_req: Request, res: Response) {
    res.status(200).send(config);
  }

  static updateConfig(req: Request, res: Response) {
    if (ConfigController.invalidConfig(req.body)) {
      res.status(400).send("Invalid config");
      return;
    }
    config = req.body as Config;
    res.status(200).send(req.body);
  }

  // should forbid to add invalid config
  static invalidConfig(config: any): boolean {
    if (
      Object.keys(config).length < 1 ||
      config.servers.length <= 0 ||
      config.servers[0].name == null ||
      config.servers[0].name === "" ||
      config.servers[0].errorFrequency < 0 ||
      config.servers[0].errorFrequency > 10 ||
      typeof config.servers[0].name !== "string" ||
      typeof config.servers[0].errorFrequency !== "number"
    ) {
      return true;
    }
    return false;
  }
}
