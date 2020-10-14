import { v4 as uuid4 } from 'uuid';
import { ErrorResponse, TokenResponse } from 'adal-node';
import AuthService from '../../service/auth.service';

const { AuthenticationContext } = require('adal-node');
const config = require('../../../config/app').default;

const clientId = config.microsoft.client_id;
const clientSecret = config.microsoft.client_secret;
const authorityHostUrl = config.microsoft.authority_hostUrl;
const { tenant } = config.microsoft;
const authorityUrl = `${authorityHostUrl}/${tenant}`;
const redirectUri = config.microsoft.redirect_uri;
const { resource } = config.microsoft;
const templateAuthzUrl = `https://login.windows.net/${
  tenant
}/oauth2/authorize?response_type=code&client_id=${
  clientId
}&redirect_uri=${
  redirectUri
}&state=<state>&resource=${
  resource}`;

const createAuthorizationUrl = (state: string) => templateAuthzUrl.replace('<state>', state);

export default (router: any) => {
  router.get('/api/microsoft/login', async (ctx: any) => {
    const authorizationUrl = createAuthorizationUrl(uuid4());
    ctx.redirect(authorizationUrl);
  });

  router.get('/api/microsoft/token', async (ctx: any) => {
    const authenticationContext = new AuthenticationContext(authorityUrl);
    const authService = new AuthService();

    const { code } = ctx.request.query;
    if (!code) {
      const errorUrl = `${config.web_service}?${new URLSearchParams(ctx.request.query).toString()}`;
      ctx.redirect(errorUrl);
    } else {
      const redirectUrl = await new Promise((resolve: any) => {
        authenticationContext.acquireTokenWithAuthorizationCode(
          code,
          redirectUri,
          resource,
          clientId,
          clientSecret,
          async (err: Error, authResponse: TokenResponse | ErrorResponse) => {
            if (err || !authResponse) {
              console.error(err);
              resolve(`${config.web_service}?error=`);
              return false;
            }

            const user = {
              first_name: authResponse.givenName,
              last_name: authResponse.familyName,
              email: authResponse.userId,
              oid: authResponse.oid,
            };

            let currentUser = await authService.getUserByEmail(user.email).catch(() => false);
            if (!currentUser) {
              currentUser = await authService.addUser(user).catch(() => {
                resolve(`${config.web_service}?error=user-added-error`);
                return false;
              });
            }
            if (!currentUser.status) {
              resolve(`${config.web_service}?error=User+is+Inactive&error_description=You+have+been+inactivated+by+Admin!`);
              return false;
            }

            authService.getAuthorizationCode(currentUser).then((authentication: {}) => {
              resolve(authentication?.redirect_uri);
            }).catch((AuthError: Error) => {
              console.error(AuthError);
              resolve(`${config.web_service}?error=${AuthError.name}`);
            });
            return false;
          },
        );
      });

      ctx.redirect(redirectUrl);
    }
  });

  return router;
};
