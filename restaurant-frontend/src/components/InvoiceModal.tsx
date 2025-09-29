import React from 'react';
import { X, Printer, Download } from 'lucide-react';

interface InvoiceData {
  numeroFacture: string;
  dateFacture: string;
  commande: {
    id: number;
    date: string;
    statut: string;
  };
  client: {
    nom: string;
    table: string;
  };
  produits: Array<{
    nom: string;
    quantite: number;
    prixUnitaire: number;
    prixTotal: number;
  }>;
  totaux: {
    sousTotal: number;
    tva: number;
    totalTTC: number;
  };
  paiement: {
    methode: string;
    statut: string;
    codeValidation: string | null;
    datePaiement: string | null;
  };
  restaurant: {
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
  };
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData | null;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, invoiceData }) => {
  if (!isOpen || !invoiceData) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Facture ${invoiceData.numeroFacture}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .invoice-header { text-align: center; margin-bottom: 30px; }
                .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .invoice-section { margin-bottom: 20px; }
                .invoice-section h3 { border-bottom: 2px solid #333; padding-bottom: 5px; }
                .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .products-table th, .products-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .products-table th { background-color: #f2f2f2; }
                .totals { text-align: right; margin-top: 20px; }
                .total-line { display: flex; justify-content: space-between; margin: 5px 0; }
                .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
                .payment-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Facture {invoiceData.numeroFacture}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Imprimer la facture"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div id="invoice-content" className="space-y-6">
              {/* Restaurant Header */}
              <div className="text-center border-b border-gray-200 pb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {invoiceData.restaurant.nom}
                </h1>
                <p className="text-gray-600">{invoiceData.restaurant.adresse}</p>
                <p className="text-gray-600">
                  Tél: {invoiceData.restaurant.telephone} | Email: {invoiceData.restaurant.email}
                </p>
              </div>

              {/* Invoice Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations Facture</h3>
                  <p><strong>Numéro:</strong> {invoiceData.numeroFacture}</p>
                  <p><strong>Date:</strong> {formatDate(invoiceData.dateFacture)}</p>
                  <p><strong>Commande:</strong> #{invoiceData.commande.id}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Client</h3>
                  <p><strong>Nom:</strong> {invoiceData.client.nom}</p>
                  <p><strong>Table:</strong> {invoiceData.client.table}</p>
                </div>
              </div>

              {/* Products Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Détail des produits</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Produit</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Quantité</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Prix unitaire</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.produits.map((produit, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-4 py-2">{produit.nom}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{produit.quantite}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {formatPrice(produit.prixUnitaire)} FCFA
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {formatPrice(produit.prixTotal)} FCFA
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-80">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{formatPrice(invoiceData.totaux.sousTotal)} FCFA</span>
                    </div>
                    {invoiceData.totaux.tva > 0 && (
                      <div className="flex justify-between">
                        <span>TVA:</span>
                        <span>{formatPrice(invoiceData.totaux.tva)} FCFA</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                      <span>Total TTC:</span>
                      <span>{formatPrice(invoiceData.totaux.totalTTC)} FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className={`p-4 rounded-lg ${invoiceData.paiement.methode === 'NON_PAYÉ' ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations de paiement</h3>
                {invoiceData.paiement.methode === 'NON_PAYÉ' ? (
                  <div className="text-center py-4">
                    <div className="text-yellow-600 font-semibold text-lg mb-2">⚠️ Commande non payée</div>
                    <p className="text-gray-600">Cette facture a été générée avant le paiement de la commande.</p>
                    <p className="text-gray-600">Le paiement devra être effectué avant la finalisation.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><strong>Méthode:</strong> {invoiceData.paiement.methode}</p>
                      <p><strong>Statut:</strong> {invoiceData.paiement.statut}</p>
                    </div>
                    <div>
                      <p><strong>Code validation:</strong> {invoiceData.paiement.codeValidation || 'N/A'}</p>
                      <p><strong>Date paiement:</strong> {invoiceData.paiement.datePaiement ? formatDate(invoiceData.paiement.datePaiement) : 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
                <p>Merci pour votre visite !</p>
                <p>Facture générée le {formatDate(invoiceData.dateFacture)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
