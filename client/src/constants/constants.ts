export default process.env.NODE_ENV === 'development'
    ? {
          socketRoute: 'http://localhost:4000',
          apiRoute: 'http://localhost:3000/data',
      }
    : {
          socketRoute: 'http://192.168.0.1:4000',
          apiRoute: 'http://192.168.0.1:3000/data',
      };
