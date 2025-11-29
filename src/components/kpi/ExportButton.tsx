import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileDown, FileSpreadsheet, FileJson } from 'lucide-react';

interface ExportButtonProps {
  onExportCSV: () => void;
  onExportJSON?: () => void;
  disabled?: boolean;
  label?: string;
}

export function ExportButton({ 
  onExportCSV, 
  onExportJSON, 
  disabled = false,
  label = 'Exporter'
}: ExportButtonProps) {
  // Si pas de JSON export, bouton simple
  if (!onExportJSON) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onExportCSV}
        disabled={disabled}
      >
        <FileDown className="h-4 w-4 mr-2" />
        {label}
      </Button>
    );
  }

  // Sinon, menu déroulant avec options
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <FileDown className="h-4 w-4 mr-2" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exporter en CSV
        </DropdownMenuItem>
        {onExportJSON && (
          <DropdownMenuItem onClick={onExportJSON}>
            <FileJson className="h-4 w-4 mr-2" />
            Exporter en JSON
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
