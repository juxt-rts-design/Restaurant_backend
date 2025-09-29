import React, { useState } from 'react';
import { X, Search, Calendar, User, CreditCard, DollarSign, FileText } from 'lucide-react';

interface InvoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: any) => void;
  onViewInvoice: (numeroFacture: string) => void;
  searchResults: any[];
  isLoading: boolean;
}

const InvoiceSearchModal: React.FC<InvoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  onViewInvoice,
  searchResults,
  isLoading
}) => {
  const [filters, setFilters] = useState({
    dateDebut: '',
    dateFin: '',
    nomClient: '',
    nomTable: '',
    montantMin: '',
    montantMax: '',
    methodePaiement: '',
    numeroFacture: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({
      dateDebut: '',
      dateFin: '',
      nomClient: '',
      nomTable: '',
      montantMin: '',
      montantMax: '',
      methodePaiement: '',
      numeroFacture: ''
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Recherche d'Archives - Factures
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Search Panel */}
            <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filtres de recherche</h3>
                
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Période
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={filters.dateDebut}
                      onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Date de début"
                    />
                    <input
                      type="date"
                      value={filters.dateFin}
                      onChange={(e) => handleInputChange('dateFin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Date de fin"
                    />
                  </div>
                </div>

                {/* Client Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nom du client
                  </label>
                  <input
                    type="text"
                    value={filters.nomClient}
                    onChange={(e) => handleInputChange('nomClient', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rechercher par nom..."
                  />
                </div>

                {/* Table */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Table
                  </label>
                  <input
                    type="text"
                    value={filters.nomTable}
                    onChange={(e) => handleInputChange('nomTable', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Table 1"
                  />
                </div>

                {/* Amount Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Montant (FCFA)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={filters.montantMin}
                      onChange={(e) => handleInputChange('montantMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Montant minimum"
                    />
                    <input
                      type="number"
                      value={filters.montantMax}
                      onChange={(e) => handleInputChange('montantMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Montant maximum"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-1" />
                    Méthode de paiement
                  </label>
                  <select
                    value={filters.methodePaiement}
                    onChange={(e) => handleInputChange('methodePaiement', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Toutes les méthodes</option>
                    <option value="A_LA_CAISSE">Payer à la caisse</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                  </select>
                </div>

                {/* Invoice Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Numéro de facture
                  </label>
                  <input
                    type="text"
                    value={filters.numeroFacture}
                    onChange={(e) => handleInputChange('numeroFacture', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: FACT-1234567890-49"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Search className="w-4 h-4" />
                    <span>{isLoading ? 'Recherche...' : 'Rechercher'}</span>
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Effacer
                  </button>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Résultats ({searchResults.length})
              </h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Recherche en cours...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune facture trouvée</p>
                  <p className="text-sm text-gray-500">Utilisez les filtres pour rechercher des factures</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((facture) => (
                    <div
                      key={facture.numero_facture}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onViewInvoice(facture.numero_facture)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-gray-900">
                              {facture.numero_facture}
                            </span>
                            <span className="text-sm text-gray-500">
                              #{facture.id_commande}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><strong>Client:</strong> {facture.nom_client}</p>
                              <p><strong>Table:</strong> {facture.nom_table}</p>
                            </div>
                            <div>
                              <p><strong>Date:</strong> {formatDate(facture.date_facture)}</p>
                              <p><strong>Paiement:</strong> {facture.methode_paiement || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {formatPrice(facture.montant_total)} FCFA
                          </div>
                          <div className="text-sm text-gray-500">
                            {facture.statut_paiement || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSearchModal;
