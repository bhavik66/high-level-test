import express from 'express';
import {
  createContactData,
  deleteContactData,
  getAllContacts,
  getContactData,
  getFormDefinition,
  updateContactData,
} from '../data/formData.js';

const router = express.Router();

// GET /api/forms/definition/:formId - Get form definition
router.get('/definition/:formId?', async (req, res) => {
  try {
    const formId = req.params.formId || 'contactForm';

    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 100 + Math.random() * 200)
    );

    // Simulate occasional network errors (3% chance)
    if (Math.random() < 0.03) {
      return res.status(500).json({
        error: 'Network error: Failed to fetch form definition',
      });
    }

    const formDefinition = getFormDefinition(formId);

    if (!formDefinition) {
      return res.status(404).json({
        error: 'Form definition not found',
        formId,
      });
    }

    res.json({
      formDefinition,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch form definition:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/forms/contact/:contactId? - Get contact data
router.get('/contact/:contactId?', async (req, res) => {
  try {
    const contactId = req.params.contactId || '1';

    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 150 + Math.random() * 200)
    );

    // Simulate occasional network errors (3% chance)
    if (Math.random() < 0.03) {
      return res.status(500).json({
        error: 'Network error: Failed to fetch contact data',
      });
    }

    const contactData = getContactData(contactId);

    if (!contactData) {
      return res.status(404).json({
        error: 'Contact not found',
        contactId,
      });
    }

    res.json({
      contact: contactData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch contact data:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/forms/contact/:contactId - Update contact data
router.put('/contact/:contactId', async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const formData = req.body;

    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 200 + Math.random() * 300)
    );

    // Simulate occasional network errors (2% chance)
    if (Math.random() < 0.02) {
      return res.status(500).json({
        error: 'Network error: Failed to update contact data',
      });
    }

    const updatedContact = updateContactData(contactId, formData);

    if (!updatedContact) {
      return res.status(404).json({
        error: 'Contact not found',
        contactId,
      });
    }

    res.json({
      contact: updatedContact,
      message: 'Contact updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to update contact data:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/forms/contact - Create new contact
router.post('/contact', async (req, res) => {
  try {
    const formData = req.body;

    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 250 + Math.random() * 300)
    );

    // Simulate occasional network errors (2% chance)
    if (Math.random() < 0.02) {
      return res.status(500).json({
        error: 'Network error: Failed to create contact',
      });
    }

    const newContact = createContactData(formData);

    res.status(201).json({
      contact: newContact,
      message: 'Contact created successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to create contact:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/forms/contacts - Get all contacts
router.get('/contacts', async (req, res) => {
  try {
    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 200 + Math.random() * 300)
    );

    // Simulate occasional network errors (3% chance)
    if (Math.random() < 0.03) {
      return res.status(500).json({
        error: 'Network error: Failed to fetch contacts',
      });
    }

    const contacts = getAllContacts();

    res.json({
      contacts,
      total: contacts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/forms/contact/:contactId - Delete contact
router.delete('/contact/:contactId', async (req, res) => {
  try {
    const contactId = req.params.contactId;

    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, 150 + Math.random() * 200)
    );

    // Simulate occasional network errors (2% chance)
    if (Math.random() < 0.02) {
      return res.status(500).json({
        error: 'Network error: Failed to delete contact',
      });
    }

    const deletedContact = deleteContactData(contactId);

    if (!deletedContact) {
      return res.status(404).json({
        error: 'Contact not found',
        contactId,
      });
    }

    res.json({
      message: 'Contact deleted successfully',
      contact: deletedContact,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to delete contact:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
