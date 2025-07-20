import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SupportContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  notes?: string;
  isEmergency: boolean;
  createdAt: string;
}

interface SupportContextType {
  contacts: SupportContact[];
  addContact: (contact: Omit<SupportContact, 'id' | 'createdAt'>) => void;
  updateContact: (id: string, contact: Partial<Omit<SupportContact, 'id' | 'createdAt'>>) => void;
  deleteContact: (id: string) => void;
  getEmergencyContacts: () => SupportContact[];
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

interface SupportProviderProps {
  children: ReactNode;
}

export const SupportProvider: React.FC<SupportProviderProps> = ({ children }) => {
  const [contacts, setContacts] = useState<SupportContact[]>(() => {
    const savedContacts = localStorage.getItem('supportContacts');
    return savedContacts ? JSON.parse(savedContacts) : [];
  });

  useEffect(() => {
    localStorage.setItem('supportContacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (contact: Omit<SupportContact, 'id' | 'createdAt'>) => {
    const newContact: SupportContact = {
      id: crypto.randomUUID(),
      ...contact,
      createdAt: new Date().toISOString()
    };
    setContacts([...contacts, newContact]);
  };

  const updateContact = (id: string, updates: Partial<Omit<SupportContact, 'id' | 'createdAt'>>) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ));
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const getEmergencyContacts = (): SupportContact[] => {
    return contacts.filter(contact => contact.isEmergency);
  };

  return (
    <SupportContext.Provider value={{
      contacts,
      addContact,
      updateContact,
      deleteContact,
      getEmergencyContacts
    }}>
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
};