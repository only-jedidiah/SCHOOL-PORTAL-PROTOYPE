import React from 'react';
import { Modal } from '@/components/molecules/Modal/Modal';
import { Button } from '@/components/atoms/Button/Button';
import { Typography } from '@/components/atoms/Typography/Typography';
import { AlertTriangle, Trash2 } from 'lucide-react';

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemType: string;
  itemName: string;
  description?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  itemType,
  itemName,
  description,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={`Are you sure you want to permanently delete this ${itemType}?`}
      maxWidth="sm"
    >
      <div className="space-y-4 pt-2">
        <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-3 text-rose-900">
          <div className="p-2 bg-rose-100 rounded-xl text-rose-700 shrink-0 mt-0.5">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-1">
            <Typography variant="label" className="text-rose-900 font-bold">
              Warning: Irreversible Action
            </Typography>
            <p className="text-xs text-rose-700 leading-relaxed">
              You are about to delete <strong className="font-semibold text-rose-900">{itemName}</strong> ({itemType}).
              {description || ' This record will be removed from your dashboard and database.'}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            leftIcon={<Trash2 size={14} />}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
