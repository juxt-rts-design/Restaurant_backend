import React from 'react';
import { X, Printer } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: any;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, invoiceData }) => {
  if (!isOpen || !invoiceData) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
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
                .header { text-align: center; margin-bottom: 30px; }
                .info { display: flex; justify-content: space-between; margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total { text-align: right; font-weight: bold; }
                .footer { text-align: center; margin-top: 30px; }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header avec boutons */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Facture {invoiceData.numeroFacture}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div id="invoice-content" className="space-y-4">
            {/* Restaurant Header */}
            <div className="text-center border-b border-gray-200 pb-4">
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {invoiceData.restaurant?.nom || 'Restaurant'}
              </h1>
              <p className="text-sm text-gray-600">{invoiceData.restaurant?.adresse || ''}</p>
              <p className="text-sm text-gray-600">
                Tél: {invoiceData.restaurant?.tel || ''}
              </p>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-medium text-gray-900 mb-2 text-sm">Informations Facture</h3>
                <div className="space-y-1 text-xs">
                  <p><span className="font-medium">Numéro:</span> {invoiceData.numeroFacture}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(invoiceData.dateFacture)}</p>
                  <p><span className="font-medium">Client:</span> {invoiceData.nomClient}</p>
                  <p><span className="font-medium">Table:</span> {invoiceData.nomTable}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-medium text-gray-900 mb-2 text-sm">Informations Commande</h3>
                <div className="space-y-1 text-xs">
                  <p><span className="font-medium">Date commande:</span> {formatDate(invoiceData.dateCommande)}</p>
                  <p><span className="font-medium">Code validation:</span> {invoiceData.codeValidation}</p>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 text-sm">Détail des produits</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoiceData.produits?.map((produit: any, index: number) => (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{produit.nom}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{produit.quantite}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{formatPrice(produit.prixUnitaire)} FCFA</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{formatPrice(produit.prixTotal || produit.quantite * produit.prixUnitaire)} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64">
                <div className="bg-gray-50 p-3 rounded">

                  <div className="flex justify-between py-1 border-t border-gray-300 font-bold text-sm">
                    <span>Total :</span>
                    <span>{formatPrice(invoiceData.totaux?.totalTTC || 0)} FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {invoiceData.paiement && (
              <div className={`p-3 rounded ${invoiceData.paiement.statut === 'EFFECTUÉ' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <h3 className="font-medium text-gray-900 mb-2 text-sm">Informations de paiement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p><span className="font-medium">Méthode:</span> {invoiceData.paiement.methode}</p>
                    <p><span className="font-medium">Statut:</span> {invoiceData.paiement.statut}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Code validation:</span> {invoiceData.paiement.codeValidation || 'N/A'}</p>
                    <p><span className="font-medium">Date paiement:</span> {invoiceData.paiement.datePaiement ? formatDate(invoiceData.paiement.datePaiement) : 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 border-t border-gray-200 pt-3">
              <p>Merci pour votre visite !</p>
              <p>Facture générée le {formatDate(invoiceData.dateFacture)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;