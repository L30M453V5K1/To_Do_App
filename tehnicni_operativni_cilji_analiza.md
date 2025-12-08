# ZK – 8. Naloga  
## Analiza kakovosti kode na podlagi metrik (Metrics Reloaded)

V tej nalogi sva izvedla analizo kakovosti kode v najinem Spring Boot backend projektu. Za merjenje metrik sva uporabila IntelliJ vtičnik Metrics Reloaded, ki izračuna različne objektno usmerjene metrike, kot so CBO, DIT, LCOM, NOC, RFC in WMC.

Na podlagi dobljenih rezultatov sva določila tri cilje: en tehnični in dva operativna. Za vsak cilj sva pripravila vprašanje, metrike in razlago, kako sva analizirala trenutno stanje ter kako bi lahko spremljala izboljšave.

## 1. Tehnični cilj: Zmanjšanje kompleksnosti razredov

### Cilj
Zmanjšati kompleksnost razredov, predvsem tistih, ki imajo visoke vrednosti WMC (Weighted Methods per Class) in RFC (Response For Class). Kompleksnejši kot je razred, težje ga je vzdrževati in testirati.

### Vprašanje
Ali se kompleksnost razredov zmanjša po refaktoriranju kode?

### Metrike
- WMC (Weighted Methods per Class)  
- RFC (Response For Class)

### Analiza trenutnega stanja
Najbolj izstopajo razredi:
- QuestControllerTest: RFC 53, WMC 11  
- QuestServiceImplTest: RFC 45, WMC 12  
- QuestServiceImpl: RFC 40, WMC 10  

## 2. Operativni cilj: Zmanjšanje odvisnosti med razredi (CBO)

### Cilj
Zmanjšati število odvisnosti med razredi (CBO). Manjša kot je odvisnost, bolj modularen in preprosto testljiv je sistem.

### Vprašanje
Ali razredi po refaktoriranju komunicirajo z manj zunanjimi razredi?

### Metrike
- CBO (Coupling Between Objects)

### Analiza trenutnega stanja
Razred Quest ima najvišjo vrednost CBO (7). QuestController ima vrednost 4.

## 3. Operativni cilj: Izboljšanje kohezije razredov (LCOM)

### Cilj
Povečati kohezijo razredov tako, da bodo metode in spremenljivke znotraj razreda bolj povezane med seboj.

### Vprašanje
Ali so razredi po refaktoriranju bolj povezani in opravljajo manj nepovezanih odgovornosti?

### Metrike
- LCOM (Lack of Cohesion of Methods)

### Analiza trenutnega stanja
Razred Quest ima LCOM 9, kar nakazuje na nizko kohezijo.

## Zaključek

Na podlagi metrik sva določila tri ključne cilje za izboljšanje kakovosti kode:
1. zmanjšanje kompleksnosti razredov (WMC, RFC),  
2. zmanjšanje odvisnosti med razredi (CBO),  
3. povečanje kohezije razredov (LCOM).

Refaktoriranje najbolj problematičnih razredov bi povečalo berljivost, modularnost in vzdrževanost projekta.
