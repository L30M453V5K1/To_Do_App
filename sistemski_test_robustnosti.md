# Robustnostni test -- Sistemski test (Nefunkcionalne zahteve)

## 1. Datum izvedbe testa

**10. november 2025**

## 2. Opis postopka izvedbe testa

**Vrsta testa:** Robustnostni / Error-handling sistemski test\
**Orodje:** Apache JMeter 5.6.3

**Namen testa:**\
Preveriti, kako backend API reagira na **neveljavne**, **nepopolne** ali
**nepričakovane** zahteve.\
Ta test preverja **pravilno obravnavanje napak**, ne zmogljivosti ali
obremenitve.

**Scenarij testa:**\
Namenoma smo ustvarili več nepravilnih HTTP zahtev, da preverimo, ali
sistem: - vrača pravilne HTTP kode (400, 404), - zavrne neveljavno ali
manjkajočo JSON vsebino, - pravilno obravnava nedelujoče ID-je, - ne
vrača nekontroliranih napak (500).

**Testirani neveljavni scenariji:** 1. **POST /api/index** -- prazen
JSON objekt\
2. **POST /api/index** -- manjkajoča obvezna polja\
3. **POST /api/index** -- napačni podatkovni tipi v JSON-u\
4. **GET /api/index/99999** -- pridobivanje neobstoječega opravila\
5. **DELETE /api/index/88888** -- brisanje neobstoječega opravila

**Konfiguracija JMetra:** - Thread Group: 3 uporabniki, 1 ponovitev\
- HTTP Request Defaults: localhost:8080\
- HTTP Header Manager: Content-Type = application/json\
- Listenerji: Summary Report, View Results Tree

## 3. Rezultati testa

Sistem se je pri vseh testnih primerih odzval pravilno:

-   Neveljavni POST zahtevki so vrnili **400 Bad Request**.
-   Zahtevki za neobstoječe vire so vrnili **404 Not Found**.
-   Nobena zahteva ni povzročila **500 Internal Server Error**.
-   API je vrnil smiselna in pričakovana sporočila o napakah.

## 4. Zaključek

-   Backend sistem pravilno in zanesljivo obravnava vse nepravilne ali
    napačne vnose.
-   Vračane so bile ustrezne HTTP kode napak.
-   Med testiranjem ni prišlo do izjem, sesutij ali nepredvidenih
    odzivov.
-   Sistem izpolnjuje nefunkcionalne zahteve glede robustnosti,
    zanesljivosti in pravilnega obravnavanja napak.
