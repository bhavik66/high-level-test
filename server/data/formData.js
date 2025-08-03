// Form definitions and contact data for API
export const formDefinitions = {
  contactForm: {
    schemaVersion: 1,
    title: 'User Registration Wizard',
    description:
      'Production-grade example demonstrating advanced features for dynamic form rendering.',
    groups: [
      {
        id: 'personal_info',
        label: 'Personal Information',
        fields: [
          {
            id: 'first_name',
            label: 'First Name',
            type: 'text',
            placeholder: 'John',
            validation: [
              {
                type: 'required',
                errorMessage: 'First name is required',
              },
              {
                type: 'minLength',
                value: 2,
                errorMessage: 'First name must be at least 2 characters',
              },
              {
                type: 'maxLength',
                value: 50,
                errorMessage: 'First name cannot exceed 50 characters',
              },
            ],
          },
          {
            id: 'last_name',
            label: 'Last Name',
            type: 'text',
            placeholder: 'Doe',
            validation: [
              {
                type: 'required',
                errorMessage: 'Last name is required',
              },
              {
                type: 'minLength',
                value: 2,
                errorMessage: 'Last name must be at least 2 characters',
              },
              {
                type: 'maxLength',
                value: 50,
                errorMessage: 'Last name cannot exceed 50 characters',
              },
            ],
          },
          {
            id: 'bio',
            label: 'Biography',
            type: 'textarea',
            placeholder: 'Tell us about yourself',
            validation: [
              {
                type: 'maxLength',
                value: 500,
                errorMessage: 'Biography cannot exceed 500 characters',
              },
            ],
            ui: {
              colSpan: 'lg:col-span-2',
              rows: 4,
            },
          },
          {
            id: 'dob',
            label: 'Date of Birth',
            type: 'date',
            validation: [
              {
                type: 'required',
                errorMessage: 'Date of birth is required',
              },
              {
                type: 'maxDate',
                value: 'today',
                errorMessage: 'Date of birth cannot be in the future',
              },
              {
                type: 'age',
                value: 18,
                errorMessage: 'User must be at least 18 years old',
              },
            ],
          },
          {
            id: 'gender',
            label: 'Gender',
            type: 'dropdown',
            options: ['Male', 'Female', 'Other'],
            validation: [
              {
                type: 'required',
                errorMessage: 'Please select a gender',
              },
            ],
          },
          {
            id: 'marital_status',
            label: 'Marital Status',
            type: 'radio',
            options: ['Single', 'Married', 'Divorced', 'Widowed'],
            validation: [
              {
                type: 'required',
                errorMessage: 'Please select your marital status',
              },
            ],
          },
          {
            id: 'spouse_name',
            label: 'Spouse Name',
            type: 'text',
            visibility: {
              dependsOn: 'marital_status',
              value: 'Married',
            },
            validation: [
              {
                type: 'minLength',
                value: 2,
                errorMessage: 'Spouse name must be at least 2 characters',
              },
              {
                type: 'maxLength',
                value: 50,
                errorMessage: 'Spouse name cannot exceed 50 characters',
              },
            ],
          },
        ],
      },
      {
        id: 'contact_info',
        label: 'Contact Information',
        fields: [
          {
            id: 'email',
            label: 'Email Address',
            type: 'email',
            placeholder: 'email@example.com',
            validation: [
              {
                type: 'required',
                errorMessage: 'Email address is required',
              },
              {
                type: 'email',
                errorMessage: 'Please enter a valid email address',
              },
            ],
          },
          {
            id: 'phone',
            label: 'Phone Number',
            type: 'tel',
            placeholder: '+123 456 7890',
            validation: [
              {
                type: 'pattern',
                value: '^[+]?\\d{10,15}$',
                errorMessage: 'Please enter a valid phone number',
              },
            ],
          },
          {
            id: 'country',
            label: 'Country',
            type: 'dropdown',
            options: [
              'United States',
              'Canada',
              'United Kingdom',
              'Germany',
              'France',
              'Australia',
              'Japan',
              'India',
            ],
            validation: [
              {
                type: 'required',
                errorMessage: 'Please select a country',
              },
            ],
          },
          {
            id: 'state',
            label: 'State / Province',
            type: 'dropdown',
            options: ['California', 'New York', 'Texas', 'Florida', 'Illinois'],
            visibility: {
              dependsOn: 'contact_info.country',
              valueNotEmpty: true,
            },
            validation: [
              {
                type: 'required',
                errorMessage: 'Please select a state/province',
              },
            ],
          },
          {
            id: 'address_line1',
            label: 'Address Line 1',
            type: 'text',
            validation: [
              {
                type: 'required',
                errorMessage: 'Address line 1 is required',
              },
            ],
            ui: { colSpan: 'lg:col-span-2' },
          },
          {
            id: 'address_line2',
            label: 'Address Line 2',
            type: 'text',
            ui: { colSpan: 'lg:col-span-2' },
          },
          {
            id: 'city',
            label: 'City',
            type: 'text',
            validation: [
              {
                type: 'required',
                errorMessage: 'City is required',
              },
            ],
          },
          {
            id: 'zip',
            label: 'ZIP / Postal Code',
            type: 'text',
            validation: [
              {
                type: 'required',
                errorMessage: 'ZIP/postal code is required',
              },
              {
                type: 'pattern',
                value: '^[A-Za-z0-9 -]{3,10}$',
                errorMessage: 'Please enter a valid ZIP/postal code',
              },
            ],
          },
        ],
      },
    ],
  },
};

// Contact data storage (simulating database records)
let contactDataStore = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    bio: 'Software engineer passionate about open source.',
    dob: '1990-01-01',
    gender: 'Male',
    marital_status: 'Married',
    spouse_name: 'Jane Doe',
    email: 'john.doe@example.com',
    phone: '+12345678901',
    country: 'Canada',
    state: 'California',
    address_line1: '123 Main St',
    address_line2: 'Apt 4B',
    city: 'San Francisco',
    zip: '94105',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Utility functions
export function getFormDefinition(formId = 'contactForm') {
  return formDefinitions[formId] || null;
}

export function getContactData(contactId = '1') {
  return contactDataStore.find(contact => contact.id === contactId) || null;
}

export function updateContactData(contactId, formData) {
  const contactIndex = contactDataStore.findIndex(
    contact => contact.id === contactId
  );

  if (contactIndex !== -1) {
    contactDataStore[contactIndex] = {
      ...contactDataStore[contactIndex],
      ...formData,
      updated_at: new Date().toISOString(),
    };
    return contactDataStore[contactIndex];
  }

  return null;
}

export function createContactData(formData) {
  const newContact = {
    id: (contactDataStore.length + 1).toString(),
    ...formData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  contactDataStore.push(newContact);
  return newContact;
}

export function getAllContacts() {
  return contactDataStore;
}

export function deleteContactData(contactId) {
  const contactIndex = contactDataStore.findIndex(
    contact => contact.id === contactId
  );

  if (contactIndex !== -1) {
    const deletedContact = contactDataStore.splice(contactIndex, 1)[0];
    return deletedContact;
  }

  return null;
}
