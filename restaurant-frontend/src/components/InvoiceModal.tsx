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

  console.log('🔍 InvoiceModal - Structure des données:', {
    numeroFacture: invoiceData.numeroFacture,
    restaurant: invoiceData.restaurant,
    produits: invoiceData.produits,
    totaux: invoiceData.totaux,
    paiement: invoiceData.paiement
  });

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-white overflow-auto"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'white',
        display: 'block'
      }}
    >
      {/* Header avec bouton fermer */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Facture {invoiceData.numeroFacture}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>

      {/* Contenu de la facture */}
      <div className="p-6 bg-white">
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
              <p><strong>Client:</strong> {invoiceData.nomClient}</p>
              <p><strong>Table:</strong> {invoiceData.nomTable}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations Commande</h3>
              <p><strong>Date commande:</strong> {formatDate(invoiceData.dateCommande)}</p>
              <p><strong>Code validation:</strong> {invoiceData.codeValidation}</p>
            </div>
          </div>

          {/* Products Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Détail des produits</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoiceData.produits.map((produit: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{produit.nom}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{produit.quantite}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatPrice(produit.prixUnitaire)} FCFA</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatPrice(produit.prixTotal)} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between py-2">
                  <span className="font-medium">Sous-total:</span>
                  <span>{formatPrice(invoiceData.totaux.sousTotal)} FCFA</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">TVA:</span>
                  <span>{formatPrice(invoiceData.totaux.tva)} FCFA</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-300 font-bold text-lg">
                  <span>Total TTC:</span>
                  <span>{formatPrice(invoiceData.totaux.totalTTC)} FCFA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className={`p-4 rounded-lg ${invoiceData.paiement.statut === 'EFFECTUÉ' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations de paiement</h3>
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
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
            <p>Merci pour votre visite !</p>
            <p>Facture générée le {formatDate(invoiceData.dateFacture)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;