import React from 'react';
import { Plus } from 'lucide-react';
import { useSchoolPortal } from '@/context/SchoolPortalContext';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { Badge } from '@/components/atoms/Badge/Badge';

export interface InventoryTrackerTableProps {
  onAddItem: () => void;
}

export const InventoryTrackerTable: React.FC<InventoryTrackerTableProps> = ({
  onAddItem,
}) => {
  const { inventory } = useSchoolPortal();

  return (
    <div className="bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border-subtle pb-4">
        <div>
          <Typography variant="h3">Inventory & Resource Tracker</Typography>
          <Typography variant="body-sm" className="mt-0.5">
            Monitor stock levels for stationery, uniforms, cardigans, and textbooks.
          </Typography>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onAddItem}
          leftIcon={<Plus size={16} />}
        >
          Add Item
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th className="py-3 px-2">
                <Typography variant="label">Item Description</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Category</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Unit Price</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Stock Quantity</Typography>
              </th>
              <th className="py-3 px-2">
                <Typography variant="label">Total Value</Typography>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {inventory.map(item => (
              <tr key={item.id} className="hover:bg-surface-subtle/50 transition-colors">
                <td className="py-3.5 px-2 font-semibold text-text-primary">
                  {item.description}
                  <span className="block text-[11px] font-mono text-text-muted font-normal">
                    {item.id}
                  </span>
                </td>
                <td className="py-3.5 px-2">
                  <Badge variant="purple" size="sm">
                    {item.category}
                  </Badge>
                </td>
                <td className="py-3.5 px-2">
                  <Typography variant="mono">₦{item.price.toLocaleString()}</Typography>
                </td>
                <td className="py-3.5 px-2">
                  <Typography variant="mono" className="font-semibold">
                    {item.qty} Units
                  </Typography>
                </td>
                <td className="py-3.5 px-2">
                  <Typography variant="mono" className="font-bold text-accent-emerald">
                    ₦{(item.price * item.qty).toLocaleString()}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
