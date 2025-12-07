import { Button } from '@/components/ui/button';
import { FileText, Image } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useState } from 'react';

interface ExportButtonsProps {
  reportRef?: React.RefObject<HTMLDivElement>;
}

export function ExportButtons({ reportRef }: ExportButtonsProps) {
  const [exporting, setExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPng = async () => {
    if (!reportRef?.current) return;
    
    setExporting(true);
    
    try {
      // Temporarily show the report for capture
      const report = reportRef.current;
      const originalDisplay = report.style.display;
      report.style.display = 'block';
      report.style.position = 'absolute';
      report.style.left = '-9999px';
      report.style.top = '0';
      report.style.width = '800px';
      report.style.background = 'white';
      
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(report, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 800,
        windowWidth: 800,
      });
      
      // Restore original display
      report.style.display = originalDisplay;
      report.style.position = '';
      report.style.left = '';
      report.style.top = '';
      report.style.width = '';
      report.style.background = '';
      
      // Download the image
      const link = document.createElement('a');
      link.download = `relatorio-renda-passiva-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex gap-2 justify-center mb-4">
      <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Exportar PDF / Imprimir
      </Button>
      <Button 
        variant="outline" 
        onClick={handleExportPng} 
        disabled={!reportRef || exporting}
        className="flex items-center gap-2"
      >
        <Image className="w-4 h-4" />
        {exporting ? 'A exportar...' : 'Exportar PNG'}
      </Button>
    </div>
  );
}
