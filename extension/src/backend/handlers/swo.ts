import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { logInfo } from "alga:extension/logging";
import { fetch as httpFetch } from "alga:extension/http";
import { UserType, filterResponse, getRule } from "../filter";
import { filters } from "../filters";

import { decode, jsonResponse } from "../utils";

export const swoHandler = (request: ExecuteRequest): ExecuteResponse => {
  const userType: UserType = "internal";

  const path = request.http.url.replace("/swo", "");

  const rule = getRule(path, userType, filters);

  if (!rule)
    return jsonResponse(
      {
        error: "Forbidden",
        message: `Request not allowed for user type ${userType}: ${request.http.url}`,
      },
      { status: 403 }
    );

  const swoAPIToken =
    "idt:TKN-8557-7823:Rv3ltKu4js3bVvR6Ok6n0JmIfruCTusirs1nI1UDF3T4AzuiHPPkuMG90gHAsNrR";

  logInfo(`Requesting: https://portal.s1.live/public/v1${path}`);

  const response = httpFetch({
    method: request.http.method,
    url: `https://portal.s1.live/public/v1${path}`,
    headers: [
      { name: "Authorization", value: `Bearer ${swoAPIToken}` },
      { name: "Content-Type", value: "application/json" },
    ],
  });

  const responseBody = decode(response.body);
  if (!responseBody) return jsonResponse({}, { status: response.status });

  const body = filterResponse(responseBody, rule);
  return jsonResponse(body, { status: response.status });
};

// // AGREEMENTS

// const agreementsHandler = (request: ExecuteRequest): ExecuteResponse => {
//   const billingConfigs = getBillingConfigs();

//   const billingConfigsById = billingConfigs.reduce((acc, billingConfig) => {
//     acc[billingConfig.agreementId] = billingConfig;
//     return acc;
//   }, {} as Record<string, BillingConfig>);

//   const swoAPIToken =
//     "idt:TKN-8557-7823:Rv3ltKu4js3bVvR6Ok6n0JmIfruCTusirs1nI1UDF3T4AzuiHPPkuMG90gHAsNrR";

//   const response = httpFetch({
//     method: "GET",
//     url: request.http.url.replace("/swo", "https://portal.s1.live/public/v1"),
//     headers: [
//       { name: "Authorization", value: `Bearer ${swoAPIToken}` },
//       { name: "Content-Type", value: "application/json" },
//     ],
//   });

//   if (response.status !== 200) {
//     return jsonResponse({}, { status: response.status });
//   }

//   const agreements = parseBody(response.body) as AgreementListResponse;

//   const mspAgreements: MSPAgreement[] =
//     agreements.data?.map((agreement) => ({
//       ...agreement,
//       price: {
//         ...agreement.price,
//         RPxY: priceWithMarkup(
//           agreement.price?.SPxY,
//           billingConfigsById[agreement.id!]?.markup
//         ),
//         RPxM: priceWithMarkup(
//           agreement.price?.SPxM,
//           billingConfigsById[agreement.id!]?.markup
//         ),
//       },
//     })) ?? [];

//   return jsonResponse(
//     {
//       $meta: agreements.$meta,
//       data: mspAgreements,
//     },
//     { status: 200 }
//   );
// };

// const agreementHandler = (request: ExecuteRequest): ExecuteResponse => {
//   const billingConfigs = getBillingConfigs();

//   const swoAPIToken =
//     "idt:TKN-8557-7823:Rv3ltKu4js3bVvR6Ok6n0JmIfruCTusirs1nI1UDF3T4AzuiHPPkuMG90gHAsNrR";

//   const response = httpFetch({
//     method: "GET",
//     url: request.http.url.replace("/swo", "https://portal.s1.live/public/v1"),
//     headers: [
//       { name: "Authorization", value: `Bearer ${swoAPIToken}` },
//       { name: "Content-Type", value: "application/json" },
//     ],
//   });

//   if (response.status !== 200) {
//     return jsonResponse({}, { status: response.status });
//   }

//   const agreement = parseBody(response.body) as Agreement;

//   const mspAgreement: MSPAgreement = {
//     ...agreement,
//     price: {
//       ...agreement.price,
//       RPxY: priceWithMarkup(
//         agreement.price?.SPxY,
//         billingConfigs.find((bc) => bc.agreementId === agreement.id)?.markup
//       ),
//     },
//   };

//   return jsonResponse(mspAgreement, { status: 200 });
// };

// // ORDERS

// const ordersHandler = (request: ExecuteRequest): ExecuteResponse => {
//   return jsonResponse({}, { status: 200 });
// };

// const orderHandler = (request: ExecuteRequest): ExecuteResponse => {
//   return jsonResponse({}, { status: 200 });
// };
