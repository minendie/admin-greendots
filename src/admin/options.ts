import { AdminJSOptions } from 'adminjs';

import componentLoader from './component-loader.js';

// import mysql from 'mysql2'

// const mySQLdb = await mongoose.connect('mongodb://localhost:27017/test')

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: [],
  databases: [],
};

export default options;
