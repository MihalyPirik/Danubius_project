import swaggerAutogen from 'swagger-autogen';

import createApp from './app.js';

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './routes/authRoutes.js',
  './routes/userRoutes.js',
  './routes/bookRoutes.js',
  './routes/basketRoutes.js',
  './routes/orderRoutes.js'
];

const doc = {
  info: {
    version: '1.0.0',
    title: 'Könyvkereskedés API',
    description: 'A dokumentációt a <b>swagger-autogen</b> modul generálta.'
  },
  host: 'localhost:3000',
  basePath: '/api',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      'name': 'Könyvek',
      'description': 'A könyvek kezelése'
    },
    {
      'name': 'Felhasználók',
      'description': 'A felhasználók nyilvántartása és kezelése'
    },
    {
      'name': 'Kosár',
      'description': 'A kosár kezelése'
    },
    {
      'name': 'Rendelések',
      'description': 'A rendelések kezelése'
    }
  ],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Bearer token'
    }
  },
  definitions: {
    Könyv: {
      _id: '6639ebbb79e633c4ec91decb',
      author: 'Sophie Johnson',
      title: 'The Secret Island',
      ISBN: '9780123450000',
      publisher: 'Publisher XYZ',
      publicationYear: 2019,
      amount: 25,
      price: 1899,
      user: '6639eaed79e633c4ec91de9a',
      createdAt: '2024-05-07T08:52:11.134+0000'
    },
    Felhasználó: {
      _id: '662fb2e0d58e4b0a535652a5',
      name: 'misi',
      email: 'misi1@misi.hu',
      role: 'publisher',
      password: '$2a$10$nxktEGoY..hawv7mb6JeF.nuvLDEopEgllx6nkSJmJzljczyVVfb.',
      createdAt: '2024-04-29T14:46:56.196+0000'
    },
    Kosár: {
      _id: "663a12307ac4e25df4a9535d",
      user: "662d0034a1b98d955559e62c",
      books: [
        {
          book: "6639ebbb79e633c4ec91decb",
          quantity: 2,
          _id: "663a12307ac4e25df4a9535e"
        }
      ],
      createdAt: "2024-05-07T11:36:16.125+0000"
    },
    Rendelés: {
      _id: "663a127c7d01d713c47bad0a",
      user: "662d0034a1b98d955559e62c",
      books: [
        {
          book: "6639ebbb79e633c4ec91decb",
          quantity: 2,
          _id: "663a12307ac4e25df4a9535e"
        }
      ],
      createdAt: "2024-05-07T11:37:32.914+0000"
    }
  }
};

swaggerAutogen(outputFile, endpointsFiles, doc)
  .then(() => {
    createApp();
  });