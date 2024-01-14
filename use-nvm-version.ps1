$version = Get-Content .\.nvmrc

# Check if the version is installed
$installedVersions = nvm ls
if ($installedVersions -notcontains $version) {
    # If not installed, install it
    nvm install $version
}

# Use the version
nvm use $version