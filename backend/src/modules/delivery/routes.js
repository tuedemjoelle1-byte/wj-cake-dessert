import { ok } from "../../core/http.js";
import { getQuery } from "../../core/request.js";
import { listDeliverySlots, listDeliveryZones } from "./service.js";

export function registerDeliveryRoutes(router) {
  router.get("/api/v1/delivery/zones", ({ res }) => {
    return Promise.resolve(listDeliveryZones()).then((items) => ok(res, { items }));
  });

  router.get("/api/v1/delivery/slots", ({ res, url }) => {
    return Promise.resolve(
      listDeliverySlots({
        type: getQuery(url, "type"),
        date: getQuery(url, "date")
      })
    ).then((items) => ok(res, { items }));
  });
}
