import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  filters?: React.ReactNode;
  children: React.ReactNode; // visualização do relatório
  onExport?: () => void;
  exportLabel?: string;
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  filters,
  children,
  onExport,
  exportLabel = 'Exportar',
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {filters && <div className="mb-4">{filters}</div>}
        <div className="mb-4">{children}</div>
        {onExport && (
          <Button variant="outline" onClick={onExport} className="mt-2">
            <Download className="w-4 h-4 mr-2" />
            {exportLabel}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog; 