# Poročilo analize kode projekta **To Do App**

## 1. Uvod

Za projekt **To Do App** smo izvedli analizo kode tako za **frontend** kot **backend**, z uporabo treh različnih pristopov. Cilj je bil oceniti **kompleksnost, velikost, OOP metrike, varnost in duplicirano kodo**, da pridobimo pregled nad kakovostjo kode in identificiramo področja za izboljšave.

---

## 2. Metode analize

### **1. CodeMetrics (VSCode – frontend, Vanilla JavaScript)**

- **Kaj počne:**
  - Izračuna **kompleksnost posameznih funkcij**
  - Funkcije kategorizira glede na kompleksnost in jih označi z barvami:
    - **Rdeča** → visoka kompleksnost
    - **Rumena** → srednja kompleksnost
    - **Zelena** → nizka kompleksnost
- **Uporaba:** omogoča hitro prepoznavanje funkcij, ki so potencialno težavne za vzdrževanje ali testiranje

---

### **2. MetricsReloaded (IntelliJ IDEA – backend, Java)**

- **Kaj počne:**
  - Tabelarno analizira **razrede in metode**
  - Izračuna:
    - **Kompleksnost** (cyclomatic complexity)
    - **Velikost kode** (LOC, število metod in atributov)
    - Podpira tudi pripravo za testiranje (identifikacija kompleksnih razredov/funkcij)
- **Uporaba:** omogoča pregled strukture kode, hitro identifikacijo kompleksnih in velikih razredov, ki bi lahko zahtevali dodatne teste ali refaktoriranje

---

### **3. SonarQube (SonarScanner + SonarQube server)**

- **Kaj počne:**
  - Celovita analiza backend kode
  - Meri in poroča o:
    - **Varnosti kode**
    - **Podvojenosti**
    - **Kompleksnosti**
    - **Velikosti**
    - **Pokritosti (coverage)**
- **Uporaba:** omogoča podrobno vizualizacijo metrike preko GUI (http://localhost:9000) in generiranje reportov
- **Primer ugotovitev:**
  - **Controller** in **Service** datoteke → varne in brez kritičnih pomanjkljivosti
  - **Application.properties** → vsebuje občutljive podatke (npr. database password)

---

## 3. Rezultati analize

### **Frontend – CodeMetrics**

| Kompleksnost | Število funkcij | Barva |
|--------------|----------------|-------|
| Visoka       | 9              | Rdeča |
| Srednja      | 6              | Rumena|
| Nizka       | 3              | Zelena|

- Funkcije z rdečo barvo so potencialno težavne za vzdrževanje in testiranje

---

### **Backend – MetricsReloaded**

| Razred               | LOC | Reliability Rating | Security Rating |
|---------------------|-----|--------|---------------------|
| QuestController       | 41 | A      | A                 |
| QuestServiceImpl          | 64 | A      | A                |

- Omogoča hitro identifikacijo razredov, ki bi zahtevali dodatno testiranje ali refaktoriranje

---

### **Backend – SonarQube**

- Analiza preko SonarScanner-ja in lokalnega SonarQube GUI:
  - **Varnost:** Controller in Service datoteke so varne
  - **Podvojenost:** Ni kritičnih dupliciranih delov
  - **Kompleksnost:** Razredi in metode imajo normalno do srednjo kompleksnost
  - **Velikost:** Razredi so primerni po velikosti, brez pretirane kompleksnosti
  - **Pokritost (coverage):** Dobro pokriti glavni moduli
  - **Opombe:** `application.properties` vsebuje občutljive podatke (npr. database password), kar predstavlja varnostno tveganje

---

## 4. Zaključek

Z uporabo treh različnih pristopov smo dobili **celovit pregled nad kakovostjo kode**:

- **Frontend:** hitro identifikacijo kompleksnih funkcij (CodeMetrics)
- **Backend lokalno:** pregled kompleksnosti, velikosti in priprava za testiranje (MetricsReloaded)
- **Backend celovito:** podrobna analiza varnosti, duplicirane kode, kompleksnosti, velikosti in pokritosti (SonarQube)

Tak pristop omogoča **identifikacijo problematičnih delov kode**, izboljšanje testiranja in večjo varnost projekta.

