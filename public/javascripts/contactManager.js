document.addEventListener("DOMContentLoaded", _ =>{

  const contactTemplate = Handlebars.compile(document.querySelector('#contacts').innerHTML);
  const contactsDisplay = document.querySelector('#contacts-display')
  const contactInfoForm = document.querySelector('#contact-information');
  fetchAndRenderContacts();

  // test contact
  let testContact = {
    full_name: 'Dossie Easton',
    email: 'dossie@cnm.com',
    phone_number: 'asdf',
    tags: 'ethics, relationships'
  }

  let testUpdateContact = {
    full_name: 'Dossie Easton',
    email: undefined,
    phone_number: '12345555555',
    tags: 'ethics, relationships',
    id: 5,
  }

  async function fetchContacts() {
    const response = await fetch('/api/contacts', {
      headers: {
        "Content-Type": "application/json"
      }
    });
    let contactList = await response.json();
    contactList.forEach(contact => {
      contact.tags = contact.tags ? contact.tags.split(',') : [];
    });
    return contactList;
  }

  function renderContacts(list) {
    contactsDisplay.innerHTML = contactTemplate({contacts: list});
  }

  function fetchAndRenderContacts() {
    fetchContacts().then((response) => {
      renderContacts(response)
    });
  }

  async function addContact(contactObject) {
    const response = await fetch('/api/contacts' , {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contactObject)
    });

    if (response.status === 201) {
      alert("Contact added successfully");
    } else {
      const text = await response.text();
      throw new Error(`Error adding contact" ${text}`);
    }
    fetchAndRenderContacts();
  }

  async function updateContact(contactObject) {
    const id = contactObject.id
    const response = await fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactObject)
    });

    if (response.status === 201) {
      alert("Contact updated successfully");
    } else {
      const text = await response.text();
      throw new Error(`Error updating contact" ${text}`);
    }
  }
  // updateContact(testUpdateContact);

  async function deleteContact(id) {
    const response = await fetch(`/api/contacts/${id}`, {
      method: 'DELETE',
    });

    if (response.status === 204) {
      alert("Contact deleted successfully");
      fetchAndRenderContacts();
    } else if (response.status === 400) {
      alert('Contact not found');
    } else {
      const text = await response.text();
      throw new Error(`Error deleting contact" ${text}`);
    }
  }

  function processClickAction(event) {
    if (event.target.matches('.delete-link')) {
      deleteContact(event.target.parentElement.dataset.id).then();
    } else if (event.target.matches('.edit-link')) {  //add the class to the edit buttons

    }
  }

  document.querySelector('#contact-information').addEventListener('submit', evt => {
    evt.preventDefault();
    let contactFormData = new FormData(contactInfoForm);
    let contactObject = {
      full_name: contactFormData.get('full-name'),
      email: contactFormData.get('email'),
      phone_number: contactFormData.get('phone'),
      tags: contactFormData.getAll('tags').join(','),
    }

    addContact(contactObject).then();
  })

  contactsDisplay.addEventListener('click', processClickAction)

  const addContactAnchor = document.querySelector('#add-contact')
  addContactAnchor.addEventListener('click', evt => {
    document.querySelector('#new-contact').style.display = 'block';
    document.querySelector('#contacts-display').style.display = 'none';
  })
})
