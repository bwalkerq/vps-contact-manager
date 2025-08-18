import {APIRequestManager} from "./APIRequestManager.js";
import {UserInterface} from "./userInterface.js";

class Application {

  constructor() {
    this.api = new APIRequestManager();
    this.interface = new UserInterface(this);
    this.tags = new Set();
    this.contacts = [];
    this.createTagsSet().then();
    this.fetchAndRenderContacts();
  }

  fetchAndRenderContacts() {
    this.api.fetchContacts().then((response) => {
      this.contacts = response;
      this.interface.renderContacts(this.contacts);
    });
  }

  async createTagsSet() {
    let contactsArray = await this.api.fetchContacts();
    let tagsArray = [];
    for (const contactsArrayElement of contactsArray) {
      for (const tag of contactsArrayElement.tags) {tagsArray.push(tag);}
    }
    tagsArray.sort();

    for (const tagsArrayElement of tagsArray) {
      this.tags.add(tagsArrayElement);
    }
  }

  async addContact(contactObject) {
    let response = await this.api.addContact(contactObject);
    this.interface.resetContactInfoForm() // does it make sense to call this here, or in the UI file?
    this.fetchAndRenderContacts();
  }

  async deleteContact(id) {
    let response = await this.api.deleteContact(id);
    this.fetchAndRenderContacts();
  }

  async fetchContact(id) {
    return await this.api.fetchSingleContact(id);
  }

  async updateContact(id, contactObject) {
    contactObject.id = id;
    await this.api.updateContact(contactObject);
  }

  addTag(tag) {
    this.tags.add(tag);
  }

  onSearchInput(input) {
    // If input is empty, return all contacts
    if (input === '') {
      this.interface.renderContacts(this.contacts);
      return;
    }

    // makes a case-insensitive regex with the input
    const regex = new RegExp(input, "i");

    // stores the contacts that matches the input on name or any tags,
    let filteredContacts = this.contacts.filter(contact => {
      if (contact.full_name.match(regex)) {return true}
      return contact.tags.some(tag => tag.match(regex));
    })

    this.interface.renderContacts(filteredContacts);
  }
}

document.addEventListener('DOMContentLoaded', _ => {
  const app = new Application();
})
