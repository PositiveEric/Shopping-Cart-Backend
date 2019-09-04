import { Router } from "express";
import { ItemsController } from "./itemsController";
import { ConfigController } from "./configController";

export const routes = Router();
routes.get("/:server/items", ItemsController.getAll);
routes.get("/:server/items/:id", ItemsController.getSingleItem);
routes.get("/:server/items/:id/quantity", ItemsController.getItemQuantity);
routes.get("/config", ConfigController.getConfig);
routes.post("/config", ConfigController.updateConfig);
routes.post(
  "/:server/items/:id/calculate-price",
  ItemsController.calculatePrice
);
