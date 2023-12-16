import AdminJS, { AdminJSOptions, ValidationError } from 'adminjs';
import { ComponentLoader } from 'adminjs';
import initializeDb from '../db/index.js';
import { fileURLToPath } from 'url';
import path from 'path';
// import { ValidationError } from 'adminjs';
import bcrypt from 'bcrypt';
// import passwordsFeature from '@adminjs/passwords';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentLoader = new ComponentLoader();

const Components = {
  MyCustomAction: componentLoader.add('MyCustomAction', path.resolve(__dirname, '../components/my-custom-action.js')),
};

const { db } = await initializeDb();

const menuItems = {
  dataManagement: {
    name: 'Data Management',
    icon: 'Database',
  },
  dataStructureModification: {
    name: 'Data Structure Modification',
    icon: 'Columns',
  },
  organizerRegistrationRequestApproval: {
    name: 'Organizer Registration Request Approval',
    icon: 'UserCheck',
  },
};

const customBeforeListPaticipant = (request, context) => {
  const { query = {} } = request;
  const newQuery = {
    ...query,
    ['filters.role']: '0',
    ['filters.state']: '0',
  };

  request.query = newQuery;

  return request;
};
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{5,45}$/;
  return usernameRegex.test(username);
};
const isValidPassword = (password) => {
  const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{3,}$/;
  return passRegex.test(password);
};
const isValidEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S+/;;
  return emailRegex.test(email);
};
const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^0\d{9,}$/;
  return phoneRegex.test(phoneNumber);
};
const isValidLink = (url) => {
  const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/\S*)?$/;
  return urlRegex.test(url);
}
const customBeforeCreateAndEditPaticipant = async (request, context) => {
  
  const { username, email, password, phoneNumber } = request.payload;
  if (!isValidUsername(username)) {
    throw new ValidationError({
      username: {
        message: 'Username must be from 5-45 characters',
      },
    });
  }
  if (!isValidPassword(password)) {
    throw new ValidationError({
      password: {
        message: 'Password must be from 3-50 characters, having at least 1 digit, 1 uppercase character and 1 lowercase character.',
      },
    });
  }
  if (!isValidEmail(email)) {
    throw new ValidationError({
      email: {
        message: 'Invalid Email format',
      },
    });
  }
  if (!isValidPhoneNumber(phoneNumber)) {
    throw new ValidationError({
      phoneNumber: {
        message: 'Invalid PhoneNumber format',
      },
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  request.payload.password = hashedPassword;
  request.payload.role = 0;
  request.payload.state = 0;
  console.log(request.payload);

  return request;
};

const customBeforeListOrganizer = (request, context) => {
  const { query = {} } = request;
  const newQuery = {
    ...query,
    ['filters.role']: '1',
    ['filters.state']: '0',
  };

  request.query = newQuery;

  return request;
};

const customBeforeListOrganizerRecord = (request, context) => {
  const { query = {} } = request;
  const newQuery = {
    ...query,
    ['filters.role']: '0',
    ['filters.state']: '1',
  };

  request.query = newQuery;

  return request;
};

const customBeforeCreateAndEditOrganizer = async (request, context) => {
  
  const { username, password, email, phoneNumber, website, fb_link, linkedin_link } = request.payload;
  if (!isValidUsername(username)) {
    throw new ValidationError({
      username: {
        message: 'Username must be from 5-45 characters',
      },
    });
  }
  if (!isValidPassword(password)) {
    throw new ValidationError({
      password: {
        message: 'Password must be from 3-50 characters, having at least 1 digit, 1 uppercase character and 1 lowercase character.',
      },
    });
  }
  if (!isValidEmail(email)) {
    throw new ValidationError({
      email: {
        message: 'Invalid Email format',
      },
    });
  }
  if (!isValidPhoneNumber(phoneNumber)) {
    throw new ValidationError({
      phoneNumber: {
        message: 'Invalid PhoneNumber format',
      },
    });
  }
  if (!isValidLink(website)) {
    throw new ValidationError({
      website: {
        message: 'Invalid Website format',
      },
    });
  }
  if (!isValidLink(fb_link)) {
    throw new ValidationError({
      fb_link: {
        message: 'Invalid Facebook Link format',
      },
    });
  }
  if (!isValidLink(linkedin_link)) {
    throw new ValidationError({
      linkedin_link: {
        message: 'Invalid Linkedin Link format',
      },
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  request.payload.password = hashedPassword;
  request.payload.role = 1;
  request.payload.state = 0;

  return request;
};

const data_resources = [
  {
    resource: db.table('user'),
    options: {
      parent: menuItems.dataManagement, // or navigation: menuItems.dataManagement
      id: 'Participants',
      
      listProperties: ['email', 'userName', 'address', 'phoneNumber', 'bio'],
      filterProperties: ['email', 'userName', 'address', 'phoneNumber', 'bio'],
      editProperties: ['email', 'userName', 'password', 'address', 'phoneNumber', 'bio'],
      showProperties: ['email', 'userName', 'address', 'phoneNumber', 'bio'],
      properties: {
        role: {
          availableValues: [
            { value: 0, label: 'Participant' },
            { value: 1, label: 'Organizer' },
          ],
        },
        state: {
          availableValues: [
            { value: 0, label: 'Approved' },
            { value: 1, label: 'Pending' },
          ],
        },
        address: {
          type: 'textarea',
        },
        bio: {
          type: 'richtext',
        },
        password: {
          type: 'password',
        },
        email: {
          type: 'string',
          isRequired: true, 
          
        },
        phoneNumber: {
          type: 'string',
          isRequired: true,
        }
      },
      actions: {
        list: {
          before: [customBeforeListPaticipant],
        },
        edit: {
          before: [customBeforeCreateAndEditPaticipant],
        },
        new: {
          before: [customBeforeCreateAndEditPaticipant],
        },
      },
      
    },
  },
  {
    resource: db.table('user'),
        options: {
            parent: menuItems.dataManagement,
            id: 'Organizers',
            listProperties: ['email', 'userName', 'organizer_name', 'address', 'phoneNumber', 'bio', 'website', 'facebook', 'linkedin'],
            filterProperties: ['email', 'userName', 'organizer_name', 'address', 'phoneNumber', 'bio', 'website', 'facebook', 'linkedin'],
            editProperties: [
                'email',
                'userName',
                'password',
                'organizer_name',
                'address',
                'phoneNumber',
                'bio',
                'website',
                'facebook',
                'linkedin',
            ],
            showProperties: ['email', 'userName', 'organizer_name', 'address', 'phoneNumber', 'bio', 'website', 'facebook', 'linkedin'],
            properties: {
                role: {
                    availableValues: [
                        { value: 0, label: 'Participant' },
                        { value: 1, label: 'Organizer' },
                    ],
                },
                state: {
                    availableValues: [
                        { value: 0, label: 'Approved' },
                        { value: 1, label: 'Pending' },
                    ],
                },
                address: {
                    type: 'textarea',
                },
                bio: {
                    type: 'richtext',
                },
                email: {
                    type: 'string',
                    isRequired: true,
                },
                phoneNumber: {
                    type: 'string',
                    isRequired: true,
                },
                website: {
                    type: 'string',
                },
                facebook: {
                    type: 'string',
                    
                },
                linkedin: {
                    type: 'string',
                    
                },
                
            },
            actions: {
                list: {
                    before: [customBeforeListOrganizer],
                },
                edit: {
                    before: [customBeforeCreateAndEditOrganizer],
                },
                new: {
                    before: [customBeforeCreateAndEditOrganizer],
                },
            },
        },
  },
  {
    resource: db.table('campaign'),
    options: {
      parent: menuItems.dataManagement,
      id: 'Campaigns',
      // listProperties: ['itemName', 'description'],
      // filterProperties: ['itemName'],
      // editProperties: ['itemName', 'description'],
      // showProperties: ['itemName', 'description'],
      properties: {
        description: {
          type: 'richtext',
        },
      },
    },
  },
  {
    resource: db.table('item'),
    options: {
      parent: menuItems.dataManagement,
      id: 'Items',
      listProperties: ['itemName', 'description'],
      filterProperties: ['itemName'],
      editProperties: ['itemName', 'description'],
      showProperties: ['itemName', 'description'],
      properties: {
        description: {
          type: 'richtext',
        },
      },
    },
  },
  {
    resource: db.table('join_campaign'),
    options: {
      parent: menuItems.dataManagement,
      id: 'Joining Campaign',
    },
  },
  {
    resource: db.table('get_item'),
    options: {
      parent: menuItems.dataManagement,
      id: 'Get Item',
    },
  },
  {
    resource: db.table('organizing'),
    options: {
      parent: menuItems.dataManagement,
      id: 'Organizing',
    },
  },
  {
    resource: db.table('user'),
    options: {
      navigation: {
        icon: menuItems.organizerRegistrationRequestApproval.icon,
      },
      // root: true,
      // parent: null,
      id: menuItems.organizerRegistrationRequestApproval.name,
      listProperties: ['email', 'userName', 'address', 'phoneNumber', 'bio', 'website', 'fb_link', 'linkedin_link'],
      filterProperties: ['email', 'userName', 'address', 'phoneNumber', 'bio', 'website', 'fb_link', 'linkedin_link'],
      editProperties: [
        'email',
        'userName',
        'password',
        'address',
        'phoneNumber',
        'bio',
        'website',
        'fb_link',
        'linkedin_link',
      ],
      showProperties: ['email', 'userName', 'address', 'phoneNumber', 'bio', 'website', 'fb_link', 'linkedin_link'],
      properties: {
        role: {
          availableValues: [
            { value: 0, label: 'Participant' },
            { value: 1, label: 'Organizer' },
          ],
        },
        state: {
          availableValues: [
            { value: 0, label: 'Approved' },
            { value: 1, label: 'Pending' },
          ],
        },
      },
      actions: {
        list: {
          before: [customBeforeListOrganizerRecord],
        },
        new: {
          isVisible: false,
        },
        edit: {
          isVisible: false,
        },
        delete: {
          isVisible: false,
        },
        accept: {
          actionType: 'record',
          icon: 'Check',
          label: 'Accept',
          component: false,
          guard: 'Are you sure you want to allow this user account to become an organizer?',
          variant: 'warning',
          handler: async (request, response, context) => {
            const { record, resource, h } = context;
            // const { record, database } = context;
            if (record) {
              await record.update({ role: 1, state: 0 });
              return {
                record: {
                  ...record.toJSON(context.currentAdmin),
                  role: 'organizer',
                },
                redirectUrl: '/admin/resources/Organizer%20Registration%20Request%20Approval/', //replace 'Participant' with resource.id(), h.resourceActionUrl({ resourceId: 'Participants' })
                notice: {
                  message: `Successfully changed role to 'organizer'.`,
                  type: 'success',
                },
              };
            }
          },
        },
        reject: {
          actionType: 'record',
          icon: 'X',
          label: 'Reject',
          component: false,
          guard: 'Are you sure that you want to decline this person from becoming an organizer?',
          variant: 'warning',
          handler: async (request, response, context) => {
            const { record, resource, h } = context;
            if (record) {
              await record.update({ state: 0 });
              return {
                record: {
                  ...record.toJSON(context.currentAdmin),
                  role: 'organizer',
                },
                redirectUrl: '/admin/resources/Organizer%20Registration%20Request%20Approval/',
                notice: {
                  message: `Successfully denied the role as an 'organizer'.`,
                  type: 'success',
                },
              };
            }
          },
        },
      },
    },
  },
];

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: data_resources,
  databases: [],
  branding: {
    companyName: 'Admin - Greendots',
    logo: '/logo.png',
    favicon: '/admin.png'

  },
  
};

export default options;
