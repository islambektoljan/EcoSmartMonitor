
import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Lightbulb, 
  Tv, 
  Fan, 
  Thermometer, 
  Refrigerator, 
  Coffee, 
  Droplets, 
  Lock, 
  Video, 
  Bot,
  ToggleLeft,
  ToggleRight,
  Power,
  ShieldAlert,
  Blinds
} from 'lucide-react';
import { Device, Room } from '../types';

const INITIAL_DEVICES: Device[] = [
  // Living Room
  { id: 'lr-light', name: 'Main Chandelier', type: 'light', room: 'Living Room', isOn: true, powerDraw: 60, settings: { brightness: 80 } },
  { id: 'lr-tv', name: 'Samsung Smart TV', type: 'appliance', room: 'Living Room', isOn: false, powerDraw: 120 },
  { id: 'lr-ac', name: 'Air Conditioner', type: 'climate', room: 'Living Room', isOn: true, powerDraw: 1200, settings: { temperature: 24, targetTemp: 22, mode: 'Cool' } },
  { id: 'lr-vac', name: 'Robot Vacuum', type: 'appliance', room: 'Living Room', isOn: false, powerDraw: 30, settings: { status: 'Docked' } },
  
  // Kitchen
  { id: 'kt-fridge', name: 'Smart Fridge', type: 'appliance', room: 'Kitchen', isOn: true, powerDraw: 150, settings: { temperature: 3 } },
  { id: 'kt-kettle', name: 'Smart Kettle', type: 'appliance', room: 'Kitchen', isOn: false, powerDraw: 2000 },
  { id: 'kt-dw', name: 'Dishwasher', type: 'appliance', room: 'Kitchen', isOn: false, powerDraw: 1800 },
  { id: 'kt-leak', name: 'Water Valve', type: 'security', room: 'Kitchen', isOn: true, powerDraw: 5, settings: { status: 'Monitoring' } },

  // Bedroom
  { id: 'bd-lamp-l', name: 'Bedside Lamp L', type: 'light', room: 'Bedroom', isOn: false, powerDraw: 9, settings: { brightness: 50, color: '#f5d0fe' } },
  { id: 'bd-humid', name: 'Humidifier', type: 'climate', room: 'Bedroom', isOn: true, powerDraw: 45, settings: { mode: 'Auto' } },
  { id: 'bd-curtain', name: 'Smart Curtains', type: 'appliance', room: 'Bedroom', isOn: true, powerDraw: 0, settings: { status: 'Open' } },

  // Entrance
  { id: 'ent-lock', name: 'Door Lock', type: 'security', room: 'Entrance', isOn: true, powerDraw: 2, settings: { status: 'Locked' } },
  { id: 'ent-cam', name: 'Video Doorbell', type: 'security', room: 'Entrance', isOn: true, powerDraw: 5, settings: { status: 'Idle' } },
];

const ROOMS: (Room | 'All')[] = ['All', 'Living Room', 'Kitchen', 'Bedroom', 'Entrance'];

