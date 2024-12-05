import React, { useState } from 'react';
import { SalesReport } from '../components/reports/SalesReport';
import { InventoryReport } from '../components/reports/InventoryReport';
import { Button } from '../components/ui/Button';
import { 
  LineChart, 
  BarChart, 
  FileSpreadsheet, 
  FileDown 
} from 'lucide-react';

type ReportType = 'sales' | 'inventory';

export default function Reports() {
  const [activeReport, setActiveReport] = useState<ReportType>('sales');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <div className="flex gap-2">
          <Button
            variant={activeReport === 'sales' ? 'default' : 'outline'}
            onClick={() => setActiveReport('sales')}
          >
            <LineChart className="h-4 w-4 mr-2" />
            Sales Report
          </Button>
          <Button
            variant={activeReport === 'inventory' ? 'default' : 'outline'}
            onClick={() => setActiveReport('inventory')}
          >
            <BarChart className="h-4 w-4 mr-2" />
            Inventory Report
          </Button>
        </div>
      </div>

      {activeReport === 'sales' ? <SalesReport /> : <InventoryReport />}
    </div>
  );
}