import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  Users, Briefcase, Building2, Heart, Star, Zap, Target, 
  Shield, Globe, TrendingUp, Award, Crown, Rocket, Coffee,
  Headphones, Code, PenTool, Camera, Music, Gamepad2, 
  Plane, Car, Bike, Ship, Palmtree, Mountain, Sun, Moon
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Available icons for groups
export const groupIcons = [
  { name: 'users', icon: Users },
  { name: 'briefcase', icon: Briefcase },
  { name: 'building', icon: Building2 },
  { name: 'heart', icon: Heart },
  { name: 'star', icon: Star },
  { name: 'zap', icon: Zap },
  { name: 'target', icon: Target },
  { name: 'shield', icon: Shield },
  { name: 'globe', icon: Globe },
  { name: 'trending', icon: TrendingUp },
  { name: 'award', icon: Award },
  { name: 'crown', icon: Crown },
  { name: 'rocket', icon: Rocket },
  { name: 'coffee', icon: Coffee },
  { name: 'headphones', icon: Headphones },
  { name: 'code', icon: Code },
  { name: 'pen', icon: PenTool },
  { name: 'camera', icon: Camera },
  { name: 'music', icon: Music },
  { name: 'gamepad', icon: Gamepad2 },
  { name: 'plane', icon: Plane },
  { name: 'car', icon: Car },
  { name: 'bike', icon: Bike },
  { name: 'ship', icon: Ship },
  { name: 'palmtree', icon: Palmtree },
  { name: 'mountain', icon: Mountain },
  { name: 'sun', icon: Sun },
  { name: 'moon', icon: Moon },
];

// Available colors for groups
export const groupColorPresets = [
  { name: 'Bleu', value: 'blue', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500' },
  { name: 'Violet', value: 'violet', gradient: 'from-violet-500 to-purple-500', bg: 'bg-violet-500' },
  { name: 'Emeraude', value: 'emerald', gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500' },
  { name: 'Ambre', value: 'amber', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500' },
  { name: 'Rose', value: 'rose', gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-500' },
  { name: 'Indigo', value: 'indigo', gradient: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-500' },
  { name: 'Cyan', value: 'cyan', gradient: 'from-cyan-500 to-sky-500', bg: 'bg-cyan-500' },
  { name: 'Fuchsia', value: 'fuchsia', gradient: 'from-fuchsia-500 to-pink-500', bg: 'bg-fuchsia-500' },
  { name: 'Lime', value: 'lime', gradient: 'from-lime-500 to-green-500', bg: 'bg-lime-500' },
  { name: 'Rouge', value: 'red', gradient: 'from-red-500 to-orange-500', bg: 'bg-red-500' },
  { name: 'Slate', value: 'slate', gradient: 'from-slate-500 to-gray-600', bg: 'bg-slate-500' },
  { name: 'Teal', value: 'teal', gradient: 'from-teal-500 to-cyan-500', bg: 'bg-teal-500' },
];

export function getGroupColor(colorValue?: string) {
  return groupColorPresets.find(c => c.value === colorValue) || groupColorPresets[0];
}

export function getGroupIcon(iconName?: string) {
  const found = groupIcons.find(i => i.name === iconName);
  return found?.icon || Users;
}

interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
  color?: string;
}

export function IconPicker({ value, onChange, color = 'blue' }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = getGroupIcon(value);
  const colorPreset = getGroupColor(color);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "w-16 h-16 rounded-2xl p-0 border-2 transition-all hover:scale-105",
            `bg-gradient-to-br ${colorPreset.gradient}`
          )}
        >
          <SelectedIcon className="h-7 w-7 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <Label className="text-sm font-medium mb-3 block">Choisir une icône</Label>
        <div className="grid grid-cols-7 gap-2">
          {groupIcons.map((item) => {
            const Icon = item.icon;
            const isSelected = value === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  onChange(item.name);
                  setOpen(false);
                }}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110",
                  isSelected 
                    ? `bg-gradient-to-br ${colorPreset.gradient} text-white shadow-lg` 
                    : "bg-muted hover:bg-muted/80 text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-3 h-11 px-4 justify-start">
          <div className={cn(
            "w-6 h-6 rounded-lg",
            `bg-gradient-to-br ${getGroupColor(value).gradient}`
          )} />
          <span className="text-sm">{getGroupColor(value).name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="start">
        <Label className="text-sm font-medium mb-3 block">Choisir une couleur</Label>
        <div className="grid grid-cols-4 gap-3">
          {groupColorPresets.map((color) => {
            const isSelected = value === color.value;
            return (
              <button
                key={color.value}
                onClick={() => {
                  onChange(color.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all hover:scale-105",
                  isSelected ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-muted"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl shadow-lg",
                  `bg-gradient-to-br ${color.gradient}`
                )} />
                <span className="text-xs font-medium">{color.name}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface GroupCustomizationProps {
  icon?: string;
  color?: string;
  onIconChange: (icon: string) => void;
  onColorChange: (color: string) => void;
}

export function GroupCustomization({ icon, color, onIconChange, onColorChange }: GroupCustomizationProps) {
  return (
    <div className="flex items-start gap-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Icône</Label>
        <IconPicker value={icon} onChange={onIconChange} color={color} />
      </div>
      <div className="space-y-2 flex-1">
        <Label className="text-sm font-medium">Couleur</Label>
        <ColorPicker value={color} onChange={onColorChange} />
      </div>
    </div>
  );
}
