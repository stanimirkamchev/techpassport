const version = require('./../../package.json').version;
import { production_tenant } from '../../auth_config.json';
export const environment = {
  production: true,
  version,
  recaptchaSiteKey: '6LfsUeMUAAAAABty_uckZSc5g1BCnksUDy14mtLt',
  auth: {
    domain: production_tenant.prod.domain,
    clientId: production_tenant.prod.clientId,
    redirectUri: window.location.origin,
    audience: production_tenant.prod.audience
  },
  serverUrl: production_tenant.prod.serverUrl
};
