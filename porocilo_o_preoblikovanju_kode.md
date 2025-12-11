# Refactoring Report -- QuestApp Backend

V tej nalogi sva analizirala backend projekta s pomočjo PMD ter izvedla
pet obveznih refaktoringov, ki odpravljajo PMD opozorila in izboljšujejo
kakovost kode. Spodaj so opisani vsi izvedeni popravki ter njihova
utemeljitev.

## 1. Refaktoring: Preimenovanje razreda `scheduler` v `Scheduler`

**PMD opozorilo: `ClassNamingConventions`**

Razred *scheduler* ni sledil Java konvenciji za poimenovanje
(PascalCase). Zato sva izvedla:

👉 **Refactoring Rename Class: `scheduler → Scheduler`**

## 2. Refaktoring: Zamenjava `System.out.println` z Loggerjem

**PMD opozorilo: `SystemPrintln`**

V `QuestController` sva odstranila `System.out.println` in uvedla:

``` java
private static final Logger logger = LoggerFactory.getLogger(QuestController.class);
```

Izpis sva preusmerila na:

``` java
logger.info("Received updated quest: {}", quest);
```

## 3. Refaktoring: Extract Method v `QuestServiceImpl`

**PMD opozorilo: `CyclomaticComplexity`, `LongMethod`**

Metoda `getAllQuests` je bila predolga, zato sva logiko razdelila v:

-   `filterBySearch()`
-   `sortQuests()`

S tem se zmanjša kompleksnost in izboljša berljivost.

## 4. Refaktoring: Raw Exception → Custom Exception

**PMD opozorilo: `AvoidThrowingRawExceptionTypes`**

Ustvarila sva novo izjemo:

``` java
public class QuestNotFoundException extends RuntimeException { ... }
```

in zamenjala prejšnje:

``` java
throw new Exception("Quest not found!");
```

## 5. Refaktoring v `Quest` razredu -- Remove Duplicated Code

Dodala sva metodo:

``` java
public static Quest cloneOf(Quest original)
```

ki prepreči podvajanje logike kopiranja quest-ov.

# Zaključek

Z izvedenimi refaktoringi sva izboljšala: - berljivost, - vzdrževanje, -
modularnost, - skladnost s PMD pravili.
