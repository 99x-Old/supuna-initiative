import dotenv from 'dotenv';

dotenv.config();

export default {
  user_service: `${process.env.USER_SERVICE}`,
  web_service: `${process.env.WEB_SERVICE}`,
  token_service: `${process.env.TOKEN_SERVICE}`,
  client_id: `${process.env.CLIENT_ID}`,
  client_secret: `${process.env.CLIENT_SECRET}`,
  provision_key: `${process.env.PROVISION_KEY}`,
  auth_server_username: `${process.env.AUTH_SERVER_USERNAME}`,
  auth_server_password: `${process.env.AUTH_SERVER_PASSWORD}`,
  auth_server_host: `${process.env.AUTH_SERVER_HOST}`,
  kafka: `${process.env.KAFKA_SERVICE}`,
  microsoft: {
    client_id: `${process.env.MICROSOFT_CLIENT_ID}`,
    client_secret: `${process.env.MICROSOFT_CLIENT_SECRET}`,
    authority_hostUrl: `${process.env.MICROSOFT_AUTHORITY_HOSTURL}`,
    tenant: `${process.env.MICROSOFT_TENANT}`,
    redirect_uri: `${process.env.MICROSOFT_REDIRECT_URI}`,
    resource: `${process.env.MICROSOFT_RESOURCE}`,
  },
};
