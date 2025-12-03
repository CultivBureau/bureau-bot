'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Plus, Trash2, Edit, ChevronUp, ChevronDown, Settings, X, Code, HelpCircle,
  Save, RefreshCw
} from 'lucide-react';
import { bitrixService } from '../../../services/bitrix';

interface FunctionProperty {
  id: string;
  name: string;
  field_code: string;
  field_name: string;
  type: string;
  description: string;
  required: boolean;
}

interface FunctionData {
  id: string;
  name: string;
  instruction: string;
  properties: FunctionProperty[];
  phase: string;
  created_at: string;
  updated_at: string;
}

interface CRMField {
  id: string;
  field_code: string;
  field_name: string;
  field_type: string;
  is_required: boolean;
  is_readonly: boolean;
  is_multiple: boolean;
  entity_type: string;
  enum_values?: any;
  is_custom?: boolean;
}

const salesPhases = [
  { id: 'lead', name: 'Lead' },
  { id: 'prospect', name: 'Prospect' },
  { id: 'qualified', name: 'Qualified' },
  { id: 'proposal', name: 'Proposal' },
  { id: 'negotiation', name: 'Negotiation' },
  { id: 'closed_won', name: 'Closed Won' },
  { id: 'closed_lost', name: 'Closed Lost' },
];

