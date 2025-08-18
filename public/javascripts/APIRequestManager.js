export class APIRequestManager {
  async fetchContacts() {
    const response = await fetch('/api/contacts', {
      headers: {"Content-Type": "application/json"}
    });
    let contactList = await response.json();
    contactList.forEach(contact => {
      contact.tags = contact.tags ? contact.tags.split(',') : [];
    });
    return contactList;
  }

  // given a contact object without an id, creates a new contact in the database
  async addContact(contactObject) {
    let response = await fetch('/api/contacts' , {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(contactObject)
    });

    if (response.status >= 400 && response.status <= 499) {
      const text = await response.text();
      throw new Error(`Error adding contact" ${text}`);
    }

    return response.json()
  }

  // given a contact object with an id, updates the information for that id
  async updateContact(contactObject) {
    const id = contactObject.id
    let response = await fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactObject)
    });

    if (response.status >= 400 && response.status <= 499) {
      const text = await response.text();
      throw new Error(`Error updating contact" ${text}`);
    }

    response = await response.json()
    return response
  }

  // Given an id, deletes the contact
  async deleteContact(id) {
    const response = await fetch(`/api/contacts/${id}`, {
      method: 'DELETE',
    });

    if (response.status === 204) {
      alert("success")
    }
    else if (response.status === 400) {
      alert('Contact not found');
    } else {
      const text = await response.text();
      throw new Error(`Error deleting contact" ${text}`);
    }
  }

  // Given an id, returns a contact object
  async fetchSingleContact(id) {
    let response = await fetch(`/api/contacts/${id}`,{
      method: 'GET',
      headers: {"Content-Type": "application/json"},
    });

    if (response.status !== 200) {
      const text = await response.text();
      throw new Error(`Error updating contact" ${text}`);
    }

    response = await response.json();
    return response;
  }
}