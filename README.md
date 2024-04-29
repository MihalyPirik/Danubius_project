# Projekt Specifikáció: Könyvkereskedési Backend Szerver

## 1. Bevezetés

A projekt célja egy olyan backend szerver kialakítása, amely lehetővé teszi a felhasználók számára, hogy könyveket vásároljanak, valamint a kiadóknak lehetőséget biztosít az új könyvek megjelenítésére. Emellett az adminisztrátoroknak kiterjedt jogosultságuk van a rendszerben.

## 2. Funkcionális Követelmények

### Felhasználók:

- Regisztráció: Felhasználók létrehozhatnak fiókokat az alkalmazásban.
- Bejelentkezés: A felhasználók bejelentkezhetnek a fiókjukba.
- Könyv böngészése: A felhasználók megtekinthetik a rendelkezésre álló könyvek listáját.
- Könyv vásárlása: A felhasználók vásárolhatnak könyveket az alkalmazáson keresztül.

### Kiadók:

- Új könyv hozzáadása: A kiadók új könyveket tudnak hozzáadni a rendszerhez.

### Adminisztrátorok:

- Felhasználókezelés: Az adminisztrátorok felhasználókat tudnak létrehozni, szerkeszteni és törölni.
- Könyvkezelés: Az adminisztrátorok képesek könyveket hozzáadni, szerkeszteni és törölni a rendszerből.

## 3. Nem-funkcionális Követelmények

- **Teljesítmény**: A szervernek hatékonyan kell kezelnie a nagy terhelést.
- **Biztonság**: Az alkalmazásnak megfelelő biztonsági intézkedéseket kell alkalmaznia, beleértve az adatbázis védelmét és a felhasználói jogosultságok kezelését.
- **Skálázhatóság**: Az alkalmazásnak könnyen skálázhatónak kell lennie, hogy a növekvő felhasználói igényekre is megfelelően tudjon reagálni.

## 4. Technológiai Stack

- **Backend Framework**: Express.js
- **Adatbázis**: MongoDB
- **User Authentication**: JSON Web Token (JWT)
- **Unit Testing**: Jest

## 5. Rendszerarchitektúra

Az alkalmazás moduláris és RESTful API-kra épülő architektúrát fog követni. A következő fő modulokat fogja tartalmazni:

- Felhasználókezelés
- Könyvkezelés
- Vásárlási Műveletek

## 6. Végpontok

A főbb végpontokat és az azokhoz tartozó funkcionalitások:

- `/api/auth`: Felhasználók bejelentkezése és regisztrációja.
- `/api/books`: Könyvek listázása, hozzáadása, módosítása és törlése.
- `/api/user`: A felhasználó a saját adatait tudja kezelni.
- `/api/user/basket`: A felhasználó kosara.
- `/api/user/orders`: A felhasználó leadott rendelései.

## 7. Tesztelés

Az alkalmazás egységtesztekkel, illetve integrációs tesztekkel lesz ellátva.

## 8. Felhasználói Jogosultságok

- **Felhasználók**: Vásárlás.
- **Kiadók**: Új könyvek hozzáadása.
- **Adminisztrátorok**: Teljes jogosultság az alkalmazásban való módosításokra és kezelésre.

## 9. A Fejlesztéshez Használt Források

- https://mongoosejs.com/docs/guides.html
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- https://github.com/motdotla/dotenv
- https://www.npmjs.com/package/morgan
- https://expressjs.com/en/guide/error-handling.html
- https://www.mongodb.com/docs/manual
- https://www.educative.io/answers/session-based-authentication-vs-token-based-authentication
- https://jwt.io
- https://github.com/auth0/node-jsonwebtoken
- https://www.npmjs.com/package/cookie-parser
- https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb
- https://www.npmjs.com/package/express-mongo-sanitize
- https://helmetjs.github.io
- https://www.npmjs.com/package/express-rate-limit
- https://expressjs.com/en/resources/middleware/cors.html

# A Projekt Indítása

## NPM Csomagok Telepítése

```
npm install
```

## Projekt Indítása

```
npm start
```