// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const version = require('./../../package.json').version;
import { uat_tenant } from '../../auth_config.json';

export const environment = {
  production: false,
  version,
  recaptchaSiteKey: '6LfsUeMUAAAAABty_uckZSc5g1BCnksUDy14mtLt',
  auth: {
    domain: uat_tenant.local.domain,
    clientId: uat_tenant.local.clientId,
    redirectUri: window.location.origin,
    audience: uat_tenant.local.audience
  },
  serverUrl: uat_tenant.local.serverUrl
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
