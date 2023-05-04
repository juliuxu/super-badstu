import type { LoaderArgs } from "@remix-run/node";
import { placeOrder } from "./order.server";
import { eventStream } from "remix-utils";
import { getOrderInfo } from "./schema";
import { mockPlaceOrder } from "./mock-order.server";

export const loader = async ({ request }: LoaderArgs) => {
  const orderInfo = getOrderInfo(request.url);

  const abortController = new AbortController();
  request.signal.addEventListener("abort", () => abortController.abort());

  return eventStream(abortController.signal, function setup(send) {
    console.log("ℹ️ new order request");
    const alsoLogOnServerSend: typeof send = ({ data, event }) => {
      console.log(
        `[${new Date().toISOString()}] ${event ?? "message"}: ${data}`
      );
      if (!abortController.signal.aborted) {
        send({ data, event });
      }
    };
    if (orderInfo.useMock) {
      mockPlaceOrder(orderInfo, alsoLogOnServerSend, abortController);
    } else {
      placeOrder(orderInfo, alsoLogOnServerSend, abortController);
    }
    return function clear() {
      console.log("ℹ️ order request done");
    };
  });
};