const DeviceManager: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [activeFilter, setActiveFilter] = useState<Room | 'All'>('All');

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        // Special logic for locks (Toggle Lock/Unlock)
        if (d.type === 'security' && d.settings?.status) {
           const newStatus = d.settings.status === 'Locked' ? 'Unlocked' : 'Locked';
           return { ...d, isOn: !d.isOn, settings: { ...d.settings, status: newStatus }};
        }
        return { ...d, isOn: !d.isOn };
      }
      return d;
    }));
  };

  const updateBrightness = (id: string, val: number) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, settings: { ...d.settings, brightness: val } } : d));
  };

  const totalPowerWatts = useMemo(() => {
    return devices.reduce((sum, d) => d.isOn ? sum + d.powerDraw : sum, 0);
  }, [devices]);

  const filteredDevices = activeFilter === 'All' 
    ? devices 
    : devices.filter(d => d.room === activeFilter);

  const getIcon = (d: Device) => {
    const props = { className: `w-6 h-6 ${d.isOn ? 'text-white' : 'text-slate-400'}` };
    if (d.name.includes('TV')) return <Tv {...props} />;
    if (d.name.includes('Vacuum')) return <Bot {...props} />;
    if (d.name.includes('Fridge')) return <Refrigerator {...props} />;
    if (d.name.includes('Kettle')) return <Coffee {...props} />;
    if (d.name.includes('Dishwasher')) return <Droplets {...props} />;
    if (d.name.includes('Valve')) return <ShieldAlert {...props} />;
    if (d.name.includes('Lock')) return <Lock {...props} />;
    if (d.name.includes('Doorbell')) return <Video {...props} />;
    if (d.name.includes('Curtain')) return <Blinds {...props} />;
    
    switch (d.type) {
      case 'light': return <Lightbulb {...props} />;
      case 'climate': return <Fan {...props} />; // Fallback for humidifier/AC
      default: return <Zap {...props} />;
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl backdrop-blur-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Power className="w-5 h-5 text-indigo-400" />
            Device Control Hub
          </h2>
          <p className="text-slate-400 text-sm">Manage connected smart home devices</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-700">
           <div className="p-1.5 bg-yellow-500/10 rounded-lg">
             <Zap className="w-4 h-4 text-yellow-400" />
           </div>
           <div>
             <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Current Load</span>
             <span className="block text-lg font-bold text-white leading-none">
               {totalPowerWatts} <span className="text-xs text-slate-400 font-medium">W</span>
             </span>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto px-6 py-4 gap-2 scrollbar-thin border-b border-slate-700/50">
        {ROOMS.map(room => (
          <button
            key={room}
            onClick={() => setActiveFilter(room)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all ${
              activeFilter === room 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'bg-slate-900/40 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {room}
          </button>
        ))}
      </div>

      {/* Device Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-slate-900/20 flex-1 overflow-y-auto max-h-[600px] scrollbar-thin">
        {filteredDevices.map(device => (
          <div 
            key={device.id}
            className={`relative p-4 rounded-xl border transition-all duration-300 group ${
              device.isOn 
                ? 'bg-eco-500/10 border-eco-500/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]' 
                : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-lg transition-colors ${device.isOn ? 'bg-eco-500/20' : 'bg-slate-900'}`}>
                {getIcon(device)}
              </div>
              
              <button 
                onClick={() => toggleDevice(device.id)}
                className="focus:outline-none transition-transform active:scale-95"
              >
                {device.isOn 
                  ? <ToggleRight className="w-8 h-8 text-eco-400" /> 
                  : <ToggleLeft className="w-8 h-8 text-slate-500" />
                }
              </button>
            </div>

            <div>
               <div className="flex justify-between items-center mb-1">
                 <h3 className={`font-semibold ${device.isOn ? 'text-white' : 'text-slate-300'}`}>{device.name}</h3>
                 {device.isOn && <span className="text-[10px] font-mono text-slate-500">{device.powerDraw}W</span>}
               </div>
               <p className="text-xs text-slate-500 mb-3">{device.room}</p>
               
               {/* Controls / Status */}
               <div className="h-8 flex items-center">
                 {device.settings?.status && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                      device.isOn ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-slate-900/30 border-slate-800 text-slate-500'
                    }`}>
                      {device.settings.status}
                    </span>
                 )}

                 {device.type === 'light' && device.settings?.brightness !== undefined && device.isOn && (
                   <div className="w-full flex items-center gap-2">
                      <Lightbulb className="w-3 h-3 text-yellow-400" />
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={device.settings.brightness}
                        onChange={(e) => updateBrightness(device.id, parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                      />
                   </div>
                 )}

                 {device.type === 'climate' && device.isOn && device.settings?.targetTemp && (
                   <div className="flex items-center gap-2 text-xs font-bold text-white bg-slate-900/50 px-2 py-1 rounded-lg border border-slate-700">
                      <Thermometer className="w-3 h-3 text-red-400" />
                      <span>{device.settings.targetTemp}°C</span>
                      <span className="text-[10px] text-slate-500 uppercase ml-1">{device.settings.mode}</span>
                   </div>
                 )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceManager;
