import { AdminJSOptions } from 'adminjs';
import express from 'express';
import componentLoader from './component-loader.js';
// import HandleRequestPage from '../page/HandleRequestPage.js';


// import mysql from 'mysql2'

// const mySQLdb = await mongoose.connect('mongodb://localhost:27017/test')

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  // resources: [
  //   {
  //     resource: HandleRequestPage,
  //     options: {
  //       parent: { name: 'Organizer_Request', icon: 'Tasks' }, // Thay đổi tên và biểu tượng cho tab mới
  //     },
  //   },
  // ],
  databases: [],
  branding: {
    companyName: 'Admin - GreenDots',
    // softwareBrothers: false, // Remove the "SoftwareBrothers" label
    logo: '/logo.png',      // Specify the path to your SVG logo
  },
  // resources: [
    
  // ],
};

export default options;
