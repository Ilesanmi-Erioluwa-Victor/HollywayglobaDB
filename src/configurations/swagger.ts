import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Hollywaygloba API Documentation',
    description: '',
  },
  host: 'localhost:8080/api/v1',
  schemes: ['http'],
};

const outputFile = '../swagger-output.json';
const endpointFile = [
  '../modules/User/user.controller.ts',
  '../modules/Admin/admin.controller.ts',
  '../modules/Admin/product.controller.ts',
];
