export default {
  jwt: {
    secret: process.env.APP_SECRET || 'aac258c08aba04385b6af9f38547ae09',
    expiresIn: '1d',
  },
};
