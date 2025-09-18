# Script PowerShell pour installer les données gabonaises
# Exécuter ce script dans PowerShell

Write-Host "🇬🇦 Installation des données gabonaises pour la restauration interactive" -ForegroundColor Green
Write-Host ""

# Vérifier si MySQL est installé
$mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlPath) {
    Write-Host "❌ MySQL n'est pas trouvé dans le PATH." -ForegroundColor Red
    Write-Host "Veuillez installer MySQL ou ajouter le chemin MySQL au PATH." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Solutions possibles :" -ForegroundColor Cyan
    Write-Host "1. Installer MySQL depuis https://dev.mysql.com/downloads/mysql/" -ForegroundColor White
    Write-Host "2. Ou utiliser XAMPP/WAMP qui inclut MySQL" -ForegroundColor White
    Write-Host "3. Ou ajouter MySQL au PATH système" -ForegroundColor White
    Write-Host ""
    Write-Host "Chemin typique MySQL : C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Alternative : Utilisez phpMyAdmin ou MySQL Workbench pour exécuter les scripts SQL manuellement." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ MySQL trouvé : $($mysqlPath.Source)" -ForegroundColor Green
Write-Host ""

# Demander les informations de connexion
$host = Read-Host "Host MySQL (défaut: localhost)"
if ([string]::IsNullOrEmpty($host)) { $host = "localhost" }

$user = Read-Host "Utilisateur MySQL (défaut: root)"
if ([string]::IsNullOrEmpty($user)) { $user = "root" }

$password = Read-Host "Mot de passe MySQL" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

$database = Read-Host "Nom de la base de données (défaut: restauration)"
if ([string]::IsNullOrEmpty($database)) { $database = "restauration" }

Write-Host ""
Write-Host "Configuration :" -ForegroundColor Cyan
Write-Host "  Host: $host" -ForegroundColor White
Write-Host "  Utilisateur: $user" -ForegroundColor White
Write-Host "  Base de données: $database" -ForegroundColor White
Write-Host ""

# Vérifier la connexion
Write-Host "🔍 Vérification de la connexion..." -ForegroundColor Yellow
$testConnection = "SELECT 1;" | & mysql -h $host -u $user -p$passwordPlain $database 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Impossible de se connecter à la base de données." -ForegroundColor Red
    Write-Host "Vérifiez vos informations de connexion." -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Connexion réussie !" -ForegroundColor Green
Write-Host ""

# Fonction pour exécuter un script SQL
function Execute-SQLScript {
    param(
        [string]$ScriptPath,
        [string]$Description
    )
    
    Write-Host "📄 Exécution de $Description..." -ForegroundColor Yellow
    
    if (Test-Path $ScriptPath) {
        try {
            Get-Content $ScriptPath | & mysql -h $host -u $user -p$passwordPlain $database
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ $Description exécuté avec succès !" -ForegroundColor Green
            } else {
                Write-Host "❌ Erreur lors de l'exécution de $Description" -ForegroundColor Red
                return $false
            }
        } catch {
            Write-Host "❌ Erreur lors de l'exécution de $Description : $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "❌ Fichier non trouvé : $ScriptPath" -ForegroundColor Red
        return $false
    }
    
    Write-Host ""
    return $true
}

# Exécuter les scripts dans l'ordre
Write-Host "🚀 Début de l'installation des données gabonaises..." -ForegroundColor Green
Write-Host ""

$scripts = @(
    @{Path="database/gabon-data.sql"; Description="Données de base gabonaises"},
    @{Path="database/gabon-specialties.sql"; Description="Spécialités régionales"},
    @{Path="database/gabon-promotions.sql"; Description="Promotions et menus"},
    @{Path="database/test-gabon-data.sql"; Description="Test des données"}
)

$success = $true
foreach ($script in $scripts) {
    if (-not (Execute-SQLScript -ScriptPath $script.Path -Description $script.Description)) {
        $success = $false
        break
    }
}

Write-Host ""
if ($success) {
    Write-Host "🎉 Installation terminée avec succès !" -ForegroundColor Green
    Write-Host ""
    Write-Host "Vos données gabonaises sont maintenant installées :" -ForegroundColor Cyan
    Write-Host "  ✅ 10 tables avec QR codes" -ForegroundColor White
    Write-Host "  ✅ 50+ plats traditionnels gabonais" -ForegroundColor White
    Write-Host "  ✅ 30+ clients avec noms typiques" -ForegroundColor White
    Write-Host "  ✅ Sessions et commandes de test" -ForegroundColor White
    Write-Host "  ✅ Promotions et menus spéciaux" -ForegroundColor White
    Write-Host ""
    Write-Host "Vous pouvez maintenant démarrer votre serveur :" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Et tester avec les QR codes :" -ForegroundColor Yellow
    Write-Host "  http://localhost:3000/table/TBL001LIBREVILLE123456789" -ForegroundColor White
} else {
    Write-Host "❌ Installation échouée. Vérifiez les erreurs ci-dessus." -ForegroundColor Red
    Write-Host ""
    Write-Host "Solutions :" -ForegroundColor Yellow
    Write-Host "1. Vérifiez que la base de données 'restauration' existe" -ForegroundColor White
    Write-Host "2. Vérifiez vos permissions MySQL" -ForegroundColor White
    Write-Host "3. Exécutez les scripts manuellement dans phpMyAdmin ou MySQL Workbench" -ForegroundColor White
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
