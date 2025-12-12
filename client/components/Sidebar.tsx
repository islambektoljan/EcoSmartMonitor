import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Layers, Settings, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Smart Home', path: '/control', icon: Layers },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-slate-950 border-r border-slate-800 z-50">
      {/* Logo Area */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-gradient-to-tr from-eco-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-eco-500/20">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="block text-sm font-bold text-white leading-none">EcoSmart</span>
          <span className="block text-[10px] text-slate-400 leading-none mt-1">Home Monitor</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-eco-500/10 text-eco-400 font-semibold border border-eco-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User / Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
            SD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Student Demo</p>
            <p className="text-[10px] text-slate-500 truncate">Thesis MVP</p>
          </div>
          <button className="text-slate-500 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;