export function FunctionsContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get('botId');

  const [functions, setFunctions] = useState<FunctionData[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [functionName, setFunctionName] = useState('');
  const [functionInstruction, setFunctionInstruction] = useState('');
  const [functionProperties, setFunctionProperties] = useState<FunctionProperty[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [functionToDelete, setFunctionToDelete] = useState<FunctionData | null>(null);
  const [functionToEdit, setFunctionToEdit] = useState<FunctionData | null>(null);
  
  // CRM Data state
  const [crmFields, setCrmFields] = useState<CRMField[]>([]);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string>('');
  const [loadingCRMData, setLoadingCRMData] = useState(false);
  
  // Search state for property fields
  const [fieldSearchTerms, setFieldSearchTerms] = useState<Record<string, string>>({});
  const [showFieldDropdowns, setShowFieldDropdowns] = useState<Record<string, boolean>>({});

  // Fetch functions
  const fetchFunctions = async () => {
    if (!botId) return;
    
    try {
      setLoading(true);
      const response = await bitrixService.getFunctions({ bot_id: botId });
      const data = response;
      const functionsList = Array.isArray(data) ? data : (data.results || data);
      
      const mappedFunctions = functionsList.map((func: any) => ({
        id: func.id,
        name: func.name,
        instruction: func.description || func.trigger_instructions || '',
        properties: func.field_mappings || func.properties || [],
        phase: func.new_stage_code || func.phase || '',
        created_at: func.created_on || func.created_at || '',
        updated_at: func.updated_on || func.updated_at || func.created_on || '',
      }));
      
      setFunctions(mappedFunctions);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch functions');
      setFunctions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch CRM data
  const fetchCRMData = async () => {
    if (!botId) return;
    
    try {
      setLoadingCRMData(true);
      const fieldsResponse = await bitrixService.getCrmFields({ bot_id: botId });
      const fieldsData = fieldsResponse;
      const fields = Array.isArray(fieldsData) ? fieldsData : (fieldsData.results || fieldsData);
      setCrmFields(fields);
      
      const pipelinesResponse = await bitrixService.getPipelines({ bot_id: botId, entity_type: 'DEAL' });
      const pipelinesData = pipelinesResponse;
      const pipelinesList = Array.isArray(pipelinesData) ? pipelinesData : (pipelinesData.results || pipelinesData);
      setPipelines(pipelinesList);
    } catch (err) {
      console.error('Failed to fetch CRM data:', err);
    } finally {
      setLoadingCRMData(false);
    }
  };

  // Fetch stages when pipeline changes
  const fetchStages = async (pipelineId: string) => {
    if (!botId || !pipelineId) return;
    
    try {
      const response = await bitrixService.getStages({ bot_id: botId, pipeline_id: pipelineId });
      const data = response;
      const stagesList = Array.isArray(data) ? data : (data.results || data);
      setStages(stagesList);
    } catch (err) {
      console.error('Failed to fetch stages:', err);
    }
  };

  useEffect(() => {
    if (botId) {
      fetchFunctions();
      fetchCRMData();
    }
  }, [botId]);

  useEffect(() => {
    if (selectedPipeline) {
      fetchStages(selectedPipeline);
    } else {
      setStages([]);
    }
  }, [selectedPipeline, botId]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSave = async () => {
    if (!botId) return;
    
    setSaving(true);
    setError('');
    
    try {
      const normalizedFunctionName = functionName.replace(/[^a-zA-Z0-9_-]/g, '_');
      
      const validProperties = functionProperties.filter(prop => {
        const field_code = prop.field_code || prop.name || '';
        return field_code && field_code !== 'function' && field_code.trim() !== '';
      });
      
      const properties = validProperties.reduce((acc, prop) => {
        const fieldKey = prop.field_code || prop.name;
        acc[fieldKey] = {
          type: 'string',
          title: prop.field_name || prop.description || prop.name,
          description: prop.description || prop.field_name || prop.name,
        };
        return acc;
      }, {} as Record<string, any>);
      
      const required = validProperties.map(prop => prop.field_code || prop.name);
      
      const function_definition = {
        name: normalizedFunctionName,
        description: functionInstruction || functionName,
        strict: false,
        parameters: {
          type: 'object',
          required: required,
          properties: properties,
          additionalProperties: false,
        },
      };
      
      if (editing && functionToEdit) {
        await bitrixService.updateFunction(functionToEdit.id, {
          name: functionName,
          description: functionInstruction,
          trigger_instructions: functionInstruction,
          new_stage_code: selectedPhase,
          function_definition: function_definition,
          properties: validProperties.map(prop => ({
            crm_field_code: prop.field_code,
            crm_field_name: prop.field_name,
            description: prop.description || '',
            data_type: 'STRING',
            required: true,
          })),
        });
        
        await fetchFunctions();
        setShowCreateForm(false);
        setEditing(false);
        setFunctionToEdit(null);
        setSuccess('Function updated successfully!');
      } else {
        await bitrixService.createFunctionWithOpenAI({
          bot_id: botId,
          name: functionName,
          description: functionInstruction,
          trigger_instructions: functionInstruction,
          result_format: '',
          new_stage_code: selectedPhase,
          function_definition: function_definition,
          properties: validProperties.map(prop => ({
            crm_field_code: prop.field_code,
            crm_field_name: prop.field_name,
            description: prop.description || '',
            data_type: 'STRING',
            required: true,
          })),
        });
        
        await fetchFunctions();
        setShowCreateForm(false);
        setSuccess('Function created successfully!');
      }
      
      setFunctionName('');
      setFunctionInstruction('');
      setFunctionProperties([]);
      setSelectedPhase('');
    } catch (err: any) {
      setError(err?.message || 'Failed to save function');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFunction = () => {
    setShowCreateForm(true);
    setFunctionName('');
    setFunctionInstruction('');
    setFunctionProperties([]);
    setSelectedPhase('');
    setEditing(false);
    setFunctionToEdit(null);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setFunctionName('');
    setFunctionInstruction('');
    setFunctionProperties([]);
    setSelectedPhase('');
    setEditing(false);
    setFunctionToEdit(null);
  };

  const handleDeleteFunction = (func: FunctionData) => {
    setFunctionToDelete(func);
  };

  const confirmDelete = async () => {
    if (!functionToDelete || !botId) return;
    
    try {
      await bitrixService.deleteFunction(functionToDelete.id);
      await fetchFunctions();
      setSuccess('Function deleted successfully!');
      setFunctionToDelete(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete function');
    }
  };

  const cancelDelete = () => {
    setFunctionToDelete(null);
  };

  const addProperty = () => {
    const newProperty: FunctionProperty = {
      id: Date.now().toString(),
      name: '',
      field_code: '',
      field_name: '',
      type: 'string',
      description: '',
      required: true,
    };
    setFunctionProperties([...functionProperties, newProperty]);
    setFieldSearchTerms(prev => ({ ...prev, [newProperty.id]: '' }));
    setShowFieldDropdowns(prev => ({ ...prev, [newProperty.id]: false }));
  };

  const removeProperty = (id: string) => {
    setFunctionProperties(functionProperties.filter(prop => prop.id !== id));
  };

  const updateProperty = (id: string, field: keyof FunctionProperty, value: any) => {
    setFunctionProperties(functionProperties.map(prop => 
      prop.id === id ? { ...prop, [field]: value } : prop
    ));
  };

  const getFilteredFields = useMemo(() => {
    return (searchTerm: string) => {
      if (!searchTerm.trim()) return crmFields;
      const lowerSearch = searchTerm.toLowerCase();
      return crmFields.filter(field => 
        field.field_name.toLowerCase().includes(lowerSearch) ||
        field.field_code.toLowerCase().includes(lowerSearch) ||
        (field.entity_type && field.entity_type.toLowerCase().includes(lowerSearch))
      );
    };
  }, [crmFields]);

  const handleFieldSelect = (propertyId: string, field: CRMField) => {
    setFunctionProperties(prev => prev.map(prop => 
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
  };

  const handleEditFunction = async (func: FunctionData) => {
    try {
      if (crmFields.length === 0 && !loadingCRMData) {
        await fetchCRMData();
      }
      
      const functionResponse = await bitrixService.getFunction(func.id);
      const functionData = functionResponse;
      
      setFunctionToEdit(func);
      setFunctionName(functionData.name || func.name);
      setFunctionInstruction(functionData.description || functionData.trigger_instructions || func.instruction || '');
      
      const fieldMappings = functionData.field_mappings || [];
      const properties: FunctionProperty[] = fieldMappings.map((prop: any, index: number) => {
        let field_code = prop.crm_field_code || prop.field_code || prop.name || '';
        if ((!field_code || field_code === 'function') && prop.crm_field_name && crmFields.length > 0) {
          const foundByFieldName = crmFields.find(f => f.field_name === prop.crm_field_name);
          if (foundByFieldName) {
            field_code = foundByFieldName.field_code;
          }
        }
        
        let field_name = prop.crm_field_name || '';
        if (!field_name && field_code && field_code !== 'function' && crmFields.length > 0) {
          const foundField = crmFields.find(f => f.field_code === field_code);
          if (foundField) {
            field_name = foundField.field_name;
          }
        }
        
        const description = prop.description || '';
        
        return {
          id: `${Date.now()}-${index}`,
          name: field_code || field_name || '',
          field_code: field_code,
          field_name: field_name,
          type: 'string',
          description: description,
          required: true,
        };
      });
      
      setFunctionProperties(properties);
      
      const initialSearchTerms: Record<string, string> = {};
      properties.forEach((prop: FunctionProperty) => {
        if (prop.field_name) {
          initialSearchTerms[prop.id] = prop.field_name;
        } else if (prop.field_code) {
          initialSearchTerms[prop.id] = prop.field_code;
        }
      });
      
      setTimeout(() => {
        setFieldSearchTerms(prev => ({ ...prev, ...initialSearchTerms }));
      }, 100);
      
      const phase = functionData.new_stage_code || functionData.phase || func.phase || '';
      setSelectedPhase(phase);
      
      if (phase && pipelines.length > 0) {
        const findPipelineForStage = async () => {
          for (const pipeline of pipelines) {
            try {
              const res = await bitrixService.getStages({ bot_id: botId ?? undefined, pipeline_id: pipeline.pipeline_id ?? undefined });
              const stagesData = res;
              const stagesArray = Array.isArray(stagesData) ? stagesData : (stagesData.results || stagesData);
              const foundStage = stagesArray.find((s: any) => s.stage_code === phase);
              if (foundStage && pipeline.pipeline_id) {
                setSelectedPipeline(pipeline.pipeline_id);
                await fetchStages(pipeline.pipeline_id);
                break;
              }
            } catch (err) {
              console.error('Error fetching stages:', err);
            }
          }
        };
        await findPipelineForStage();
      }
      
      setEditing(true);
      setShowCreateForm(true);
      setMenuOpen(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load function data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm text-muted-foreground">Loading functions...</div>
      </div>
    );
  }

  if (!botId) {
    return (
      <div className="text-center text-muted-foreground">
        Please select a bot to manage its functions.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-sm p-8 shadow-sm">
        {functions.length === 0 && !showCreateForm && (
          <div className="text-center py-12">
            <Code className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">
              No functions created yet
            </h3>
            <p className="mb-6 text-muted-foreground">
              Create your first function to get started with custom bot capabilities
            </p>
            <button 
              onClick={handleCreateFunction}
              className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-5 h-5" />
              Create First Function
            </button>
          </div>
        )}

        {functions.length > 0 && !showCreateForm && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-card-foreground">
                Functions ({functions.length})
              </h2>
              <button 
                onClick={handleCreateFunction}
                className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
              >
                <Plus className="w-4 h-4" />
                Create Function
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {functions.map((func) => (
                <div key={func.id} className="p-4 rounded-xl border border-border bg-card/50 relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-card-foreground">
                      {func.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setExpandedCard(expandedCard === func.id ? null : func.id)}
                        className="p-1 rounded-lg text-muted-foreground hover:bg-secondary"
                      >
                        {expandedCard === func.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setMenuOpen(menuOpen === func.id ? null : func.id)}
                          className="p-1 rounded-lg text-muted-foreground hover:bg-secondary"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        
                        {menuOpen === func.id && (
                          <div className="absolute right-0 top-8 w-48 rounded-lg border border-border bg-card z-10">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await handleEditFunction(func);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-secondary flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFunction(func);
                                setMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mb-3 text-muted-foreground">
                    {func.instruction ? func.instruction.substring(0, 100) + '...' : 'No description'}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {func.properties.length} properties • {func.phase || 'No phase'}
                  </div>

                  {expandedCard === func.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium mb-2 text-card-foreground">
                            Full Description
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {func.instruction || 'No description'}
                          </p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium mb-2 text-card-foreground">
                            Properties ({func.properties.length})
                          </h5>
                          <div className="space-y-2">
                            {func.properties.map((prop, index) => (
                              <div key={index} className="p-2 rounded-lg bg-secondary/50">
                                <span className="text-sm font-medium text-card-foreground">
                                  {prop.name || prop.field_name || ''}
                                </span>
                                {prop.description && (
                                  <p className="text-xs mt-1 text-muted-foreground">
                                    {prop.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {showCreateForm && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-card-foreground">
                {editing ? 'Edit Function' : 'Create New Function'}
              </h2>
              <button
                onClick={handleCancelCreate}
                className="p-2 rounded-lg text-muted-foreground hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-card-foreground">
                Function Name
              </label>
              <input
                type="text"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
                placeholder="Name Function"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground"
              />
            </div>
          
            <div className="space-y-2">
              <label className="block text-sm font-medium text-card-foreground">
                Function instruction
              </label>
              <textarea
                value={functionInstruction}
                onChange={(e) => setFunctionInstruction(e.target.value)}
                placeholder="Function instruction here..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground resize-y"
              />
            </div>
          
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-card-foreground">
                  Function properties for crm fields:
                </label>
                <button
                  onClick={addProperty}
                  className="p-2 rounded-lg bg-green-500/20 text-green-600 hover:bg-green-500/30"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-blue-500/20 text-blue-600 hover:bg-blue-500/30">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            
              {functionProperties.map((property) => (
                <div key={property.id} className="p-4 rounded-xl border border-border bg-card/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-card-foreground">
                      {property.field_name || property.name || ''}
                    </h4>
                    <button
                      onClick={() => removeProperty(property.id)}
                      className="p-1 rounded-lg text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2 relative">
                      <label className="text-sm font-medium text-card-foreground">
                        Field:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={
                            showFieldDropdowns[property.id]
                              ? (fieldSearchTerms[property.id] ?? property.field_name ?? property.name ?? '')
                              : (fieldSearchTerms[property.id] || property.field_name || property.field_code || property.name || '')
                          }
                          onChange={(e) => {
                            const searchValue = e.target.value;
                            setFieldSearchTerms(prev => ({ ...prev, [property.id]: searchValue }));
                            setShowFieldDropdowns(prev => ({ ...prev, [property.id]: true }));
                          }}
                          onFocus={() => {
                            if (property.field_name && !fieldSearchTerms[property.id]) {
                              setFieldSearchTerms(prev => ({ ...prev, [property.id]: property.field_name }));
                            }
                            setShowFieldDropdowns(prev => ({ ...prev, [property.id]: true }));
                          }}
                          onBlur={() => {
                            setTimeout(() => {
                              setShowFieldDropdowns(prev => {
                                const newState = { ...prev };
                                delete newState[property.id];
                                return newState;
                              });
                              if (property.field_name && property.field_code) {
                                setFieldSearchTerms(prev => ({ ...prev, [property.id]: property.field_name }));
                              }
                            }, 200);
                          }}
                          placeholder={property.field_name ? property.field_name : "Search by field name or code..."}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                        />
                        
                        {showFieldDropdowns[property.id] && (
                          <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-card">
                            {(() => {
                              const filtered = getFilteredFields(fieldSearchTerms[property.id] || '');
                              if (filtered.length === 0) {
                                return (
                                  <div className="p-3 text-sm text-muted-foreground">
                                    {loadingCRMData ? 'Loading fields...' : crmFields.length === 0 ? 'No CRM fields available. Sync CRM data first.' : 'No fields found'}
                                  </div>
                                );
                              }
                              return filtered.map(field => {
                                const entityTypeLabel = field.entity_type || 'DEAL';
                                const isSelected = property.field_code === field.field_code && property.field_code !== '';
                                
                                return (
                                  <div
                                    key={`${field.id}-${entityTypeLabel}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleFieldSelect(property.id, field);
                                    }}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                    }}
                                    className={`px-4 py-2 cursor-pointer transition-all ${
                                      isSelected
                                        ? 'bg-primary/20 text-primary'
                                        : 'hover:bg-secondary text-foreground'
                                    }`}
                                  >
                                    <div className="font-medium">{field.field_name}</div>
                                    <div className="text-xs mt-1 text-muted-foreground">
                                      Code: {field.field_code} • Type: {field.field_type}
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-card-foreground">
                        Description:
                      </label>
                      <textarea
                        value={property.description}
                        onChange={(e) => updateProperty(property.id, 'description', e.target.value)}
                        placeholder="Property description"
                        rows={1}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-card-foreground">
                Change phase or sales funnel:
              </label>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Pipeline:
                </label>
                <select
                  value={selectedPipeline}
                  onChange={(e) => setSelectedPipeline(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground"
                >
                  <option value="">Select pipeline</option>
                  {pipelines.map(pipeline => (
                    <option key={pipeline.id} value={pipeline.pipeline_id}>
                      {pipeline.pipeline_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Stage:
                </label>
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground"
                >
                  <option value="">Select stage</option>
                  {stages.map(stage => (
                    <option key={stage.id} value={stage.stage_code}>
                      {stage.stage_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {editing ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editing ? 'Update Function' : 'Save Function'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {functionToDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-md rounded-2xl bg-card border border-border">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-card-foreground">
                  Delete Function
                </h2>
                <button
                  onClick={cancelDelete}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-base text-muted-foreground">
                Are you sure you want to delete &quot;<strong>{functionToDelete.name}</strong>&quot;?
              </p>
              <p className="text-sm mt-2 text-muted-foreground">
                This action will delete the function from both the database and OpenAI. This action cannot be undone.
              </p>
            </div>
            
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
