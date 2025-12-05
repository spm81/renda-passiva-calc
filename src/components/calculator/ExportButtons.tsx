import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export function ExportButtons() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex gap-2 justify-center mb-4">
      <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Exportar PDF / Imprimir
      </Button>
    </div>
  );
}
