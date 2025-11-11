# Naloga 5 – Sistemski test (Nefunkcionalne zahteve)

## 1\. Datum izvedbe testa

**10. November 2025**

---

## 2\. Opis postopka izvedbe testa

**Vrsta testa:** Performance test (zmogljivost)

**Orodje:** Apache JMeter 5.6.3

**Scenarij testa:**

* Simulirali sva obremenitev backend sistema s 20 sočasnimi uporabniki (**threads**)
* Ramp-up perioda: 5 sekund (uporabniki so se postopoma priključili)
* Vsak uporabnik je izvedel 10 ponovitev (**loop count = 10**)
* Skupno je bilo izvedenih 400 zahtev (20 uporabnikov × 10 ponovitev × 2 endpointa)

**Testirani API endpointi:**

1. `GET /api/index` – pridobivanje vseh opravil
2. `POST /api/index` – ustvarjanje novega opravila

**Konfiguracija JMeterja:**

* HTTP Request Defaults: Server = `localhost`, Port = `8080`, Protocol = `http`
* HTTP Header Manager: Content-Type = `application/json`
* Listenerji: Summary Report in View Results Tree

---

## 3\. Rezultati testa

**Summary Report:**

| Label | # Samples | Avg (ms) | Min (ms) | Max (ms) | Std. Dev | Error % | Throughput | Received KB/sec | Sent KB/sec |
|-------|------------|-----------|-----------|-----------|-----------|----------|------------|----------------|------------|
| GET /api/index | 200 | 11 | 5 | 291 | 22.03 | 0.00 | 41.6/sec | 661.78 | 6.42 |
| POST /api/index | 200 | 12 | 5 | 243 | 24.65 | 0.00 | 44.3/sec | 18.01 | 11.80 |
| \*\*TOTAL\*\* | 400 | 12 | 5 | 291 | 23.38 | 0.00 | 83.1/sec | 677.87 | 17.49 |

**Interpretacija rezultatov:**

* Povprečni odzivni čas je zelo nizek (GET = 11 ms, POST = 12 ms)
* Maksimalni odzivni čas (291 ms) je še vedno znotraj sprejemljive meje
* Napake niso zaznane (Error % = 0)
* Prepustnost sistema je ~83 zahtev/s

**View Results Tree:**

* Vse zahteve so uspešno izvedene
* HTTP status kode = 200 za GET in POST

---

## 4\. Zaključek

* Backend aplikacije je **odziven, zanesljiv in stabilen** pod simulirano obremenitvijo.
* Povprečni odzivni časi so zelo nizki, brez napak ali prekinitev.
* Sistem izpolnjuje nefunkcionalne zahteve glede **zmogljivosti in stabilnosti**.
* Za nadaljnje teste bi bilo priporočljivo izvesti stresni test z večjim številom sočasnih uporabnikov, da se preveri mejna zmogljivost sistema.
