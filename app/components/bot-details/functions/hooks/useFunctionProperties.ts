import { useState, useCallback } from 'react';
import type { FunctionProperty, CRMField } from '../../../../types/functions';

export function useFunctionProperties() {
  const [properties, setProperties] = useState<FunctionProperty[]>([]);
  const [fieldSearchTerms, setFieldSearchTerms] = useState<Record<string, string>>({});
  const [showFieldDropdowns, setShowFieldDropdowns] = useState<Record<string, boolean>>({});

  const addProperty = useCallback(() => {
    const newProperty: FunctionProperty = {
      id: Date.now().toString(),
      name: '',
      field_code: '',
      field_name: '',
      type: 'string',
      description: '',
      required: true,
    };
    setProperties(prev => [...prev, newProperty]);
    setFieldSearchTerms(prev => ({ ...prev, [newProperty.id]: '' }));
    setShowFieldDropdowns(prev => ({ ...prev, [newProperty.id]: false }));
  }, []);

  const removeProperty = useCallback((id: string) => {
    setProperties(prev => prev.filter(prop => prop.id !== id));
    setFieldSearchTerms(prev => {
      const newTerms = { ...prev };
      delete newTerms[id];
      return newTerms;
    });
    setShowFieldDropdowns(prev => {
      const newDrops = { ...prev };
      delete newDrops[id];
      return newDrops;
    });
  }, []);

  const updateProperty = useCallback((id: string, field: keyof FunctionProperty, value: any) => {
    setProperties(prev => prev.map(prop => 
      prop.id === id ? { ...prop, [field]: value } : prop
    ));
  }, []);

  const handleFieldSelect = useCallback((propertyId: string, field: CRMField) => {
    setProperties(prev => prev.map(prop => 
      prop.id === propertyId 
        ? { 
            ...prop, 
            field_code: field.field_code,
            field_name: field.field_name,
            name: field.field_code,
          } 
        : prop
    ));
    
    setFieldSearchTerms(prev => ({ ...prev, [propertyId]: field.field_name }));
    setShowFieldDropdowns(prev => ({ ...prev, [propertyId]: false }));
  }, []);

  const setFieldSearchTerm = useCallback((propertyId: string, term: string) => {
    setFieldSearchTerms(prev => ({ ...prev, [propertyId]: term }));
  }, []);

  const setFieldDropdown = useCallback((propertyId: string, show: boolean) => {
    setShowFieldDropdowns(prev => ({ ...prev, [propertyId]: show }));
  }, []);

  const resetProperties = useCallback(() => {
    setProperties([]);
    setFieldSearchTerms({});
    setShowFieldDropdowns({});
  }, []);

  const setPropertiesWithSearchTerms = useCallback((newProperties: FunctionProperty[]) => {
    setProperties(newProperties);
    const initialSearchTerms: Record<string, string> = {};
    newProperties.forEach((prop: FunctionProperty) => {
      if (prop.field_name) {
        initialSearchTerms[prop.id] = prop.field_name;
      } else if (prop.field_code) {
        initialSearchTerms[prop.id] = prop.field_code;
      }
    });
    setFieldSearchTerms(initialSearchTerms);
  }, []);

  return {
    properties,
    fieldSearchTerms,
    showFieldDropdowns,
    addProperty,
    removeProperty,
    updateProperty,
    handleFieldSelect,
    setFieldSearchTerm,
    setFieldDropdown,
    resetProperties,
    setPropertiesWithSearchTerms,
  };
}

