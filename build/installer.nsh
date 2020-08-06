 
!include LogicLib.nsh
 
!define UninstIdExe "{0b40325a-6c1b-41fb-9800-283d3f40247f}"
!define UninstIdMsi "{071A3CCA-285A-4F60-AFE8-FFFCB355E675}"

 
!macro UninstallExistingExe exitcode uninstcommand
Push `${uninstcommand}`
Call UninstallExistingExe
Pop ${exitcode}
!macroend

!ifndef BUILD_UNINSTALLER
Function UninstallExistingExe

Exch $1 ; uninstcommand
Push $2 ; Uninstaller
Push $3 ; Len
StrCpy $3 ""
StrCpy $2 $1

ExecWait '$2 /quiet /norestart' $1
MessageBox MB_OK "post uninstall exe: $1"
IntCmp $1 0 "" +2 +2 ; Don't delete the installer if it was aborted
Delete "$2" ; Delete the uninstaller
RMDir "$3" ; Try to delete $InstDir
RMDir "$3\.." ; (Optional) Try to delete the parent of $InstDir

Pop $3
Pop $2
Exch $1 ; exitcode
FunctionEnd
!endif

!macro UninstallExistingMsi exitcode uninstid
Push `${uninstid}`
Call UninstallExistingMsi
Pop ${exitcode}
!macroend

!ifndef BUILD_UNINSTALLER
Function UninstallExistingMsi

Exch $1 ; id
Push $2 ; id
Push $3 ; Len
StrCpy $3 ""
StrCpy $2 $1

ExecWait 'MsiExec.exe /X "$2" /norestart /qb' $1
MessageBox MB_OK "post uninstall msi: $1"

Pop $3
Pop $2
Exch $1 ; exitcode
FunctionEnd
!endif
 
!macro customInit

; find uninstall exe under 32-bit path
ReadRegStr $0 HKLM "SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\${UninstIdExe}" "UninstallString"
${If} $0 != ""
	!insertmacro UninstallExistingExe $0 $0
	${If} $0 <> 0
		MessageBox MB_YESNO|MB_ICONSTOP "Failed to uninstall, continue anyway?" /SD IDYES IDYES +2
		Abort
	${EndIf}
${EndIf}
; find uninstall exe under 64-bit path
ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${UninstIdExe}" "UninstallString"
${If} $0 != ""
	!insertmacro UninstallExistingExe $0 $0
	${If} $0 <> 0
		MessageBox MB_YESNO|MB_ICONSTOP "Failed to uninstall, continue anyway?" /SD IDYES IDYES +2
		Abort
	${EndIf}
${EndIf}

; find uninstall msi under 32-bit path
ReadRegStr $0 HKLM "SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\${UninstIdMsi}" "UninstallString"
${If} $0 != ""
	StrCpy $0 "${UninstIdMsi}"
	!insertmacro UninstallExistingMsi $0 $0
	${If} $0 <> 0
		MessageBox MB_YESNO|MB_ICONSTOP "Failed to uninstall, continue anyway?" /SD IDYES IDYES +2
		Abort
	${EndIf}
${EndIf}
; find uninstall msi under 64-bit path
ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${UninstIdMsi}" "UninstallString"
${If} $0 != ""
	StrCpy $0 "${UninstIdMsi}"
	!insertmacro UninstallExistingMsi $0 $0
	${If} $0 <> 0
		MessageBox MB_YESNO|MB_ICONSTOP "Failed to uninstall, continue anyway?" /SD IDYES IDYES +2
		Abort
	${EndIf}
${EndIf}
!macroend
