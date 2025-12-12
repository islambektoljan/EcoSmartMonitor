
import React, { useState } from 'react';
import { 
  Play, 
  Plus, 
  Trash2, 
  Moon, 
  Sun, 
  Clapperboard, 
  Shield, 
  Power, 
  Zap,
  Coffee,
  X,
  Edit,
  Camera,
  Check,
  Smartphone
} from 'lucide-react';
import { Scenario, ScenarioAction, Zone } from '../types';

interface ScenarioManagerProps {
  scenarios: Scenario[];
  zones: Zone[]; 
  onActivate: (id: string) => void;
  onCreate: (name: string, icon: string, actions: ScenarioAction[]) => void;
  onUpdate: (id: string, name: string, icon: string, actions: ScenarioAction[]) => void;
  onDelete: (id: string) => void;
}

const ICONS = ['Moon', 'Sun', 'Clapperboard', 'Shield', 'Power', 'Zap', 'Coffee'];

const ScenarioManager: React.FC<ScenarioManagerProps> = ({ 
  scenarios, 
  zones,
  onActivate, 
  onCreate, 
  onUpdate,
  onDelete 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Modal State
  const [formData, setFormData] = useState<{
    name: string;
    icon: string;
    selectedActions: Record<string, ScenarioAction>; 
  }>({
    name: '',
    icon: 'Zap',
    selectedActions: {}
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: '', icon: 'Zap', selectedActions: {} });
    setShowModal(true);
  };

  const handleOpenEdit = (scenario: Scenario) => {
    setEditingId(scenario.id);
    const actionMap: Record<string, ScenarioAction> = {};
    scenario.actions.forEach(a => {
      actionMap[a.deviceId] = a;
    });
    setFormData({
      name: scenario.name,
      icon: scenario.icon,
      selectedActions: actionMap
    });
    setShowModal(true);
  };

  const handleSnapshot = () => {
    const snapshot: Record<string, ScenarioAction> = {};
    zones.forEach(zone => {
      zone.lights.forEach(light => {
        snapshot[light.id] = {
          zoneId: zone.id,
          deviceId: light.id,
          deviceType: 'light',
          isOn: light.isOn,
          brightness: light.brightness
        };
      });
      zone.appliances.forEach(app => {
        snapshot[app.id] = {
          zoneId: zone.id,
          deviceId: app.id,
          deviceType: 'appliance',
          isOn: app.isOn
        };
      });
    });
    setFormData(prev => ({ ...prev, selectedActions: snapshot }));
  };

  const handleActionToggle = (zoneId: string, deviceId: string, deviceType: 'light' | 'appliance', defaultBrightness?: number) => {
    setFormData(prev => {
      const newActions = { ...prev.selectedActions };
      if (newActions[deviceId]) {
        delete newActions[deviceId];
      } else {
        newActions[deviceId] = {
          zoneId,
          deviceId,
          deviceType,
          isOn: false, 
          brightness: defaultBrightness || 100
        };
      }
      return { ...prev, selectedActions: newActions };
    });
  };

  const updateActionState = (deviceId: string, updates: Partial<ScenarioAction>) => {
    setFormData(prev => {
      if (!prev.selectedActions[deviceId]) return prev;
      return {
        ...prev,
        selectedActions: {
          ...prev.selectedActions,
          [deviceId]: { ...prev.selectedActions[deviceId], ...updates }
        }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const actionsList = Object.values(formData.selectedActions);

    if (editingId) {
      onUpdate(editingId, formData.name, formData.icon, actionsList);
    } else {
      onCreate(formData.name, formData.icon, actionsList);
    }
    setShowModal(false);
  };

  const getIcon = (iconName: string) => {
    const props = { className: "w-5 h-5" };
    switch (iconName) {
      case 'Moon': return <Moon {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'Clapperboard': return <Clapperboard {...props} />;
      case 'Shield': return <Shield {...props} />;
      case 'Power': return <Power {...props} />;
      case 'Coffee': return <Coffee {...props} />;
      default: return <Zap {...props} />;
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl backdrop-blur-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-indigo-400" />
            Scenario Manager
          </h2>
          <p className="text-slate-400 text-sm">Automate your home with one-tap presets</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Create Scenario
        </button>
      </div>

      {/* List - Responsive Grid Adjustment with content-start to prevent stretching */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-y-auto min-h-0 flex-1 content-start">
        {scenarios.map(scenario => (
          <div 
            key={scenario.id}
            className="group relative bg-slate-900/40 border border-slate-700 rounded-2xl p-5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-800 rounded-xl text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/20 transition-colors">
                  {getIcon(scenario.icon)}
                </div>
                
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleOpenEdit(scenario)}
                    className="p-2 text-slate-600 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(scenario.id)}
                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{scenario.name}</h3>
              <p className="text-xs text-slate-500 mb-6 line-clamp-2 min-h-[2.5em]">{scenario.description}</p>
            </div>

            <button 
              onClick={() => onActivate(scenario.id)}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-eco-600 text-slate-300 hover:text-white font-bold py-3 rounded-xl transition-all duration-300 group-hover:bg-eco-600 group-hover:text-white"
            >
              <Play className="w-4 h-4 fill-current" />
              Activate
            </button>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl relative overflow-hidden h-[85vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center shrink-0 bg-slate-900">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {editingId ? 'Edit Scenario' : 'Create New Scenario'}
                </h3>
                <p className="text-sm text-slate-400">Configure devices and states for this preset.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="scenario-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto bg-slate-950/30">
              
              {/* Configuration Section */}
              <div className="p-6 space-y-6 border-b border-slate-800">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Scenario Name</label>
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g., Reading Mode"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                                autoFocus
                            />
                        </div>
                        <div className="flex items-end">
                            <button 
                            type="button" 
                            onClick={handleSnapshot}
                            className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-2.5 rounded-lg transition-colors border border-indigo-500/20 whitespace-nowrap h-[38px]"
                            >
                            <Camera className="w-3.5 h-3.5" />
                            Capture Current State
                            </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Icon</label>
                        <div className="flex gap-2">
                          {ICONS.map(icon => (
                            <button
                              key={icon}
                              type="button"
                              onClick={() => setFormData({...formData, icon})}
                              className={`p-2 rounded-lg border shrink-0 transition-all ${
                                formData.icon === icon 
                                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                              }`}
                            >
                              {getIcon(icon)}
                            </button>
                          ))}
                        </div>
                    </div>
                  </div>
              </div>

              {/* Device Selector List */}
              <div className="p-6 pt-0 space-y-6">
                <h4 className="text-xs font-bold uppercase text-slate-500 sticky top-0 bg-slate-950/95 py-3 backdrop-blur-sm z-10 border-b border-slate-800/50">
                   Select Devices to Automate
                </h4>
                
                {zones.map(zone => (
                  <div key={zone.id} className="space-y-1">
                    <div className="flex items-center gap-2 mb-2 px-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.accentColor }}></span>
                      <h4 className="text-sm font-bold text-slate-300">{zone.name}</h4>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                      {/* Lights */}
                      {zone.lights.map(light => {
                        const isSelected = !!formData.selectedActions[light.id];
                        const action = formData.selectedActions[light.id];
                        
                        return (
                          <div key={light.id} className={`flex items-center justify-between p-3 transition-colors hover:bg-slate-800/30 ${isSelected ? 'bg-indigo-900/5' : ''}`}>
                            <div 
                              className="flex items-center gap-3 cursor-pointer select-none flex-1"
                              onClick={() => handleActionToggle(zone.id, light.id, 'light', light.brightness)}
                            >
                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600 bg-slate-900'}`}>
                                 {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                              </div>
                              <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>{light.name}</span>
                            </div>

                            {isSelected && action && (
                              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
                                {light.isDimmable && (
                                  <div className="flex items-center gap-2 bg-slate-950 rounded-lg px-2 py-1 border border-slate-800">
                                    <Sun className="w-3 h-3 text-slate-500" />
                                    <input 
                                      type="range" 
                                      min="0" max="100" 
                                      value={action.brightness || 0}
                                      onChange={(e) => updateActionState(light.id, { brightness: parseInt(e.target.value) })}
                                      className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                  </div>
                                )}
                                <button 
                                  type="button"
                                  onClick={() => updateActionState(light.id, { isOn: !action.isOn })}
                                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border min-w-[3rem] transition-colors ${
                                    action.isOn 
                                      ? 'bg-eco-500/10 border-eco-500/50 text-eco-400 hover:bg-eco-500/20' 
                                      : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'
                                  }`}
                                >
                                  {action.isOn ? 'ON' : 'OFF'}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Appliances */}
                      {zone.appliances.map(app => {
                        const isSelected = !!formData.selectedActions[app.id];
                        const action = formData.selectedActions[app.id];

                        return (
                           <div key={app.id} className={`flex items-center justify-between p-3 transition-colors hover:bg-slate-800/30 ${isSelected ? 'bg-indigo-900/5' : ''}`}>
                              <div 
                                className="flex items-center gap-3 cursor-pointer select-none flex-1"
                                onClick={() => handleActionToggle(zone.id, app.id, 'appliance')}
                              >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600 bg-slate-900'}`}>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>{app.name}</span>
                              </div>

                              {isSelected && action && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                                  <button 
                                    type="button"
                                    onClick={() => updateActionState(app.id, { isOn: !action.isOn })}
                                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border min-w-[3rem] transition-colors ${
                                      action.isOn 
                                        ? 'bg-eco-500/10 border-eco-500/50 text-eco-400 hover:bg-eco-500/20' 
                                        : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'
                                    }`}
                                  >
                                    {action.isOn ? 'ON' : 'OFF'}
                                  </button>
                                </div>
                              )}
                           </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </form>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-900 shrink-0">
              <button 
                type="submit"
                form="scenario-form"
                disabled={!formData.name.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-500/20 text-sm"
              >
                {editingId ? 'Update Scenario' : 'Save Scenario'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioManager;
