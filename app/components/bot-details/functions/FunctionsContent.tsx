'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Plus, Trash2, Edit, ChevronUp, ChevronDown, Settings, X, Code, HelpCircle,
  Save, RefreshCw
} from 'lucide-react';
import { bitrixService } from '../../../services/bitrix';
import { functionsService, type Function, type IntegrationType } from '../../../services/functions';

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
  integration_type?: IntegrationType;
  is_active?: boolean;
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
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [functionToDelete, setFunctionToDelete] = useState<FunctionData | null>(null);
  const [functionToEdit, setFunctionToEdit] = useState<FunctionData | null>(null);
  const [viewingFunction, setViewingFunction] = useState<FunctionData | null>(null);
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'create'>('create');
  
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
      const response = await functionsService.getFunctions({ 
        bot_id: botId,
        integration_type: 'BITRIX' // Only BITRIX for now
      });
      
      const functionsList = response.results || [];
      
      const mappedFunctions = functionsList.map((func: Function) => {
        // Parse properties and phase from result_format
        let phase = '';
        let properties: FunctionProperty[] = [];
        
        if (func.result_format) {
          // Extract stage
          const stageMatch = func.result_format.match(/Stage:\s*([^|]+)/);
          if (stageMatch) {
            phase = stageMatch[1].trim();
          }
          
          // Extract properties
          const propertiesMatch = func.result_format.match(/Properties:\s*(.+)/);
          if (propertiesMatch) {
            try {
              const propertiesJson = propertiesMatch[1].trim();
              const parsedProperties = JSON.parse(propertiesJson);
              
              if (Array.isArray(parsedProperties)) {
                properties = parsedProperties.map((prop: any, index: number) => ({
                  id: `${func.id}-prop-${index}`,
                  name: prop.field_code || prop.field_name || '',
                  field_code: prop.field_code || '',
                  field_name: prop.field_name || '',
                  type: 'string',
                  description: prop.description || '',
                  required: true,
                }));
              }
            } catch (err) {
              console.error('Failed to parse properties for function:', func.id, err);
            }
          }
        }
        
        return {
          id: func.id,
          name: func.name,
          instruction: func.trigger_instructions || '',
          properties: properties,
          phase: phase,
          created_at: func.created_on || '',
          updated_at: func.updated_on || func.created_on || '',
          integration_type: func.integration_type,
          is_active: func.is_active,
        };
      });
      
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
      const fields = Array.isArray(fieldsResponse) ? fieldsResponse : (fieldsResponse.results || fieldsResponse);
      setCrmFields(fields);
      
      const pipelinesResponse = await bitrixService.getPipelines({ bot_id: botId, entity_type: 'DEAL' });
      const pipelinesList = Array.isArray(pipelinesResponse) ? pipelinesResponse : (pipelinesResponse.results || pipelinesResponse);
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
      const response = await bitrixService.getStages({ bot_id: botId, pipeline_id: pipelineId, entity_type: 'DEAL' });
      const stagesList = Array.isArray(response) ? response : (response.results || response);
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
    
    if (!functionName.trim()) {
      setError('Function name is required');
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      // Prepare properties data
      const validProperties = functionProperties.filter(prop => {
        const field_code = prop.field_code || prop.name || '';
        return field_code && field_code !== 'function' && field_code.trim() !== '';
      });

      const propertiesData = validProperties.map(prop => ({
        field_code: prop.field_code || prop.name,
        field_name: prop.field_name || prop.description || prop.name,
        description: prop.description || '',
      }));

      // Build result_format with stage and properties
      let resultFormat = '';
      if (selectedPhase) {
        resultFormat = `Stage: ${selectedPhase}`;
      }
      if (propertiesData.length > 0) {
        const propertiesJson = JSON.stringify(propertiesData);
        resultFormat = resultFormat 
          ? `${resultFormat}|Properties: ${propertiesJson}`
          : `Properties: ${propertiesJson}`;
      }

      if (editing && functionToEdit) {
        await functionsService.updateFunction(functionToEdit.id, {
          bot: botId,
          name: functionName.trim(),
          integration_type: 'BITRIX',
          is_active: true, // Always set to true
          trigger_instructions: functionInstruction.trim() || null,
          result_format: resultFormat || null,
        });
        
        await fetchFunctions();
        setShowCreateForm(false);
        setViewMode('create');
        setEditing(false);
        setFunctionToEdit(null);
        setViewingFunction(null);
        setSuccess('Function updated successfully!');
      } else {
        await functionsService.createFunction({
          bot: botId,
          name: functionName.trim(),
          integration_type: 'BITRIX',
          is_active: true, // Always set to true
          trigger_instructions: functionInstruction.trim() || null,
          result_format: resultFormat || null,
        });
        
        await fetchFunctions();
        setShowCreateForm(false);
        setViewMode('create');
        setViewingFunction(null);
        setSuccess('Function created successfully!');
      }
      
      setFunctionName('');
      setFunctionInstruction('');
      setFunctionProperties([]);
      setSelectedPhase('');
      setSelectedPipeline('');
      setStages([]);
    } catch (err: any) {
      setError(err?.message || 'Failed to save function');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFunction = () => {
    setShowCreateForm(true);
    setViewMode('create');
    setFunctionName('');
    setFunctionInstruction('');
    setFunctionProperties([]);
    setSelectedPhase('');
    setSelectedPipeline('');
    setStages([]);
    setEditing(false);
    setFunctionToEdit(null);
    setViewingFunction(null);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setViewMode('create');
    setFunctionName('');
    setFunctionInstruction('');
    setFunctionProperties([]);
    setSelectedPhase('');
    setSelectedPipeline('');
    setStages([]);
    setEditing(false);
    setFunctionToEdit(null);
    setViewingFunction(null);
  };

  const handleViewFunction = async (func: FunctionData) => {
    try {
      if (crmFields.length === 0 && !loadingCRMData) {
        await fetchCRMData();
      }
      
      const functionResponse = await functionsService.getFunctionById(func.id);
      
      setViewingFunction(func);
      setFunctionName(functionResponse.name || func.name);
      setFunctionInstruction(functionResponse.trigger_instructions || func.instruction || '');
      
      // Extract stage and properties from result_format if available
      let phase = '';
      let properties: FunctionProperty[] = [];
      
      if (functionResponse.result_format) {
        // Extract stage
        const stageMatch = functionResponse.result_format.match(/Stage:\s*([^|]+)/);
        if (stageMatch) {
          phase = stageMatch[1].trim();
        }
        
        // Extract properties
        const propertiesMatch = functionResponse.result_format.match(/Properties:\s*(.+)/);
        if (propertiesMatch) {
          try {
            const propertiesJson = propertiesMatch[1].trim();
            const parsedProperties = JSON.parse(propertiesJson);
            
            if (Array.isArray(parsedProperties)) {
              properties = parsedProperties.map((prop: any, index: number) => {
                const field_code = prop.field_code || '';
                const field_name = prop.field_name || '';
                
                // Try to find the field in CRM fields to get full details
                let fullField = null;
                if (crmFields.length > 0 && field_code) {
                  fullField = crmFields.find(f => f.field_code === field_code);
                }
                
                return {
                  id: `${Date.now()}-${index}`,
                  name: field_code || field_name,
                  field_code: field_code,
                  field_name: fullField?.field_name || field_name,
                  type: fullField?.field_type || 'string',
                  description: prop.description || '',
                  required: true,
                };
              });
            }
          } catch (err) {
            console.error('Failed to parse properties from result_format:', err);
          }
        }
      }
      
      setSelectedPhase(phase);
      setFunctionProperties(properties);
      
      // Initialize field search terms for loaded properties
      const initialSearchTerms: Record<string, string> = {};
      properties.forEach((prop: FunctionProperty) => {
        if (prop.field_name) {
          initialSearchTerms[prop.id] = prop.field_name;
        } else if (prop.field_code) {
          initialSearchTerms[prop.id] = prop.field_code;
        }
      });
      setFieldSearchTerms(initialSearchTerms);
      
      // Try to find the pipeline for this stage
      if (phase && pipelines.length > 0) {
        const findPipelineForStage = async () => {
          for (const pipeline of pipelines) {
            try {
              const res = await bitrixService.getStages({ 
                bot_id: botId ?? undefined, 
                pipeline_id: pipeline.pipeline_id ?? undefined,
                entity_type: 'DEAL'
              });
              const stagesArray = Array.isArray(res) ? res : (res.results || res);
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
      
      setViewMode('view');
      setShowCreateForm(true);
      setMenuOpen(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load function data');
    }
  };

  const handleDeleteFunction = (func: FunctionData) => {
    setFunctionToDelete(func);
  };

  const confirmDelete = async () => {
    if (!functionToDelete || !botId) return;
    
    try {
      await functionsService.deleteFunction(functionToDelete.id);
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
      
      const functionResponse = await functionsService.getFunctionById(func.id);
      
      setFunctionToEdit(func);
      setFunctionName(functionResponse.name || func.name);
      setFunctionInstruction(functionResponse.trigger_instructions || func.instruction || '');
      
      // Extract stage and properties from result_format if available
      let phase = '';
      let properties: FunctionProperty[] = [];
      
      if (functionResponse.result_format) {
        // Extract stage
        const stageMatch = functionResponse.result_format.match(/Stage:\s*([^|]+)/);
        if (stageMatch) {
          phase = stageMatch[1].trim();
        }
        
        // Extract properties
        const propertiesMatch = functionResponse.result_format.match(/Properties:\s*(.+)/);
        if (propertiesMatch) {
          try {
            const propertiesJson = propertiesMatch[1].trim();
            const parsedProperties = JSON.parse(propertiesJson);
            
            if (Array.isArray(parsedProperties)) {
              properties = parsedProperties.map((prop: any, index: number) => {
                const field_code = prop.field_code || '';
                const field_name = prop.field_name || '';
                
                // Try to find the field in CRM fields to get full details
                let fullField = null;
                if (crmFields.length > 0 && field_code) {
                  fullField = crmFields.find(f => f.field_code === field_code);
                }
                
                return {
                  id: `${Date.now()}-${index}`,
                  name: field_code || field_name,
                  field_code: field_code,
                  field_name: fullField?.field_name || field_name,
                  type: fullField?.field_type || 'string',
                  description: prop.description || '',
                  required: true,
                };
              });
            }
          } catch (err) {
            console.error('Failed to parse properties from result_format:', err);
          }
        }
      }
      
      setSelectedPhase(phase);
      setFunctionProperties(properties);
      
      // Initialize field search terms for loaded properties
      const initialSearchTerms: Record<string, string> = {};
      properties.forEach((prop: FunctionProperty) => {
        if (prop.field_name) {
          initialSearchTerms[prop.id] = prop.field_name;
        } else if (prop.field_code) {
          initialSearchTerms[prop.id] = prop.field_code;
        }
      });
      setFieldSearchTerms(initialSearchTerms);
      
      // Try to find the pipeline for this stage
      if (phase && pipelines.length > 0) {
        const findPipelineForStage = async () => {
          for (const pipeline of pipelines) {
            try {
              const res = await bitrixService.getStages({ 
                bot_id: botId ?? undefined, 
                pipeline_id: pipeline.pipeline_id ?? undefined,
                entity_type: 'DEAL'
              });
              const stagesArray = Array.isArray(res) ? res : (res.results || res);
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
      setViewMode('edit');
      setShowCreateForm(true);
      setMenuOpen(null);
      setViewingFunction(null);
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
                <div 
                  key={func.id} 
                  onClick={() => handleViewFunction(func)}
                  className="p-4 rounded-xl border border-border bg-card/50 relative cursor-pointer hover:bg-card/70 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-card-foreground">
                      {func.name}
                    </h3>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setMenuOpen(menuOpen === func.id ? null : func.id)}
                        className="p-1 rounded-lg text-muted-foreground hover:bg-secondary"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      
                      {menuOpen === func.id && (
                        <div className="absolute right-0 top-8 w-48 rounded-lg border border-border bg-card z-10 shadow-lg">
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
                  <p className="text-sm mb-3 text-muted-foreground">
                    {func.instruction ? func.instruction.substring(0, 100) + '...' : 'No description'}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {func.properties.length} properties • {func.phase || 'No phase'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showCreateForm && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-card-foreground">
                {viewMode === 'view' ? 'View Function' : editing ? 'Edit Function' : 'Create New Function'}
              </h2>
              <div className="flex items-center gap-2">
                {viewMode === 'view' && viewingFunction && (
                  <button
                    onClick={async () => {
                      await handleEditFunction(viewingFunction);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
                <button
                  onClick={handleCancelCreate}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-card-foreground">
                  Integration Type
                </label>
                <input
                  type="text"
                  value="Bitrix24"
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Only Bitrix24 integration is currently supported
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-card-foreground">
                  Function Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  placeholder="Name Function"
                  disabled={viewMode === 'view'}
                  className={`w-full px-4 py-3 rounded-xl border border-border ${
                    viewMode === 'view' 
                      ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                      : 'bg-background text-foreground'
                  }`}
                  required
                />
              </div>
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
                disabled={viewMode === 'view'}
                className={`w-full px-4 py-3 rounded-xl border border-border resize-y ${
                  viewMode === 'view' 
                    ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                    : 'bg-background text-foreground'
                }`}
              />
            </div>
          
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-card-foreground">
                  Function properties for crm fields:
                </label>
                {viewMode !== 'view' && (
                  <>
                    <button
                      onClick={addProperty}
                      className="p-2 rounded-lg bg-green-500/20 text-green-600 hover:bg-green-500/30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-blue-500/20 text-blue-600 hover:bg-blue-500/30">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            
              {functionProperties.map((property) => (
                <div key={property.id} className="p-4 rounded-xl border border-border bg-card/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-card-foreground">
                      {property.field_name || property.name || ''}
                    </h4>
                    {viewMode !== 'view' && (
                      <button
                        onClick={() => removeProperty(property.id)}
                        className="p-1 rounded-lg text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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
                            if (viewMode === 'view') return;
                            const searchValue = e.target.value;
                            setFieldSearchTerms(prev => ({ ...prev, [property.id]: searchValue }));
                            setShowFieldDropdowns(prev => ({ ...prev, [property.id]: true }));
                          }}
                          onFocus={() => {
                            if (viewMode === 'view') return;
                            if (property.field_name && !fieldSearchTerms[property.id]) {
                              setFieldSearchTerms(prev => ({ ...prev, [property.id]: property.field_name }));
                            }
                            setShowFieldDropdowns(prev => ({ ...prev, [property.id]: true }));
                          }}
                          onBlur={() => {
                            if (viewMode === 'view') return;
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
                          disabled={viewMode === 'view'}
                          className={`w-full px-3 py-2 rounded-lg border border-border ${
                            viewMode === 'view' 
                              ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                              : 'bg-background text-foreground'
                          }`}
                        />
                        
                        {showFieldDropdowns[property.id] && viewMode !== 'view' && (
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
                              return filtered.map((field, fieldIndex) => {
                                const entityTypeLabel = field.entity_type || 'DEAL';
                                const isSelected = property.field_code === field.field_code && property.field_code !== '';
                                // Use field_code + entity_type for unique key, fallback to index if field_code is missing
                                const uniqueKey = field.field_code 
                                  ? `${field.field_code}-${entityTypeLabel}` 
                                  : `field-${fieldIndex}-${entityTypeLabel}`;
                                
                                return (
                                  <div
                                    key={uniqueKey}
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
                        disabled={viewMode === 'view'}
                        className={`w-full px-3 py-2 rounded-lg border border-border resize-none ${
                          viewMode === 'view' 
                            ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                            : 'bg-background text-foreground'
                        }`}
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
                  disabled={viewMode === 'view'}
                  className={`w-full px-4 py-3 rounded-xl border border-border ${
                    viewMode === 'view' 
                      ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                      : 'bg-background text-foreground'
                  }`}
                >
                  <option value="">Select pipeline</option>
                  {pipelines.map((pipeline, index) => (
                    <option key={pipeline.pipeline_id || index} value={pipeline.pipeline_id}>
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
                  disabled={viewMode === 'view'}
                  className={`w-full px-4 py-3 rounded-xl border border-border ${
                    viewMode === 'view' 
                      ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                      : 'bg-background text-foreground'
                  }`}
                >
                  <option value="">Select stage</option>
                  {stages.map((stage, index) => (
                    <option key={stage.stage_code || stage.stage_id || index} value={stage.stage_code}>
                      {stage.stage_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {viewMode !== 'view' && (
              <div className="flex justify-end pt-6 gap-3">
                <button
                  onClick={handleCancelCreate}
                  className="px-6 py-3 rounded-xl font-medium border border-border hover:bg-secondary"
                >
                  Cancel
                </button>
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
            )}
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
