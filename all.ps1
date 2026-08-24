$W =  (Get-Item .).FullName

.\config.ps1
cd $W
.\unzip.ps1
cd $W
.\build.ps1
cd $W
.\server.ps1