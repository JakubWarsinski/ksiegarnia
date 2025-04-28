const { execSync } = require('child_process');

const requiredPackages = [
    'dotenv',
    'express',
    'express-session',
    'bcrypt',
];

function isPackageInstalled(pkg) {
    try {
        require.resolve(pkg);
        return true;
    } catch (e) {
        return false;
    }
}

const missingPackages = requiredPackages.filter(pkg => !isPackageInstalled(pkg));

if (missingPackages.length > 0) {
    console.log('Wykryto brakujące paczki:', missingPackages.join(', '));
    
    try {
        execSync(`npm install ${missingPackages.join(' ')}`, { stdio: 'inherit' });
        
        console.log('✔ Brakujące paczki zostały zainstalowane.');
    } catch (err) {
        console.error('✖ Błąd podczas instalacji paczek:', err.message);
        process.exit(1);
    }
} else {
    console.log('✔ Wszystkie wymagane paczki są zainstalowane.');
}

try {
    require('./src/server/server');
} catch (err) {
    console.error('✖ Błąd przy uruchamianiu aplikacji:', err.message);
    process.exit(1);
}