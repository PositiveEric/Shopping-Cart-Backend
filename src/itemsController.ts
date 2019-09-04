import csv from "csvtojson";
import { Request, Response } from "express";
import { resolve } from "path";
import { config } from "./configController";
import { CalculatePriceBody, Config, Item } from "./interfaces";

const csvFilePath = resolve(__dirname, "../store.csv");

const toItem = (line: any) => {
  return {
    id: line.id,
    title: line.title,
    description: line.description,
    image: line.image,
    expectedDeliveryDate: line.expected_delivery_date,
    seller: line.seller,
    sellerImage: line.seller_image
  } as Item;
};

export class ItemsController {
  static getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 25;
    const requestServer = (req.params as any).server;

    if (serverStatus(config, requestServer) === 500) {
      res.status(500).send("server error");
    } else {
      csv()
        .fromFile(csvFilePath)
        .then(items => {
          res.send({
            page: page,
            totalPages: Math.ceil(items.length / size),
            totalItems: items.length,
            items: items.map(toItem).slice(page * size, page * size + size)
          });
        });
    }
  }

  static getSingleItem(req: Request, res: Response) {
    const id: string = (req.params as any).id;

    csv()
      .fromFile(csvFilePath)
      .then(
        (lines: Item[]) => {
          const line = lines.find(line => line.id.toString() === id);
          if (line !== undefined) {
            res.json(toItem(line));
          } else {
            res.status(404).send("Could not find the id you requested");
          }
        },
        (e: Error) => {
          res
            .status(500)
            .send(`Sorry - was unable to open csv database: ${e.message}`);
        }
      );
  }

  static getItemQuantity(req: Request, res: Response) {
    const id: string = (req.params as any).id;

    csv()
      .fromFile(csvFilePath)
      .then(
        lines => {
          const line = lines.find(line => line.id.toString() === id);
          if (line !== undefined) {
            res.json(parseInt(line.quantity));
          } else {
            res.status(404).send("Could not find the id you requested");
          }
        },
        (e: Error) => {
          res
            .status(500)
            .send(`Sorry - was unable to open csv database: ${e.message}`);
        }
      );
  }

  static calculatePrice(req: Request, res: Response) {
    const id: string = (req.params as any).id;
    const body = req.body as CalculatePriceBody;

    csv()
      .fromFile(csvFilePath)
      .then(
        lines => {
          const line = lines.find(line => line.id.toString() === id);

          if (line !== undefined) {
            const price = parseFloat(line.price);
            if (line.quantity < body.quantity) {
              res.status(400).send("Quantity requested too large");
            } else if (line.sale) {
              const itemsSale = parseFloat(line.sale.charAt(0));

              if (body.quantity % itemsSale === 0) {
                res.send(
                  `${price * body.quantity -
                    (price * body.quantity) / itemsSale} EUR`
                );
              } else {
                res.send(
                  `${price * body.quantity -
                    Math.floor(body.quantity / itemsSale) * price} EUR`
                );
              }
            } else {
              res.send(`${price * body.quantity} EUR`);
            }
          } else if (body.quantity === undefined) {
            res
              .status(400)
              .send("Quantity you requested could not be delivered");
          } else {
            res
              .status(404)
              .send("Could not find the the price of the item you requested");
          }
        },
        (e: Error) => {
          res
            .status(500)
            .send(`Sorry - was unable to open csv database: ${e.message}`);
        }
      );
  }
}

let counter = 1;

function serverStatus(config: Config, req: string): any {
  if (req === config.servers[0].name) {
    if (counter <= config.servers[0].errorFrequency) {
      if (counter === 10) {
        counter = 1;
      } else {
        counter++;
      }
      return 500;
    } else {
      if (counter === 10) {
        counter = 1;
      } else {
        counter++;
      }
      return 200;
    }
  } else {
    return 500;
  }
}
