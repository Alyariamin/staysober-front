import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Plus, AlertTriangle, Users } from 'lucide-react';
import { useSupport } from '../../contexts/SupportContext';
import SupportContactForm from './SupportContactForm';

const SupportNetwork: React.FC = () => {
  const { contacts, getEmergencyContacts } = useSupport();
  const [showForm, setShowForm] = useState(false);
  
  const emergencyContacts = getEmergencyContacts();
  const regularContacts = contacts.filter(c => !c.isEmergency);

  const callContact = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const emailContact = (email: string) => {
    window.open(`mailto:${email}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800">
          Support Network
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-3 py-2 bg-blue-600 dark:bg-blue-500 ocean:bg-cyan-600 forest:bg-green-600 sunset:bg-orange-600 lavender:bg-purple-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Contact
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <SupportContactForm onComplete={() => setShowForm(false)} />
        </motion.div>
      )}

      {/* Emergency Contacts */}
      {emergencyContacts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Emergency Contacts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-300">{contact.name}</h4>
                    <p className="text-sm text-red-600 dark:text-red-400">{contact.relationship}</p>
                  </div>
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded text-xs font-medium">
                    Emergency
                  </span>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => callContact(contact.phone)}
                    className="w-full flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call {contact.phone}
                  </button>
                  
                  {contact.email && (
                    <button
                      onClick={() => emailContact(contact.email!)}
                      className="w-full flex items-center justify-center px-3 py-2 border border-red-300 text-red-700 dark:text-red-300 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </button>
                  )}
                </div>
                
                {contact.notes && (
                  <p className="mt-3 text-sm text-red-700 dark:text-red-300 italic">
                    {contact.notes}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Contacts */}
      {regularContacts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800 flex items-center mb-4">
            <Users className="h-5 w-5 mr-2" />
            Support Contacts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularContacts.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 border border-gray-200 dark:border-slate-700 rounded-xl p-4"
              >
                <div className="mb-3">
                  <h4 className="font-semibold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800">
                    {contact.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contact.relationship}</p>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => callContact(contact.phone)}
                    className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 dark:bg-blue-500 ocean:bg-cyan-600 forest:bg-green-600 sunset:bg-orange-600 lavender:bg-purple-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {contact.phone}
                  </button>
                  
                  {contact.email && (
                    <button
                      onClick={() => emailContact(contact.email!)}
                      className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </button>
                  )}
                </div>
                
                {contact.notes && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
                    {contact.notes}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {contacts.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Build your support network. Having people to call makes a huge difference.
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 ocean:bg-cyan-600 forest:bg-green-600 sunset:bg-orange-600 lavender:bg-purple-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              Add Your First Contact
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportNetwork;