import { MercadoPagoConfig, Preference } from "mercadopago";
// const client = new MercadoPagoConfig({
//   accessToken: process.env.PROD_ACCESS_TOKEN,
// });
const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-4126003856086907-081909-e368e86d70bf7996906a4bef3a874f33-2638908578",
});
const preference = new Preference(client);

export class PaymentController {
  constructor() {}
  async createPayment(req, res) {
    preference
      .create({
        body: {
          items: [
            {
              title: "Mi producto",
              quantity: 1,
              unit_price: 2000,
            },
          ],
          back_urls: {
            success: "https://r6q0x0dq-5173.use2.devtunnels.ms/checkout/success", // <--- Tu frontend leerá esto
            failure: "https://r6q0x0dq-5173.use2.devtunnels.ms/checkout/failure",
            pending: "https://r6q0x0dq-5173.use2.devtunnels.ms/checkout/pending",
          },
          auto_return: "approved",
          // notification_url: "https://www.tu-dominio.com/notifications",
          // external_reference: "12345",
        },
      })
      .then((data) => {
        console.log(data);
        res.status(201).json({
          preference_id: data.id,
          preference_url: data.init_point,
        });
      })
      .catch(console.log);
  }
}
