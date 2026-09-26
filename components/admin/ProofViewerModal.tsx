'use client';

import React, { useState } from 'react';
import { Order } from '@/types';
import { X, CheckCircle2, XCircle, ZoomIn, ZoomOut, Download, ExternalLink, ShieldCheck } from 'lucide-react';

interface ProofViewerModalProps {
  order: Order;
  onClose: () => void;
  onValidate: (orderId: string) => void;
  onReject: (orderId: string) => void;
}

export function ProofViewerModal({ order, onClose, onValidate, onReject }: ProofViewerModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const proofUrl =
    order.payment_proof_url ||
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80';

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.7));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Reçu BaridiMob / CCP
              </span>
              <h3 className="text-sm font-bold text-white">
                Preuve de Virement • Commande <span className="font-mono text-cyan-300">{order.orderNumber}</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Client : <strong>{order.customer.firstName} {order.customer.lastName}</strong> • Tél : {order.customer.phone} • Montant :{' '}
              <span className="font-mono font-bold text-emerald-400">
                {(order.total_amount || order.total).toLocaleString('fr-FR')} {order.currency || 'DZD'}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-2 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white flex items-center gap-1"
              title="Zoom avant"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Zoom +</span>
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white flex items-center gap-1"
              title="Zoom arrière"
            >
              <ZoomOut className="w-3.5 h-3.5" />
              <span>Zoom -</span>
            </button>
            <span className="text-[11px] font-mono text-slate-500">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>

          <a
            href={proofUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ouvrir en plein écran</span>
          </a>
        </div>

        {/* Image Preview Area */}
        <div className="flex-1 overflow-auto p-6 bg-slate-950 flex items-center justify-center min-h-[350px]">
          <div
            style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
            className="max-w-full flex items-center justify-center origin-center"
          >
            <img
              src={proofUrl}
              alt={`Reçu BaridiMob de la commande ${order.orderNumber}`}
              className="max-h-[480px] w-auto rounded-xl shadow-2xl border border-slate-700/60 object-contain"
            />
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/90">
          <div className="text-xs text-slate-400">
            {order.status === 'completed' ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Commande déjà validée et livrée.
              </span>
            ) : (
              <span>Vérifiez la date, l&apos;heure et le numéro de transaction RIP avant validation.</span>
            )}
          </div>

          {order.status !== 'completed' && order.status !== 'refunded' && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onReject(order.id);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Rejeter le reçu</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onValidate(order.id);
                  onClose();
                }}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>[Valider et Livrer la clé]</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
