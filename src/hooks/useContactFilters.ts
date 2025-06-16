
import { useState, useMemo } from 'react';
import { Contact } from '@/types/contact';

export const useContactFilters = (contacts: Contact[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      // Filtro por nome
      const matchesSearch = searchTerm === '' || 
        contact.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.documento && contact.documento.includes(searchTerm));
      
      // Filtro por tipo
      let matchesType = typeFilter === 'all';
      if (!matchesType) {
        if (typeFilter === 'Funcionário') {
          matchesType = contact.tipo === 'Funcionário' || contact.tipo === 'Funcionario';
        } else {
          matchesType = contact.tipo === typeFilter;
        }
      }
      
      // Filtro por data
      let matchesDateRange = true;
      if (startDate || endDate) {
        const contactDate = new Date(contact.data);
        
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          matchesDateRange = contactDate >= start && contactDate <= end;
        } else if (startDate) {
          const start = new Date(startDate);
          matchesDateRange = contactDate >= start;
        } else if (endDate) {
          const end = new Date(endDate);
          matchesDateRange = contactDate <= end;
        }
      }
      
      return matchesSearch && matchesType && matchesDateRange;
    });
  }, [contacts, searchTerm, typeFilter, startDate, endDate]);

  return {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredContacts
  };
};
