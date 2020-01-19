# FIMK Nodejs / Browser libraries

[![Travis](https://img.shields.io/travis/Heat-Ledger-Ltd/fimk-sdk.svg)](https://travis-ci.org/Heat-Ledger-Ltd/fimk-sdk)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Dev Dependencies](https://david-dm.org/Heat-Ledger-Ltd/fimk-sdk/dev-status.svg)](https://david-dm.org/Heat-Ledger-Ltd/fimk-sdk?type=dev)
[![NPM version](https://img.shields.io/npm/v/fimk-sdk.svg)](https://www.npmjs.com/package/fimk-sdk)

FIMK support libraries for Node.js and the browser

### Links

[**FIMK-SDK API**](https://heat-ledger-ltd.github.io/fimk-sdk/) browse all classes, interfaces, methods includes links to their source code implementation.

[**FIMK REST API**](https://heatwallet.com/api/#/) OpenAPI, heat server

[**GITHUB**](https://github.com/Heat-Ledger-Ltd/fimk-sdk) Heat-Ledger-Ltd/fimk-sdk

### Functionality

With FIMK-SDK you get full client-side/offline functionality of everything involving FIMK cryptocurrency. 
This includes but is not limited to:

- Full FIMK API wrapper
- Support for real-time updates through FIMK websocket API
- Complete client side support for both constructing and parsing binary transaction data
- Full client side encryption/decryption support for transaction attachments
- Support for all other low-level FIMK functionality. But all client side, no server needed! (publickeys, accountids, transaction signatures etc.)

### Samples

All samples open in https://runkit.com/ which gives you a live Nodejs environment, feel free to play around change the code samples, click RUN and see the output.

[![NODEJS | API ACCESS](https://img.shields.io/badge/NODEJS-API%20ACCESS-orange.svg)](https://runkit.com/dmdeklerk/fimk-sdk-api-access)

[![NODEJS | GENERATE ACCOUNT](https://img.shields.io/badge/NODEJS-GENERATE%20ACCOUNT-orange.svg)](https://runkit.com/dmdeklerk/fimk-sdk-generate-account)

[![BROWSER | GENERATE ACCOUNT](https://img.shields.io/badge/BROWSER-GENERATE%20ACCOUNT-orange.svg)](https://embed.plnkr.co/ySpykW/)

[![NODEJS | DEX USD to FIMK  ](https://img.shields.io/badge/NODEJS-DEX%20USD%20to%20HEAT-orange.svg)](https://runkit.com/dmdeklerk/fimk-sdk-live-dex-usd-to-heat)

[![BROWSER | DEX USD to FIMK  ](https://img.shields.io/badge/BROWSER-DEX%20USD%20to%20HEAT-orange.svg)](https://embed.plnkr.co/rsVVcU/)

[![BROWSER | BLOCK WHEN?  ](https://img.shields.io/badge/BROWSER-BLOCK%20WHEN-orange.svg)](https://embed.plnkr.co/gVZVlH/)

[![BROWSER | WEBSOCKETS  ](https://img.shields.io/badge/BROWSER-WEBSOCKETS-orange.svg)](https://embed.plnkr.co/h57qe7NRprjB409Vhb6f/)

### Usage

#### Node

Install fimk-sdk

```bash
npm install fimk-sdk --save
```

When using TypeScript install @typings with

```bash
npm install @types/fimk-sdk --save
```

Require fimk-sdk and use it in your project

```javascript
var {FimkSDK} = require('fimk-sdk')
var sdk = new FimkSDK()
sdk.payment("mike@heatwallet.com","99.95")
   .publicMessage("Happy birthday!")
   .sign("my secret phrase")
   .broadcast()
```

#### Browser

fimk-sdk comes as an UMD module which means you could either `require` or `import {heatsdk} from 'fimk-sdk'` or simply load as `<script src="">` and access it through `window.heatsdk`

```html
<html>
  <head>
    <script src="fimk-sdk.js"></script>
    <script>
      var sdk = new heatsdk.FimkSDK()
      sdk.payment("mike@heatwallet.com","99.95")
         .publicMessage("Happy birthday!")
         .sign("my secret phrase")
         .broadcast()
    </script>
  </head>
</html>
```