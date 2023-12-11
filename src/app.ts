import express from 'express';
import AdminJS from 'adminjs';

import { buildAuthenticatedRouter } from '@adminjs/express';
import path from 'path';
import provider from './admin/auth-provider.js';
import options from './admin/options.js';
import initializeDb from './db/index.js';
import { fileURLToPath } from 'url';
import componentLoader from './admin/component-loader.js';

// import { Database, Resource } from '@adminjs/typeorm' // or any other adapter

// AdminJS.registerAdapter({ Database, Resource })
const port = process.env.PORT || 4000;

const start = async () => {
  const app = express();
  // const path = require('path');
  // app.use(express.static(path.join(__dirname, "/public")));
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, 'public')));
  const db = await initializeDb();
  
  options.databases = [
  db.db
  ];
  // options.databases['options']

  const admin = new AdminJS(options);
 
  if (process.env.NODE_ENV === 'production') {
    await admin.initialize();
  } else {
    admin.watch();
  }

  const router = buildAuthenticatedRouter(
    admin,
    {
      cookiePassword: process.env.COOKIE_SECRET,
      cookieName: 'adminjs',
      provider,
    },
    null,
    {
      secret: process.env.COOKIE_SECRET,
      saveUninitialized: true,
      resave: true,
    },
  );

  app.use(admin.options.rootPath, router);

  app.listen(port, () => {
    console.log(`AdminJS available at http://localhost:${port}${admin.options.rootPath}`);
  });
};

start();
