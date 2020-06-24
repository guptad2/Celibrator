/**
 * Copyright 2019-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For CeleBot
 */

"use strict";

// Imports dependencies
const Response = require("./response"),
  i18n = require("../i18n.config");

module.exports = class Order {
  static handlePayload(payload) {
    let response;

    switch (payload) {
      case "NEW_ORDER":
        response = [Response.genText(i18n.__("order.name"))];
        return response;

      case "EXISTING_ORDER":
        response = Response.genText(i18n.__("order.number"));
        return response;

      case "ORDER_BIRTHDAY":
        response = [
          Response.genText(i18n.__("order.init")),
          Response.genText(i18n.__("order.code"))
        ];
        return response;

      case "ORDER_GRADUATION":
        response = [
          Response.genText(i18n.__("order.init")),
          Response.genText(i18n.__("order.code"))
        ];
        return response;

      // Add video for the google drive link here for the code
      case "ORDER_RESULT":
        response = Response.genText("video_url");
        return response;
    }
  }
};
