import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Database, 
  Key, 
  User,
  Globe,
  CreditCard,
  Server,
  Save,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Info,
  RefreshCw,
  Plus
} from 'lucide-react';
import adminApiService from '../services/adminApi';

interface SystemSettings {
  platformName: string;
  platformUrl: string;
  supportEmail: string;
  maintenanceMode: boolean;
  maxRestaurants: number;
  sessionTimeout: number;
}

interface SecuritySettings {
  passwordMinLength: number;
  requireSpecialChars: boolean;
  twoFactorEnabled: boolean;
  sessionExpiry: number;
  ipWhitelist: string[];
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  newRestaurantAlert: boolean;
  paymentAlert: boolean;
  systemAlert: boolean;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  
  // États pour les paramètres
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    platformName: 'Restaurant SaaS Platform',
    platformUrl: 'https://restaurant-saas.com',
    supportEmail: 'support@restaurant-saas.com',
    maintenanceMode: false,
    maxRestaurants: 1000,
    sessionTimeout: 30
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    passwordMinLength: 8,
    requireSpecialChars: true,
    twoFactorEnabled: false,
    sessionExpiry: 24,
    ipWhitelist: []
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newRestaurantAlert: true,
    paymentAlert: true,
    systemAlert: true
  });

  // Charger les données au montage du composant
  useEffect(() => {
    loadSettings();
    loadSystemStats();
    loadApiKeys();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await adminApiService.getSettings('all');
      if (response.success && response.data) {
        // Charger les paramètres généraux
        if (response.data.general) {
          setSystemSettings({
            platformName: response.data.general.platform_name?.value || 'Restaurant SaaS Platform',
            platformUrl: response.data.general.platform_url?.value || 'https://restaurant-saas.com',
            supportEmail: response.data.general.support_email?.value || 'support@restaurant-saas.com',
            maintenanceMode: response.data.general.maintenance_mode?.value || false,
            maxRestaurants: response.data.general.max_restaurants?.value || 1000,
            sessionTimeout: response.data.general.session_timeout?.value || 30
          });
        }

        // Charger les paramètres de sécurité
        if (response.data.security) {
          setSecuritySettings({
            passwordMinLength: response.data.security.password_min_length?.value || 8,
            requireSpecialChars: response.data.security.require_special_chars?.value || true,
            twoFactorEnabled: response.data.security.two_factor_enabled?.value || false,
            sessionExpiry: response.data.security.session_expiry?.value || 24,
            ipWhitelist: []
          });
        }

        // Charger les paramètres de notifications
        if (response.data.notifications) {
          setNotificationSettings({
            emailNotifications: response.data.notifications.email_notifications?.value || true,
            smsNotifications: response.data.notifications.sms_notifications?.value || false,
            pushNotifications: response.data.notifications.push_notifications?.value || true,
            newRestaurantAlert: response.data.notifications.new_restaurant_alert?.value || true,
            paymentAlert: response.data.notifications.payment_alert?.value || true,
            systemAlert: response.data.notifications.system_alert?.value || true
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  const loadSystemStats = async () => {
    try {
      const response = await adminApiService.getSystemStats();
      if (response.success && response.data) {
        setSystemStats(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const loadApiKeys = async () => {
    try {
      const response = await adminApiService.getApiKeys();
      if (response.success && response.data) {
        setApiKeys(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clés API:', error);
    }
  };

  const tabs = [
    { id: 'general', name: 'Général', icon: SettingsIcon },
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'database', name: 'Base de données', icon: Database },
    { id: 'api', name: 'API & Intégrations', icon: Key },
    { id: 'billing', name: 'Facturation', icon: CreditCard }
  ];

  const handleSave = async (section: string) => {
    setLoading(true);
    try {
      // Préparer les données selon la section
      let settingsToSave: any = {};
      
      switch (section) {
        case 'general':
          settingsToSave = {
            general: {
              platform_name: systemSettings.platformName,
              platform_url: systemSettings.platformUrl,
              support_email: systemSettings.supportEmail,
              maintenance_mode: systemSettings.maintenanceMode,
              max_restaurants: systemSettings.maxRestaurants,
              session_timeout: systemSettings.sessionTimeout
            }
          };
          break;
        case 'security':
          settingsToSave = {
            security: {
              password_min_length: securitySettings.passwordMinLength,
              require_special_chars: securitySettings.requireSpecialChars,
              two_factor_enabled: securitySettings.twoFactorEnabled,
              session_expiry: securitySettings.sessionExpiry
            }
          };
          break;
        case 'notifications':
          settingsToSave = {
            notifications: {
              email_notifications: notificationSettings.emailNotifications,
              sms_notifications: notificationSettings.smsNotifications,
              push_notifications: notificationSettings.pushNotifications,
              new_restaurant_alert: notificationSettings.newRestaurantAlert,
              payment_alert: notificationSettings.paymentAlert,
              system_alert: notificationSettings.systemAlert
            }
          };
          break;
        default:
          settingsToSave = {
            general: {
              platform_name: systemSettings.platformName,
              platform_url: systemSettings.platformUrl,
              support_email: systemSettings.supportEmail,
              maintenance_mode: systemSettings.maintenanceMode,
              max_restaurants: systemSettings.maxRestaurants,
              session_timeout: systemSettings.sessionTimeout
            },
            security: {
              password_min_length: securitySettings.passwordMinLength,
              require_special_chars: securitySettings.requireSpecialChars,
              two_factor_enabled: securitySettings.twoFactorEnabled,
              session_expiry: securitySettings.sessionExpiry
            },
            notifications: {
              email_notifications: notificationSettings.emailNotifications,
              sms_notifications: notificationSettings.smsNotifications,
              push_notifications: notificationSettings.pushNotifications,
              new_restaurant_alert: notificationSettings.newRestaurantAlert,
              payment_alert: notificationSettings.paymentAlert,
              system_alert: notificationSettings.systemAlert
            }
          };
      }

      const response = await adminApiService.updateSettings(settingsToSave);
      
      if (response.success) {
        alert(`Paramètres ${section} sauvegardés avec succès !`);
        // Recharger les données
        await loadSettings();
      } else {
        alert(response.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      const response = await adminApiService.backupDatabase();
      if (response.success) {
        alert('Sauvegarde effectuée avec succès !');
        await loadSystemStats(); // Recharger les stats
      } else {
        alert(response.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      alert('Veuillez entrer un nom pour la clé API');
      return;
    }

    setLoading(true);
    try {
      const response = await adminApiService.createApiKey({
        key_name: newKeyName,
        key_type: 'admin',
        permissions: ['read', 'write', 'delete']
      });
      
      if (response.success) {
        alert(`Clé API créée avec succès !\nClé: ${response.data.key_value}`);
        setNewKeyName('');
        setShowCreateKeyModal(false);
        await loadApiKeys();
      } else {
        alert(response.error || 'Erreur lors de la création de la clé API');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la clé API:', error);
      alert('Erreur lors de la création de la clé API');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateApiKey = async (keyId: number) => {
    setLoading(true);
    try {
      const response = await adminApiService.regenerateApiKey(keyId);
      if (response.success) {
        alert(`Clé API régénérée avec succès !\nNouvelle clé: ${response.data.key_value}`);
        await loadApiKeys();
      } else {
        alert(response.error || 'Erreur lors de la régénération de la clé API');
      }
    } catch (error) {
      console.error('Erreur lors de la régénération de la clé API:', error);
      alert('Erreur lors de la régénération de la clé API');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('XOF', 'FCFA');
  };

  const renderGeneralSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Informations de la plateforme */}
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #cbd5e1'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#1e293b',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Globe style={{ width: '20px', height: '20px' }} />
          Informations de la plateforme
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '6px'
            }}>
              Nom de la plateforme
            </label>
            <input
              type="text"
              value={systemSettings.platformName}
              onChange={(e) => setSystemSettings({...systemSettings, platformName: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white'
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '6px'
            }}>
              URL de la plateforme
            </label>
            <input
              type="url"
              value={systemSettings.platformUrl}
              onChange={(e) => setSystemSettings({...systemSettings, platformUrl: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white'
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '6px'
            }}>
              Email de support
            </label>
            <input
              type="email"
              value={systemSettings.supportEmail}
              onChange={(e) => setSystemSettings({...systemSettings, supportEmail: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white'
              }}
            />
          </div>
        </div>
      </div>

      {/* Configuration système */}
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #f59e0b'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#92400e',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Server style={{ width: '20px', height: '20px' }} />
          Configuration système
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={systemSettings.maintenanceMode}
              onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
              style={{ width: '16px', height: '16px' }}
            />
            <label style={{ fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
              Mode maintenance
            </label>
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#92400e',
              marginBottom: '6px'
            }}>
              Nombre maximum de restaurants
            </label>
            <input
              type="number"
              value={systemSettings.maxRestaurants}
              onChange={(e) => setSystemSettings({...systemSettings, maxRestaurants: parseInt(e.target.value)})}
              style={{
                width: '200px',
                padding: '12px',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white'
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#92400e',
              marginBottom: '6px'
            }}>
              Timeout de session (minutes)
            </label>
            <input
              type="number"
              value={systemSettings.sessionTimeout}
              onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: parseInt(e.target.value)})}
              style={{
                width: '200px',
                padding: '12px',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Configuration des mots de passe */}
      <div style={{
        background: 'linear-gradient(135deg, #fef2f2, #fecaca)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #f87171'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#dc2626',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Shield style={{ width: '20px', height: '20px' }} />
          Configuration des mots de passe
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#dc2626',
              marginBottom: '6px'
            }}>
              Longueur minimale des mots de passe
            </label>
            <input
              type="number"
              value={securitySettings.passwordMinLength}
              onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
              style={{
                width: '200px',
                padding: '12px',
                border: '1px solid #f87171',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={securitySettings.requireSpecialChars}
              onChange={(e) => setSecuritySettings({...securitySettings, requireSpecialChars: e.target.checked})}
              style={{ width: '16px', height: '16px' }}
            />
            <label style={{ fontSize: '14px', color: '#dc2626', fontWeight: '500' }}>
              Exiger des caractères spéciaux
            </label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={securitySettings.twoFactorEnabled}
              onChange={(e) => setSecuritySettings({...securitySettings, twoFactorEnabled: e.target.checked})}
              style={{ width: '16px', height: '16px' }}
            />
            <label style={{ fontSize: '14px', color: '#dc2626', fontWeight: '500' }}>
              Authentification à deux facteurs
            </label>
          </div>
        </div>
      </div>

      {/* Configuration des sessions */}
      <div style={{
        background: 'linear-gradient(135deg, #f0f9ff, #bae6fd)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #0ea5e9'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#0c4a6e',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <User style={{ width: '20px', height: '20px' }} />
          Configuration des sessions
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#0c4a6e',
              marginBottom: '6px'
            }}>
              Expiration des sessions (heures)
            </label>
            <input
              type="number"
              value={securitySettings.sessionExpiry}
              onChange={(e) => setSecuritySettings({...securitySettings, sessionExpiry: parseInt(e.target.value)})}
              style={{
                width: '200px',
                padding: '12px',
                border: '1px solid #0ea5e9',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Notifications par email */}
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4, #bbf7d0)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #22c55e'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#166534',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Bell style={{ width: '20px', height: '20px' }} />
          Configuration des notifications
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
              style={{ width: '16px', height: '16px' }}
            />
            <label style={{ fontSize: '14px', color: '#166534', fontWeight: '500' }}>
              Notifications par email
            </label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={notificationSettings.smsNotifications}
              onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
              style={{ width: '16px', height: '16px' }}
            />
            <label style={{ fontSize: '14px', color: '#166534', fontWeight: '500' }}>
              Notifications par SMS
            </label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={notificationSettings.pushNotifications}
              onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
              style={{ width: '16px', height: '16px' }}
            />
            <label style={{ fontSize: '14px', color: '#166534', fontWeight: '500' }}>
              Notifications push
            </label>
          </div>
        </div>
      </div>

      {/* Types d'alertes */}
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #f59e0b'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#92400e',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertTriangle style={{ width: '20px', height: '20px' }} />
          Types d'alertes
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={notificationSettings.newRestaurantAlert}
              onChange={(e) => setNotificationSettings({...notificationSettings, newRestaurantAlert: e.target.checked})}
              style={{ width: '16px', height: '16px' }}
            />
            <label style={{ fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
              Nouveau restaurant inscrit
            </label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={notificationSettings.paymentAlert}
              onChange={(e) => setNotificationSettings({...notificationSettings, paymentAlert: e.target.checked})}
              style={{ width: '16px', height: '16px' }}
            />
            <label style={{ fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
              Alertes de paiement
            </label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={notificationSettings.systemAlert}
              onChange={(e) => setNotificationSettings({...notificationSettings, systemAlert: e.target.checked})}
              style={{ width: '16px', height: '16px' }}
            />
            <label style={{ fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
              Alertes système
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Statistiques système */}
      {systemStats && (
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff, #bae6fd)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #0ea5e9'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#0c4a6e',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Database style={{ width: '20px', height: '20px' }} />
            Statistiques système
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{
              padding: '16px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #0ea5e9'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0c4a6e', marginBottom: '4px' }}>
                Restaurants
              </h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0ea5e9', margin: '0' }}>
                {systemStats.restaurants?.total_restaurants || 0}
              </p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Actifs: {systemStats.restaurants?.active_restaurants || 0}
              </p>
            </div>
            
            <div style={{
              padding: '16px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #0ea5e9'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0c4a6e', marginBottom: '4px' }}>
                Utilisateurs
              </h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0ea5e9', margin: '0' }}>
                {systemStats.users?.total_users || 0}
              </p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Actifs: {systemStats.users?.active_users || 0}
              </p>
            </div>
            
            <div style={{
              padding: '16px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #0ea5e9'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0c4a6e', marginBottom: '4px' }}>
                Revenus
              </h4>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#0ea5e9', margin: '0' }}>
                {formatCurrency(systemStats.revenue?.total_revenue_fcfa || 0)}
              </p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Ce mois: {formatCurrency(systemStats.revenue?.monthly_revenue_fcfa || 0)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gestion de la base de données */}
      <div style={{
        background: 'linear-gradient(135deg, #f0f9ff, #bae6fd)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #0ea5e9'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#0c4a6e',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Database style={{ width: '20px', height: '20px' }} />
          Gestion de la base de données
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #0ea5e9'
          }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0c4a6e', marginBottom: '4px' }}>
                Sauvegarde
              </h4>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                Dernière sauvegarde: {systemStats?.database?.last_backup ? 
                  new Date(systemStats.database.last_backup).toLocaleString('fr-FR') : 
                  'Jamais'
                }
              </p>
            </div>
            <button 
              onClick={handleBackup}
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: loading ? '#9ca3af' : '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder maintenant'}
            </button>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #0ea5e9'
          }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0c4a6e', marginBottom: '4px' }}>
                Taille de la base
              </h4>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                {systemStats?.database?.size_mb ? 
                  `${systemStats.database.size_mb} MB` : 
                  'Calcul en cours...'
                }
              </p>
            </div>
            <button 
              onClick={() => loadSystemStats()}
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Clés API existantes */}
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #f59e0b'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#92400e',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Key style={{ width: '20px', height: '20px' }} />
          Clés API existantes
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {apiKeys.length > 0 ? (
            apiKeys.map((key) => (
              <div key={key.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #f59e0b'
              }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>
                    {key.key_name}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                    {key.key_value}
                  </p>
                  <p style={{ fontSize: '10px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                    Type: {key.key_type} • Créée: {new Date(key.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleRegenerateApiKey(key.id)}
                    disabled={loading}
                    style={{
                      padding: '6px 12px',
                      background: loading ? '#9ca3af' : '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Régénération...' : 'Régénérer'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: '#6b7280',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #f59e0b'
            }}>
              <Key style={{ width: '32px', height: '32px', margin: '0 auto 8px', color: '#9ca3af' }} />
              <p>Aucune clé API trouvée</p>
            </div>
          )}
          
          <button 
            onClick={() => setShowCreateKeyModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              alignSelf: 'flex-start'
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Créer une nouvelle clé
          </button>
        </div>
      </div>

      {/* Modal de création de clé API */}
      {showCreateKeyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            width: '400px',
            maxWidth: '90vw'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1e293b',
              marginBottom: '16px'
            }}>
              Créer une nouvelle clé API
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '6px'
              }}>
                Nom de la clé
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Ex: Clé API pour intégration mobile"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCreateKeyModal(false);
                  setNewKeyName('');
                }}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleCreateApiKey}
                disabled={loading || !newKeyName.trim()}
                style={{
                  padding: '8px 16px',
                  background: loading || !newKeyName.trim() ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: loading || !newKeyName.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBillingSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Plan unique */}
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4, #bbf7d0)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #22c55e'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#166534',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CreditCard style={{ width: '20px', height: '20px' }} />
          Plan et tarification (FCFA)
        </h3>
        
        {/* Plan unique centré */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            padding: '32px',
            background: 'white',
            borderRadius: '16px',
            border: '3px solid #22c55e',
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 10px 25px rgba(34, 197, 94, 0.1)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#22c55e',
              color: 'white',
              padding: '6px 20px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Plan Standard
            </div>
            
            <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#166534', marginBottom: '12px', marginTop: '20px' }}>
              Restaurant SaaS
            </h4>
            
            <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#22c55e', margin: '0 0 8px 0' }}>
              {formatCurrency(75000)}
            </p>
            
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
              par mois par restaurant
            </p>
            
            <div style={{ textAlign: 'left', marginBottom: '32px' }}>
              <h5 style={{ fontSize: '18px', fontWeight: '600', color: '#166534', marginBottom: '16px', textAlign: 'center' }}>
                Toutes les fonctionnalités incluses :
              </h5>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px', color: '#374151' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                  <span>Gestion des commandes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                  <span>Menu digital</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                  <span>QR Codes tables</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                  <span>Paiements mobiles</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                  <span>Analytics temps réel</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                  <span>Support technique</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                  <span>Application mobile</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                  <span>Mises à jour gratuites</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{
                width: '100%',
                padding: '16px',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                Souscrire maintenant
              </button>
              
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                ✓ Essai gratuit de 14 jours<br/>
                ✓ Annulation à tout moment<br/>
                ✓ Facturation mensuelle
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informations de facturation */}
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #f59e0b'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#92400e',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Info style={{ width: '20px', height: '20px' }} />
          Informations de facturation
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #f59e0b'
          }}>
            <span style={{ fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
              Période d'essai gratuite
            </span>
            <span style={{ fontSize: '14px', color: '#92400e', fontWeight: '600' }}>
              14 jours
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #f59e0b'
          }}>
            <span style={{ fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
              Facturation
            </span>
            <span style={{ fontSize: '14px', color: '#92400e', fontWeight: '600' }}>
              Mensuelle
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #f59e0b'
          }}>
            <span style={{ fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
              Méthodes de paiement
            </span>
            <span style={{ fontSize: '14px', color: '#92400e', fontWeight: '600' }}>
              Mobile Money, Virement, Carte
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'database':
        return renderDatabaseSettings();
      case 'api':
        return renderApiSettings();
      case 'billing':
        return renderBillingSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
      minHeight: '100vh',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          Paramètres
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#64748b'
        }}>
          Configuration de la plateforme SaaS et gestion des paramètres système
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar des onglets */}
        <div style={{
          width: '280px',
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          height: 'fit-content'
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: '16px'
          }}>
            Catégories
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === tab.id ? '#3b82f6' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  <Icon style={{ width: '18px', height: '18px' }} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu principal */}
        <div style={{ 
          flex: 1,
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          {renderTabContent()}
          
          {/* Bouton de sauvegarde */}
          <div style={{ 
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              onClick={() => handleSave(activeTab)}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? (
                <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <Save style={{ width: '16px', height: '16px' }} />
              )}
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;